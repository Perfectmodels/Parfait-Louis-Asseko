// Section du quiz à remplacer dans TrainingModuleView.tsx
// Remplacer tout le bloc "else" après "{!showQuiz ? (" jusqu'à la fin de la section quiz

        ) : (
          <div className="space-y-6">
            {/* Quiz header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-playfair font-bold text-white">
                Quiz : {currentChapter.title}
              </h2>
              <button
                onClick={() => {
                  setShowQuiz(false);
                  setQuizStarted(false);
                  if (timerRef.current) {
                    clearInterval(timerRef.current);
                  }
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quiz en cours - Une question à la fois */}
            {quizStarted && !quizSubmitted && (
              <div className="space-y-6">
                {/* Progression */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/40 text-sm font-bold">
                    Question {currentQuestionIndex + 1} / {currentChapter.quiz.length}
                  </span>
                  <div className="flex-1 mx-4 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pm-gold transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / currentChapter.quiz.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-pm-gold text-sm font-bold">
                    {Math.round(((currentQuestionIndex + 1) / currentChapter.quiz.length) * 100)}%
                  </span>
                </div>

                {/* Question actuelle */}
                {(() => {
                  const question = currentChapter.quiz[currentQuestionIndex];
                  const userAnswer = quizAnswers[currentQuestionIndex];

                  return (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-pm-gold/20 flex items-center justify-center text-pm-gold font-black text-xl">
                          {currentQuestionIndex + 1}
                        </div>
                        <h3 className="text-xl font-bold text-white flex-1 leading-relaxed">
                          {question.question}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {question.options.map((option, oIdx) => {
                          const isSelected = userAnswer === oIdx;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleQuizAnswer(currentQuestionIndex, oIdx)}
                              disabled={userAnswer !== undefined}
                              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'bg-pm-gold/20 border-pm-gold text-white scale-[1.02]'
                                  : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:bg-white/10'
                              } ${userAnswer !== undefined ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-pm-gold bg-pm-gold'
                                      : 'border-white/30'
                                  }`}
                                >
                                  {isSelected && (
                                    <CheckCircle2 size={16} className="text-pm-dark" />
                                  )}
                                </div>
                                <span className="text-base">{option}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Résultats du quiz avec appréciation */}
            {quizSubmitted && quizScore && (
              <div className="space-y-6">
                {/* Score et appréciation */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 text-center">
                  {/* Score */}
                  <div className="mb-6">
                    <div className="text-6xl font-black text-white mb-2">
                      {quizScore.correct}/{quizScore.total}
                    </div>
                    <div className="text-sm text-white/40 uppercase tracking-wider">
                      Réponses correctes
                    </div>
                  </div>

                  {/* Appréciation */}
                  {(() => {
                    const appreciation = getAppreciationForScore(quizScore.correct, quizScore.total);
                    const percentage = (quizScore.correct / quizScore.total) * 100;
                    const passed = percentage >= TRAINING_CONFIG.PASSING_SCORE;

                    return (
                      <>
                        <div className="mb-6">
                          <div className="text-8xl mb-4 animate-bounce">{appreciation.emoji}</div>
                          <div className={`text-4xl font-bold ${appreciation.color} mb-2`}>
                            {appreciation.label}
                          </div>
                          <div className="text-2xl text-white/60 mb-4">
                            Note : {appreciation.note}/20
                          </div>
                          <div className="text-lg text-white/40">
                            ({Math.round(percentage)}%)
                          </div>
                        </div>

                        {/* Message */}
                        <div className={`p-6 rounded-xl ${
                          passed
                            ? 'bg-green-500/10 border border-green-500/20'
                            : 'bg-red-500/10 border border-red-500/20'
                        }`}>
                          <div className="flex items-center justify-center gap-3 mb-2">
                            {passed ? (
                              <CheckCircle2 size={24} className="text-green-400" />
                            ) : (
                              <AlertCircle size={24} className="text-red-400" />
                            )}
                            <span className={`font-bold text-lg ${
                              passed ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {passed ? 'Chapitre validé !' : 'Score insuffisant'}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            passed ? 'text-green-400/70' : 'text-red-400/70'
                          }`}>
                            {passed
                              ? TRAINING_CONFIG.MESSAGES.quizPassed
                              : TRAINING_CONFIG.MESSAGES.quizFailed
                            }
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Révision des réponses */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb size={20} className="text-pm-gold" />
                    Révision des réponses
                  </h3>
                  <div className="space-y-4">
                    {currentChapter.quiz.map((question, qIdx) => {
                      const userAnswer = quizAnswers[qIdx];
                      const isCorrect = userAnswer === question.correct;

                      return (
                        <div
                          key={qIdx}
                          className={`p-4 rounded-xl border ${
                            isCorrect
                              ? 'bg-green-500/10 border-green-500/20'
                              : 'bg-red-500/10 border-red-500/20'
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                              isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {isCorrect ? '✓' : '✗'}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-bold text-sm mb-2">
                                Question {qIdx + 1}: {question.question}
                              </p>
                              <p className="text-xs text-white/60 mb-2">
                                <strong>Votre réponse :</strong> {userAnswer !== undefined && userAnswer >= 0 ? question.options[userAnswer] : 'Pas de réponse'}
                              </p>
                              {!isCorrect && (
                                <p className="text-xs text-white/60 mb-2">
                                  <strong className="text-green-400">Bonne réponse :</strong> {question.options[question.correct]}
                                </p>
                              )}
                              <p className="text-xs text-white/50 italic">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  {(quizScore.correct / quizScore.total) * 100 < TRAINING_CONFIG.PASSING_SCORE && (
                    <button
                      onClick={handleRetryQuiz}
                      className="flex-1 px-6 py-4 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <AlertCircle size={20} />
                      Réessayer le quiz
                    </button>
                  )}
                  {(quizScore.correct / quizScore.total) * 100 >= TRAINING_CONFIG.PASSING_SCORE && currentChapterIndex < module.chapters.length - 1 && (
                    <button
                      onClick={handleNextChapter}
                      className="flex-1 px-6 py-4 rounded-xl bg-pm-gold text-pm-dark font-bold hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
                    >
                      Chapitre suivant
                      <ChevronRight size={20} />
                    </button>
                  )}
                  {(quizScore.correct / quizScore.total) * 100 >= TRAINING_CONFIG.PASSING_SCORE && currentChapterIndex === module.chapters.length - 1 && (
                    <button
                      onClick={() => navigate('/formation')}
                      className="flex-1 px-6 py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Award size={20} />
                      Module terminé
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
