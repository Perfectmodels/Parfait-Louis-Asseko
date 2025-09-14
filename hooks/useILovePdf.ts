import { useState } from 'react';
import { useData } from '../contexts/DataContext';

interface ILovePdfHook {
    generatePdf: (htmlContent: string, filename: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useILovePdf = (): ILovePdfHook => {
    const { data } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAuthToken = async (publicKey: string, secretKey: string): Promise<string> => {
        const response = await fetch('https://api.ilovepdf.com/v1/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_key: publicKey, secret_key: secretKey }),
        });
        if (!response.ok) throw new Error('Authentication with iLovePDF failed.');
        const { token } = await response.json();
        return token;
    };

    const startTask = async (tool: string, token: string): Promise<{ server: string, task: string }> => {
        const response = await fetch(`https://api.ilovepdf.com/v1/start/${tool}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Failed to start ${tool} task.`);
        return response.json();
    };

    const uploadFile = async (server: string, task: string, token: string, htmlContent: string): Promise<{ server_filename: string }> => {
        const formData = new FormData();
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        formData.append('file', htmlBlob, 'document.html');
        formData.append('task', task);

        const response = await fetch(`https://${server}/v1/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        if (!response.ok) throw new Error('File upload failed.');
        return response.json();
    };
    
    const processTask = async (server: string, task: string, token: string, serverFilename: string, outputFilename: string): Promise<{ download_filename: string }> => {
        const response = await fetch(`https://${server}/v1/process`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task,
                tool: 'htmltopdf',
                files: [{ server_filename: serverFilename, filename: 'document.html' }],
                output_filename: outputFilename,
            }),
        });
        if (!response.ok) throw new Error('Processing failed.');
        return response.json();
    };

    const downloadFile = async (server: string, task: string, token: string, filename: string) => {
        const response = await fetch(`https://${server}/v1/download/${task}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Download failed.');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };


    const generatePdf = async (htmlContent: string, filename: string) => {
        setIsLoading(true);
        setError(null);

        const iLovePdfKeys = data?.apiKeys?.iLovePdf;
        if (!iLovePdfKeys?.publicKey || !iLovePdfKeys.secretKey) {
            setError('iLovePDF API keys are not configured.');
            setIsLoading(false);
            return;
        }

        try {
            const token = await getAuthToken(iLovePdfKeys.publicKey, iLovePdfKeys.secretKey);
            const { server, task } = await startTask('htmltopdf', token);
            const { server_filename } = await uploadFile(server, task, token, htmlContent);
            const { download_filename } = await processTask(server, task, token, server_filename, filename);
            await downloadFile(server, task, token, download_filename);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unknown error occurred during PDF generation.');
        } finally {
            setIsLoading(false);
        }
    };

    return { generatePdf, isLoading, error };
};
