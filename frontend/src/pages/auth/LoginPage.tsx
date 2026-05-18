import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from '@/components/ui/Typography';
import { useAuth } from '@/store/hooks/useAuth';
import toast from 'react-hot-toast';
import poster1 from "@assets/poster-1.avif"
import { riftToast } from '@/components/common/toastContainer';
const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[!.@#$%^&*]/, "Must contain a special character"),
});
type LoginInput = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginState } = useAuth();
  const { handleSubmit, register, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });
  const navigate = useNavigate();
  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await login(data).unwrap();
      riftToast.success("Login Successful");
      console.log(res);
      const home = { admin: '/admin', vendor: '/vendor', buyer: '/' };
      navigate(home[(res as any)?.data?.role as keyof typeof home] ?? '/', { replace: true });
    } catch {
      riftToast.error("Login Failed");
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
              <Link to="/" className="flex gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors">
                <ArrowLeft size={14} />
                Back to Home
              </Link>
            </nav>
            <div className="mb-10">
              <h1 className="text-4xl lg:text-4xl font-heading font-black italic tracking-tighter uppercase leading-none mb-2 text-left">
                Welcome Back <br /> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40 text-left">Login to Continue</span>
              </h1>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={16} />
                  <input
                    type="email"
                    placeholder="email@gmail.com"
                    className="w-full bg-[#1A1A1A]/5 border-none p-4 pl-12 text-[12px] font-medium tracking-widest outline-none focus:bg-[#EAE8E2] transition-all"
                    {...register("email")}
                  />
                </div>
                {errors.email && <Text variant="error">{errors.email.message}</Text>}
              </div>

              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Password</label>
                  <Link to="/forgot-password" className="text-[9px] text-[#1A1A1A]/40 font-medium uppercase tracking-widest hover:text-[#1A1A1A]">Forgot Password</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1A1A]/5 border-none p-4 pl-12 text-[12px] font-medium tracking-widest outline-none focus:bg-[#EAE8E2] transition-all"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {errors.password && <Text variant="error">{errors.password.message}</Text>}
              </div>

              <div className="flex items-center gap-4 py-4 px-1">
                <input type="checkbox" id="remember" className="w-4 h-4 border-[#1A1A1A]/10 rounded-none text-[#1A1A1A] focus:ring-0" />
                <label htmlFor="remember" className="text-[10px] font-bold uppercase tracking-widest opacity-40 cursor-pointer">Remember Me</label>
              </div>

              <Button type="submit" className="w-full h-14 text-[10px] font-bold uppercase tracking-[0.4em] bg-[#1A1A1A] text-[#FDFCF8] hover:bg-black transition-all">
                {loginState.isLoading ? <Loader2 size={16} className="ml-2 animate-spin" /> : <>
                  Login
                  <ArrowRight size={16} className="ml-2" />
                </>}
              </Button>
            </form>

            <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-40">
              New here? <Link to="/signup" className="font-bold text-[#1A1A1A] hover:underline">Register Now</Link>
            </p>
          </div>
        </div>

        {/* Right: Illustration/Photo */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#1A1A1A]">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src={poster1}
            alt="broadcasting"
            className="absolute inset-0 w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-left">
            <div className="w-12 h-px bg-white/40 mb-8"></div>
            <h2 className="text-4xl font-heading font-black italic text-white uppercase tracking-tighter leading-none mb-4">
              Shopping <br /> with <br /> Confidence
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 max-w-xs">
              Connecting you to the verified vendors and products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
