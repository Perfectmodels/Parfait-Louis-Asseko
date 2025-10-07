import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserGroupIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Student {
  id: string;
  name: string;
  email: string;
  level: string;
  progress: number;
  joinDate: string;
}

interface PromoteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromote: (studentId: string, promotionData: any) => void;
  students: Student[];
}

const PromoteStudentModal: React.FC<PromoteStudentModalProps> = ({ 
  isOpen, 
  onClose, 
  onPromote, 
  students 
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [promotionData, setPromotionData] = useState({
    newLevel: 'pro',
    contractType: 'exclusif',
    startDate: '',
    salary: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setSelectedStudent(null);
      setPromotionData({
        newLevel: 'pro',
        contractType: 'exclusif',
        startDate: '',
        salary: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setPromotionData(prev => ({
      ...prev,
      startDate: new Date().toISOString().split('T')[0]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPromotionData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedStudent) newErrors.student = 'Veuillez sélectionner un étudiant';
    if (!promotionData.startDate) newErrors.startDate = 'La date de début est requise';
    if (!promotionData.salary) newErrors.salary = 'Le salaire est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedStudent) return;

    const finalPromotionData = {
      ...promotionData,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      previousLevel: selectedStudent.level,
      promotedAt: new Date().toISOString()
    };

    onPromote(selectedStudent.id, finalPromotionData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <StarIcon className="w-6 h-6" />
              Promouvoir un Étudiant
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Sélection de l'étudiant */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-pm-gold mb-4">
              Sélectionner un Étudiant à Promouvoir
            </h3>
            
            {students.length === 0 ? (
              <div className="text-center py-8 text-pm-off-white/70">
                <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-pm-gold/50" />
                <p>Aucun étudiant débutant disponible pour la promotion.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedStudent?.id === student.id
                        ? 'border-pm-gold bg-pm-gold/10'
                        : 'border-pm-gold/20 hover:border-pm-gold/40 hover:bg-pm-gold/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-pm-off-white">{student.name}</h4>
                      {selectedStudent?.id === student.id && (
                        <CheckCircleIcon className="w-5 h-5 text-pm-gold" />
                      )}
                    </div>
                    <p className="text-sm text-pm-off-white/70 mb-2">{student.email}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-pm-gold">Niveau: {student.level}</span>
                      <span className="text-pm-off-white/60">Progrès: {student.progress}%</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-pm-gold/20 rounded-full h-2">
                        <div 
                          className="bg-pm-gold h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {errors.student && (
              <p className="text-red-400 text-sm mt-2">{errors.student}</p>
            )}
          </div>

          {/* Formulaire de promotion */}
          {selectedStudent && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-pm-gold/5 border border-pm-gold/20 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-pm-gold mb-2">Étudiant sélectionné</h4>
                <p className="text-pm-off-white">{selectedStudent.name} - {selectedStudent.email}</p>
                <p className="text-sm text-pm-off-white/70">
                  Niveau actuel: {selectedStudent.level} | Progrès: {selectedStudent.progress}%
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Nouveau Niveau *
                  </label>
                  <select
                    name="newLevel"
                    value={promotionData.newLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  >
                    <option value="pro">Mannequin Professionnel</option>
                    <option value="senior">Mannequin Senior</option>
                    <option value="expert">Mannequin Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Type de Contrat *
                  </label>
                  <select
                    name="contractType"
                    value={promotionData.contractType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  >
                    <option value="exclusif">Contrat Exclusif</option>
                    <option value="non-exclusif">Contrat Non-Exclusif</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Date de Début *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={promotionData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                      errors.startDate ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                  />
                  {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Salaire Mensuel (FCFA) *
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={promotionData.salary}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                      errors.salary ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="500000"
                  />
                  {errors.salary && <p className="text-red-400 text-sm mt-1">{errors.salary}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Notes de Promotion
                </label>
                <textarea
                  name="notes"
                  value={promotionData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  placeholder="Notes sur la promotion, conditions spéciales, etc."
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-pm-gold/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
                >
                  Promouvoir l'Étudiant
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoteStudentModal;
