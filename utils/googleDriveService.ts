const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly';

export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    webViewLink?: string;
    thumbnailLink?: string;
    iconLink?: string;
    modifiedTime?: string;
}

class GoogleDriveService {
    private accessToken: string | null = null;
    private clientId: string;

    constructor() {
        // @ts-ignore
        this.clientId = (import.meta as any).env.VITE_GOOGLE_DRIVE_CLIENT_ID || '';
    }

    /**
     * Initialise le flux d'authentification OAuth2
     */
    async authenticate(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.accessToken) {
                resolve(this.accessToken);
                return;
            }

            // @ts-ignore
            const client = google.accounts.oauth2.initTokenClient({
                client_id: this.clientId,
                scope: SCOPES,
                callback: (response: any) => {
                    if (response.error) {
                        reject(response);
                        return;
                    }
                    this.accessToken = response.access_token;
                    resolve(response.access_token);
                },
            });

            client.requestAccessToken();
        });
    }

    /**
     * Upload un fichier vers Google Drive
     */
    async uploadFile(file: File, folderId?: string): Promise<GoogleDriveFile> {
        const token = await this.authenticate();

        const metadata = {
            name: file.name,
            mimeType: file.type,
            parents: folderId ? [folderId] : undefined,
        };

        const formData = new FormData();
        formData.append(
            'metadata',
            new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        );
        formData.append('file', file);

        const response = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,thumbnailLink',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Erreur lors de l'upload sur Google Drive");
        }

        return await response.json();
    }

    /**
     * Crée un dossier dans Google Drive
     */
    async createFolder(name: string, parentId?: string): Promise<string> {
        const token = await this.authenticate();

        const metadata = {
            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: parentId ? [parentId] : undefined,
        };

        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(metadata),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Erreur lors de la création du dossier");
        }

        const result = await response.json();
        return result.id;
    }

    /**
     * Liste les fichiers de Google Drive
     */
    async listFiles(pageSize: number = 20): Promise<GoogleDriveFile[]> {
        const token = await this.authenticate();

        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,iconLink,modifiedTime)&orderBy=modifiedTime desc`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Erreur lors de la récupération des fichiers");
        }

        const result = await response.json();
        return result.files || [];
    }
}

export const googleDriveService = new GoogleDriveService();
