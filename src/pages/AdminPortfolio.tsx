import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { PortfolioImage, PortfolioCategory, CompCard } from '../../types';
import { Camera, Plus, Image as ImageIcon, Star, Edit, Trash2, Upload, Eye, EyeOff, Tag } from 'lucide-react';

const AdminPortfolio: React.FC = () => {
  const { data, updateData } = useData();
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'images' | 'categories' | 'compcards'>('images');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const models = data?.models || [];
  const portfolioImages: PortfolioImage[] = data?.portfolioImages || [];
  const categories: PortfolioCategory[] = data?.portfolioCategories || [];
  const compCards: CompCard[] = data?.compCards || [];

  const [newCategory, setNewCategory] = useState<Partial<PortfolioCategory>>({
    name: '',
    description: '',
    order: 0
  });

  const [uploadData, setUploadData] = useState({
    modelId: '',
    title: '',
    description: '',
    categories: [] as string[],
    tags: [] as string[],
    photographer: '',
    shootDate: '',
    location: '',
    isFeatured: false,
    isPublic: true
  });

  const modelImages = selectedModel 
    ? portfolioImages.filter(img => img.modelId === selectedModel)
    : portfolioImages;

  const filteredImages = filterCategory === 'all' 
    ? modelImages 
    : modelImages.filter(img => img.categories.includes(filterCategory));

  const handleCreateCategory = () => {
    const category: PortfolioCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name || '',
      description: newCategory.description,
      order: newCategory.order || categories.length
    };

    updateData({
      portfolioCategories: [...categories, category]
    });

    setNewCategory({ name: '', description: '', order: 0 });
  };

  const handleUploadImages = () => {
    // Simulation d'upload - En production, utiliser un service comme Cloudinary
    const newImage: PortfolioImage = {
      id: `img-${Date.now()}`,
      modelId: uploadData.modelId || selectedModel,
      imageUrl: '/placeholder-portfolio.jpg', // URL de l'image uploadée
      thumbnailUrl: '/placeholder-portfolio-thumb.jpg',
      title: uploadData.title,
      description: uploadData.description,
      categories: uploadData.categories,
      tags: uploadData.tags,
      photographer: uploadData.photographer,
      shootDate: uploadData.shootDate,
      location: uploadData.location,
      isFeatured: uploadData.isFeatured,
      isPublic: uploadData.isPublic,
      order: portfolioImages.length,
      uploadedAt: new Date().toISOString(),
      metadata: {
        width: 1920,
        height: 1280,
        size: 2048000,
        format: 'jpg'
      }
    };

    updateData({
      portfolioImages: [...portfolioImages, newImage]
    });

    setShowUploadModal(false);
    setUploadData({
      modelId: '',
      title: '',
      description: '',
      categories: [],
      tags: [],
      photographer: '',
      shootDate: '',
      location: '',
      isFeatured: false,
      isPublic: true
    });
  };

  const handleToggleFeatured = (imageId: string) => {
    updateData({
      portfolioImages: portfolioImages.map(img =>
        img.id === imageId ? { ...img, isFeatured: !img.isFeatured } : img
      )
    });
  };

  const handleTogglePublic = (imageId: string) => {
    updateData({
      portfolioImages: portfolioImages.map(img =>
        img.id === imageId ? { ...img, isPublic: !img.isPublic } : img
      )
    });
  };

  const handleDeleteImage = (imageId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      updateData({
        portfolioImages: portfolioImages.filter(img => img.id !== imageId)
      });
    }
  };

  const handleGenerateCompCard = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    const modelPortfolioImages = portfolioImages
      .filter(img => img.modelId === modelId && img.isFeatured)
      .slice(0, 4)
      .map(img => img.imageUrl);

    const newCompCard: CompCard = {
      id: `comp-${Date.now()}`,
      modelId,
      templateId: 'default',
      images: modelPortfolioImages,
      info: {
        name: model.name,
        measurements: `${model.height} | ${model.measurements.chest}-${model.measurements.waist}-${model.measurements.hips}`,
        contact: 'Perfect Models Management'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updateData({
      compCards: [...compCards, newCompCard]
    });
  };

  const handleBulkAction = (action: 'delete' | 'public' | 'private' | 'feature') => {
    if (selectedImages.length === 0) return;

    switch (action) {
      case 'delete':
        if (confirm(`Supprimer ${selectedImages.length} images ?`)) {
          updateData({
            portfolioImages: portfolioImages.filter(img => !selectedImages.includes(img.id))
          });
          setSelectedImages([]);
        }
        break;
      case 'public':
        updateData({
          portfolioImages: portfolioImages.map(img =>
            selectedImages.includes(img.id) ? { ...img, isPublic: true } : img
          )
        });
        break;
      case 'private':
        updateData({
          portfolioImages: portfolioImages.map(img =>
            selectedImages.includes(img.id) ? { ...img, isPublic: false } : img
          )
        });
        break;
      case 'feature':
        updateData({
          portfolioImages: portfolioImages.map(img =>
            selectedImages.includes(img.id) ? { ...img, isFeatured: true } : img
          )
        });
        break;
    }
  };

  const stats = {
    totalImages: portfolioImages.length,
    publicImages: portfolioImages.filter(img => img.isPublic).length,
    featuredImages: portfolioImages.filter(img => img.isFeatured).length,
    totalModels: new Set(portfolioImages.map(img => img.modelId)).size
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Portfolios</h1>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
            >
              <Upload className="w-5 h-5" />
              Upload Images
            </button>
          </div>
          <p className="text-gray-600">Gérez les portfolios et comp cards des mannequins</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Publiques</p>
                <p className="text-2xl font-bold text-green-600">{stats.publicImages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En vedette</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.featuredImages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mannequins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalModels}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('images')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'images'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Images ({portfolioImages.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'categories'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Catégories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('compcards')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'compcards'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Comp Cards ({compCards.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
              >
                <option value="">Tous les mannequins</option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              {selectedImages.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-600">{selectedImages.length} sélectionnées</span>
                  <button
                    onClick={() => handleBulkAction('feature')}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                  >
                    Mettre en vedette
                  </button>
                  <button
                    onClick={() => handleBulkAction('public')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                  >
                    Rendre public
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map(image => {
                const model = models.find(m => m.id === image.modelId);
                const isSelected = selectedImages.includes(image.id);

                return (
                  <div
                    key={image.id}
                    className={`relative group border rounded-lg overflow-hidden hover:shadow-lg transition ${
                      isSelected ? 'ring-2 ring-pm-gold' : ''
                    }`}
                  >
                    <div
                      className="aspect-[3/4] bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if (selectedImages.includes(image.id)) {
                          setSelectedImages(selectedImages.filter(id => id !== image.id));
                        } else {
                          setSelectedImages([...selectedImages, image.id]);
                        }
                      }}
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.title || 'Portfolio'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition">
                      <div className="flex gap-1">
                        {image.isFeatured && (
                          <span className="p-1 bg-yellow-500 text-white rounded">
                            <Star className="w-4 h-4" />
                          </span>
                        )}
                        {image.isPublic ? (
                          <span className="p-1 bg-green-500 text-white rounded">
                            <Eye className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="p-1 bg-red-500 text-white rounded">
                            <EyeOff className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setSelectedImages([...selectedImages, image.id]);
                          } else {
                            setSelectedImages(selectedImages.filter(id => id !== image.id));
                          }
                        }}
                        className="w-5 h-5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition">
                      <p className="text-sm font-medium truncate">{model?.name}</p>
                      {image.title && <p className="text-xs truncate">{image.title}</p>}
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFeatured(image.id);
                          }}
                          className="p-1 bg-white/20 hover:bg-white/30 rounded transition"
                          title="Mettre en vedette"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePublic(image.id);
                          }}
                          className="p-1 bg-white/20 hover:bg-white/30 rounded transition"
                          title="Basculer la visibilité"
                        >
                          {image.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id);
                          }}
                          className="p-1 bg-white/20 hover:bg-white/30 rounded transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucune image trouvée</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-6 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                >
                  Uploader des images
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Catégories de Portfolio</h2>
              <button
                onClick={() => {
                  const name = prompt('Nom de la catégorie :');
                  if (name) {
                    setNewCategory({ name });
                    handleCreateCategory();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
              >
                <Plus className="w-5 h-5" />
                Nouvelle Catégorie
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryImages = portfolioImages.filter(img => 
                  img.categories.includes(category.name)
                ).length;

                return (
                  <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        Ordre: {category.order}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">{categoryImages} images</span>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucune catégorie créée</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compcards' && (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map(model => {
                const modelCompCard = compCards.find(cc => cc.modelId === model.id);
                const modelFeaturedImages = portfolioImages
                  .filter(img => img.modelId === model.id && img.isFeatured)
                  .length;

                return (
                  <div key={model.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={model.imageUrl || '/placeholder-avatar.png'}
                        alt={model.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{model.name}</h3>
                        <p className="text-sm text-gray-600">{modelFeaturedImages} images en vedette</p>
                      </div>
                    </div>

                    {modelCompCard ? (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-600 mb-2">Comp Card générée</p>
                        <p className="text-sm text-gray-900">
                          {new Date(modelCompCard.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button className="text-sm text-blue-600 hover:underline">
                            Voir
                          </button>
                          <button className="text-sm text-green-600 hover:underline">
                            Télécharger
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-yellow-800">Aucune comp card</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleGenerateCompCard(model.id)}
                      disabled={modelFeaturedImages < 4}
                      className={`w-full px-4 py-2 rounded-lg transition ${
                        modelFeaturedImages >= 4
                          ? 'bg-pm-gold text-white hover:bg-opacity-90'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {modelCompCard ? 'Regénérer' : 'Générer'} Comp Card
                    </button>
                    {modelFeaturedImages < 4 && (
                      <p className="text-xs text-red-500 mt-2">
                        Minimum 4 images en vedette requises
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload d'Images</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mannequin</label>
                  <select
                    value={uploadData.modelId || selectedModel}
                    onChange={(e) => setUploadData({ ...uploadData, modelId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                  >
                    <option value="">Sélectionner un mannequin</option>
                    {models.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pm-gold transition">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Glissez-déposez vos images ici</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer"
                    >
                      Parcourir
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Titre de la séance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photographe</label>
                  <input
                    type="text"
                    value={uploadData.photographer}
                    onChange={(e) => setUploadData({ ...uploadData, photographer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Nom du photographe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date du shoot</label>
                    <input
                      type="date"
                      value={uploadData.shootDate}
                      onChange={(e) => setUploadData({ ...uploadData, shootDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
                    <input
                      type="text"
                      value={uploadData.location}
                      onChange={(e) => setUploadData({ ...uploadData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                      placeholder="Lieu du shooting"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={uploadData.categories.includes(cat.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUploadData({
                                ...uploadData,
                                categories: [...uploadData.categories, cat.name]
                              });
                            } else {
                              setUploadData({
                                ...uploadData,
                                categories: uploadData.categories.filter(c => c !== cat.name)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={uploadData.isFeatured}
                      onChange={(e) => setUploadData({ ...uploadData, isFeatured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Mettre en vedette</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={uploadData.isPublic}
                      onChange={(e) => setUploadData({ ...uploadData, isPublic: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Rendre public</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUploadImages}
                  disabled={!uploadData.modelId && !selectedModel}
                  className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Uploader
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;
