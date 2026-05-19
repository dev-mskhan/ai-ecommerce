import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useForm } from "react-hook-form";
import { useAuth } from '@/store/hooks/useAuth';
import toast from 'react-hot-toast';
import { Text } from '@/components/ui/Typography';
import { riftToast } from '@/components/common/toastContainer';
export const ResetPasswordPage: React.FC = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'updating' | 'success'>('success');
  const navigate = useNavigate();
  const { handleSubmit, register, watch, formState: { errors } } = useForm();
  const params = useParams();
  const token = params.token;
  const { resetPassword, resetState } = useAuth();
  const password = watch("password");
  const handleReset = async (data: { password: string }) => {
    if (!data.password || data.password !== confirmPassword) return;

    try {
      setStatus('updating');
      await resetPassword({ token, password: data.password });
      setStatus("success");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      riftToast.error("Failed to reset password");
      navigate('/forgot-password');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {status !== 'success' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase mb-4">
                  New Password <br /> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Set New Password</span>
                </h1>
              </div>

              <form onSubmit={handleSubmit(handleReset)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 px-1">New Password</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 p-5 text-[10px] font-bold tracking-widest outline-none focus:bg-white focus:border-[#1A1A1A]/10 transition-all"
                        {...register('password', {
                          required: "Password is required",
                          minLength: 6,
                          pattern: /[!.@#$%^&*]/
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-all"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.password && <Text variant="error">{errors.password.message as string}</Text>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 px-1">Confirm Password</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 p-5 text-[10px] font-bold tracking-widest outline-none focus:bg-white focus:border-[#1A1A1A]/10 transition-all"
                        required
                      />
                      <Lock size={14} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-[8px] font-bold text-red-600 uppercase tracking-widest mt-2 px-1">Sequence Mismatch</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={status === 'updating' || !password || password !== confirmPassword}
                  className="w-full h-14 text-[10px] font-bold uppercase tracking-[0.4em] bg-[#1A1A1A] text-[#FDFCF8] relative overflow-hidden group"
                >
                  <span className={status === 'updating' ? 'opacity-0' : 'opacity-100'}>
                    Set New Password
                  </span>
                  {status === 'updating' && (
                    <Loader2 size={18} className="absolute inset-0 m-auto animate-spin" />
                  )}
                </Button>
              </form>

              <div className="p-6 bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A]/10 flex items-center justify-center flex-shrink-0">
                  <Lock size={14} className="opacity-40" />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest leading-none">Security Protocol</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest opacity-30 leading-normal">
                    Update will terminate all active sessions across registered devices.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 text-center"
            >
              <div className="w-24 h-24 bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase mb-4">
                  Password Updated <br />
                </h1>
                <p className="text-sm font-light text-[#1A1A1A]/60 italic">
                  Your password has been successfully reset. You can now login with your new password.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-widest opacity-40">
                <span className="w-8 h-[1px] bg-[#1A1A1A]/10"></span>
                Redirecting in 2s
                <span className="w-8 h-[1px] bg-[#1A1A1A]/10"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
