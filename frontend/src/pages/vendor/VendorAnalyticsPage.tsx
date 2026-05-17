import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Activity, TrendingUp, Users, DollarSign, Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

const COLORS = ['#1A1A1A', '#4A4A4A', '#8A8A8A', '#CACACA'];

export const VendorAnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState('daily');
  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 6000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 8890 },
    { name: 'Sat', revenue: 5390 },
    { name: 'Sun', revenue: 7490 },
  ];

  const categoryData = [
    { name: 'Tech', value: 400 },
    { name: 'Home', value: 300 },
    { name: 'Apparel', value: 300 },
    { name: 'Gear', value: 200 },
  ];

  return (
    <div className="space-y-24 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">Structural Intelligence</div>
          <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Data <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Analytics</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center w-64 bg-[#1A1A1A]/5 p-2">
            <CustomDropdown 
              value={timeframe}
              onChange={(val) => setTimeframe(val)}
              options={[
                { label: 'Daily Progression', value: 'daily' },
                { label: 'Weekly Stride', value: 'weekly' },
                { label: 'Monthly Yield', value: 'monthly' }
              ]}
              className="w-full bg-transparent p-0"
              placeholder="Select Timeframe"
            />
          </div>
        </div>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
        {[
          { label: 'Aggregate Yield', value: 'RS. 1.2M', trend: '+12.5%', icon: DollarSign },
          { label: 'Network Points', value: '4.8K', trend: '+4%', icon: Users },
          { label: 'Yield Velocity', value: '3.2%', trend: '-0.8%', icon: Activity },
          { label: 'Market Position', value: '#14', trend: 'STABLE', icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#FDFCF8] p-10">
            <div className="flex justify-between items-start mb-6">
              <stat.icon size={18} strokeWidth={1} className="opacity-40" />
              <span className={cn(
                "text-[9px] font-mono",
                stat.trend.startsWith('+') ? "text-green-600" : stat.trend.startsWith('-') ? "text-red-600" : "opacity-40"
              )}>{stat.trend}</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-4">{stat.label}</p>
            <p className="text-4xl font-heading font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-[#FDFCF8] p-12 border border-[#1A1A1A]/10 h-[600px] flex flex-col">
          <div className="flex items-baseline justify-between mb-12 border-b border-[#1A1A1A]/5 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Revenue Progression</h3>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" strokeOpacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.4 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#1A1A1A] text-[#FDFCF8] p-12 flex flex-col h-[600px]">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-12">Category Architecture</h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#FDFCF8' : `rgba(253, 252, 248, ${0.4 - index * 0.1})`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 pt-8">
               {categoryData.map((item, idx) => (
                 <div key={item.name} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-[#FDFCF8]/5 pb-2">
                    <span className="opacity-40 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: idx === 0 ? '#FDFCF8' : `rgba(253, 252, 248, ${0.4 - idx * 0.1})` }}></div>
                      {item.name}
                    </span>
                    <span>{item.value} Units</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FDFCF8] p-12 border border-[#1A1A1A]/10">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-12 border-b border-[#1A1A1A]/5 pb-4">Principal Assets (Top Velocity)</h3>
        <div className="h-[400px]">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData.map(d => ({ name: d.name, value: d.revenue / 100 }))}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, opacity: 0.4 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#FDFCF8', fontSize: '10px' }} />
                <Bar dataKey="value" fill="#1A1A1A" radius={[0, 0, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
