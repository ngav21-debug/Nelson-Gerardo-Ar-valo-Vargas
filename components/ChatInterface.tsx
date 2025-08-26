
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isQuerying: boolean;
  isReady: boolean;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
  
    if(isSystem) {
        return (
            <div className="text-center my-2">
                <p className="text-sm text-gray-400 italic">{message.text}</p>
            </div>
        )
    }

    return (
      <div className={`flex my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`rounded-lg px-4 py-2 max-w-sm md:max-w-md ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
            {message.isLoading ? (
                <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                </div>
            ) : (
                <p className="whitespace-pre-wrap">{message.text}</p>
            )}
        </div>
      </div>
    );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isQuerying, isReady }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isQuerying && isReady) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 flex flex-col h-[60vh] mt-4 border border-gray-700">
      <div className="flex-grow overflow-y-auto mb-4 pr-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isReady ? "Haz una pregunta sobre los archivos..." : "Selecciona una carpeta para empezar"}
          className="flex-grow bg-gray-700 text-white rounded-l-md p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
          disabled={!isReady || isQuerying}
        />
        <button
          type="submit"
          disabled={isQuerying || !isReady || !input.trim()}
          className="bg-cyan-500 text-white p-3 rounded-r-md hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};
