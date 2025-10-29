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
  },