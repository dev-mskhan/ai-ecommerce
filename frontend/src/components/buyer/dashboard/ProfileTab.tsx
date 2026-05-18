import { User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { useUserActions } from '@store/hooks/useUser';
import { useGetCurrentUserQuery } from '@store/api/userApi';
import { Link } from 'react-router-dom';
type ProfileFormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export const ProfileTab = () => {
    const { data: user, isLoading } = useGetCurrentUserQuery();
    const [update, updateState] = useUserActions().update;

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileFormValues>({
        values: {
            name: (user as any)?.name ?? '',
            email: (user as any)?.email ?? '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: ProfileFormValues) => {
        const payload: any = { name: data.name, email: data.email };
        if (data.password) payload.password = data.password;
        update(payload);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        update(formData);
    };

    if (isLoading) return <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Loading profile...</p>;

    return (
        <section className="space-y-16">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Profile Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
                <div className="md:col-span-4 space-y-8">
                    <label className="relative group w-48 h-48 block cursor-pointer">
                        <div className="w-full h-full bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 flex items-center justify-center grayscale overflow-hidden">
                            {(user as any)?.avatar ? (
                                <img src={(user as any)?.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="opacity-10" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-[#1A1A1A]/80 text-[#FDFCF8] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                            <Camera size={20} />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Update Photo</span>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                </div>

                <div className="md:col-span-8 space-y-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Full Name</label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full bg-[#1A1A1A]/5 p-4 outline-none border-none text-sm font-medium"
                                />
                                {errors.name && <p className="text-[9px] text-red-600 uppercase tracking-widest">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Email Address</label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full bg-[#1A1A1A]/5 p-4 outline-none border-none text-sm font-medium"
                                />
                                {errors.email && <p className="text-[9px] text-red-600 uppercase tracking-widest">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">New Password</label>
                                <input
                                    type="password"
                                    {...register('password', {
                                        minLength: { value: 6, message: 'Min 6 characters' },
                                    })}
                                    placeholder="Leave blank to keep current"
                                    className="w-full bg-[#1A1A1A]/5 p-4 outline-none border-none text-sm font-medium"
                                />
                                {errors.password && <p className="text-[9px] text-red-600 uppercase tracking-widest">{errors.password.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Confirm Password</label>
                                <input
                                    type="password"
                                    {...register('confirmPassword', {
                                        validate: v => !watch('password') || v === watch('password') || 'Passwords do not match',
                                    })}
                                    className="w-full bg-[#1A1A1A]/5 p-4 outline-none border-none text-sm font-medium"
                                />
                                {errors.confirmPassword && <p className="text-[9px] text-red-600 uppercase tracking-widest">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                        <Button type="submit" disabled={updateState.isLoading} className="text-[10px] uppercase font-bold tracking-widest">
                            {updateState.isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        {updateState.isSuccess && <p className="text-[9px] text-green-600 uppercase tracking-widest">Profile updated.</p>}
                        {updateState.isError && <p className="text-[9px] text-red-600 uppercase tracking-widest">Update failed.</p>}
                    </form>

                    <div className="p-10 bg-[#1A1A1A] text-[#FDFCF8] space-y-6">
                        <h3 className="text-xl font-heading font-medium italic">Become a Seller?</h3>
                        <p className="text-sm font-light opacity-60 leading-relaxed">Start selling your products on our platform today.</p>
                        <Link to="/vendor-onboarding">
                            <Button className="bg-[#FDFCF8] text-[#1A1A1A] hover:bg-[#EAE8E2] w-full text-[10px] uppercase font-bold tracking-widest">
                                Upgrade to Vendor
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};