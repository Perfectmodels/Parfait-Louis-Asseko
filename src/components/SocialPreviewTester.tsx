import React, { useState } from 'react';
import { EyeIcon, ShareIcon, LinkIcon } from '@heroicons/react/24/outline';

interface SocialPreviewTesterProps {
  url: string;
  title: string;
  description: string;
  image: string;
  className?: string;
}

const SocialPreviewTester: React.FC<SocialPreviewTesterProps> = ({
  url,
  title,
  description,
  image,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const testSocialSharing = () => {
    // Ouvrir l'aperçu dans une nouvelle fenêtre
    const previewUrl = `/api/social-image?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent('Perfect Models Management')}`;
    window.open(previewUrl, '_blank', 'width=1200,height=630');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copiée dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <div className={`bg-pm-dark border border-pm-gold/20 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-playfair text-pm-gold">Aperçu de Partage Social</h3>
        <div className="flex gap-2">
          <button
            onClick={testSocialSharing}
            className="flex items-center gap-2 px-3 py-2 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors"
            title="Tester l'aperçu"
          >
            <EyeIcon className="w-4 h-4" />
            Tester
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-2 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors"
            title="Copier l'URL"
          >
            <LinkIcon className="w-4 h-4" />
            Copier
          </button>
        </div>
      </div>

      {/* Aperçu Facebook/LinkedIn */}
      <div className="bg-white rounded-lg p-4 mb-4 max-w-md">
        <div className="flex gap-3">
          <img 
            src={image} 
            alt={title}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
              {title}
            </h4>
            <p className="text-gray-600 text-xs leading-relaxed mb-2 line-clamp-2">
              {description}
            </p>
            <p className="text-gray-500 text-xs">
              {url.replace(/^https?:\/\//, '')}
            </p>
          </div>
        </div>
      </div>

      {/* Aperçu Twitter */}
      <div className="bg-white rounded-lg p-4 max-w-md">
        <div className="mb-3">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover rounded"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {title}
          </h4>
          <p className="text-gray-600 text-xs leading-relaxed mb-2">
            {description}
          </p>
          <p className="text-gray-500 text-xs">
            {url.replace(/^https?:\/\//, '')}
          </p>
        </div>
      </div>

      {/* Informations techniques */}
      <div className="mt-4 p-3 bg-black/30 rounded-lg">
        <h5 className="text-sm font-semibold text-pm-gold mb-2">Meta Tags Générés :</h5>
        <div className="text-xs text-pm-off-white/80 space-y-1">
          <div><strong>og:title:</strong> {title}</div>
          <div><strong>og:description:</strong> {description}</div>
          <div><strong>og:image:</strong> {image}</div>
          <div><strong>og:url:</strong> {url}</div>
          <div><strong>twitter:card:</strong> summary_large_image</div>
        </div>
      </div>
    </div>
  );
};

export default SocialPreviewTester;
