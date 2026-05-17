import React from 'react';
import { Camera, Save, Shield, Store, User, Mail, Landmark, Bell } from 'lucide-react';
import { cn } from '@/utils/helpers';

export const VendorSettingsPage: React.FC = () => {
  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-12 gap-8">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-8">Store Settings</div>
          <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Profile <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Settings</span>
          </h1>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-[#FDFCF8] text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">
           <Save size={16} /> Save Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Left Column: Visual Identity */}
        <div className="lg:col-span-4 space-y-12">
           <div className="space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Store Photo</p>
              <div className="relative group w-48 h-48 mx-auto lg:mx-0">
                 <div className="w-full h-full bg-[#1A1A1A]/5 border-2 border-dashed border-[#1A1A1A]/10 flex items-center justify-center grayscale">
                    <Store size={48} className="opacity-20" />
                 </div>
                 <button className="absolute inset-0 bg-[#1A1A1A]/80 text-[#FDFCF8] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                    <Camera size={20} />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-center px-4">Change Store Image</span>
                 </button>
              </div>
           </div>

           <div className="p-8 bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 space-y-6">
              <div className="flex items-center gap-4 text-green-600">
                 <Shield size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Verified Vendor</span>
              </div>
              <p className="text-[10px] font-mono leading-relaxed opacity-40 uppercase">
                 Member since 2024. Level 2 authorization active. Transaction limit: Unlimited.
              </p>
           </div>
        </div>

        {/* Right Column: Parameters */}
        <div className="lg:col-span-8 space-y-16">
           <section className="space-y-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 border-b border-[#1A1A1A]/5 pb-4">Store Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Store Name</label>
                    <input type="text" defaultValue="TechZone Official" className="w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-medium focus:bg-[#1A1A1A]/10 transition-colors" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Email Address</label>
                    <input type="email" defaultValue="admin@techzone.pk" className="w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-medium focus:bg-[#1A1A1A]/10 transition-colors" />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Store Description</label>
                    <textarea defaultValue="High-quality products for modern homes and offices." className="w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-medium h-32 focus:bg-[#1A1A1A]/10 transition-colors resize-none" />
                 </div>
              </div>
           </section>

           <section className="space-y-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 border-b border-[#1A1A1A]/5 pb-4">Notification Preferences</h3>
              <div className="space-y-4">
                 {[
                    { label: 'New Order Alerts', desc: 'Receive real-time notification on order placement.', active: true },
                    { label: 'Low Stock Warnings', desc: 'Alert when stock gets low.', active: true },
                    { label: 'Sales Reports', desc: 'Weekly report on customer activity.', active: false },
                 ].map((pref) => (
                    <div key={pref.label} className="flex items-center justify-between p-6 bg-[#FDFCF8] border border-[#1A1A1A]/5 group hover:border-[#1A1A1A]/20 transition-all">
                       <div>
                          <p className="text-sm font-bold tracking-tight mb-1">{pref.label}</p>
                          <p className="text-[10px] font-mono opacity-40 uppercase">{pref.desc}</p>
                       </div>
                       <button className={cn(
                          "w-12 h-6 rounded-full relative transition-all duration-300",
                          pref.active ? "bg-[#1A1A1A]" : "bg-[#1A1A1A]/10"
                       )}>
                          <div className={cn(
                             "absolute top-1 w-4 h-4 rounded-full transition-all duration-300 bg-[#FDFCF8]",
                             pref.active ? "left-7" : "left-1"
                          )}></div>
                       </button>
                    </div>
                 ))}
              </div>
           </section>

           <section className="space-y-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 border-b border-[#1A1A1A]/5 pb-4">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <button className="flex items-center justify-between p-6 bg-[#FDFCF8] border border-red-600/10 text-red-600 hover:bg-red-600 hover:text-[#FDFCF8] transition-all">
                    <div className="text-left">
                       <p className="text-[10px] font-bold uppercase tracking-widest">Change Password</p>
                       <p className="text-[8px] font-mono opacity-60 uppercase">Change security credentials</p>
                    </div>
                 </button>
                 <button className="flex items-center justify-between p-6 bg-red-600/5 border border-red-600/20 text-red-700 hover:bg-red-600 hover:text-[#FDFCF8] transition-all">
                    <div className="text-left">
                       <p className="text-[10px] font-bold uppercase tracking-widest italic">Delete Account</p>
                       <p className="text-[8px] font-mono opacity-60 uppercase">Permanently close your store</p>
                    </div>
                 </button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};
