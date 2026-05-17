import React from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Text } from '@/components/ui/Typography';
import poster2 from "@assets/poster-2.avif"
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).trim(),
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[.!@#$%^&*]/, "Must contain a special character"),
})
type SignUpInput = z.infer<typeof signupSchema>;
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: signup, registerState } = useAuth();
  const { handleSubmit, register, formState: { errors } } = useForm<SignUpInput>({
    resolver: zodResolver(signupSchema)
  });
  const handleSignup = async (data: SignUpInput) => {
    try {
      const res = await signup(data).unwrap();
      if (res.message) {
        navigate('/verify-email')
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col">
      {/* Navigation */}


      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
          <div className="max-w-md w-full">
            <nav className="pb-12 self-start">
              <Link to="/login" className="flex gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors">
                <ArrowLeft size={14} />
                Back to Login
              </Link>
            </nav>
            <div className="mb-12">
              <h1 className="text-4xl lg:text-4xl font-heading font-black italic tracking-tighter uppercase leading-none mb-4 text-left">
                Register Account<br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40 text-left">Enter Your Information</span>
              </h1>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(handleSignup)}>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={16} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-[#1A1A1A]/5 border-none p-4 pl-12 text-[10px] font-bold tracking-widest outline-none focus:bg-[#EAE8E2] transition-all"
                    {...register('name')}
                  />
                </div>
                {errors.name && <Text variant="error">{errors.name.message}</Text>}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={16} />
                  <input
                    type="email"
                    placeholder="email@gmail.com"
                    className="w-full bg-[#1A1A1A]/5 border-none p-4 pl-12 text-[10px] font-bold tracking-widest outline-none focus:bg-[#EAE8E2] transition-all"
                    {...register('email')}
                  />
                </div>
                {errors.email && <Text variant="error">{errors.email.message}</Text>}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={16} />
                  <input
                    type="password"
                    placeholder="Create password"
                    className="w-full bg-[#1A1A1A]/5 border-none p-4 pl-12 text-[10px] font-bold tracking-widest outline-none focus:bg-[#EAE8E2] transition-all"
                    {...register('password')}
                  />
                </div>
                {errors.password && <Text variant="error">{errors.password.message}</Text>}
              </div>

              <div className="flex items-start gap-4 py-4 px-1">
                <input type="checkbox" id="terms" className="mt-1 w-4 h-4 border-[#1A1A1A]/10 rounded-none text-[#1A1A1A] focus:ring-0" required />
                <label htmlFor="terms" className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed cursor-pointer text-left">
                  I accept the <span className="text-[#1A1A1A] underline">Terms & Conditions</span>
                </label>
              </div>

              <Button type="submit" className="w-full h-14 text-[10px] font-bold uppercase tracking-[0.4em] bg-[#1A1A1A] text-[#FDFCF8] hover:bg-black transition-all">
                {
                  registerState.isLoading ? <Loader2 size={16} className="ml-2 animate-spin" /> : <>
                    Register
                    <ArrowRight size={16} className="ml-2" />
                  </>
                }
              </Button>
            </form>

            <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-40">
              Already have an Account? <Link to="/login" className="text-[#1A1A1A] hover:underline text-left">Login Here</Link>
            </p>
          </div>
        </div>

        {/* Right: Illustration/Photo */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#1A1A1A]">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src={poster2}
            alt="future-tech"
            className="absolute inset-0 w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-left">
            <div className="w-12 h-px bg-white/40 mb-8"></div>
            <h2 className="text-4xl font-heading font-black italic text-white uppercase tracking-tighter leading-none mb-4">
              Secure <br /> Architecture
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 max-w-xs">
              Your digital footprint is protected by Shop Rift high-level encryption protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
