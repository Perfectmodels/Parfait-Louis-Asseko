import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat as GeminiChat } from '@google/genai';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';
import SEO from '../../components/SEO';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chat: React.FC = () => {
  const [chat, setChat] = useState<GeminiChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are the PMM Assistant, an expert AI for Perfect Models Management. You are friendly, professional, and knowledgeable about the modeling industry, fashion in Gabon, and the agency's activities. You answer questions and provide advice based on the agency's context. Your responses should be concise and helpful. Start the conversation by introducing yourself and asking how you can help.",
          },
        });
        setChat(chatSession);
        
        // Fetch initial welcome message
        setIsLoading(true);
        const response = await chatSession.sendMessageStream({ message: "Hello" });
        let fullResponse = "";
        for await (const chunk of response) {
            fullResponse += chunk.text;
        }
        setMessages([{ sender: 'ai', text: fullResponse }]);
        setIsLoading(false);

      } catch (err: any) {
        console.error("Chat initialization error:", err);
        setError("Impossible d'initialiser l'assistant IA. Vérifiez la configuration de la clé API.");
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
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseStream = await chat.sendMessageStream({ message: input });
      
      let aiResponseText = "";
      setMessages(prev => [...prev, { sender: 'ai', text: "" }]);
      
      for await (const chunk of responseStream) {
        aiResponseText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText };
          return newMessages;
        });
      }

    } catch (err: any) {
      console.error("Gemini API error:", err);
      const errorMessage = "Désolé, une erreur est survenue. Veuillez réessayer.";
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
                {isLoading && (
                     <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-pm-gold flex items-center justify-center text-pm-dark font-bold flex-shrink-0">IA</div>
                        <div className="max-w-lg p-3 rounded-lg bg-pm-dark">
                           <div className="flex items-center gap-1">
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse"></span>
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse [animation-delay:0.2s]"></span>
                               <span className="w-2 h-2 bg-pm-gold rounded-full animate-pulse [animation-delay:0.4s]"></span>
                           </div>
                        </div>
                    </div>
                )}
                {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="bg-black border-x border-b border-pm-gold/20 rounded-b-lg p-4 flex items-center gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question ici..."
                    className="flex-grow bg-pm-dark border border-pm-off-white/30 rounded-full p-3 px-5 focus:outline-none focus:border-pm-gold transition-colors"
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-pm-gold text-pm-dark p-3 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
      </div>
    </>
  );
};

export default Chat;