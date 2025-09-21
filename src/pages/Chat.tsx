import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import SEO from '../components/SEO';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setError("L'assistant IA est temporairement indisponible pour maintenance. Veuillez réessayer plus tard.");
    setMessages([
        { sender: 'ai', text: "Bonjour ! Je suis l'assistant IA de Perfect Models Management. Je suis actuellement en cours de maintenance, mais je serai de retour très bientôt pour répondre à toutes vos questions." }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // Chat functionality is disabled.
  };

  return (
    <>
      <SEO title="Assistant IA | PMM" description="Discutez avec l'assistant IA de Perfect Models Management." noIndex />
      <div className="bg-pm-dark text-pm-off-white h-screen flex flex-col pt-28">
         <div className="container mx-auto px-6 flex-grow flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
                <Link to="/" className="text-pm-gold hover:underline">
                    <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-8 h-8 text-pm-gold" />
                    <h1 className="text-3xl font-playfair text-pm-gold">Assistant PMM</h1>
                </div>
            </div>

            <div className="flex-grow bg-black border border-pm-gold/20 rounded-t-lg overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-pm-gold flex items-center justify-center text-pm-dark font-bold flex-shrink-0">IA</div>}
                        <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-pm-gold text-pm-dark' : 'bg-pm-dark'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {error && (
                    <div className="flex justify-center items-center p-4">
                        <div className="flex items-center gap-3 bg-yellow-900/30 text-yellow-300 p-3 rounded-lg">
                            <ExclamationTriangleIcon className="w-6 h-6"/>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="bg-black border-x border-b border-pm-gold/20 rounded-b-lg p-4 flex items-center gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="L'assistant est en maintenance..."
                    className="flex-grow bg-pm-dark border border-pm-off-white/30 rounded-full p-3 px-5 focus:outline-none focus:border-pm-gold transition-colors"
                    disabled={true}
                />
                <button type="submit" disabled={true} className="bg-pm-gold text-pm-dark p-3 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
