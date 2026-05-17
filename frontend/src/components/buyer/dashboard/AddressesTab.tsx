import { MapPin } from 'lucide-react';

const addresses = [
    { id: 1, label: 'Home', street: '14/B Khayaban-e-Ittehad', city: 'Karachi', suffix: '75500', isDefault: true },
    { id: 2, label: 'Work', street: '42 Al-Nasr Heights', city: 'Lahore', suffix: '54000', isDefault: false },
];

export const AddressesTab = () => (
    <section className="space-y-12">
        <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">My Addresses</h2>
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border-b border-[#1A1A1A] pb-1 hover:opacity-50 transition-all">Add Address +</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
            {addresses.map((addr) => (
                <div key={addr.id} className="bg-[#FDFCF8] p-10 space-y-6 group">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-[#1A1A1A]/5 flex items-center justify-center grayscale group-hover:bg-[#1A1A1A] group-hover:text-[#FDFCF8] transition-all">
                            <MapPin size={20} />
                        </div>
                        {addr.isDefault && <span className="text-[8px] font-bold uppercase tracking-widest border border-[#1A1A1A]/10 px-2 py-1">Default Address</span>}
                    </div>
                    <div>
                        <h3 className="text-xl font-heading font-medium italic mb-2">{addr.label}</h3>
                        <p className="text-sm font-light opacity-60 italic">{addr.street}</p>
                        <p className="text-sm font-light opacity-60 uppercase tracking-widest">{addr.city}, {addr.suffix}</p>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-[#1A1A1A]/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[10px] font-bold uppercase tracking-widest hover:line-through">Edit</button>
                        {!addr.isDefault && <button className="text-[10px] font-bold uppercase tracking-widest hover:line-through">Set Default</button>}
                        <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:line-through">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    </section>
);