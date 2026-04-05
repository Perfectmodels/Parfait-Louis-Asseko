import React, { useState, useEffect } from 'react';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { db } from '../firebaseConfig';
import { Miss5emeCandidate, Miss5emeScore, Miss5emeResult, Miss5emeCandidateSheet, Miss5emeJury } from '../types';
import { useToast } from '../components/ui/Toast';
import AdminLayout from '../components/admin/AdminLayout';

const AdminMiss5eme: React.FC = () => {
  const { success: showToast, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState<'candidates' | 'results' | 'sheets'>('candidates');
  const [candidates, setCandidates] = useState<Miss5emeCandidate[]>([]);
  const [scores, setScores] = useState<Miss5emeScore[]>([]);
  const [results, setResults] = useState<Miss5emeResult[]>([]);
  const [candidateSheets, setCandidateSheets] = useState<Miss5emeCandidateSheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<Miss5emeCandidateSheet | null>(null);
  
  // Notation modal state
  const [isNotationModalOpen, setIsNotationModalOpen] = useState(false);
  const [selectedCandidateForNotation, setSelectedCandidateForNotation] = useState<Miss5emeCandidate | null>(null);
  const [selectedJuryForNotation, setSelectedJuryForNotation] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPassageForNotation, setSelectedPassageForNotation] = useState<1 | 2 | 3>(1);
  const [notationScores, setNotationScores] = useState({
    sourire: 0,
    gestuelle: 0,
    performanceTechnique: 0,
    prestanceElegance: 0
  });
  
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    number: 1,
    photoUrl: ''
  });

  // Load candidates
  useEffect(() => {
    const candidatesRef = ref(db, 'miss5emeCandidates');
    const unsubscribe = onValue(candidatesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const candidatesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => a.number - b.number);
        setCandidates(candidatesList);
      } else {
        setCandidates([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load scores
  useEffect(() => {
    const scoresRef = ref(db, 'miss5emeScores');
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const scoresList = Object.values(data) as Miss5emeScore[];
        setScores(scoresList);
      } else {
        setScores([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Calculate results
  useEffect(() => {
    if (candidates.length === 0 || scores.length === 0) {
      setResults([]);
      return;
    }

    const calculatedResults: Miss5emeResult[] = candidates.map(candidate => {
      const candidateScores = scores.filter(s => s.candidateId === candidate.id);
      
      // Calculate average for each passage across all jury members
      const passage1Scores = candidateScores.filter(s => s.passage === 1);
      const passage2Scores = candidateScores.filter(s => s.passage === 2);
      const passage3Scores = candidateScores.filter(s => s.passage === 3);
      
      const passage1Total = passage1Scores.length > 0
        ? passage1Scores.reduce((sum, s) => sum + s.totalPassage, 0) / passage1Scores.length
        : 0;
      
      const passage2Total = passage2Scores.length > 0
        ? passage2Scores.reduce((sum, s) => sum + s.totalPassage, 0) / passage2Scores.length
        : 0;
      
      const passage3Total = passage3Scores.length > 0
        ? passage3Scores.reduce((sum, s) => sum + s.totalPassage, 0) / passage3Scores.length
        : 0;
      
      const validPassages = [passage1Total, passage2Total, passage3Total].filter(p => p > 0);
      const finalScore = validPassages.length > 0
        ? validPassages.reduce((sum, p) => sum + p, 0) / validPassages.length
        : 0;

      return {
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateNumber: candidate.number,
        passage1Total,
        passage2Total,
        passage3Total,
        finalScore
      };
    });

    // Sort by final score and assign ranks
    const sortedResults = calculatedResults
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((result, index) => ({
        ...result,
        rank: index + 1
      }));

    setResults(sortedResults);
  }, [candidates, scores]);

  // Calculate candidate sheets
  useEffect(() => {
    if (candidates.length === 0) {
      setCandidateSheets([]);
      return;
    }

    const sheets: Miss5emeCandidateSheet[] = candidates.map(candidate => {
      const candidateScores = scores.filter(s => s.candidateId === candidate.id);
      
      const scoresByJury: { [juryNumber: number]: any } = {};
      [1, 2, 3, 4].forEach(juryNum => {
        const juryScores = candidateScores.filter(s => s.juryNumber === juryNum);
        scoresByJury[juryNum] = {
          passage1: juryScores.find(s => s.passage === 1),
          passage2: juryScores.find(s => s.passage === 2),
          passage3: juryScores.find(s => s.passage === 3)
        };
      });

      // Calculate averages by passage
      const passage1Scores = candidateScores.filter(s => s.passage === 1);
      const passage2Scores = candidateScores.filter(s => s.passage === 2);
      const passage3Scores = candidateScores.filter(s => s.passage === 3);

      const passage1Avg = passage1Scores.length > 0
        ? passage1Scores.reduce((sum, s) => sum + s.totalPassage, 0) / passage1Scores.length
        : 0;
      const passage2Avg = passage2Scores.length > 0
        ? passage2Scores.reduce((sum, s) => sum + s.totalPassage, 0) / passage2Scores.length
        : 0;
      const passage3Avg = passage3Scores.length > 0
        ? passage3Scores.reduce((sum, s) => sum + s.totalPassage, 0) / passage3Scores.length
        : 0;

      const validAvgs = [passage1Avg, passage2Avg, passage3Avg].filter(a => a > 0);
      const finalScore = validAvgs.length > 0
        ? validAvgs.reduce((sum, a) => sum + a, 0) / validAvgs.length
        : 0;

      return {
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateNumber: candidate.number,
        scoresByJury,
        averageByPassage: {
          passage1: passage1Avg,
          passage2: passage2Avg,
          passage3: passage3Avg
        },
        finalScore
      };
    });

    setCandidateSheets(sheets);
  }, [candidates, scores]);

  const handleAddCandidate = async () => {
    if (!newCandidate.name.trim()) {
      showError('Veuillez entrer un nom');
      return;
    }

    if (candidates.some(c => c.number === newCandidate.number)) {
      showError('Ce numéro est déjà utilisé');
      return;
    }

    if (candidates.length >= 10) {
      showError('Maximum 10 candidates');
      return;
    }

    const candidateRef = push(ref(db, 'miss5emeCandidates'));
    const candidateData: any = {
      id: candidateRef.key!,
      name: newCandidate.name.trim(),
      number: newCandidate.number
    };
    
    // Only add photoUrl if it has a value
    if (newCandidate.photoUrl.trim()) {
      candidateData.photoUrl = newCandidate.photoUrl.trim();
    }

    await set(candidateRef, candidateData);
    showToast('Candidate ajoutée');
    setNewCandidate({ name: '', number: candidates.length + 1, photoUrl: '' });
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!confirm('Supprimer cette candidate et toutes ses notes ?')) return;
    
    await remove(ref(db, `miss5emeCandidates/${candidateId}`));
    
    // Delete all scores for this candidate
    const candidateScores = scores.filter(s => s.candidateId === candidateId);
    for (const score of candidateScores) {
      const scoreRef = ref(db, `miss5emeScores`);
      onValue(scoreRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const scoreKey = Object.keys(data).find(key => 
            data[key].candidateId === candidateId && 
            data[key].juryNumber === score.juryNumber && 
            data[key].passage === score.passage
          );
          if (scoreKey) {
            remove(ref(db, `miss5emeScores/${scoreKey}`));
          }
        }
      }, { onlyOnce: true });
    }
    
    showToast('Candidate supprimée');
  };

  const handleResetAllScores = async () => {
    if (!confirm('Supprimer toutes les notes ? Cette action est irréversible.')) return;
    
    await remove(ref(db, 'miss5emeScores'));
    await remove(ref(db, 'miss5emeJury'));
    showToast('Toutes les notes ont été supprimées');
  };

  const openNotationModal = (candidate: Miss5emeCandidate) => {
    setSelectedCandidateForNotation(candidate);
    setIsNotationModalOpen(true);
    setNotationScores({ sourire: 0, gestuelle: 0, performanceTechnique: 0, prestanceElegance: 0 });
  };

  const handleSubmitNotation = async () => {
    if (!selectedCandidateForNotation) return;

    const total = Object.values(notationScores).reduce((sum, score) => sum + score, 0);
    if (total > 20) {
      showError('Le total ne peut pas dépasser 20 points');
      return;
    }

    // Check if jury already exists
    const juryRef = ref(db, 'miss5emeJury');
    let juryId = '';
    
    await onValue(juryRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const juryList = Object.values(data) as Miss5emeJury[];
        const existingJury = juryList.find(j => j.juryNumber === selectedJuryForNotation);
        
        if (existingJury) {
          juryId = existingJury.id;
        }
      }
    }, { onlyOnce: true });

    // Create jury if doesn't exist
    if (!juryId) {
      const newJuryRef = push(ref(db, 'miss5emeJury'));
      const newJury: Miss5emeJury = {
        id: newJuryRef.key!,
        name: `Juré ${selectedJuryForNotation}`,
        juryNumber: selectedJuryForNotation,
        pin: '0000'
      };
      await set(newJuryRef, newJury);
      juryId = newJuryRef.key!;
    }

    const scoreData: Miss5emeScore = {
      juryId: juryId,
      juryNumber: selectedJuryForNotation,
      candidateId: selectedCandidateForNotation.id,
      passage: selectedPassageForNotation,
      sourire: notationScores.sourire,
      gestuelle: notationScores.gestuelle,
      performanceTechnique: notationScores.performanceTechnique,
      prestanceElegance: notationScores.prestanceElegance,
      totalPassage: total,
      timestamp: new Date().toISOString()
    };

    const newScoreRef = push(ref(db, 'miss5emeScores'));
    await set(newScoreRef, scoreData);

    showToast('Note enregistrée avec succès');
    setIsNotationModalOpen(false);
    setNotationScores({ sourire: 0, gestuelle: 0, performanceTechnique: 0, prestanceElegance: 0 });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-pink-600 mb-2">Miss 5ème</h1>
          <p className="text-gray-600">Gestion du concours et des résultats</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'candidates'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Candidates ({candidates.length}/10)
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'sheets'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Fiches Individuelles
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'results'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Classement Final
            </button>
          </div>
        </div>

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Accès Jury</h2>
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Lien pour les jurés :</strong>
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/jury/miss-5eme`}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/jury/miss-5eme`);
                      showToast('Lien copié');
                    }}
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors text-sm"
                  >
                    Copier
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  PIN : <strong>0000</strong> (identique pour tous les jurés)
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ajouter une candidate</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCandidate.number}
                    onChange={(e) => setNewCandidate({ ...newCandidate, number: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="Nom de la candidate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo URL (optionnel)
                  </label>
                  <input
                    type="text"
                    value={newCandidate.photoUrl}
                    onChange={(e) => setNewCandidate({ ...newCandidate, photoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <button
                onClick={handleAddCandidate}
                className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Ajouter
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Liste des candidates</h2>
                <button
                  onClick={handleResetAllScores}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Réinitialiser toutes les notes
                </button>
              </div>
              
              {candidates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune candidate ajoutée</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.map((candidate) => {
                    const candidateScores = scores.filter(s => s.candidateId === candidate.id);
                    const totalScores = candidateScores.length;
                    const maxScores = 12; // 4 jury × 3 passages
                    
                    return (
                      <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-2xl font-bold text-pink-600">#{candidate.number}</div>
                            <div className="font-semibold text-gray-800">{candidate.name}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openNotationModal(candidate)}
                              className="text-pink-600 hover:text-pink-800 text-sm font-semibold"
                              title="Noter cette candidate"
                            >
                              ✏️ Noter
                            </button>
                            <button
                              onClick={() => handleDeleteCandidate(candidate.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Supprimer"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Notes reçues: {totalScores}/{maxScores}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sheets' && (
          <div className="space-y-6">
            {selectedSheet ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => setSelectedSheet(null)}
                  className="mb-4 text-pink-600 hover:text-pink-700 font-semibold"
                >
                  ← Retour à la liste
                </button>
                
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">
                        Candidate #{selectedSheet.candidateNumber}
                      </h2>
                      <p className="text-xl text-gray-600 mt-1">{selectedSheet.candidateName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Note Finale</p>
                      <p className="text-4xl font-bold text-pink-600">
                        {selectedSheet.finalScore.toFixed(2)}<span className="text-2xl">/20</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {[1, 2, 3].map((passage) => {
                    const passageKey = `passage${passage}` as 'passage1' | 'passage2' | 'passage3';
                    const passageAvg = selectedSheet.averageByPassage[passageKey];
                    
                    return (
                      <div key={passage} className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-bold text-gray-800">
                            Passage {passage}
                          </h3>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Moyenne</p>
                            <p className="text-3xl font-bold text-pink-600">
                              {passageAvg > 0 ? passageAvg.toFixed(2) : '-'}<span className="text-xl">/20</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 px-3 font-bold text-gray-700">Juré</th>
                                <th className="text-center py-3 px-3 font-bold text-gray-700">
                                  <div>😊</div>
                                  <div className="text-xs font-normal">Sourire</div>
                                </th>
                                <th className="text-center py-3 px-3 font-bold text-gray-700">
                                  <div>🤸</div>
                                  <div className="text-xs font-normal">Gestuelle</div>
                                </th>
                                <th className="text-center py-3 px-3 font-bold text-gray-700">
                                  <div>⭐</div>
                                  <div className="text-xs font-normal">Perf. Tech.</div>
                                </th>
                                <th className="text-center py-3 px-3 font-bold text-gray-700">
                                  <div>👗</div>
                                  <div className="text-xs font-normal">Prestance</div>
                                </th>
                                <th className="text-center py-3 px-3 font-bold text-pink-600 bg-pink-50">
                                  <div>Total</div>
                                  <div className="text-xs font-normal">/20</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {[1, 2, 3, 4].map((juryNum) => {
                                const score = selectedSheet.scoresByJury[juryNum]?.[passageKey];
                                const hasScore = !!score;
                                
                                return (
                                  <tr 
                                    key={juryNum} 
                                    className={`border-b border-gray-200 ${hasScore ? 'hover:bg-white' : 'bg-gray-100'}`}
                                  >
                                    <td className="py-3 px-3 font-semibold text-gray-800">
                                      Juré {juryNum}
                                    </td>
                                    <td className="text-center py-3 px-3">
                                      {hasScore ? (
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold">
                                          {score.sourire}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="text-center py-3 px-3">
                                      {hasScore ? (
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-800 font-bold">
                                          {score.gestuelle}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="text-center py-3 px-3">
                                      {hasScore ? (
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold">
                                          {score.performanceTechnique}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="text-center py-3 px-3">
                                      {hasScore ? (
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-800 font-bold">
                                          {score.prestanceElegance}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="text-center py-3 px-3 bg-pink-50">
                                      {hasScore ? (
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-600 text-white font-bold text-lg">
                                          {score.totalPassage}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                              {passageAvg > 0 && (
                                <tr className="bg-pink-100 font-bold">
                                  <td className="py-3 px-3 text-gray-800">MOYENNE</td>
                                  <td className="text-center py-3 px-3">
                                    {(() => {
                                      const scores = [1, 2, 3, 4]
                                        .map(j => selectedSheet.scoresByJury[j]?.[passageKey]?.sourire)
                                        .filter(s => s !== undefined) as number[];
                                      return scores.length > 0 
                                        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                                        : '-';
                                    })()}
                                  </td>
                                  <td className="text-center py-3 px-3">
                                    {(() => {
                                      const scores = [1, 2, 3, 4]
                                        .map(j => selectedSheet.scoresByJury[j]?.[passageKey]?.gestuelle)
                                        .filter(s => s !== undefined) as number[];
                                      return scores.length > 0 
                                        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                                        : '-';
                                    })()}
                                  </td>
                                  <td className="text-center py-3 px-3">
                                    {(() => {
                                      const scores = [1, 2, 3, 4]
                                        .map(j => selectedSheet.scoresByJury[j]?.[passageKey]?.performanceTechnique)
                                        .filter(s => s !== undefined) as number[];
                                      return scores.length > 0 
                                        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                                        : '-';
                                    })()}
                                  </td>
                                  <td className="text-center py-3 px-3">
                                    {(() => {
                                      const scores = [1, 2, 3, 4]
                                        .map(j => selectedSheet.scoresByJury[j]?.[passageKey]?.prestanceElegance)
                                        .filter(s => s !== undefined) as number[];
                                      return scores.length > 0 
                                        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                                        : '-';
                                    })()}
                                  </td>
                                  <td className="text-center py-3 px-3 text-pink-600 text-lg">
                                    {passageAvg.toFixed(2)}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Section */}
                <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Résumé des Passages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Passage 1</p>
                      <p className="text-2xl font-bold text-pink-600">
                        {selectedSheet.averageByPassage.passage1 > 0 
                          ? selectedSheet.averageByPassage.passage1.toFixed(2) 
                          : '-'}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Passage 2</p>
                      <p className="text-2xl font-bold text-pink-600">
                        {selectedSheet.averageByPassage.passage2 > 0 
                          ? selectedSheet.averageByPassage.passage2.toFixed(2) 
                          : '-'}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Passage 3</p>
                      <p className="text-2xl font-bold text-pink-600">
                        {selectedSheet.averageByPassage.passage3 > 0 
                          ? selectedSheet.averageByPassage.passage3.toFixed(2) 
                          : '-'}
                      </p>
                    </div>
                    <div className="bg-pink-600 rounded-lg p-4 text-center">
                      <p className="text-sm text-white mb-1">Note Finale</p>
                      <p className="text-3xl font-bold text-white">
                        {selectedSheet.finalScore.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Sélectionner une candidate</h2>
                
                {candidateSheets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune fiche disponible</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidateSheets.map((sheet) => (
                      <button
                        key={sheet.candidateId}
                        onClick={() => setSelectedSheet(sheet)}
                        className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 hover:shadow-md transition-all text-left"
                      >
                        <div className="text-2xl font-bold text-pink-600 mb-1">
                          #{sheet.candidateNumber}
                        </div>
                        <div className="font-semibold text-gray-800 mb-2">
                          {sheet.candidateName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Note finale: <span className="font-bold text-pink-600">
                            {sheet.finalScore.toFixed(2)}/20
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Classement Final</h2>
            
            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun résultat disponible</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Rang</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">N°</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Candidate</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Passage 1</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Passage 2</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Passage 3</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Note Finale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.candidateId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            result.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                            result.rank === 2 ? 'bg-gray-300 text-gray-800' :
                            result.rank === 3 ? 'bg-orange-400 text-orange-900' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {result.rank}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-pink-600">#{result.candidateNumber}</td>
                        <td className="py-3 px-4 font-medium">{result.candidateName}</td>
                        <td className="py-3 px-4 text-center">
                          {result.passage1Total > 0 ? result.passage1Total.toFixed(2) : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {result.passage2Total > 0 ? result.passage2Total.toFixed(2) : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {result.passage3Total > 0 ? result.passage3Total.toFixed(2) : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-pink-600 text-lg">
                            {result.finalScore.toFixed(2)}/20
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notation Modal */}
      {isNotationModalOpen && selectedCandidateForNotation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Noter: {selectedCandidateForNotation.name}
                  </h2>
                  <p className="text-gray-600">Candidate #{selectedCandidateForNotation.number}</p>
                </div>
                <button
                  onClick={() => setIsNotationModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Jury Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner le juré
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedJuryForNotation(num as 1 | 2 | 3 | 4)}
                      className={`py-2 rounded-lg font-semibold transition-colors ${
                        selectedJuryForNotation === num
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Juré {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passage Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner le passage
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedPassageForNotation(num as 1 | 2 | 3)}
                      className={`py-2 rounded-lg font-semibold transition-colors ${
                        selectedPassageForNotation === num
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Passage {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Criteria Scoring */}
              <div className="space-y-4 mb-6">
                {[
                  { key: 'sourire', label: 'Sourire', icon: '😊' },
                  { key: 'gestuelle', label: 'Gestuelle', icon: '🤸' },
                  { key: 'performanceTechnique', label: 'Performance Technique', icon: '⭐' },
                  { key: 'prestanceElegance', label: 'Prestance et Élégance', icon: '👗' }
                ].map(({ key, label, icon }) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-gray-700">
                        {icon} {label}
                      </label>
                      <span className="text-pink-600 font-bold text-lg">
                        {notationScores[key as keyof typeof notationScores]} / 4
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setNotationScores(prev => ({ ...prev, [key]: value }))}
                          className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                            notationScores[key as keyof typeof notationScores] === value
                              ? 'bg-pink-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className={`text-3xl font-bold ${
                    Object.values(notationScores).reduce((sum, score) => sum + score, 0) > 20 
                      ? 'text-red-600' 
                      : 'text-pink-600'
                  }`}>
                    {Object.values(notationScores).reduce((sum, score) => sum + score, 0)} / 20
                  </span>
                </div>
                {Object.values(notationScores).reduce((sum, score) => sum + score, 0) > 20 && (
                  <p className="text-red-600 text-sm mt-2">
                    ⚠️ Le total ne peut pas dépasser 20 points
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsNotationModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitNotation}
                  disabled={Object.values(notationScores).reduce((sum, score) => sum + score, 0) > 20}
                  className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Enregistrer la note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMiss5eme;
