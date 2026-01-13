
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { XMarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

interface ModelQRCodeProps {
    modelId: string;
    modelName: string;
    onClose: () => void;
}

export const ModelQRCode: React.FC<ModelQRCodeProps> = ({ modelId, modelName, onClose }) => {
    // Generate the public profile URL
    const profileUrl = `${window.location.origin}/mannequins/${modelId}`;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative">
                 <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-pm-off-white/50 hover:text-white transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-playfair text-pm-gold mb-2">{modelName}</h3>
                    <p className="text-sm text-pm-off-white/70 mb-8">Scannez pour voir le portfolio</p>

                    <div className="bg-white p-4 rounded-xl shadow-inner mb-8">
                        <QRCodeSVG
                            value={profileUrl}
                            size={200}
                            level="H"
                            imageSettings={{
                                src: "https://i.ibb.co/fVBxPNTP/T-shirt.png",
                                x: undefined,
                                y: undefined,
                                height: 40,
                                width: 40,
                                excavate: true,
                            }}
                        />
                    </div>

                    <div className="w-full space-y-3">
                         <button
                            onClick={() => {
                                navigator.clipboard.writeText(profileUrl);
                                alert("Lien copié dans le presse-papier !");
                            }}
                            className="w-full py-3 bg-pm-dark border border-pm-gold/30 text-pm-gold rounded-full font-bold uppercase text-xs tracking-widest hover:bg-pm-gold hover:text-pm-dark transition-all"
                         >
                            Copier le lien
                         </button>
                    </div>
                </div>

                <div className="bg-pm-gold/10 p-4 text-center border-t border-pm-gold/20">
                    <p className="text-xs text-pm-gold">Perfect Models Management</p>
                </div>
            </div>
        </div>
    );
};
