import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useChats } from '@store/hooks/useChat';
import { cn } from '@/utils/helpers';

export const AIChatHistoryTab = () => {
    const { data: chats, isLoading, isError } = useChats();
    const [selectedChat, setSelectedChat] = useState<any | null>(null);

    if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-[2px] bg-[#1A1A1A] animate-pulse"></div></div>;
    if (isError) return <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">Failed to load chats.</p>;

    if (selectedChat) return (
        <section className="space-y-12">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Chat</h2>
            </div>
            <button onClick={() => setSelectedChat(null)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
                ← Back to Chats
            </button>
            <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                {selectedChat.messages.map((msg: any) => (
                    <div key={msg._id} className={cn("p-8 space-y-2", msg.role === 'user' ? "bg-[#FDFCF8]" : "bg-[#1A1A1A] text-[#FDFCF8]")}>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">{msg.role}</p>
                        <p className="text-sm font-light leading-relaxed">{msg.content}</p>
                        <p className="text-[9px] font-mono opacity-20 uppercase">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </section>
    );

    return (
        <section className="space-y-12">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">AI Assistant Chats</h2>
            </div>
            {!chats?.data?.length ? (
                <p className="text-sm font-light opacity-40">No chat history yet.</p>
            ) : (
                <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                    {chats.data.map((chat: any) => (
                        <button key={chat._id} onClick={() => setSelectedChat(chat)} className="w-full bg-[#FDFCF8] p-10 flex justify-between items-center group hover:bg-[#EAE8E2] transition-colors text-left">
                            <div className="space-y-2">
                                <h3 className="text-lg font-heading font-medium italic">{chat.messages[0]?.content ?? 'Untitled Chat'}</h3>
                                <p className="text-sm font-light opacity-60 line-clamp-1">{chat.messages[chat.messages.length - 1]?.content}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[12px] font-mono opacity-70 uppercase block mb-1">{chat.updatedAt?.slice(0, 10)}</span>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0" />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};