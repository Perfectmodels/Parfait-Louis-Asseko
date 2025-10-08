import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Certification, ModelCertification, ModelEvaluation } from '../../types';
import { Award, Plus, Star, TrendingUp, Users, CheckCircle, Clock, FileText, Download } from 'lucide-react';

const AdminCertifications: React.FC = () => {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState<'certifications' | 'evaluations'>('certifications');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  const certifications: Certification[] = data?.certifications || [];
  const modelCertifications: ModelCertification[] = data?.modelCertifications || [];
  const evaluations: ModelEvaluation[] = data?.modelEvaluations || [];
  const models = data?.models || [];

  const [newCertification, setNewCertification] = useState<Partial<Certification>>({
    name: '',
    description: '',
    requirements: [],
    isActive: true
  });

  const [newEvaluation, setNewEvaluation] = useState<Partial<ModelEvaluation>>({
    modelId: '',
    type: 'general',
    criteria: {
      professionalism: 5,
      punctuality: 5,
      performance: 5,
      attitude: 5,
      appearance: 5
    },
    overallScore: 5,
    strengths: '',
    improvements: '',
    comments: ''
  });

  const handleCreateCertification = () => {
    const certification: Certification = {
      id: `cert-${Date.now()}`,
      name: newCertification.name || '',
      description: newCertification.description || '',
      requirements: newCertification.requirements || [],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    updateData({
      certifications: [...certifications, certification]
    });

    setNewCertification({
      name: '',
      description: '',
      requirements: [],
      isActive: true
    });
    setShowCreateModal(false);
  };

  const handleCreateEvaluation = () => {
    const model = models.find(m => m.id === newEvaluation.modelId);
    if (!model) return;

    const evaluation: ModelEvaluation = {
      id: `eval-${Date.now()}`,
      modelId: newEvaluation.modelId || '',
      modelName: model.name,
      evaluatorId: 'admin',
      evaluatorName: 'Administrateur',
      date: new Date().toISOString(),
      type: newEvaluation.type || 'general',
      criteria: newEvaluation.criteria || {
        professionalism: 5,
        punctuality: 5,
        performance: 5,
        attitude: 5,
        appearance: 5
      },
      overallScore: newEvaluation.overallScore || 5,
      strengths: newEvaluation.strengths,
      improvements: newEvaluation.improvements,
      comments: newEvaluation.comments
    };

    updateData({
      modelEvaluations: [...evaluations, evaluation]
    });

    setNewEvaluation({
      modelId: '',
      type: 'general',
      criteria: {
        professionalism: 5,
        punctuality: 5,
        performance: 5,
        attitude: 5,
        appearance: 5
      },
      overallScore: 5,
      strengths: '',
      improvements: '',
      comments: ''
    });
    setShowEvaluationModal(false);
  };

  const handleAwardCertification = (certificationId: string, modelId: string) => {
    const newModelCert: ModelCertification = {
      id: `model-cert-${Date.now()}`,
      modelId,
      certificationId,
      obtainedAt: new Date().toISOString(),
      score: 100
    };

    updateData({
      modelCertifications: [...modelCertifications, newModelCert]
    });
  };

  const getModelCertifications = (modelId: string) => {
    return modelCertifications.filter(mc => mc.modelId === modelId);
  };

  const getModelEvaluations = (modelId: string) => {
    return evaluations.filter(e => e.modelId === modelId);
  };

  const getModelAverageScore = (modelId: string) => {
    const modelEvals = getModelEvaluations(modelId);
    if (modelEvals.length === 0) return 0;
    const total = modelEvals.reduce((sum, e) => sum + e.overallScore, 0);
    return (total / modelEvals.length).toFixed(1);
  };

  const getCertificationStats = (certId: string) => {
    return modelCertifications.filter(mc => mc.certificationId === certId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certifications & Évaluations</h1>
          <p className="text-gray-600">Gérez les certifications et évaluez les performances</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Certifications</p>
                <p className="text-2xl font-bold text-gray-900">{certifications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Certifiés</p>
                <p className="text-2xl font-bold text-green-600">{modelCertifications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Évaluations</p>
                <p className="text-2xl font-bold text-blue-600">{evaluations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Score Moyen</p>
                <p className="text-2xl font-bold text-orange-600">
                  {evaluations.length > 0
                    ? (evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length).toFixed(1)
                    : '0'}/5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('certifications')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'certifications'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Certifications
            </button>
            <button
              onClick={() => setActiveTab('evaluations')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'evaluations'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Évaluations
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'certifications' ? (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Programmes de Certification</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
              >
                <Plus className="w-5 h-5" />
                Nouvelle Certification
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map(cert => (
                <div key={cert.id} className="border rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cert.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cert.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{cert.description}</p>

                  {cert.requirements && cert.requirements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Critères:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {cert.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                        {cert.requirements.length > 3 && (
                          <li className="text-gray-500">+{cert.requirements.length - 3} autres...</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Mannequins certifiés</p>
                        <p className="text-lg font-bold text-gray-900">{getCertificationStats(cert.id)}</p>
                      </div>
                      <button className="text-pm-gold hover:underline text-sm">
                        Attribuer →
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {certifications.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">Aucune certification créée</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    Créer une certification
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Évaluations des Mannequins</h2>
              <button
                onClick={() => setShowEvaluationModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
              >
                <Plus className="w-5 h-5" />
                Nouvelle Évaluation
              </button>
            </div>

            {/* Model Performance Overview */}
            <div className="space-y-4">
              {models.map(model => {
                const modelEvals = getModelEvaluations(model.id);
                const modelCerts = getModelCertifications(model.id);
                const avgScore = getModelAverageScore(model.id);

                return (
                  <div key={model.id} className="border rounded-xl p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={model.imageUrl || '/placeholder-avatar.png'}
                          alt={model.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{model.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">
                              {modelEvals.length} évaluation{modelEvals.length > 1 ? 's' : ''}
                            </span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm text-gray-600">
                              {modelCerts.length} certification{modelCerts.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Number(avgScore)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{avgScore}/5</p>
                      </div>
                    </div>

                    {modelEvals.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Dernière évaluation:</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">
                              {new Date(modelEvals[modelEvals.length - 1].date).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {modelEvals[modelEvals.length - 1].type}
                            </span>
                          </div>
                          {modelEvals[modelEvals.length - 1].comments && (
                            <p className="text-sm text-gray-600 italic">
                              "{modelEvals[modelEvals.length - 1].comments}"
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {modelCerts.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {modelCerts.map(mc => {
                          const cert = certifications.find(c => c.id === mc.certificationId);
                          return cert ? (
                            <span key={mc.id} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                              {cert.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Create Certification Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle Certification</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={newCertification.name}
                    onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Nom de la certification"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCertification.description}
                    onChange={(e) => setNewCertification({ ...newCertification, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Description de la certification"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Critères (un par ligne)</label>
                  <textarea
                    value={newCertification.requirements?.join('\n')}
                    onChange={(e) => setNewCertification({ 
                      ...newCertification, 
                      requirements: e.target.value.split('\n').filter(r => r.trim()) 
                    })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Critère 1&#10;Critère 2&#10;Critère 3"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateCertification}
                  disabled={!newCertification.name || !newCertification.description}
                  className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Evaluation Modal */}
        {showEvaluationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle Évaluation</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mannequin</label>
                  <select
                    value={newEvaluation.modelId}
                    onChange={(e) => setNewEvaluation({ ...newEvaluation, modelId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                  >
                    <option value="">Sélectionner un mannequin</option>
                    {models.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'évaluation</label>
                  <select
                    value={newEvaluation.type}
                    onChange={(e) => setNewEvaluation({ ...newEvaluation, type: e.target.value as ModelEvaluation['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                  >
                    <option value="general">Générale</option>
                    <option value="project">Projet</option>
                    <option value="training">Formation</option>
                    <option value="casting">Casting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Critères d'évaluation</label>
                  <div className="space-y-3">
                    {Object.entries(newEvaluation.criteria || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              onClick={() => setNewEvaluation({
                                ...newEvaluation,
                                criteria: {
                                  ...newEvaluation.criteria!,
                                  [key]: rating
                                }
                              })}
                              className={`w-8 h-8 rounded ${
                                rating <= value
                                  ? 'bg-yellow-400 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points forts</label>
                  <textarea
                    value={newEvaluation.strengths}
                    onChange={(e) => setNewEvaluation({ ...newEvaluation, strengths: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Points positifs observés"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points à améliorer</label>
                  <textarea
                    value={newEvaluation.improvements}
                    onChange={(e) => setNewEvaluation({ ...newEvaluation, improvements: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Axes d'amélioration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
                  <textarea
                    value={newEvaluation.comments}
                    onChange={(e) => setNewEvaluation({ ...newEvaluation, comments: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Commentaires additionnels"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Score global</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setNewEvaluation({ ...newEvaluation, overallScore: rating })}
                        className={`px-4 py-2 rounded ${
                          rating <= (newEvaluation.overallScore || 0)
                            ? 'bg-yellow-400 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowEvaluationModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateEvaluation}
                  disabled={!newEvaluation.modelId}
                  className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCertifications;
