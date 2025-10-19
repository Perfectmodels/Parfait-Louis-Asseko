import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  EyeIcon,
  LinkIcon,
  DocumentTextIcon,
  TagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  SparklesIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaMarkup?: any;
  robots?: string;
  hreflang?: { [key: string]: string };
}

export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
  readability: ReadabilityScore;
  performance: PerformanceScore;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  field: string;
  suggestion?: string;
}

export interface SEOSuggestion {
  type: 'improvement' | 'optimization' | 'best-practice';
  message: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

export interface ReadabilityScore {
  score: number;
  level: 'very-easy' | 'easy' | 'fair' | 'difficult' | 'very-difficult';
  suggestions: string[];
}

export interface PerformanceScore {
  score: number;
  metrics: {
    loadTime: number;
    imageOptimization: number;
    mobileFriendly: boolean;
    httpsEnabled: boolean;
  };
}

interface SEOToolsProps {
  initialData?: SEOData;
  onDataChange: (data: SEOData) => void;
  content?: string;
  url?: string;
}

const SEOTools: React.FC<SEOToolsProps> = ({
  initialData = {
    title: '',
    description: '',
    keywords: [],
    canonicalUrl: '',
    robots: 'index, follow'
  },
  onDataChange,
  content = '',
  url = ''
}) => {
  const [seoData, setSeoData] = useState<SEOData>(initialData);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'analysis' | 'preview'>('basic');

  useEffect(() => {
    onDataChange(seoData);
  }, [seoData, onDataChange]);

  const analyzeSEO = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis: SEOAnalysis = {
      score: calculateSEOScore(seoData, content),
      issues: analyzeIssues(seoData, content),
      suggestions: generateSuggestions(seoData, content),
      readability: analyzeReadability(content),
      performance: analyzePerformance(url)
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const calculateSEOScore = (data: SEOData, content: string): number => {
    let score = 0;
    let maxScore = 0;

    // Title optimization
    maxScore += 20;
    if (data.title && data.title.length >= 30 && data.title.length <= 60) {
      score += 20;
    } else if (data.title) {
      score += 10;
    }

    // Description optimization
    maxScore += 20;
    if (data.description && data.description.length >= 120 && data.description.length <= 160) {
      score += 20;
    } else if (data.description) {
      score += 10;
    }

    // Keywords
    maxScore += 15;
    if (data.keywords.length >= 3 && data.keywords.length <= 10) {
      score += 15;
    } else if (data.keywords.length > 0) {
      score += 8;
    }

    // Content length
    maxScore += 15;
    if (content.length >= 300) {
      score += 15;
    } else if (content.length >= 150) {
      score += 10;
    }

    // Meta tags
    maxScore += 10;
    if (data.ogTitle && data.ogDescription) {
      score += 10;
    } else if (data.ogTitle || data.ogDescription) {
      score += 5;
    }

    // Canonical URL
    maxScore += 10;
    if (data.canonicalUrl) {
      score += 10;
    }

    // Schema markup
    maxScore += 10;
    if (data.schemaMarkup) {
      score += 10;
    }

    return Math.round((score / maxScore) * 100);
  };

  const analyzeIssues = (data: SEOData, content: string): SEOIssue[] => {
    const issues: SEOIssue[] = [];

    if (!data.title) {
      issues.push({
        type: 'error',
        message: 'Le titre est manquant',
        field: 'title',
        suggestion: 'Ajoutez un titre descriptif de 30-60 caractères'
      });
    } else if (data.title.length < 30) {
      issues.push({
        type: 'warning',
        message: 'Le titre est trop court',
        field: 'title',
        suggestion: 'Étendez le titre pour qu\'il fasse au moins 30 caractères'
      });
    } else if (data.title.length > 60) {
      issues.push({
        type: 'warning',
        message: 'Le titre est trop long',
        field: 'title',
        suggestion: 'Raccourcissez le titre pour qu\'il fasse moins de 60 caractères'
      });
    }

    if (!data.description) {
      issues.push({
        type: 'error',
        message: 'La description est manquante',
        field: 'description',
        suggestion: 'Ajoutez une description de 120-160 caractères'
      });
    } else if (data.description.length < 120) {
      issues.push({
        type: 'warning',
        message: 'La description est trop courte',
        field: 'description',
        suggestion: 'Étendez la description pour qu\'elle fasse au moins 120 caractères'
      });
    } else if (data.description.length > 160) {
      issues.push({
        type: 'warning',
        message: 'La description est trop longue',
        field: 'description',
        suggestion: 'Raccourcissez la description pour qu\'elle fasse moins de 160 caractères'
      });
    }

    if (data.keywords.length === 0) {
      issues.push({
        type: 'info',
        message: 'Aucun mot-clé défini',
        field: 'keywords',
        suggestion: 'Ajoutez 3-10 mots-clés pertinents'
      });
    }

    if (content.length < 300) {
      issues.push({
        type: 'warning',
        message: 'Le contenu est trop court',
        field: 'content',
        suggestion: 'Ajoutez plus de contenu (minimum 300 mots recommandé)'
      });
    }

    return issues;
  };

  const generateSuggestions = (data: SEOData, content: string): SEOSuggestion[] => {
    const suggestions: SEOSuggestion[] = [];

    if (!data.ogTitle || !data.ogDescription) {
      suggestions.push({
        type: 'optimization',
        message: 'Ajoutez des balises Open Graph pour améliorer le partage sur les réseaux sociaux',
        impact: 'high',
        action: 'Remplir les champs OG Title et OG Description'
      });
    }

    if (!data.schemaMarkup) {
      suggestions.push({
        type: 'best-practice',
        message: 'Ajoutez du balisage structuré pour améliorer la compréhension par les moteurs de recherche',
        impact: 'medium',
        action: 'Configurer le Schema Markup'
      });
    }

    if (data.keywords.length < 3) {
      suggestions.push({
        type: 'improvement',
        message: 'Ajoutez plus de mots-clés pour améliorer la visibilité',
        impact: 'medium',
        action: 'Ajouter 3-10 mots-clés pertinents'
      });
    }

    return suggestions;
  };

  const analyzeReadability = (content: string): ReadabilityScore => {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const syllables = content.split(/[aeiouAEIOU]+/).length;
    
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    let level: ReadabilityScore['level'] = 'very-difficult';
    if (score >= 90) level = 'very-easy';
    else if (score >= 80) level = 'easy';
    else if (score >= 70) level = 'fair';
    else if (score >= 60) level = 'difficult';
    
    const suggestions = [];
    if (avgWordsPerSentence > 20) {
      suggestions.push('Raccourcissez vos phrases');
    }
    if (avgSyllablesPerWord > 2) {
      suggestions.push('Utilisez des mots plus simples');
    }
    if (words < 300) {
      suggestions.push('Ajoutez plus de contenu');
    }
    
    return {
      score: Math.max(0, Math.min(100, score)),
      level,
      suggestions
    };
  };

  const analyzePerformance = (url: string): PerformanceScore => {
    // Mock performance analysis
    return {
      score: 85,
      metrics: {
        loadTime: 2.3,
        imageOptimization: 90,
        mobileFriendly: true,
        httpsEnabled: url.startsWith('https://')
      }
    };
  };

  const updateData = (field: keyof SEOData, value: any) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const addKeyword = (keyword: string) => {
    if (keyword && !seoData.keywords.includes(keyword)) {
      updateData('keywords', [...seoData.keywords, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    updateData('keywords', seoData.keywords.filter(k => k !== keyword));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getIssueIcon = (type: SEOIssue['type']) => {
    switch (type) {
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'info': return <LightBulbIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="seo-tools">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pm-gold">Outils SEO</h2>
        <button
          onClick={analyzeSEO}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black rounded hover:bg-pm-gold/90 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5" />
          )}
          {isAnalyzing ? 'Analyse...' : 'Analyser SEO'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'basic', label: 'Basique', icon: DocumentTextIcon },
          { id: 'advanced', label: 'Avancé', icon: Cog6ToothIcon },
          { id: 'analysis', label: 'Analyse', icon: ChartBarIcon },
          { id: 'preview', label: 'Aperçu', icon: EyeIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              activeTab === tab.id
                ? 'bg-pm-gold text-black'
                : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic SEO */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
              Titre de la page
              <span className="text-xs text-pm-gold/70 ml-2">
                ({seoData.title.length}/60 caractères)
              </span>
            </label>
            <input
              type="text"
              value={seoData.title}
              onChange={(e) => updateData('title', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
              placeholder="Titre optimisé pour le SEO..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
              Description
              <span className="text-xs text-pm-gold/70 ml-2">
                ({seoData.description.length}/160 caractères)
              </span>
            </label>
            <textarea
              value={seoData.description}
              onChange={(e) => updateData('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none resize-none"
              placeholder="Description qui apparaîtra dans les résultats de recherche..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
              Mots-clés
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {seoData.keywords.map(keyword => (
                <span
                  key={keyword}
                  className="flex items-center gap-1 px-2 py-1 bg-pm-gold/20 text-pm-gold rounded text-sm"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="text-pm-gold/70 hover:text-pm-gold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ajouter un mot-clé..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addKeyword(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
              URL canonique
            </label>
            <input
              type="url"
              value={seoData.canonicalUrl}
              onChange={(e) => updateData('canonicalUrl', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
              placeholder="https://example.com/page"
            />
          </div>
        </div>
      )}

      {/* Advanced SEO */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-pm-gold mb-4">Open Graph</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={seoData.ogTitle || ''}
                    onChange={(e) => updateData('ogTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    placeholder="Titre pour les réseaux sociaux..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                    OG Description
                  </label>
                  <textarea
                    value={seoData.ogDescription || ''}
                    onChange={(e) => updateData('ogDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none resize-none"
                    placeholder="Description pour les réseaux sociaux..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                    OG Image
                  </label>
                  <input
                    type="url"
                    value={seoData.ogImage || ''}
                    onChange={(e) => updateData('ogImage', e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-pm-gold mb-4">Twitter Cards</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    value={seoData.twitterTitle || ''}
                    onChange={(e) => updateData('twitterTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    placeholder="Titre pour Twitter..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                    Twitter Description
                  </label>
                  <textarea
                    value={seoData.twitterDescription || ''}
                    onChange={(e) => updateData('twitterDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none resize-none"
                    placeholder="Description pour Twitter..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                    Twitter Image
                  </label>
                  <input
                    type="url"
                    value={seoData.twitterImage || ''}
                    onChange={(e) => updateData('twitterImage', e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                    placeholder="https://example.com/twitter-image.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
              Robots
            </label>
            <select
              value={seoData.robots || 'index, follow'}
              onChange={(e) => updateData('robots', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
            >
              <option value="index, follow">Index, Follow</option>
              <option value="index, nofollow">Index, No Follow</option>
              <option value="noindex, follow">No Index, Follow</option>
              <option value="noindex, nofollow">No Index, No Follow</option>
            </select>
          </div>
        </div>
      )}

      {/* Analysis */}
      {activeTab === 'analysis' && analysis && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-pm-off-white/70">Score SEO</h3>
                <ChartBarIcon className="w-5 h-5 text-pm-gold" />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}/100
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-pm-off-white/70">Lisibilité</h3>
                <DocumentTextIcon className="w-5 h-5 text-pm-gold" />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.readability.score)}`}>
                {analysis.readability.score}/100
              </div>
              <div className="text-xs text-pm-off-white/50 capitalize">
                {analysis.readability.level.replace('-', ' ')}
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-pm-off-white/70">Performance</h3>
                <CursorArrowRaysIcon className="w-5 h-5 text-pm-gold" />
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.performance.score)}`}>
                {analysis.performance.score}/100
              </div>
            </div>
          </div>

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-pm-gold mb-4">Problèmes détectés</h3>
              <div className="space-y-2">
                {analysis.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-black/20 rounded">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <p className="text-pm-off-white">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-sm text-pm-off-white/70 mt-1">{issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-pm-gold mb-4">Suggestions d'amélioration</h3>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-black/20 rounded">
                    <LightBulbIcon className="w-5 h-5 text-yellow-400" />
                    <div className="flex-1">
                      <p className="text-pm-off-white">{suggestion.message}</p>
                      {suggestion.action && (
                        <p className="text-sm text-pm-gold mt-1">{suggestion.action}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      suggestion.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                      suggestion.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {suggestion.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-pm-gold">Aperçu des résultats de recherche</h3>
          
          <div className="bg-white p-4 rounded-lg text-black">
            <div className="text-blue-600 text-sm mb-1">
              {seoData.canonicalUrl || 'https://example.com/page'}
            </div>
            <div className="text-blue-600 text-xl font-medium mb-2 hover:underline cursor-pointer">
              {seoData.title || 'Titre de la page'}
            </div>
            <div className="text-green-700 text-sm mb-2">
              {seoData.canonicalUrl || 'https://example.com/page'}
            </div>
            <div className="text-gray-600 text-sm">
              {seoData.description || 'Description de la page qui apparaîtra dans les résultats de recherche...'}
            </div>
            {seoData.keywords.length > 0 && (
              <div className="flex gap-1 mt-2">
                {seoData.keywords.map(keyword => (
                  <span key={keyword} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-md font-semibold text-pm-gold mb-2">Balises Meta générées</h4>
            <pre className="bg-black/30 p-4 rounded text-sm text-pm-off-white/70 overflow-x-auto">
{`<title>${seoData.title || 'Titre de la page'}</title>
<meta name="description" content="${seoData.description || 'Description de la page'}" />
<meta name="keywords" content="${seoData.keywords.join(', ')}" />
<meta name="robots" content="${seoData.robots || 'index, follow'}" />
${seoData.canonicalUrl ? `<link rel="canonical" href="${seoData.canonicalUrl}" />` : ''}
${seoData.ogTitle ? `<meta property="og:title" content="${seoData.ogTitle}" />` : ''}
${seoData.ogDescription ? `<meta property="og:description" content="${seoData.ogDescription}" />` : ''}
${seoData.ogImage ? `<meta property="og:image" content="${seoData.ogImage}" />` : ''}
${seoData.twitterTitle ? `<meta name="twitter:title" content="${seoData.twitterTitle}" />` : ''}
${seoData.twitterDescription ? `<meta name="twitter:description" content="${seoData.twitterDescription}" />` : ''}
${seoData.twitterImage ? `<meta name="twitter:image" content="${seoData.twitterImage}" />` : ''}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOTools;