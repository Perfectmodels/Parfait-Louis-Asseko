import React, { useState } from 'react';
import { Model } from '../types';
import { 
  HeartIcon, 
  ShareIcon, 
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface EnhancedModelPortfolioProps {
  model: Model;
  isOwnProfile?: boolean;
}

const EnhancedModelPortfolio: React.FC<EnhancedModelPortfolioProps> = ({
  model,
  isOwnProfile = false
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'professional' | 'fashion' | 'lifestyle'>('all');

  // Simulation des images du portfolio
  const portfolioImages = [
    { id: '1', url: 'https://i.ibb.co/NdrpzGpm/blob.jpg', category: 'professional', title: 'Shooting Studio' },
    { id: '2', url: 'https://i.ibb.co/NdrpzGpm/blob.jpg', category: 'fashion', title: 'Défilé Paris' },
    { id: '3', url: 'https://i.ibb.co/NdrpzGpm/blob.jpg', category: 'lifestyle', title: 'Street Style' },
    { id: '4', url: 'https://i.ibb.co/NdrpzGpm/blob.jpg', category: 'professional', title: 'Portrait Pro' },
    { id: '5', url: 'https://i.ibb.co/NdrpzGpm/blob.jpg', category: 'fashion', title: 'Haute Couture' },
    { id: '6', url: 'https://i.ibb.co/NdrpzGpm/blob.jpg', category: 'lifestyle', title: 'Nature' },
  ];

  const filteredImages = filter === 'all' 
    ? portfolioImages 
    : portfolioImages.filter(img => img.category === filter);

  const toggleLike = (imageId: string) => {
    setLikedImages(prev => {
      const newLikes = new Set(prev);
      if (newLikes.has(imageId)) {
        newLikes.delete(imageId);
      } else {
        newLikes.add(imageId);
      }
      return newLikes;
    });
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${model.name} - Perfect Models`,
        text: `Découvrez le portfolio de ${model.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers');
    }
  };

  const downloadCompCard = () => {
    // Simulation de téléchargement de comp card
    alert('Téléchargement de la comp card en cours...');
  };

  return (
    <div className="space-y-6">
      {/* Header du portfolio */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
            <p className="text-gray-600 mt-1">{portfolioImages.length} photos</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filtres */}
            <div className="flex items-center space-x-2">
              {(['all', 'professional', 'fashion', 'lifestyle'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-pm-gold text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'Tout' : f === 'professional' ? 'Pro' : f === 'fashion' ? 'Mode' : 'Life'}
                </button>
              ))}
            </div>

            {/* Vue mode */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={shareProfile}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Partager"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
              {isOwnProfile && (
                <button
                  onClick={downloadCompCard}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Télécharger Comp Card"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] relative">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                  <button
                    onClick={() => setSelectedImage(image.url)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => toggleLike(image.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {likedImages.has(image.id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                </div>

                {/* Catégorie */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-gray-900">{image.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {likedImages.has(image.id) ? 'Liké' : 'Aimer'}
                  </span>
                  <div className="flex items-center space-x-1">
                    {likedImages.has(image.id) && (
                      <HeartSolidIcon className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-32 flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{image.title}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-1">
                        {image.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedImage(image.url)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <MagnifyingGlassIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleLike(image.id)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {likedImages.has(image.id) ? (
                          <HeartSolidIcon className="w-4 h-4 text-red-500" />
                        ) : (
                          <HeartIcon className="w-4 h-4 text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'image agrandie */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Agrandissement"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
            >
              <span className="text-white text-xl">×</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedModelPortfolio;
