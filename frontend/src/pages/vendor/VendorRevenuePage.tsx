import React from 'react';
import { TrendingUp, DollarSign, Wallet, ArrowUpRight, BarChart3, Download } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { formatPrice, cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';

const revenueOverTime = [
  { name: '01 May', amount: 5000 },
  { name: '02 May', amount: 8000 },
  { name: '03 May', amount: 7500 },
  { name: '04 May', amount: 12000 },
  { name: '05 May', amount: 18000 },
  { name: '06 May', amount: 15000 },
  { name: '07 May', amount: 25000 },
];

export const VendorRevenuePage: React.FC = () => {
  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">Yield Analysis</div>
          <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Revenue <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Optimization</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={14} /> Settlement Log
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {[
          { label: 'Gross Yield', value: 'RS. 142.8K', delta: '+18.2%', icon: DollarSign },
          { label: 'Current Balance', value: 'RS. 28.4K', delta: 'STABLE', icon: Wallet },
          { label: 'Projected Monthly', value: 'RS. 450K', delta: '+5.4%', icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8] p-12">
            <stat.icon size={20} className="opacity-20 mb-8" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-4">{stat.label}</p>
            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-heading font-black tracking-tighter">{stat.value}</p>
              <span className="text-[10px] font-mono opacity-40">{stat.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FDFCF8] border border-[#1A1A1A]/10 p-12 h-[500px] flex flex-col">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-12 border-b border-[#1A1A1A]/5 pb-4">Inflow Spectrum</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueOverTime}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px', borderRadius: '0' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#1A1A1A" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section className="space-y-8">
         <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 border-b border-[#1A1A1A]/10 pb-4">System Disburse Registry</h3>
         <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
           {[
             { id: 'T_042', date: '12 May 2026', amount: 15400, status: 'PROCESSED' },
             { id: 'T_041', date: '05 May 2026', amount: 8200, status: 'PROCESSED' },
             { id: 'T_040', date: '28 Apr 2026', amount: 12900, status: 'STAGED' },
           ].map(trx => (
             <div key={trx.id} className="bg-[#FDFCF8] p-8 flex justify-between items-center group hover:bg-[#EAE8E2] transition-colors">
               <div className="flex items-center gap-8">
                 <span className="font-mono text-[10px] opacity-40">{trx.id}</span>
                 <p className="text-sm font-heading italic underline decoration-[#1A1A1A]/10">{trx.date}</p>
               </div>
               <div className="flex items-center gap-12">
                 <span className={cn(
                   "text-[9px] font-bold uppercase tracking-widest px-3 py-1",
                   trx.status === 'PROCESSED' ? "bg-green-600/10 text-green-700" : "bg-[#1A1A1A]/5 text-[#1A1A1A]/40"
                 )}>{trx.status}</span>
                 <span className="text-lg font-bold tracking-tight">{formatPrice(trx.amount).replace('Rs. ', '')}</span>
               </div>
             </div>
           ))}
         </div>
      </section>
    </div>
  );
};
