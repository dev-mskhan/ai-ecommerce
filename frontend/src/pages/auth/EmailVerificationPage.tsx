import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/hooks/useAuth';
import toast from 'react-hot-toast';

export const EmailVerificationPage: React.FC = () => {
  const [status, setStatus] = useState<'pending' | 'verifying' | 'success'>('pending');
  const navigate = useNavigate();
  const { verifyEmail, verifyState } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  useEffect(() => {
    if (token) {
      setStatus('verifying');
      (async () => {
        try {
          await verifyEmail({ token }).unwrap();
          setStatus('success');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } catch {
          setStatus('pending');
          toast.error("Verification failed");
          navigate('/signup', { replace: true });
        }
      })()

    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <AnimatePresence mode="wait">
          {status === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 bg-[#1A1A1A]/5 flex items-center justify-center mx-auto">
                <Mail size={40} className="opacity-20" />
              </div>
              <div>
                <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase mb-4">
                  Verify<br />
                  <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">
                    EMAIL ADDRESS
                  </span>
                </h1>
                <p className="text-sm font-light text-[#1A1A1A]/60 italic leading-relaxed">
                  A verification link has been sent to your email address. Please confirm your identity to continue.
                </p>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-30">Didn't receive the link? <button className="hover:line-through text-[#1A1A1A]">Resend Link</button></p>
            </motion.div>
          )}

          {status === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <Loader2 size={48} className="mx-auto animate-spin opacity-20" />
              <div>
                <h2 className="text-2xl font-heading font-black italic tracking-tighter uppercase mb-2">Verifying your account...</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Please wait while we verify your account</p>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase mb-4">Account Verified <br /></h1>
                <p className="text-sm font-light text-[#1A1A1A]/60 italic">
                  Your account is now verified. Redirecting to your dashboard...
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
