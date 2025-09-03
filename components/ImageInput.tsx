import React, { useState, useRef } from 'react';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PhotoIcon, GlobeAltIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ImageInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mode, setMode] = useState<'url' | 'upload'>('url');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            onChange(downloadURL);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("L'upload a échoué. Veuillez réessayer.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-pm-off-white/70 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                {value && (
                    <img src={value} alt="Prévisualisation" className="w-24 h-24 object-cover rounded-md bg-black border border-pm-off-white/20" />
                )}
                <div className="flex-grow">
                    <div className="flex mb-2">
                        <button type="button" onClick={() => setMode('url')} className={`px-4 py-1 text-xs rounded-l-md ${mode === 'url' ? 'bg-pm-gold text-pm-dark' : 'bg-black'}`}>URL</button>
                        <button type="button" onClick={() => setMode('upload')} className={`px-4 py-1 text-xs rounded-r-md ${mode === 'upload' ? 'bg-pm-gold text-pm-dark' : 'bg-black'}`}>Upload</button>
                    </div>
                    
                    {mode === 'url' ? (
                        <input 
                            type="text" 
                            value={value} 
                            onChange={(e) => onChange(e.target.value)} 
                            placeholder="https://..."
                            className="admin-input" 
                        />
                    ) : (
                        <div className="relative">
                            <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="w-full admin-input text-left text-pm-off-white/70 flex items-center justify-between"
                            >
                                {uploading ? `Envoi en cours...` : (value ? "Changer le fichier" : "Choisir un fichier")}
                                {uploading ? <ArrowPathIcon className="w-5 h-5 animate-spin"/> : <PhotoIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageInput;