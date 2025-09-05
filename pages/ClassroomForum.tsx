import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ForumMessage } from '../types';

const ClassroomForum: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userId = sessionStorage.getItem('userId');
    const user = data?.models.find(m => m.id === userId);

    const messages = data?.classroomForumMessages || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !data) return;

        setIsLoading(true);

        const messageData: ForumMessage = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            text: newMessage,
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...data.classroomForumMessages, messageData];
        
        try {
            await saveData({ ...data, classroomForumMessages: updatedMessages });
            setNewMessage('');
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
            alert("Impossible d'envoyer le message. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    if (!isInitialized || !user) {
        return (
            <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center">
                <p>Chargement du forum...</p>
            </div>
        );
    }
    
    return (
        <>
            <SEO title="Forum | PMM Classroom" noIndex />
            <div className="bg-pm-dark text-pm-off-white h-screen flex flex-col pt-28">
                <div className="container mx-auto px-4 sm:px-6 flex-grow flex flex-col h-full overflow-hidden">
                    <header className="flex items-center gap-4 mb-4 flex-shrink-0">
                        <Link to="/formations" className="text-pm-gold hover:underline p-2">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-pm-gold" />
                            <div>
                                <h1 className="text-2xl font-playfair text-pm-gold">Forum de la Classe</h1>
                                <p className="text-xs text-pm-off-white/60">Connecté en tant que {user.name}</p>
                            </div>
                        </div>
                    </header>

                    <main className="flex-grow bg-black border border-pm-gold/20 rounded-t-lg overflow-y-auto p-4 space-y-4">
                       {messages.map((msg) => {
                           const isCurrentUser = msg.userId === userId;
                           return (
                               <div key={msg.id} className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                   <div className={`max-w-md md:max-w-lg p-3 rounded-lg flex flex-col ${isCurrentUser ? 'bg-pm-gold/80 text-pm-dark' : 'bg-pm-dark'}`}>
                                       {!isCurrentUser && (
                                           <p className="font-bold text-sm text-pm-gold">{msg.userName}</p>
                                       )}
                                       <p className="whitespace-pre-wrap">{msg.text}</p>
                                       <p className={`text-xs mt-1 ${isCurrentUser ? 'text-pm-dark/70 text-right' : 'text-pm-off-white/50 text-right'}`}>
                                           {formatTimestamp(msg.timestamp)}
                                       </p>
                                   </div>
                               </div>
                           );
                       })}
                       <div ref={messagesEndRef} />
                    </main>

                     <footer className="flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="bg-black border-x border-b border-pm-gold/20 rounded-b-lg p-3 flex items-center gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="flex-grow bg-pm-dark border border-pm-off-white/30 rounded-full p-3 px-5 focus:outline-none focus:border-pm-gold transition-colors"
                            />
                            <button type="submit" disabled={isLoading || !newMessage.trim()} className="bg-pm-gold text-pm-dark p-3 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                                <PaperAirplaneIcon className="w-6 h-6" />
                            </button>
                        </form>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default ClassroomForum;
