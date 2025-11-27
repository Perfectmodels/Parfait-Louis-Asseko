import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { 
  PlusIcon, 
  XMarkIcon, 
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface PollCreatorProps {
  chatId: string;
  onClose: () => void;
  onCreatePoll: (poll: {
    question: string;
    options: string[];
    multipleChoice: boolean;
    anonymous: boolean;
    expiresAt?: number;
  }) => void;
}

const PollCreator: React.FC<PollCreatorProps> = ({ chatId, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [expiration, setExpiration] = useState<'none' | '1hour' | '6hours' | '24hours' | '3days'>('none');

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const getExpirationTime = () => {
    switch (expiration) {
      case '1hour': return Date.now() + (60 * 60 * 1000);
      case '6hours': return Date.now() + (6 * 60 * 60 * 1000);
      case '24hours': return Date.now() + (24 * 60 * 60 * 1000);
      case '3days': return Date.now() + (3 * 24 * 60 * 60 * 1000);
      default: return undefined;
    }
  };

  const handleSubmit = () => {
    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll({
        question: question.trim(),
        options: validOptions,
        multipleChoice,
        anonymous,
        expiresAt: getExpirationTime()
      });
      onClose();
    }
  };

  const isValid = question.trim() && options.filter(opt => opt.trim() !== '').length >= 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-pm-gold" />
            Créer un sondage
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Posez votre question..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pm-gold focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Options de réponse
              </label>
              <span className="text-xs text-gray-500">
                {options.filter(opt => opt.trim() !== '').length}/10 minimum 2
              </span>
            </div>
            
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <button
                onClick={addOption}
                className="mt-2 w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-pm-gold hover:text-pm-gold flex items-center justify-center"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Ajouter une option
              </button>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-3">
            {/* Multiple Choice */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="multipleChoice"
                  checked={multipleChoice}
                  onChange={(e) => setMultipleChoice(e.target.checked)}
                  className="w-4 h-4 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
                />
                <label htmlFor="multipleChoice" className="ml-2 text-sm text-gray-700">
                  Choix multiples
                </label>
              </div>
              <span className="text-xs text-gray-500">Les utilisateurs peuvent voter pour plusieurs options</span>
            </div>

            {/* Anonymous */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 text-pm-gold border-gray-300 rounded focus:ring-pm-gold"
                />
                <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700 flex items-center">
                  <EyeSlashIcon className="w-4 h-4 mr-1" />
                  Vote anonyme
                </label>
              </div>
              <span className="text-xs text-gray-500">Les votes ne seront pas attribués</span>
            </div>

            {/* Expiration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                Durée du sondage
              </label>
              <select
                value={expiration}
                onChange={(e) => setExpiration(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              >
                <option value="none">Illimité</option>
                <option value="1hour">1 heure</option>
                <option value="6hours">6 heures</option>
                <option value="24hours">24 heures</option>
                <option value="3days">3 jours</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          {isValid && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900 mb-2">Aperçu :</p>
              <p className="text-sm text-gray-700 mb-2">{question}</p>
              <div className="space-y-1">
                {options.filter(opt => opt.trim() !== '').map((opt, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                {multipleChoice && <span>• Choix multiples</span>}
                {anonymous && <span>• Anonyme</span>}
                {expiration !== 'none' && <span>• Expire</span>}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-pm-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Créer le sondage
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollCreator;
