import React from 'react';

const ArticlePreview: React.FC<{ article: any }> = ({ article }) => {
    return (
        <div className="bg-pm-dark p-6 rounded-lg border border-pm-gold/20">
            <h2 className="text-2xl font-playfair text-pm-gold mb-4">{article.title || 'Aperçu de l\'article'}</h2>
            <div className="prose prose-invert max-w-none">
                {article.content?.map((block: any, idx: number) => (
                    <div key={idx} className="mb-4">
                        {block.type === 'paragraph' && <p>{block.text}</p>}
                        {block.type === 'heading' && <h3 className="text-xl text-pm-gold-light mt-6 mb-2">{block.text}</h3>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticlePreview;
