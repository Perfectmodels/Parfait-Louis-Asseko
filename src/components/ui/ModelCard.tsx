import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from '../types';

interface ModelCardProps {
    model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
    return (
        <Link to={`/models/${model.id}`} className="block group">
            <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-800">
                <img
                    src={model.imageUrl || '/placeholder-model.jpg'}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-xl font-playfair text-pm-gold">{model.name}</h3>
                    {model.height && <p className="text-sm text-white">{model.height}cm</p>}
                </div>
            </div>
            <div className="mt-3 text-center">
                <h3 className="text-lg font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors">{model.name}</h3>
            </div>
        </Link>
    );
};

export default ModelCard;
