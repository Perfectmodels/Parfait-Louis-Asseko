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
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const config: any = {};
      if (isGrounded) {
        config.tools = [{ googleSearch: {} }];
      }
      
      const responseStream = await chat.sendMessageStream({ message: currentInput }, config);
      
      let aiResponseText = "";
      let sources: { uri: string; title: string }[] = [];
      setMessages(prev => [...prev, { sender: 'ai', text: "" }]);
      
      for await (const chunk of responseStream) {
        aiResponseText += chunk.text;

        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
             groundingChunks.forEach(c => {
                 if (c.web) {
                     sources.push({ uri: c.web.uri, title: c.web.title || c.web.uri });
                 }
             });
        }

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText, sources: sources.length > 0 ? sources : undefined };
          return newMessages;
        });
      }

    } catch (err: any) {
      console.error("Gemini API error:", err);
      const errorMessage = "Désolé, une erreur est survenue. Veuillez reformuler votre question ou réessayer.";
      setError(errorMessage);
      setMessages(prev => [...prev, { sender: 'ai', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Assistant IA | PMM" description="Discutez avec l'assistant IA de Perfect Models Management." noIndex />
      <div className="bg-pm-dark text-pm-off-white h-screen flex flex-col pt-28">
         <div className="container mx-auto px-4 md:px-6 flex-grow flex flex-col h-full overflow-hidden max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-pm-gold hover:underline p-2 -ml-2">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-pm-gold" />
                        <h1 className="text-3xl font-playfair text-pm-gold">Assistant PMM</h1>
                    </div>
                </div>
                <label htmlFor="grounded-toggle" className="flex items-center cursor-pointer">
                    <span className="mr-3 text-sm font-medium text-pm-off-white/70">Recherche Web</span>
                    <div className="relative">
                        <input type="checkbox" id="grounded-toggle" className="sr-only" checked={isGrounded} onChange={() => setIsGrounded(!isGrounded)} />
                        <div className="block bg-black w-14 h-8 rounded-full border border-pm-gold/50"></div>
                        <div className={`dot absolute left-1 top-1 bg-pm-gold w-6 h-6 rounded-full transition-transform flex items-center justify-center ${isGrounded ? 'transform translate-x-full' : ''}`}>
                            {isGrounded && <GlobeAltIcon className="w-4 h-4 text-pm-dark" />}
                        </div>
                    </div>
                </label>
            </div>

            <div className="flex-grow bg-black border border-pm-gold/20 rounded-t-lg overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-pm-gold flex items-center justify-center text-pm-dark font-bold flex-shrink-0 mt-1">IA</div>}
                        <div className={`max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-pm-gold text-pm-dark rounded-br-none' : 'bg-pm-dark rounded-bl-none'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                           {msg.sources && msg.sources.length > 0 && (
                               <div className="mt-3 pt-2 border-t border-pm-dark">
                                   <h4 className="text-xs font-bold uppercase text-pm-gold mb-1">Sources :</h4>
                                   <ul className="space-y-1">
                                       {msg.sources.map((source, i) => (
                                           <li key={i}>
                                               <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-pm-off-white/70 hover:underline truncate block">
                                                   {i+1}. {source.title || source.uri}
                                               </a>
                                           </li>
                                       ))}
                                   </ul>
                               </div>
                           )}
                        </div>
                    </motion.div>
                ))}
                {isLoading && messages[messages.length - 1]?.sender !== 'ai' && (
                     <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-pm-gold flex items-center justify-center text-pm-dark font-bold flex-shrink-0">IA</div>
                        <div className="max-w-lg p-3 rounded-lg bg-pm-dark">
                           <div className="flex items-center gap-2">
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse"></span>
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse [animation-delay:0.2s]"></span>
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse [animation-delay:0.4s]"></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {error && <p className="text-red-400 text-center text-xs p-2 bg-black">{error}</p>}
            <form onSubmit={handleSendMessage} className="bg-black border-x border-b border-pm-gold/20 rounded-b-lg p-3 flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question ici..."
                    className="flex-grow bg-pm-dark border border-pm-off-white/30 rounded-full py-3 px-5 focus:outline-none focus:border-pm-gold transition-colors"
                    aria-label="Votre message"
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-pm-gold text-pm-dark p-3 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Envoyer le message">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
