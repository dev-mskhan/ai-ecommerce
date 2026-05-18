import React from 'react';
import { Save, Globe, Shield, Percent } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Note: Settings page manages platform-level config (store name, commission %).
// These would require a dedicated settings API endpoint on your backend.
// Wire up to your settings API when available. Local state is used for now.

export const AdminSettingsPage: React.FC = () => {
    const [storeName, setStoreName] = React.useState('THE ARCHIVE');
    const [commission, setCommission] = React.useState('5');
    const [isOffline, setIsOffline] = React.useState(false);
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        // TODO: call your settings PATCH endpoint here
        // e.g. updateSettings({ storeName, commissionPercentage: Number(commission) })
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-14">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Configuration</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Settings <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Platform Config</span>
                    </h1>
                </div>
                <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save size={14} />
                    {saved ? 'Saved!' : 'Save Changes'}
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                {/* Branding */}
                <section className="space-y-10 bg-[#FDFCF8] border border-[#1A1A1A]/10 p-10">
                    <div className="flex items-center gap-4 border-b border-[#1A1A1A]/5 pb-5">
                        <Globe size={16} className="opacity-40" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Branding</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Store Name</label>
                            <input
                                type="text"
                                value={storeName}
                                onChange={e => setStoreName(e.target.value)}
                                className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 block">Platform Logo</label>
                            <div className="flex items-start gap-8">
                                <div className="w-20 h-20 bg-[#1A1A1A] flex items-center justify-center text-[#FDFCF8] font-black text-2xl italic">
                                    {storeName[0] ?? 'A'}
                                </div>
                                <div className="flex-1 pt-2 space-y-3">
                                    <button className="text-[10px] font-bold uppercase tracking-widest underline decoration-[#1A1A1A]/10 underline-offset-8 hover:decoration-[#1A1A1A]">Change Logo</button>
                                    <p className="text-[9px] font-mono opacity-30 leading-relaxed uppercase">Max 5MB // JPG, PNG, SVG</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Commission */}
                <section className="space-y-10 bg-[#FDFCF8] border border-[#1A1A1A]/10 p-10">
                    <div className="flex items-center gap-4 border-b border-[#1A1A1A]/5 pb-5">
                        <Percent size={16} className="opacity-40" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Commission</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Platform Commission (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={commission}
                                onChange={e => setCommission(e.target.value)}
                                min={0}
                                max={100}
                                className="w-full bg-[#1A1A1A]/5 p-5 pr-12 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-mono font-bold text-2xl"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 font-mono opacity-20 text-2xl">%</span>
                        </div>
                        <p className="text-[9px] font-mono opacity-40 uppercase">
                            Current backend uses 5% — update dashboard logic if changed.
                        </p>
                    </div>
                </section>

                {/* System Status */}
                <section className="space-y-10 bg-[#1A1A1A] text-[#FDFCF8] p-10 lg:col-span-2">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                        <Shield size={16} className="opacity-40" />
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-60">System Status</h3>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="space-y-2 max-w-md">
                            <h4 className="text-lg font-heading font-medium italic">Maintenance Mode</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">
                                Turn off the store for maintenance. Only admins can log in during this time.
                            </p>
                        </div>

                        <div className="flex items-center gap-5">
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", isOffline ? "text-red-400" : "text-green-400")}>
                                {isOffline ? 'Offline' : 'Online'}
                            </span>
                            <button
                                onClick={() => setIsOffline(v => !v)}
                                className="w-16 h-8 relative bg-white/10 border border-white/20 transition-colors hover:bg-white/20"
                            >
                                <div className={cn(
                                    "absolute top-1 w-6 h-6 bg-white transition-all",
                                    isOffline ? "left-[calc(100%-28px)]" : "left-1"
                                )} />
                            </button>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                {isOffline ? 'Turn On' : 'Turn Off'}
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

// Utility needed for cn inside this file
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}