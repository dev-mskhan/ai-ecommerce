import { ChevronRight } from 'lucide-react';

const chatHistory = [
    { id: 1, title: 'Product compatibility question', lastMessage: 'The dimensions provided are accurate...', date: '2h ago' },
    { id: 2, title: 'Item material details', lastMessage: 'We source exclusively from Berlin...', date: '1d ago' },
    { id: 3, title: 'Return request status', lastMessage: 'Your label has been generated.', date: '3d ago' },
];

export const AIChatHistoryTab = () => (
    <section className="space-y-12">
        <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">AI assistant chats</h2>
        </div>
        <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
            {chatHistory.map((chat) => (
                <button key={chat.id} className="w-full bg-[#FDFCF8] p-10 flex justify-between items-center group hover:bg-[#EAE8E2] transition-colors text-left">
                    <div className="space-y-2">
                        <h3 className="text-lg font-heading font-medium italic">{chat.title}</h3>
                        <p className="text-sm font-light opacity-60 line-clamp-1">{chat.lastMessage}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] font-mono opacity-20 uppercase block mb-1">{chat.date}</span>
                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0" />
                    </div>
                </button>
            ))}
        </div>
    </section>
);