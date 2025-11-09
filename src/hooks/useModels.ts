
import { useState, useMemo, useEffect } from 'react';
import { Model } from '../types';
import { useData } from '../contexts/DataContext';

export const useModels = () => {
    const { data, saveData } = useData();
    const [models, setModels] = useState<Model[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        if (data?.models) {
            setModels([...data.models].sort((a, b) => a.name.localeCompare(b.name)));
        }
    }, [data?.models]);

    const filteredModels = useMemo(() => {
        return models
            .filter(model =>
                (levelFilter === 'all' || model.level === levelFilter) &&
                (statusFilter === 'all' || (statusFilter === 'public' && model.isPublic) || (statusFilter === 'private' && !model.isPublic)) &&
                model.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [models, searchTerm, levelFilter, statusFilter]);

    const paginatedModels = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredModels.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredModels, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredModels.length / itemsPerPage);

    const handleUpdateModel = async (updatedModels: Model[]) => {
        if (!data) return;
        await saveData({ ...data, models: updatedModels });
    };

    return {
        models: paginatedModels,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        levelFilter,
        setLevelFilter,
        statusFilter,
        setStatusFilter,
        handleUpdateModel
    };
};
