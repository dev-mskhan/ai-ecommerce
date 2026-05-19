import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot, X, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import { useChatActions, useChats } from '@/store/hooks/useChat';
import { useAppSelector } from '@/store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: any[];
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi there! I\'m your product advisor. How can I help you?'
    }
  ]);
  const [input, setInput] = React.useState('');
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: chatsData } = useChats();
  const [activeChatId, setActiveChatId] = React.useState<string | null>(
    isAuthenticated ? chatsData?.data?.[0]?.id ?? null : null
  );
  const { sendMessage, sendState: { isLoading, error, isSuccess } } = useChatActions();
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: input }]);
    setInput('');
    const { data: result } = await sendMessage({ message: input, ...(activeChatId && { chatId: activeChatId }) });
    if (!activeChatId && result?.data?.chatId) {
      setActiveChatId(result.data.chatId);
    }
    if (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Cannot process request now, try again",
      }]);
      return;
    }
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result?.data?.message,
      recommendations: result?.data?.products
    }
    setMessages(prev => [...prev, assistantMessage]);
  };

  const promptChips = [
    "electronics",
    "Fashion",
    "Furniture",
    "Home",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-[600px] bg-[#FDFCF8] border border-[#1A1A1A] z-[101] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <header className="p-8 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-[#1A1A1A] text-[#FDFCF8]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-[#FDFCF8]/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-[#FDFCF8]/60" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.4em]">AI Based Search</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 border border-[#FDFCF8]/20 flex items-center justify-center hover:bg-[#FDFCF8] hover:text-[#1A1A1A] transition-all"
              >
                <X size={18} />
              </button>
            </header>

            {/* Chat Area */}
            <div
              ref={scrollRef}
              className="flex-1 p-8 overflow-y-auto space-y-8 no-scrollbar bg-[#FDFCF8]"
            >
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-6",
                      msg.role === 'user' ? "flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center flex-shrink-0 border",
                      msg.role === 'user' ? "bg-[#1A1A1A] text-[#FDFCF8] border-[#1A1A1A]" : "bg-[#1A1A1A]/5 text-[#1A1A1A] border-[#1A1A1A]/10"
                    )}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={cn(
                      "max-w-[75%] space-y-4",
                      msg.role === 'user' ? "text-right" : ""
                    )}>
                      <div className={cn(
                        "p-3 text-sm font-light leading-relaxed border",
                        msg.role === 'user'
                          ? "bg-[#1A1A1A] text-[#FDFCF8] border-[#1A1A1A] italic"
                          : "bg-white border-[#1A1A1A]/10 text-[#1A1A1A]"
                      )}>
                        {msg.content}
                      </div>

                      {msg.recommendations && (
                        <div className="grid grid-cols-2 gap-4">
                          {msg.recommendations.map(p => (
                            <button
                              key={p.id}
                              onClick={() => {
                                onClose();
                                navigate(`/product/${p.slug}`);
                              }}
                              className="p-4 border border-[#1A1A1A]/10 bg-white group/prod hover:border-[#1A1A1A] transition-all text-left cursor-pointer"
                            >
                              <div className="w-full h-24 bg-[#1A1A1A]/5 overflow-hidden mb-4">
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover/prod:opacity-100 group-hover/prod:scale-110 transition-all" />
                              </div>
                              <h4 className="text-[10px] font-bold uppercase truncate mb-1">{p.name}</h4>
                              <span className="text-[10px] font-bold text-xl">PKR {p.price.toFixed(2)}</span>
                              <span className="text-[9px] font-mono opacity-40 float-right mt-2">View Record</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-6"
                  >
                    <div className="w-10 h-10 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center">
                      <Bot size={18} />
                    </div>
                    <div className="bg-white border border-[#1A1A1A]/10 p-6 flex gap-1 items-center">
                      <div className="w-1 h-1 bg-[#1A1A1A] animate-bounce"></div>
                      <div className="w-1 h-1 bg-[#1A1A1A] animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-[#1A1A1A] animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-[#1A1A1A]/10 bg-white">
              <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
                {promptChips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => setInput(chip)}
                    className="px-4 py-2 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 text-[9px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <input
                  type="text"
                  placeholder="Initiate Search..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full h-16 pl-6 pr-16 bg-[#1A1A1A]/5 border border-transparent focus:border-[#1A1A1A] outline-none text-sm font-light italic transition-all"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-[#1A1A1A] text-[#FDFCF8] flex items-center justify-center hover:bg-[#333] transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
