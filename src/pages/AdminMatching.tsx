import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingMatch } from '../../types';
import { Users, Filter, Target, CheckCircle, XCircle, TrendingUp, Star } from 'lucide-react';

const AdminMatching: React.FC = () => {
  const { data, updateData } = useData();
  const [selectedCasting, setSelectedCasting] = useState<string>('');
  const [filterScore, setFilterScore] = useState<number>(0);
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);

  const models = data?.models || [];
  const castings = data?.castingApplications || [];

  // Fonction de matching automatique
  const calculateMatch = (casting: any, model: any): CastingMatch => {
    let score = 0;
    const reasons: string[] = [];
    const criteria = {
      heightMatch: false,
      genderMatch: false,
      categoryMatch: false,
      availabilityMatch: true, // Supposons que tous sont disponibles par défaut
      experienceMatch: false
    };

    // Matching du genre
    if (casting.gender === model.gender) {
      score += 30;
      criteria.genderMatch = true;
      reasons.push('Genre correspondant');
    }

    // Matching de la taille (±5cm de tolérance)
    const castingHeight = parseInt(casting.height);
    const modelHeight = parseInt(model.height);
    if (Math.abs(castingHeight - modelHeight) <= 5) {
      score += 25;
      criteria.heightMatch = true;
      reasons.push(`Taille compatible (${model.height}cm)`);
    }

    // Matching de la catégorie
    const castingCategories = ['Fashion', 'Commercial', 'Editorial']; // Simulation
    const modelCategories = model.categories || [];
    const hasCommonCategory = castingCategories.some(cat => modelCategories.includes(cat));
    if (hasCommonCategory) {
      score += 20;
      criteria.categoryMatch = true;
      reasons.push('Catégories correspondantes');
    }

    // Matching de l'expérience
    if (model.experience && model.experience.length > 100) {
      score += 15;
      criteria.experienceMatch = true;
      reasons.push('Expérience pertinente');
    }

    // Bonus pour les mannequins avec de bonnes évaluations
    const modelEvaluations = data?.modelEvaluations?.filter(e => e.modelId === model.id) || [];
    if (modelEvaluations.length > 0) {
      const avgScore = modelEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / modelEvaluations.length;
      if (avgScore >= 4) {
        score += 10;
        reasons.push(`Excellentes évaluations (${avgScore.toFixed(1)}/5)`);
      }
    }

    return {
      castingId: casting.id,
      modelId: model.id,
      matchScore: Math.min(score, 100),
      reasons,
      criteria,
      recommended: score >= 70
    };
  };

  // Calculer tous les matches pour le casting sélectionné
  const matches: CastingMatch[] = useMemo(() => {
    if (!selectedCasting) return [];

    const casting = castings.find(c => c.id === selectedCasting);
    if (!casting) return [];

    return models.map(model => calculateMatch(casting, model))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [selectedCasting, models, castings, data]);

  // Filtrer les matches
  const filteredMatches = matches.filter(match => {
    const meetsScoreThreshold = match.matchScore >= filterScore;
    const meetsRecommendation = !showOnlyRecommended || match.recommended;
    return meetsScoreThreshold && meetsRecommendation;
  });

  const handleSelectModel = (modelId: string) => {
    if (!selectedCasting) return;

    const casting = castings.find(c => c.id === selectedCasting);
    if (!casting) return;

    // Créer un profil mannequin pour le candidat accepté
    const model = models.find(m => m.id === modelId);
    if (model) {
      updateData({
        castingApplications: castings.map(c =>
          c.id === selectedCasting
            ? { ...c, status: 'Accepté' as const }
            : c
        )
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const stats = {
    totalCastings: castings.filter(c => c.status === 'Nouveau').length,
    totalModels: models.length,
    recommendedMatches: filteredMatches.filter(m => m.recommended).length,
    avgMatchScore: filteredMatches.length > 0
      ? (filteredMatches.reduce((sum, m) => sum + m.matchScore, 0) / filteredMatches.length).toFixed(1)
      : 0
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matching Automatique</h1>
          <p className="text-gray-600">Trouvez les meilleurs mannequins pour vos castings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Castings Ouverts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCastings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mannequins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalModels}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommandés</p>
                <p className="text-2xl font-bold text-green-600">{stats.recommendedMatches}</p>
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
                <p className="text-2xl font-bold text-orange-600">{stats.avgMatchScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Casting Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sélectionner un Casting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {castings
              .filter(c => c.status === 'Nouveau' || c.status === 'Présélectionné')
              .map(casting => (
                <div
                  key={casting.id}
                  onClick={() => setSelectedCasting(casting.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedCasting === casting.id
                      ? 'border-pm-gold bg-pm-gold/5'
                      : 'border-gray-300 hover:border-pm-gold'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {casting.firstName} {casting.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {casting.gender} • {casting.height}cm
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      casting.status === 'Nouveau' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {casting.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(casting.submissionDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
          </div>

          {castings.filter(c => c.status === 'Nouveau' || c.status === 'Présélectionné').length === 0 && (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun casting en attente</p>
            </div>
          )}
        </div>

        {/* Filters */}
        {selectedCasting && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filtres:</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Score minimum:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterScore}
                  onChange={(e) => setFilterScore(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-medium text-gray-900 min-w-[40px]">{filterScore}%</span>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlyRecommended}
                  onChange={(e) => setShowOnlyRecommended(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Recommandés uniquement</span>
              </label>

              <div className="ml-auto text-sm text-gray-600">
                {filteredMatches.length} résultats
              </div>
            </div>
          </div>
        )}

        {/* Matching Results */}
        {selectedCasting && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Résultats du Matching</h2>
            
            <div className="space-y-4">
              {filteredMatches.map(match => {
                const model = models.find(m => m.id === match.modelId);
                if (!model) return null;

                const modelEvaluations = data?.modelEvaluations?.filter(e => e.modelId === model.id) || [];
                const avgRating = modelEvaluations.length > 0
                  ? modelEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / modelEvaluations.length
                  : 0;

                return (
                  <div
                    key={match.modelId}
                    className={`border rounded-xl p-6 hover:shadow-md transition ${
                      match.recommended ? 'border-green-500 bg-green-50/50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={model.imageUrl || '/placeholder-avatar.png'}
                          alt={model.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{model.name}</h3>
                            {match.recommended && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Recommandé
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(match.matchScore)}`}>
                              {match.matchScore}%
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>{model.gender}</span>
                            <span>•</span>
                            <span>{model.height}cm</span>
                            <span>•</span>
                            <span>{model.location || 'Non spécifié'}</span>
                            {avgRating > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span>{avgRating.toFixed(1)}/5</span>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Points forts:</p>
                            <div className="flex flex-wrap gap-2">
                              {match.reasons.map((reason, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                              {Object.entries(match.criteria).map(([key, value]) => (
                                <span
                                  key={key}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                  }`}
                                  title={key.replace('Match', '')}
                                >
                                  {value ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500">
                              Taille • Genre • Catégorie • Disponibilité • Expérience
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleSelectModel(model.id)}
                          className="px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                        >
                          Sélectionner
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                          Voir Profil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredMatches.length === 0 && (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucun mannequin ne correspond aux critères</p>
                  <p className="text-gray-400 text-sm mt-2">Essayez d'ajuster les filtres</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedCasting && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Target className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Sélectionnez un casting pour voir les recommandations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMatching;
