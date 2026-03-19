import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  sources?: { uri: string; title: string }[];
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGrounded, setIsGrounded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ 
      sender: 'ai', 
      text: "Bonjour ! Je suis l'assistant d'élite de Perfect Models. Comment puis-je vous accompagner dans l'univers de la mode gabonaise aujourd'hui ?" 
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const config: any = {
        systemInstruction: "Tu es l'ambassadeur IA de Perfect Models Management au Gabon. Ton ton est luxueux, inspirant et précis. Tu connais parfaitement l'agence, le Perfect Fashion Day et les opportunités pour les mannequins.",
      };

      if (isGrounded) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: currentInput,
        config
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = groundingChunks
        ?.filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title })) || [];

      const aiMessage: Message = { 
        sender: 'ai', 
        text: response.text || "Je n'ai pas pu générer de réponse.", 
        sources: sources.length > 0 ? sources : undefined 
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err: any) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Une erreur est survenue lors de la connexion à mon intelligence. Veuillez réessayer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Concierge AI | PMM" noIndex />
      <div className="bg-pm-dark text-pm-off-white h-screen flex flex-col">
        <header className="flex-shrink-0 bg-black/40 backdrop-blur-2xl border-b border-white/5 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-6">
                <Link to="/" className="text-pm-gold hover:text-white transition-colors"><ArrowLeftIcon className="w-6 h-6" /></Link>
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-5 h-5 text-pm-gold animate-pulse" />
                    <h1 className="font-playfair text-xl font-black italic tracking-wider">PMM Concierge</h1>
                </div>
            </div>
            <button 
              onClick={() => setIsGrounded(!isGrounded)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 text-[10px] font-black uppercase tracking-widest ${
                isGrounded ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'border-white/10 text-white/40 hover:border-white/20'
              }`}
            >
              <GlobeAltIcon className="w-4 h-4" />
              {isGrounded ? 'Web Active' : 'Offline Mode'}
            </button>
        </header>

        <main className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar">
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[80%] p-6 rounded-2xl ${
                      msg.sender === 'user' 
                      ? 'bg-pm-gold text-pm-dark font-medium shadow-2xl shadow-pm-gold/10' 
                      : 'bg-white/5 border border-white/10 backdrop-blur-md'
                    }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        {msg.sources && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Reférences</p>
                                <div className="flex flex-wrap gap-2">
                                    {msg.sources.map((s, i) => (
                                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-pm-gold hover:text-white underline truncate max-w-[150px]">
                                            {s.title || 'Source'}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="flex gap-1">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-pm-gold rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-pm-gold rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-pm-gold rounded-full" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
        </main>

        <footer className="p-8 bg-black/40 border-t border-white/5">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Votre requête d'exception..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-full py-4 px-8 focus:outline-none focus:border-pm-gold transition-all duration-500 placeholder:text-white/10"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="w-14 h-14 bg-pm-gold text-pm-dark rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </form>
        </footer>
      </div>
    </>
  );
};

export default Chat;