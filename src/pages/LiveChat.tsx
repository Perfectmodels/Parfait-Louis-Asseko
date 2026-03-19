import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeftIcon, MicrophoneIcon, StopCircleIcon } from '@heroicons/react/24/solid';

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
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
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const LiveChat: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const sessionPromiseRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const stopConversation = useCallback(async () => {
        if (sessionPromiseRef.current) {
            const session = await sessionPromiseRef.current;
            session.close();
        }
        if (audioContextRef.current) {
            await audioContextRef.current.close();
            audioContextRef.current = null;
        }
        sessionPromiseRef.current = null;
        setStatus('idle');
    }, []);

    const startConversation = useCallback(async () => {
        setStatus('connecting');
        setErrorMessage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const inputAudioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = inputAudioContext;
            const outputAudioContext = new AudioContext({ sampleRate: 24000 });
            let nextStartTime = 0;
            const sources = new Set<AudioBufferSourceNode>();

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (event) => {
                            const inputData = event.inputBuffer.getChannelData(0);
                            const int16 = new Int16Array(inputData.length);
                            for (let i = 0; i < inputData.length; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: GenAIBlob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current.then((s: any) => s.sendRealtimeInput({ media: pcmBlob }));
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
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.add(source);
                        }
                    },
                    onerror: () => setStatus('error'),
                    onclose: () => setStatus('idle'),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: "Tu es l'assistant vocal de Perfect Models. Réponds de façon concise et élégante.",
                },
            });
        } catch (err) {
            setErrorMessage("Accès microphone refusé.");
            setStatus('error');
        }
    }, []);

    return (
        <div className="bg-[#050505] h-screen flex flex-col justify-center items-center overflow-hidden">
            <SEO title="Live Concierge | PMM" noIndex />
            <Link to="/" className="absolute top-12 left-12 group flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-pm-gold transition-colors">
                    <ArrowLeftIcon className="w-5 h-5 text-white/40 group-hover:text-pm-gold" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors">Exit Session</span>
            </Link>

            <div className="relative text-center">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pm-gold rounded-full blur-[100px] transition-opacity duration-1000 ${status === 'connected' ? 'opacity-20 animate-pulse' : 'opacity-0'}`} />
                
                <h1 className="text-6xl md:text-8xl font-playfair font-black italic text-white mb-12">
                    {status === 'connected' ? "I'm Listening" : "Voice Concierge"}
                </h1>

                <button
                    onClick={status === 'connected' ? stopConversation : startConversation}
                    className={`relative w-48 h-48 rounded-full border-2 transition-all duration-700 flex items-center justify-center group ${
                        status === 'connected' ? 'border-red-500 bg-red-500/10' : 'border-pm-gold/40 hover:border-pm-gold'
                    }`}
                >
                    {status === 'connected' ? (
                        <StopCircleIcon className="w-20 h-20 text-red-500 animate-pulse" />
                    ) : (
                        <MicrophoneIcon className="w-20 h-20 text-pm-gold group-hover:scale-110 transition-transform" />
                    )}
                </button>

                <div className="mt-12 text-[11px] font-black uppercase tracking-[0.5em] text-white/30 h-6">
                    {status === 'connecting' && "Establishing Link..."}
                    {status === 'connected' && <span className="text-pm-gold">Link Active</span>}
                    {status === 'error' && <span className="text-red-500">{errorMessage}</span>}
                </div>
            </div>
        </div>
    );
};

export default LiveChat;