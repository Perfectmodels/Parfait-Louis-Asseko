import React from 'react';
import { Model } from '../types';
const ModelCard: React.FC<{ model: Model }> = ({ model }) => <div>{model.name}</div>;
export default ModelCard;