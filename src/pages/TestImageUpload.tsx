import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import MultipleImageUpload from '../components/MultipleImageUpload';

const TestImageUpload: React.FC = () => {
  const [singleImage, setSingleImage] = useState<string>('');
  const [multipleImages, setMultipleImages] = useState<string[]>([]);

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-playfair text-pm-gold mb-8">Test d'Upload d'Images</h1>
        
        <div className="space-y-12">
          <div className="bg-black border border-pm-gold/20 p-6 rounded-lg">
            <h2 className="text-2xl font-playfair text-pm-gold mb-4">Upload d'Image Unique</h2>
            <ImageUpload
              currentImage={singleImage}
              onImageUploaded={setSingleImage}
              placeholder="Testez l'upload d'une image unique"
            />
            {singleImage && (
              <div className="mt-4 p-4 bg-pm-dark rounded-lg">
                <p className="text-sm text-pm-off-white/70 mb-2">URL de l'image uploadée :</p>
                <p className="text-xs text-pm-gold break-all">{singleImage}</p>
              </div>
            )}
          </div>

          <div className="bg-black border border-pm-gold/20 p-6 rounded-lg">
            <h2 className="text-2xl font-playfair text-pm-gold mb-4">Upload d'Images Multiples</h2>
            <MultipleImageUpload
              images={multipleImages}
              onImagesChange={setMultipleImages}
              maxImages={5}
              placeholder="Testez l'upload d'images multiples"
            />
            {multipleImages.length > 0 && (
              <div className="mt-4 p-4 bg-pm-dark rounded-lg">
                <p className="text-sm text-pm-off-white/70 mb-2">Images uploadées ({multipleImages.length}) :</p>
                <div className="space-y-2">
                  {multipleImages.map((url, index) => (
                    <p key={index} className="text-xs text-pm-gold break-all">
                      {index + 1}. {url}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestImageUpload;
