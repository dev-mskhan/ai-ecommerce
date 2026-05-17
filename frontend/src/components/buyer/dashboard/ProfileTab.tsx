import { User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ProfileTab = () => {
    const user = { name: 'Elias Thorne', email: 'elias.thorne@archive.com', joined: 'January 2024' };

    return (
        <section className="space-y-16">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Profile Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
                <div className="md:col-span-4 space-y-8">
                    <div className="relative group w-48 h-48">
                        <div className="w-full h-full bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 flex items-center justify-center grayscale overflow-hidden">
                            <User size={64} className="opacity-10" />
                        </div>
                        <button className="absolute inset-0 bg-[#1A1A1A]/80 text-[#FDFCF8] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                            <Camera size={20} />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Update Photo</span>
                        </button>
                    </div>
                    <div className="pt-8 border-t border-[#1A1A1A]/5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">Member Since</p>
                        <p className="text-sm font-mono opacity-60 uppercase">{user.joined}</p>
                    </div>
                </div>
                <div className="md:col-span-8 space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Full Name</label>
                            <input type="text" readOnly value={user.name} className="w-full bg-[#1A1A1A]/5 p-4 outline-none border-none text-sm font-medium opacity-60" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Email Address</label>
                            <input type="email" readOnly value={user.email} className="w-full bg-[#1A1A1A]/5 p-4 outline-none border-none text-sm font-medium opacity-60" />
                        </div>
                    </div>
                    <div className="p-10 bg-[#1A1A1A] text-[#FDFCF8] space-y-6">
                        <h3 className="text-xl font-heading font-medium italic">Become a Seller?</h3>
                        <p className="text-sm font-light opacity-60 leading-relaxed">Start selling your products on our platform today.</p>
                        <Button className="bg-[#FDFCF8] text-[#1A1A1A] hover:bg-[#EAE8E2] w-full text-[10px] uppercase font-bold tracking-widest">
                            Upgrade to Vendor
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};