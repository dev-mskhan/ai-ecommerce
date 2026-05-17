import React from 'react';
import { MessageSquare, Search, Send, User, MoreHorizontal, Circle } from 'lucide-react';
import { cn } from '@/utils/helpers';

export const VendorMessagesPage: React.FC = () => {
  const chats = [
    { id: 1, user: 'Elias Thorne', lastMsg: 'Is the architectural drafting table still in stock?', time: '2m', unread: true },
    { id: 2, user: 'Margot Vanhoutte', lastMsg: 'Thank you for the prompt shipment.', time: '1h', unread: false },
    { id: 3, user: 'Studio OBSCURE', lastMsg: 'Technical specs inquiry regarding...', time: '3d', unread: false },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
      {/* Chat List */}
      <aside className="w-80 bg-[#FDFCF8] flex flex-col border-r border-[#1A1A1A]/10">
        <header className="p-8 border-b border-[#1A1A1A]/10 space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Correspondence</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" size={14} />
            <input 
              type="text" 
              placeholder="Filter..." 
              className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/5 border-none text-[10px] uppercase font-bold tracking-widest outline-none"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button 
              key={chat.id}
              className={cn(
                "w-full p-8 text-left border-b border-[#1A1A1A]/5 transition-all flex gap-4 items-start group hover:bg-[#EAE8E2]",
                chat.id === 1 ? "bg-[#EAE8E2]" : ""
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 flex items-center justify-center grayscale">
                  <User size={20} className="opacity-40" />
                </div>
                {chat.unread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#1A1A1A] rounded-full border-2 border-[#FDFCF8]"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-heading font-medium italic truncate">{chat.user}</h3>
                  <span className="text-[9px] font-mono opacity-40">{chat.time}</span>
                </div>
                <p className="text-[11px] font-light text-[#1A1A1A]/60 leading-relaxed truncate">{chat.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 bg-[#FDFCF8] flex flex-col">
        <header className="p-8 border-b border-[#1A1A1A]/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1A1A1A]/10 flex items-center justify-center">
              <User size={18} className="opacity-40" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-medium italic">Elias Thorne</h3>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                <Circle size={4} className="fill-green-600 text-green-600" /> Active Now
              </span>
            </div>
          </div>
          <button className="p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </header>

        <div className="flex-1 p-12 overflow-y-auto space-y-12">
          {/* Incoming */}
          <div className="flex gap-4 max-w-lg">
            <div className="w-8 h-8 bg-[#1A1A1A]/5 flex items-center justify-center flex-shrink-0">
               <User size={14} className="opacity-40" />
            </div>
            <div className="space-y-2">
              <div className="bg-[#1A1A1A]/5 p-6 border border-[#1A1A1A]/5 text-sm font-light leading-relaxed">
                Is the architectural drafting table still in stock? I noticed it was listed as low inventory.
              </div>
              <span className="text-[9px] font-mono opacity-40">10:42 AM</span>
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex gap-4 max-w-lg ml-auto flex-row-reverse">
            <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
               <User size={14} className="text-white opacity-40" />
            </div>
            <div className="space-y-2 text-right">
              <div className="bg-[#1A1A1A] text-[#FDFCF8] p-6 text-sm font-light leading-relaxed">
                Greetings Elias. Yes, we have exactly two units remaining in our Berlin warehouse.
              </div>
               <span className="text-[9px] font-mono opacity-40">10:45 AM</span>
            </div>
          </div>
        </div>

        <footer className="p-8 border-t border-[#1A1A1A]/10">
          <div className="relative flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Draft correspondence..."
              className="flex-1 bg-[#1A1A1A]/5 border-none p-6 text-sm outline-none focus:bg-[#EAE8E2] transition-all"
            />
            <button className="bg-[#1A1A1A] text-white p-6 hover:bg-black transition-all">
              <Send size={20} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};
