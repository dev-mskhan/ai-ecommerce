import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, Briefcase, FileText, CheckCircle2, ArrowRight, ArrowLeft, Building2, Smartphone, Plus, Trash2, Check, MapPin, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { cn } from '@/utils/helpers';

interface Address {
  line: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
}

export const VendorOnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Form State
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([
    { line: '', city: '', state: '', country: 'Pakistan', isDefault: true }
  ]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const handleComplete = () => {
     // Validate before navigation
     if (addresses.filter(a => a.isDefault).length !== 1) {
       alert("Exactly one address must be set as default");
       return;
     }
     navigate('/vendor');
  };

  const addAddress = () => {
    setAddresses([...addresses, { line: '', city: '', state: '', country: 'Pakistan', isDefault: false }]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length <= 1) return;
    const newAddresses = addresses.filter((_, i) => i !== index);
    if (addresses[index].isDefault) {
      newAddresses[0].isDefault = true;
    }
    setAddresses(newAddresses);
  };

  const updateAddress = (index: number, field: keyof Address, value: any) => {
    const newAddresses = [...addresses];
    if (field === 'isDefault' && value === true) {
      // Unset others
      newAddresses.forEach(a => a.isDefault = false);
    }
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };

  const pakistaniCities = [
    { label: 'Karachi', value: 'karachi' },
    { label: 'Lahore', value: 'lahore' },
    { label: 'Islamabad', value: 'islamabad' },
    { label: 'Faisalabad', value: 'faisalabad' },
    { label: 'Rawalpindi', value: 'rawalpindi' },
    { label: 'Multan', value: 'multan' },
    { label: 'Peshawar', value: 'peshawar' },
    { label: 'Quetta', value: 'quetta' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col">
      <nav className="p-8 border-b border-[#1A1A1A]/5">
        <Link to="/account" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft size={14} />
          Back to Profile
        </Link>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 py-20">
        <div className="mb-16">
          <h1 className="text-5xl lg:text-7xl font-heading font-black italic tracking-tighter uppercase leading-none mb-6 text-left">
            Partner <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Registration</span>
          </h1>
          <div className="flex gap-4">
             {[1, 2, 3].map(i => (
               <div key={i} className={`h-1 flex-1 ${step >= i ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]/10'} transition-all`}></div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 text-left">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">Phase 0{step}</h3>
            <p className="text-sm font-light text-[#1A1A1A]/60 italic leading-relaxed">
              {step === 1 && "Establish your store details and contact information."}
              {step === 2 && "Configure the physical distribution nodes for your operation."}
              {step === 3 && "Review and finalize your partner profile for authentication."}
            </p>
          </div>

          <div className="md:col-span-8">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-left">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Store Name</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                      <input 
                        type="text" 
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Minimalist Lab" 
                        className="w-full bg-[#1A1A1A]/5 border-none p-4 pl-12 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-[#EAE8E2] transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Phone Number (Pakistan)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                      <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="03001234567" 
                        className="w-full bg-[#1A1A1A]/5 border-none p-4 pl-12 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-[#EAE8E2] transition-all font-mono" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Store Description (Optional)</label>
                    <textarea 
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      placeholder="Describe your brand essence..." 
                      className="w-full bg-[#1A1A1A]/5 border-none p-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-[#EAE8E2] transition-all min-h-[120px]"
                    ></textarea>
                  </div>
                </div>
                <Button onClick={handleNext} className="w-full h-14 text-[10px] font-bold uppercase tracking-[0.4em]">Initialize Logistics <ArrowRight size={16} className="ml-2" /></Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-left">
                <div className="space-y-6">
                  {addresses.map((addr, idx) => (
                    <div key={idx} className="bg-[#1A1A1A]/5 p-6 border border-[#1A1A1A]/5 space-y-6 relative">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="opacity-40" />
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Address Node {idx + 1}</span>
                        </div>
                        {addresses.length > 1 && (
                          <button onClick={() => removeAddress(idx)} className="text-red-500 opacity-40 hover:opacity-100 transition-opacity">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Street Line</label>
                          <input 
                            type="text" 
                            value={addr.line}
                            onChange={(e) => updateAddress(idx, 'line', e.target.value)}
                            className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none" 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">City</label>
                            <CustomDropdown 
                              options={pakistaniCities}
                              value={addr.city}
                              onChange={(val) => updateAddress(idx, 'city', val)}
                              className="bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Province / State</label>
                            <input 
                              type="text" 
                              value={addr.state}
                              onChange={(e) => updateAddress(idx, 'state', e.target.value)}
                              className="w-full h-full min-h-[46px] bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Postal Code</label>
                            <input 
                              type="text" 
                              value={addr.postalCode}
                              onChange={(e) => updateAddress(idx, 'postalCode', e.target.value)}
                              className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none font-mono" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Country</label>
                            <input 
                              type="text" 
                              value={addr.country}
                              disabled
                              className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none opacity-40" 
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer group pt-2">
                          <button 
                            type="button"
                            onClick={() => updateAddress(idx, 'isDefault', true)}
                            className={cn(
                              "w-5 h-5 flex items-center justify-center transition-all",
                              addr.isDefault ? "bg-[#1A1A1A] text-white" : "border border-[#1A1A1A]/20"
                            )}
                          >
                            {addr.isDefault && <Check size={12} />}
                          </button>
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Primary Operational Address</span>
                        </label>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={addAddress}
                    className="w-full py-4 border border-dashed border-[#1A1A1A]/20 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:border-[#1A1A1A] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Add Secondary Location
                  </button>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
                  <Button onClick={handleNext} className="flex-[2] h-14 text-[10px] font-bold uppercase tracking-[0.4em]">Validate Profile <ArrowRight size={16} className="ml-2" /></Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-left">
                <div className="bg-[#1A1A1A] text-white p-10 space-y-8">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-6">Manifest Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Store</span>
                        <span className="text-sm font-heading italic">{storeName || 'Unnamed Entity'}</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Contact</span>
                        <span className="text-sm font-mono opacity-60">{phoneNumber || 'Not Provided'}</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Locations</span>
                        <span className="text-sm font-bold">{addresses.length} Node(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/5 rounded-none flex items-start gap-4">
                    <CheckCircle2 className="text-green-500 mt-1" size={16} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Verification Ready</p>
                      <p className="text-[9px] opacity-40 italic mt-1">Your data has been formatted for the Rift registry.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 px-1">
                    <input type="checkbox" id="verify" className="w-4 h-4 border-[#1A1A1A]/10 rounded-none text-[#1A1A1A] focus:ring-0" />
                    <label htmlFor="verify" className="text-[10px] font-bold uppercase tracking-widest opacity-40 cursor-pointer">I verify all data is authentic and complies with partner protocols.</label>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleBack} className="flex-1">Edit</Button>
                    <Button onClick={handleComplete} className="flex-[2] h-14 text-[10px] font-bold uppercase tracking-[0.4em] bg-green-600 text-white hover:bg-green-700">Submit Registration</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

