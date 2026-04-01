import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeftIcon, MicrophoneIcon, StopCircleIcon } from '@heroicons/react/24/solid';

// Helper functions for audio encoding/decoding, as per guidelines
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}


const LiveChat: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const startConversation = useCallback(async () => {
        setStatus('connecting');
        setErrorMessage(null);

        try {
            if (!process.env.API_KEY) {
              throw new Error("API key not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = inputAudioContext;
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            let nextStartTime = 0;
            const sources = new Set<AudioBufferSourceNode>();

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: GenAIBlob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };

                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContext.destination);
                            source.addEventListener('ended', () => sources.delete(source));
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.add(source);
                        }
                        if (message.serverContent?.interrupted) {
                            sources.forEach(source => source.stop());
                            sources.clear();
                            nextStartTime = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setErrorMessage("Une erreur de connexion est survenue. Veuillez réessayer.");
                        setStatus('error');
                    },
                    onclose: () => {
                        setStatus('idle');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: "Tu es PMM Assistant, une IA pour l'agence Perfect Models Management. Parle en français. Sois amical, professionnel et concis.",
                },
            });
        } catch (err) {
            console.error("Failed to start conversation:", err);
            setErrorMessage("Impossible d'accéder au microphone ou de démarrer la session.");
            setStatus('error');
        }
    }, []);

    const stopConversation = useCallback(async () => {
        if (sessionPromiseRef.current) {
            const session = await sessionPromiseRef.current;
            session.close();
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        if (audioContextRef.current) {
            await audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        sessionPromiseRef.current = null;
        setStatus('idle');
    }, []);

    useEffect(() => {
        return () => {
            if (status !== 'idle') {
                stopConversation();
            }
        };
    }, [status, stopConversation]);

    return (
        <>
            <SEO title="Live Chat | Assistant Vocal IA" description="Parlez en temps réel avec l'assistant vocal de Perfect Models Management." noIndex />
            <div className="bg-pm-dark text-pm-off-white h-screen flex flex-col justify-center items-center p-4">
                <Link to="/" className="absolute top-8 left-8 text-pm-gold hover:underline flex items-center gap-2">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Retour à l'accueil
                </Link>

                <div className="text-center">
                    <h1 className="text-5xl font-playfair text-pm-gold">Live Chat</h1>
                    <p className="text-pm-off-white/80 mt-2">Parlez directement avec notre assistant vocal.</p>

                    <div className="mt-12 flex justify-center">
                        {status === 'idle' || status === 'error' ? (
                            <button
                                onClick={startConversation}
                                className="w-40 h-40 bg-pm-gold rounded-full flex flex-col items-center justify-center text-pm-dark font-bold uppercase tracking-wider transition-transform hover:scale-105"
                            >
                                <MicrophoneIcon className="w-16 h-16" />
                                Démarrer
                            </button>
                        ) : (
                            <button
                                onClick={stopConversation}
                                className="w-40 h-40 bg-red-600 rounded-full flex flex-col items-center justify-center text-white font-bold uppercase tracking-wider"
                            >
                                <StopCircleIcon className="w-16 h-16" />
                                Arrêter
                            </button>
                        )}
                    </div>

                    <div className="mt-8 h-10">
                        {status === 'connecting' && <p className="text-pm-gold animate-pulse">Connexion en cours...</p>}
                        {status === 'connected' && <p className="text-green-400">Connecté. Parlez maintenant.</p>}
                        {status === 'error' && <p className="text-red-400">{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LiveChat;