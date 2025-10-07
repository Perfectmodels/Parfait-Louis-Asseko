import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';

const CastingForm: React.FC = () => {
  const navigate = useNavigate();
  const { saveData, data } = useData();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    city: '',
    experience: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const application = {
        id: Date.now().toString(),
        ...formData,
        status: 'Nouveau',
        submittedAt: new Date().toISOString()
      };

      const existingApplications = data?.castingApplications || [];
      saveData({ ...data, castingApplications: [...existingApplications, application] });

      alert('Votre candidature a été soumise avec succès!');
      navigate('/casting');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <SEO 
        title="Formulaire de Casting"
        description="Postulez pour rejoindre notre agence de mannequins"
      />
      <div className="min-h-screen py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-playfair text-pm-gold mb-6">Formulaire de Casting</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Âge *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Taille (cm) *</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ville *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expérience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-pm-gold"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-pm-gold text-white py-3 rounded hover:bg-pm-gold/90 disabled:opacity-50"
                >
                  {submitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/casting')}
                  className="px-6 py-3 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CastingForm;

