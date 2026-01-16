import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ImageUploader from '../components/ImageUploader'; // Corrected import path
import HeroManager from '../components/admin/HeroManager';
import { useData } from '../contexts/DataContext';
import { HeroSlide } from '../types';

const AdminSettings: React.FC = () => {
  const { data, saveData } = useData();

  if (!data) return (
      <AdminLayout>
          <div className="flex items-center justify-center h-full">
              <p className="text-pm-gold animate-pulse">Chargement des données...</p>
          </div>
      </AdminLayout>
  );

  const { siteImages, heroSlides } = data;

  const handleUpdateImage = (key: keyof typeof siteImages, url: string) => {
    saveData({
      ...data,
      siteImages: {
        ...siteImages,
        [key]: url
      }
    });
  };

  const handleUpdateHeroSlides = (newSlides: HeroSlide[]) => {
    saveData({
      ...data,
      heroSlides: newSlides
    });
  };

  return (
    <AdminLayout>
        <div className="space-y-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-playfair text-pm-gold mb-8">Paramètres du Site</h1>

        <div className="bg-pm-dark/50 p-6 rounded-lg border border-pm-gold/20">
            <HeroManager
                slides={heroSlides || []}
                onUpdate={handleUpdateHeroSlides}
            />
        </div>

        <div className="bg-pm-dark/50 p-6 rounded-lg border border-pm-gold/20">
            <h2 className="text-xl font-playfair text-pm-gold mb-6">Autres Images du Site</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-pm-off-white mb-2">Image À Propos</label>
                <ImageUploader
                currentImage={siteImages?.about || ''}
                onImageUpload={(url) => handleUpdateImage('about', url)}
                folder="site-images"
                />
            </div>

            <div>
                <label className="block text-pm-off-white mb-2">Arrière-plan Fashion Day</label>
                <ImageUploader
                currentImage={siteImages?.fashionDayBg || ''}
                onImageUpload={(url) => handleUpdateImage('fashionDayBg', url)}
                folder="site-images"
                />
            </div>

            <div>
                <label className="block text-pm-off-white mb-2">Arrière-plan Classroom</label>
                <ImageUploader
                currentImage={siteImages?.classroomBg || ''}
                onImageUpload={(url) => handleUpdateImage('classroomBg', url)}
                folder="site-images"
                />
            </div>

            <div>
                <label className="block text-pm-off-white mb-2">Arrière-plan Casting</label>
                <ImageUploader
                currentImage={siteImages?.castingBg || ''}
                onImageUpload={(url) => handleUpdateImage('castingBg', url)}
                folder="site-images"
                />
            </div>

            <div>
                <label className="block text-pm-off-white mb-2">Image Histoire Agence</label>
                <ImageUploader
                currentImage={siteImages?.agencyHistory || ''}
                onImageUpload={(url) => handleUpdateImage('agencyHistory', url)}
                folder="site-images"
                />
            </div>
            </div>
        </div>
        </div>
    </AdminLayout>
  );
};

export default AdminSettings;
