'use client';

import { useState, useEffect, useRef } from 'react';

type SpeechRecognitionHook = {
  text: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
};

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      setText(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
        if(isListening) {
           // recognition.start(); // This can cause infinite loops if not handled carefully
        } else {
           recognition.stop();
        }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening]);
  
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setText('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!(
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    ),
  };
};
