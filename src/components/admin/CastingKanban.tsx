
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useData } from '../../contexts/DataContext';
import { CastingApplication } from '../../types';
import { UserIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const columns = {
    'Nouveau': { title: 'Nouveau', color: 'border-blue-500/50', bg: 'bg-blue-500/10' },
    'Lu': { title: 'En Revue', color: 'border-yellow-500/50', bg: 'bg-yellow-500/10' },
    'Accepté': { title: 'Accepté', color: 'border-green-500/50', bg: 'bg-green-500/10' },
    'Refusé': { title: 'Refusé', color: 'border-red-500/50', bg: 'bg-red-500/10' },
};

export const CastingKanban: React.FC = () => {
    const { data, saveData } = useData();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<CastingApplication[]>(data?.castingApplications || []);

    // Ensure local state syncs with data context initially
    React.useEffect(() => {
        if (data?.castingApplications) {
            setApplications(data.castingApplications);
        }
    }, [data?.castingApplications]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;
        const appId = draggableId;

        // Optimistic UI Update
        const updatedApps = applications.map(app =>
            app.id === appId ? { ...app, status: newStatus as any } : app
        );
        setApplications(updatedApps);

        // Save to backend
        if (data) {
            await saveData({ ...data, castingApplications: updatedApps });
        }
    };

    const getAppsByStatus = (status: string) => applications.filter(app => (app.status || 'Nouveau') === status);

    return (
        <div className="overflow-x-auto pb-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 min-w-[1000px]">
                    {Object.entries(columns).map(([columnId, column]) => (
                        <div key={columnId} className="flex-1 min-w-[250px] bg-pm-dark/50 rounded-xl border border-pm-gold/10 flex flex-col max-h-[700px]">
                            <div className={`p-4 border-b-2 ${column.color} flex justify-between items-center bg-black/20 rounded-t-xl sticky top-0 z-10`}>
                                <h3 className="font-playfair font-bold text-pm-off-white">{column.title}</h3>
                                <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white/70">{getAppsByStatus(columnId).length}</span>
                            </div>
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`p-4 flex-grow overflow-y-auto space-y-3 transition-colors ${snapshot.isDraggingOver ? column.bg : ''}`}
                                    >
                                        {getAppsByStatus(columnId).map((app, index) => (
                                            <Draggable key={app.id} draggableId={app.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-black border border-pm-gold/20 rounded-lg p-4 shadow-lg group hover:border-pm-gold/50 transition-all ${snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''}`}
                                                        style={{ ...provided.draggableProps.style }}
                                                    >
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <div className="w-10 h-10 rounded-full bg-pm-gold/20 flex items-center justify-center text-pm-gold font-bold flex-shrink-0">
                                                                {app.firstName[0]}{app.lastName[0]}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-pm-off-white text-sm">{app.firstName} {app.lastName}</h4>
                                                                <p className="text-xs text-pm-off-white/50">{app.age} ans • {app.city}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                            <span className="text-xs text-pm-off-white/40">{new Date(app.submissionDate).toLocaleDateString()}</span>
                                                            <button
                                                                onClick={() => navigate(`/admin/casting-applications?view=${app.id}`)} // Simplification: In real app, open modal or navigate
                                                                className="p-1.5 hover:bg-white/10 rounded text-pm-gold"
                                                                title="Voir détails"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};
