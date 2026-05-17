import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Package, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const PaymentSuccessPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-[#FDFCF8] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-12"
        >
          <div className="w-24 h-24 bg-green-500/10 flex items-center justify-center mx-auto relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle2 size={48} className="text-green-600" />
            </motion.div>
            <div className="absolute inset-0 border border-[#1A1A1A]/5 scale-125"></div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
              Payment <br /> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Successful</span>
            </h1>
            <p className="text-sm font-light text-[#1A1A1A]/60 italic max-w-md mx-auto leading-relaxed">
              Your order has been placed successfully. We have sent a confirmation email to your registered address.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 max-w-lg mx-auto">
            <div className="bg-white p-6 space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-30 block">Order ID</span>
              <span className="text-xs font-mono font-bold tracking-tighter">#WB-2024-99812-X</span>
            </div>
            <div className="bg-white p-6 space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-30 block">Order Status</span>
              <span className="text-xs font-bold tracking-tight">Processing</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/account" className="w-full sm:w-auto">
              <Button className="w-full h-14 px-12 text-[10px] font-bold uppercase tracking-[0.4em] bg-[#1A1A1A] text-[#FDFCF8] hover:bg-black">
                Track Order <Package size={16} className="ml-3" />
              </Button>
            </Link>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 italic">
            Continue shopping <Link to="/categories" className="text-[#1A1A1A] underline">Browse Catalog</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
