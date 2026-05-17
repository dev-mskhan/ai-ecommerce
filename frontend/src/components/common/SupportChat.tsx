import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Paperclip, MoreHorizontal, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/utils/helpers';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi! How can I help you today?', sender: 'agent', timestamp: '12:00' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    // Simulate Agent Response
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I am looking into that for you. One moment please...',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20, x: 20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "bg-[#FDFCF8] border border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col absolute bottom-0 right-0",
              isMinimized ? "h-16 w-64" : "h-[500px] w-[380px]"
            )}
          >
            {/* Header */}
            <div className="bg-[#1A1A1A] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 flex items-center justify-center">
                  <Bot size={16} className="text-[#FDFCF8]" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#FDFCF8]">Live Support</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-[#FDFCF8]/40">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-[#FDFCF8]/40 hover:text-white transition-colors">
                  <Minimize2 size={14} />
                </button>
                <button onClick={onClose} className="p-2 text-[#FDFCF8]/40 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.sender === 'user' ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "p-4 text-xs leading-relaxed",
                        msg.sender === 'user'
                          ? "bg-[#1A1A1A] text-[#FDFCF8] font-light"
                          : "bg-[#1A1A1A]/5 text-[#1A1A1A] font-light italic border border-[#1A1A1A]/5"
                      )}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-mono opacity-30 mt-2 uppercase">{msg.timestamp}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#1A1A1A]/10 flex items-center gap-3">
                  <button type="button" className="p-2 text-[#1A1A1A]/20 hover:text-[#1A1A1A] transition-colors">
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none outline-none text-xs font-light py-2"
                  />
                  <button type="submit" className="w-10 h-10 bg-[#1A1A1A] flex items-center justify-center text-[#FDFCF8] hover:bg-black transition-all">
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

