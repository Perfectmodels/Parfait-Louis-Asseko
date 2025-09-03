
import React, { useState } from 'react';

const Application: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    // Handle file drop logic here
    // const files = e.dataTransfer.files;
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Devenir Mannequin</h1>
        <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
          Vous avez le talent, la passion et la discipline ? Rejoignez l'élite de la mode gabonaise. Remplissez le formulaire ci-dessous pour soumettre votre candidature.
        </p>

        <div className="max-w-4xl mx-auto bg-black p-8 md:p-12 border border-pm-gold/20">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Nom complet" id="fullName" type="text" />
              <InputField label="Email" id="email" type="email" />
              <InputField label="Téléphone" id="phone" type="tel" />
              <InputField label="Âge" id="age" type="number" />
              <InputField label="Taille (ex: 1m85)" id="height" type="text" />
              <InputField label="Ville de résidence" id="city" type="text" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input type="radio" name="gender" className="form-radio bg-pm-dark border-pm-off-white/30 text-pm-gold focus:ring-pm-gold" />
                  <span className="ml-2">Femme</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="gender" className="form-radio bg-pm-dark border-pm-off-white/30 text-pm-gold focus:ring-pm-gold" />
                  <span className="ml-2">Homme</span>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">Expérience (si applicable)</label>
              <textarea
                id="experience"
                rows={4}
                className="w-full bg-pm-dark border border-pm-off-white/30 rounded-lg p-3 focus:outline-none focus:border-pm-gold transition-colors"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Vos Photos</label>
              <label
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                htmlFor="photo-upload"
                className={`flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-pm-gold' : 'border-pm-gold/50'} border-dashed rounded-md cursor-pointer transition-colors`}
              >
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-400">
                    <p className="pl-1">Glissez-déposez ou cliquez pour choisir vos photos</p>
                  </div>
                  <p className="text-xs text-gray-500">Portraits et photos en pied (PNG, JPG)</p>
                </div>
                <input id="photo-upload" name="photo-upload" type="file" multiple className="sr-only" />
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30"
              >
                Envoyer ma candidature
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      id={id}
      className="w-full bg-pm-dark border border-pm-off-white/30 rounded-lg p-3 focus:outline-none focus:border-pm-gold transition-colors"
    />
  </div>
);

export default Application;
