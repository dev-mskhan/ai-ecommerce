import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, CheckCircle2, ArrowRight, ArrowLeft, Plus, Trash2, Check, MapPin, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import { useVendorActions } from '@/store/hooks/useVendor';
import toast from 'react-hot-toast';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { riftToast } from '@/components/common/toastContainer';

const addressSchema = z.object({
  line: z.string().min(1, "Address line is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  state: z.string().min(1, "State is required").trim(),
  postalCode: z.string().trim().optional(),
  country: z.string().trim().default("Pakistan"),
  isDefault: z.boolean().default(false),
});

const vendorSchema = z.object({
  storeName: z.string().min(2).max(50).trim(),
  storeDescription: z.string().max(500).trim().optional(),
  phoneNumber: z.string().regex(/^(\+92|0)3[0-9]{9}$/, "Valid Pakistani number required (03001234567)"),
  addresses: z.array(addressSchema)
    .min(1, "At least one address is required")
    .refine(arr => arr.filter(a => a.isDefault).length === 1, "Exactly one address must be set as default"),
});

type VendorForm = z.infer<typeof vendorSchema>;

const pakistaniCities = ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Multan', 'Peshawar', 'Quetta'];

export const VendorOnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { upgrade } = useVendorActions();
  const [upgradeToVendor, { isLoading }] = upgrade;

  const { register, handleSubmit, watch, setValue, control, trigger, formState: { errors } } = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema) as Resolver<VendorForm>,
    defaultValues: {
      storeName: '',
      storeDescription: '',
      phoneNumber: '',
      addresses: [{ line: '', city: '', state: '', country: 'Pakistan', isDefault: true }],
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'addresses' });
  const watched = watch();

  const handleNext = async () => {
    const valid = step === 1
      ? await trigger(['storeName', 'phoneNumber', 'storeDescription'])
      : await trigger(['addresses']);
    if (valid) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const setDefault = (idx: number) => {
    fields.forEach((_, i) => setValue(`addresses.${i}.isDefault`, i === idx));
  };

  const onSubmit = async (data: VendorForm) => {
    await riftToast.promise(
      upgradeToVendor(data).unwrap(),
      {
        loading: 'Registering as vendor...',
        success: 'Vendor registration successful!',
        error: 'Registration failed',
      }
    )
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col">
      <nav className="p-8">
        <Link to="/account" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft size={14} /> Back to Profile
        </Link>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 py-10">
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none mb-6 text-left">
            Partner <br /><span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Registration</span>
          </h1>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 flex-1 transition-all ${step >= i ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]/10'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 text-left">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">Phase 0{step}</h3>
            <p className="text-sm font-light text-[#1A1A1A]/60 italic leading-relaxed">
              {step === 1 && "Establish your store details and contact information."}
              {step === 2 && "Configure the physical distribution address/es for your operation."}
              {step === 3 && "Review and finalize your partner profile for authentication."}
            </p>
          </div>

          <div className="md:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Step 1 */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-left">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Store Name</label>
                      <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                        <input {...register('storeName')} placeholder="e.g. Minimalist Lab"
                          className="w-full bg-[#1A1A1A]/5 p-4 pl-12 text-[10px] font-bold tracking-widest outline-none focus:bg-[#EAE8E2] transition-all" />
                      </div>
                      {errors.storeName && <p className="text-[9px] text-red-500">{errors.storeName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Phone Number (Pakistan)</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                        <input {...register('phoneNumber')} placeholder="03001234567"
                          className="w-full bg-[#1A1A1A]/5 p-4 pl-12 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-[#EAE8E2] transition-all font-mono" />
                      </div>
                      {errors.phoneNumber && <p className="text-[9px] text-red-500">{errors.phoneNumber.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Store Description (Optional)</label>
                      <textarea {...register('storeDescription')} placeholder="Describe your brand essence..."
                        className="w-full bg-[#1A1A1A]/5 p-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-[#EAE8E2] transition-all min-h-[120px]" />
                      {errors.storeDescription && <p className="text-[9px] text-red-500">{errors.storeDescription.message}</p>}
                    </div>
                  </div>
                  <Button type="button" onClick={handleNext} className="w-full h-14 text-[10px] font-bold uppercase tracking-[0.4em]">
                    Continue <ArrowRight size={16} className="ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-left">
                  <div className="space-y-6">
                    {fields.map((field, idx) => (
                      <div key={field.id} className="bg-[#1A1A1A]/5 p-6 border border-[#1A1A1A]/5 space-y-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="opacity-40" />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Address Node {idx + 1}</span>
                          </div>
                          {fields.length > 1 && (
                            <button type="button" onClick={() => remove(idx)} className="text-red-500 opacity-40 hover:opacity-100 transition-opacity">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Street Line</label>
                            <input {...register(`addresses.${idx}.line`)}
                              className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none" />
                            {errors.addresses?.[idx]?.line && <p className="text-[9px] text-red-500">{errors.addresses[idx]?.line?.message}</p>}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">City</label>
                              <select {...register(`addresses.${idx}.city`)}
                                className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none">
                                <option value="">Select</option>
                                {pakistaniCities.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                              </select>
                              {errors.addresses?.[idx]?.city && <p className="text-[9px] text-red-500">{errors.addresses[idx]?.city?.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Province / State</label>
                              <input {...register(`addresses.${idx}.state`)}
                                className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none" />
                              {errors.addresses?.[idx]?.state && <p className="text-[9px] text-red-500">{errors.addresses[idx]?.state?.message}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Postal Code</label>
                              <input {...register(`addresses.${idx}.postalCode`)}
                                className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none font-mono" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Country</label>
                              <input value="Pakistan" disabled
                                className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-[10px] font-bold uppercase tracking-widest outline-none opacity-40" />
                            </div>
                          </div>

                          <label className="flex items-center gap-3 cursor-pointer group pt-2">
                            <button type="button" onClick={() => setDefault(idx)}
                              className={cn("w-5 h-5 flex items-center justify-center transition-all",
                                watch(`addresses.${idx}.isDefault`) ? "bg-[#1A1A1A] text-white" : "border border-[#1A1A1A]/20"
                              )}>
                              {watch(`addresses.${idx}.isDefault`) && <Check size={12} />}
                            </button>
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Primary Operational Address</span>
                          </label>
                        </div>
                      </div>
                    ))}

                    {errors.addresses?.root && <p className="text-[9px] text-red-500">{errors.addresses.root.message}</p>}

                    <button type="button" onClick={() => append({ line: '', city: '', state: '', country: 'Pakistan', isDefault: false })}
                      className="w-full py-4 border border-dashed border-[#1A1A1A]/20 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:border-[#1A1A1A] transition-all flex items-center justify-center gap-2">
                      <Plus size={14} /> Add Secondary Location
                    </button>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={handleBack} className="flex-1">Back</Button>
                    <Button type="button" onClick={handleNext} className="flex-[2] h-14 text-[10px] font-bold uppercase tracking-[0.4em]">
                      Next Step<ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-left">
                  <div className="bg-[#1A1A1A] text-white p-10 space-y-8">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-6">Manifest Summary</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Store</span>
                          <span className="text-sm font-heading italic">{watched.storeName || 'Unnamed Entity'}</span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Contact</span>
                          <span className="text-sm font-mono opacity-60">{watched.phoneNumber || 'Not Provided'}</span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Locations</span>
                          <span className="text-sm font-bold">{fields.length} Address{fields.length > 1 ? 'es' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/5 flex items-start gap-4">
                      <CheckCircle2 className="text-green-500 mt-1" size={16} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Verification Ready</p>
                        <p className="text-[9px] opacity-40 italic mt-1">Your data has been formatted for the Rift registry.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-1">
                      <input type="checkbox" id="verify" className="w-4 h-4 border-[#1A1A1A]/10 text-[#1A1A1A] focus:ring-0" />
                      <label htmlFor="verify" className="text-[10px] font-bold uppercase tracking-widest opacity-40 cursor-pointer">
                        I verify all data is authentic and complies with partner protocols.
                      </label>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handleBack} className="flex-1">Edit</Button>
                      <Button type="submit" disabled={isLoading}
                        className="flex-[2] h-14 text-[10px] font-bold uppercase tracking-[0.4em] bg-green-600 text-white hover:bg-green-700">
                        {isLoading ? 'Submitting...' : 'Submit Registration'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};