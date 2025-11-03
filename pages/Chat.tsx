
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat as GeminiChat, GenerateContentResponse } from '@google/genai';
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
  const [chat, setChat] = useState<GeminiChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGrounded, setIsGrounded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        if (!process.env.API_KEY) {
          throw new Error("La clé API n'est pas configurée pour l'assistant IA.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "Tu es PMM Assistant, l'IA experte de l'agence de mannequins Perfect Models Management au Gabon. Ton ton est amical, professionnel et encourageant. Tu réponds aux questions sur l'agence, le mannequinat au Gabon, les services de PMM, et donnes des conseils de base. Tes réponses doivent être concises et utiles. Commence la conversation en te présentant chaleureusement et en demandant comment tu peux aider.",
          },
        });
        setChat(chatSession);
        
        const response: GenerateContentResponse = await chatSession.sendMessage({ message: "Bonjour" });
        
        setMessages([{ sender: 'ai', text: response.text }]);
      } catch (err: any) {
        console.error("Chat initialization error:", err);
        setError("Désolé, l'assistant IA est actuellement indisponible. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        let response: GenerateContentResponse;
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

        if (isGrounded) {
             response = await ai.models.generateContent({
                 model: 'gemini-2.5-flash',
                 contents: input,
                 config: {
                    tools: [{ googleSearch: {} }],
                 }
             });
        } else {
            if (!chat) {
                throw new Error("La session de chat n'est pas initialisée.");
            }
            response = await chat.sendMessage({ message: input });
        }
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources = groundingChunks
            ?.filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title })) || [];

        const aiMessage: Message = { sender: 'ai', text: response.text, sources: sources.length > 0 ? sources : undefined };
        setMessages(prev => [...prev, aiMessage]);

    } catch (err: any) {
      console.error("Send message error:", err);
      const errorMessage: Message = { sender: 'ai', text: "Oups, quelque chose s'est mal passé. Veuillez réessayer." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Assistant IA | Perfect Models Management" noIndex />
      <div className="bg-pm-dark text-pm-off-white h-screen flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 bg-black/50 border-b border-pm-gold/20 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <Link to="/" className="text-pm-gold hover:text-white"><ArrowLeftIcon className="w-6 h-6" /></Link>
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-pm-gold" />
                    <h1 className="font-playfair text-xl text-pm-gold">PMM Assistant</h1>
                </div>
            </div>
            <label htmlFor="grounded-toggle" className="flex items-center cursor-pointer" title="Activer la recherche web pour des réponses plus actuelles">
                <span className="mr-2 text-xs text-pm-off-white/70">Recherche Web</span>
                <div className="relative">
                    <input type="checkbox" id="grounded-toggle" className="sr-only" checked={isGrounded} onChange={() => setIsGrounded(!isGrounded)} />
                    <div className="block bg-black w-10 h-6 rounded-full border border-pm-gold/50"></div>
                    <div className={`dot absolute left-1 top-1 bg-pm-gold w-4 h-4 rounded-full transition-transform flex items-center justify-center ${isGrounded ? 'transform translate-x-full' : ''}`}>
                        {isGrounded && <GlobeAltIcon className="w-3 h-3 text-pm-dark"/>}
                    </div>
                </div>
            </label>
        </header>

        {/* Messages Area */}
        <main className="flex-grow overflow-y-auto p-4 space-y-6">
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-pm-gold flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-pm-dark"/></div>}
                    <div className={`max-w-md lg:max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-pm-gold text-pm-dark' : 'bg-black'}`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-pm-gold/30">
                                <h4 className="text-xs font-bold mb-1">Sources:</h4>
                                <ul className="space-y-1">
                                    {msg.sources.map((source, i) => (
                                        <li key={i}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block" title={source.title}>
                                                {i + 1}. {source.title || source.uri}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
            {isLoading && messages[messages.length-1]?.sender === 'user' && (
                <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-pm-gold flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-pm-dark"/></div>
                    <div className="max-w-md lg:max-w-lg p-3 rounded-lg bg-black">
                        <span className="animate-pulse">...</span>
                    </div>
                </div>
            )}
            {error && <p className="text-red-400 text-center">{error}</p>}
            <div ref={messagesEndRef} />
        </main>

        {/* Input Form */}
        <footer className="flex-shrink-0 p-4 bg-black/50 border-t border-pm-gold/20">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-grow bg-pm-dark border border-pm-off-white/30 rounded-full py-3 px-5 focus:outline-none focus:border-pm-gold transition-colors"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-pm-gold text-pm-dark p-3 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </form>
        </footer>
      </div>
    </>
  );
};

export default Chat;
