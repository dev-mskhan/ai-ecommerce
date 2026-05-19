import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Camera, Save, Shield, Store, Phone, MapPin, Plus, Trash2, Check, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { useGetVendorProfileQuery, useUpdateVendorMutation } from '@/store/api/vendorApi';
import { riftToast } from '@/components/common/toastContainer';

interface Address {
  line: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
}

interface SettingsFormValues {
  storeName: string;
  storeDescription: string;
  phoneNumber: string;
  addresses: Address[];
}

const CITY_OPTIONS = [
  { label: 'Karachi', value: 'karachi' },
  { label: 'Lahore', value: 'lahore' },
  { label: 'Islamabad', value: 'islamabad' },
  { label: 'Faisalabad', value: 'faisalabad' },
  { label: 'Rawalpindi', value: 'rawalpindi' },
  { label: 'Multan', value: 'multan' },
  { label: 'Peshawar', value: 'peshawar' },
  { label: 'Quetta', value: 'quetta' },
];

export const VendorSettingsPage: React.FC = () => {
  const { data: profileData, isLoading: profileLoading } = useGetVendorProfileQuery();
  const [updateVendor, { isLoading: saving }] = useUpdateVendorMutation();

  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const profile = profileData?.data;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormValues>({
    defaultValues: {
      storeName: '',
      storeDescription: '',
      phoneNumber: '',
      addresses: [{ line: '', city: '', state: '', postalCode: '', country: 'Pakistan', isDefault: true }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: 'addresses' });

  React.useEffect(() => {
    if (profile) {
      reset({
        storeName: profile.storeName ?? '',
        storeDescription: profile.storeDescription ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        addresses: profile.addresses?.length
          ? profile.addresses
          : [{ line: '', city: '', state: '', postalCode: '', country: 'Pakistan', isDefault: true }],
      });
      if (profile.storeAvatar) setAvatarPreview(profile.storeAvatar);
    }
  }, [profile, reset]);

  const setDefault = (targetIdx: number) => {
    fields.forEach((_, i) => {
      update(i, { ...fields[i], isDefault: i === targetIdx });
    });
  };

  const onSubmit = async (values: SettingsFormValues) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    // Validate exactly one default address
    const defaultCount = values.addresses.filter((a) => a.isDefault).length;
    if (defaultCount !== 1) {
      setErrorMsg('Exactly one address must be set as default.');
      return;
    }

    const fd = new FormData();
    fd.append('storeName', values.storeName);
    fd.append('storeDescription', values.storeDescription ?? '');
    fd.append('phoneNumber', values.phoneNumber);
    fd.append('addresses', JSON.stringify(values.addresses));
    if (avatarFile) fd.append('avatar', avatarFile);

    await riftToast.promise(updateVendor(fd).unwrap(), {
      loading: 'Saving changes...',
      success: 'Profile updated successfully.',
      error: 'Failed to update profile.',
    });
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin opacity-30" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-14">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Store Settings</div>
          <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
            Profile <br />
            <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Settings</span>
          </h1>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="flex items-center gap-2 px-7 py-4 bg-[#1A1A1A] text-[#FDFCF8] text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      {successMsg && (
        <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 border border-green-100">
          <CheckCircle2 size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 border border-red-100">
          <AlertCircle size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
          {/* Left: Avatar + status */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Store Photo</p>
              <div className="relative group w-44 h-44">
                <div className="w-full h-full bg-[#1A1A1A]/5 border-2 border-dashed border-[#1A1A1A]/10 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} className="w-full h-full object-cover grayscale" alt="Store avatar" />
                  ) : (
                    <Store size={40} className="opacity-20" />
                  )}
                </div>
                <label className="absolute inset-0 bg-[#1A1A1A]/80 text-[#FDFCF8] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer">
                  <Camera size={18} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-center px-3">Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setAvatarFile(f);
                        setAvatarPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="p-7 bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 space-y-4">
              <div className="flex items-center gap-3 text-green-600">
                <Shield size={15} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {profile?.isApproved ? 'Verified Vendor' : 'Pending Approval'}
                </span>
              </div>
              <p className="text-[9px] font-mono leading-relaxed opacity-40 uppercase">
                Member since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '—'}.
                {profile?.isApproved ? ' Verified account.' : ' Awaiting admin review.'}
              </p>
            </div>
          </div>

          {/* Right: Form fields */}
          <div className="lg:col-span-8 space-y-14">
            {/* Store Info */}
            <section className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 border-b border-[#1A1A1A]/5 pb-3">
                Store Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Store Name *</label>
                  <input
                    {...register('storeName', { required: 'Store name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                    className={cn(
                      'w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-medium focus:bg-[#1A1A1A]/10 transition-colors',
                      errors.storeName ? 'ring-1 ring-red-400' : '',
                    )}
                  />
                  {errors.storeName && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.storeName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Phone Number *</label>
                  <input
                    {...register('phoneNumber', {
                      required: 'Phone is required',
                      pattern: { value: /^(\+92|0)3[0-9]{9}$/, message: 'Invalid Pakistani number' },
                    })}
                    placeholder="03001234567"
                    className={cn(
                      'w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-mono focus:bg-[#1A1A1A]/10 transition-colors',
                      errors.phoneNumber ? 'ring-1 ring-red-400' : '',
                    )}
                  />
                  {errors.phoneNumber && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.phoneNumber.message}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Store Description</label>
                  <textarea
                    {...register('storeDescription')}
                    maxLength={500}
                    rows={4}
                    className="w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-medium h-28 focus:bg-[#1A1A1A]/10 transition-colors resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Addresses */}
            <section className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 border-b border-[#1A1A1A]/5 pb-3">
                Store Addresses
              </h3>

              <div className="space-y-5">
                {fields.map((field, idx) => (
                  <div key={field.id} className="bg-[#1A1A1A]/5 p-6 space-y-5 border border-[#1A1A1A]/5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="opacity-40" />
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Address {idx + 1}</span>
                      </div>
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(idx)} className="text-red-500 opacity-40 hover:opacity-100 transition-opacity">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Street Address</label>
                      <input
                        {...register(`addresses.${idx}.line`, { required: true })}
                        className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-sm outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">City</label>
                        <Controller
                          control={control}
                          name={`addresses.${idx}.city`}
                          render={({ field: f }) => (
                            <CustomDropdown options={CITY_OPTIONS} value={f.value} onChange={f.onChange} className="bg-white" />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Province</label>
                        <input
                          {...register(`addresses.${idx}.state`, { required: true })}
                          className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Postal Code</label>
                        <input
                          {...register(`addresses.${idx}.postalCode`)}
                          className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-sm font-mono outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Country</label>
                        <input
                          value="Pakistan"
                          disabled
                          className="w-full bg-white border border-[#1A1A1A]/5 p-3 text-sm outline-none opacity-40"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group pt-1">
                      <button
                        type="button"
                        onClick={() => setDefault(idx)}   // pass idx here
                        className={cn(
                          'w-5 h-5 flex items-center justify-center transition-all',
                          field.isDefault ? 'bg-[#1A1A1A] text-white' : 'border border-[#1A1A1A]/20',
                        )}
                      >
                        {field.isDefault && <Check size={11} />}
                      </button>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                        Set as Default Address
                      </span>
                    </label>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => append({ line: '', city: '', state: '', postalCode: '', country: 'Pakistan', isDefault: false })}
                  className="w-full py-4 border border-dashed border-[#1A1A1A]/20 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:border-[#1A1A1A] transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={13} /> Add Address
                </button>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
};
