import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, Send, Bot, Minimize2, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/utils/helpers';
import { useSupportChatActions, useSupportChats } from '@store/hooks/useSupport';
import { useChatSocket } from '@store/socket/useChatSocket';
import { getSocket } from '@store/socket/socket';

interface Message {
  role: 'user' | 'support';
  content: string;
  createdAt: string | Date;
  _id?: string;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatsData } = useSupportChats();
  const {
    create: [createChat, { isLoading: creating }],
    send: [sendMessage, { isLoading: sending }],
  } = useSupportChatActions();

  // Pick the most recent open chat on load
  useEffect(() => {
    const chats = chatsData?.data ?? [];
    const open = chats.find((c: any) => c.status === 'open');
    if (open && !activeChatId) {
      setActiveChatId(open._id);
      setMessages(open.messages ?? []);
    }
  }, [chatsData]);

  // Join socket room whenever activeChatId changes
  // Pass activeChatId directly — empty string means "don't join yet"
  useChatSocket(activeChatId ?? '', undefined);

  // ✅ Stable handler refs to avoid duplicate registrations
  const handleNewMessage = useCallback(
    ({ chatId, message }: { chatId: string; message: Message }) => {
      if (chatId !== activeChatId) return;

      setMessages(prev => {
        // Deduplicate: skip if a message with same content+role already exists
        // within a 2-second window (handles optimistic + socket race)
        const isDuplicate = prev.some(
          m =>
            m.role === message.role &&
            m.content === message.content &&
            Math.abs(
              new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()
            ) < 2000
        );
        if (isDuplicate) return prev;
        return [...prev, message];
      });
    },
    [activeChatId]
  );

  const handleChatClosed = useCallback(
    ({ chatId }: { chatId: string }) => {
      if (chatId === activeChatId) setActiveChatId(null);
    },
    [activeChatId]
  );

  // ✅ Register/cleanup socket listeners with stable handler refs
  useEffect(() => {
    if (!activeChatId) return;

    const s = getSocket();

    s.on('chat:new_message', handleNewMessage);
    s.on('chat:closed', handleChatClosed);

    return () => {
      // ✅ Remove only OUR specific handlers, not all listeners on the event
      s.off('chat:new_message', handleNewMessage);
      s.off('chat:closed', handleChatClosed);
    };
  }, [activeChatId, handleNewMessage, handleChatClosed]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || creating || sending) return;

    const text = input.trim();
    setInput('');

    if (!activeChatId) {
      // First message — create the support ticket
      try {
        const res = await createChat({ message: text }).unwrap();
        const chat = res.data;

        // ✅ Set messages from the server response (includes the first message)
        setMessages(chat.messages ?? []);

        // ✅ Set activeChatId AFTER messages are set so the socket join fires correctly
        setActiveChatId(chat._id);
      } catch (err) {
        console.error('Failed to create support chat:', err);
        setInput(text); // restore input on error
      }
    } else {
      // ✅ Optimistically add the message immediately for responsive UX
      const optimisticMsg: Message = {
        role: 'user',
        content: text,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, optimisticMsg]);

      try {
        await sendMessage({ chatId: activeChatId, message: text }).unwrap();
        // Socket will broadcast back — deduplication in handleNewMessage prevents doubling
      } catch (err) {
        console.error('Failed to send message:', err);
        // Roll back optimistic message on failure
        setMessages(prev => prev.filter(m => m !== optimisticMsg));
        setInput(text); // restore input on error
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={cn(
              'bg-[#FDFCF8] border border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col absolute bottom-0 right-0',
              isMinimized ? 'h-16 w-64' : 'h-[500px] w-[380px]'
            )}
          >
            {/* Header */}
            <div className="bg-[#1A1A1A] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 flex items-center justify-center">
                  <Bot size={16} className="text-[#FDFCF8]" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#FDFCF8]">
                    Live Support
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-[#FDFCF8]/40">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(p => !p)}
                  className="p-2 text-[#FDFCF8]/40 hover:text-white transition-colors"
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-[#FDFCF8]/40 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                  {messages.length === 0 && (
                    <div className="text-center py-8 opacity-40">
                      <Bot size={28} className="mx-auto mb-3 stroke-1" />
                      <p className="text-[10px] uppercase tracking-widest font-bold">
                        How can we help?
                      </p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div
                      key={msg._id ?? i}
                      className={cn(
                        'flex flex-col max-w-[85%]',
                        msg.role === 'user' ? 'ml-auto items-end' : 'items-start'
                      )}
                    >
                      <div
                        className={cn(
                          'p-4 text-xs leading-relaxed',
                          msg.role === 'user'
                            ? 'bg-[#1A1A1A] text-[#FDFCF8] font-light'
                            : 'bg-[#1A1A1A]/5 text-[#1A1A1A] font-light italic border border-[#1A1A1A]/5'
                        )}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[8px] font-mono opacity-30 mt-2 uppercase">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-[#1A1A1A]/10 flex items-center gap-3"
                >
                  <button
                    type="button"
                    className="p-2 text-[#1A1A1A]/20 hover:text-[#1A1A1A] transition-colors"
                  >
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={activeChatId ? 'Type your message...' : 'Describe your issue...'}
                    className="flex-1 bg-transparent border-none outline-none text-xs font-light py-2"
                  />
                  <button
                    type="submit"
                    disabled={creating || sending}
                    className="w-10 h-10 bg-[#1A1A1A] flex items-center justify-center text-[#FDFCF8] hover:bg-black transition-all disabled:opacity-40"
                  >
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