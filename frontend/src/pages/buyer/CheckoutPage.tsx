import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Watch } from 'react-hook-form';
import { Truck, ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import { useCartStore } from '@store/zustand/cartStore';
import { cn, formatPrice } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { useOrderActions } from '@/store/hooks/useOrder';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { riftToast } from '@/components/common/toastContainer';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface DeliveryForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: 'stripe' | 'cod';
}

// Payment form (inside Elements context)
const StripePaymentForm = ({ total, onBack }: { total: number; onBack: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });
    if (error) riftToast.error(error.message ?? 'Payment failed');
    setIsProcessing(false);
  };

  return (
    <div className="space-y-16">
      <div className="bg-[#1A1A1A] text-[#FDFCF8] p-12 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Stripe Secure Encryption</p>
            <h3 className="text-xl font-heading font-medium italic mt-2">Card Credentials</h3>
          </div>
          <Lock size={20} className="opacity-40" />
        </div>
        {/* Stripe mounts its own secure card UI here */}
        <div className="bg-white/5 p-6 border-b border-white/10">
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>
      </div>

      <div className="flex items-center gap-6 p-8 border border-[#1A1A1A]/10 bg-[#1A1A1A]/5">
        <ShieldCheck size={24} className="opacity-40" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption</p>
          <p className="text-[9px] font-mono opacity-40">Transaction handled via Stripe payments</p>
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-all">
          <ArrowLeft size={14} /> Back
        </button>
        <Button onClick={handlePay} disabled={isProcessing || !stripe} className="px-16 h-16 text-[10px] uppercase tracking-widest font-bold">
          {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
};

// Main page 
export const CheckoutPage: React.FC = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = React.useState<'delivery' | 'payment'>('delivery');
  const [clientSecret, setClientSecret] = React.useState('');
  const navigate = useNavigate();
  const { create } = useOrderActions();
  const [createOrder, { isLoading }] = create;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<DeliveryForm>();

  const subtotal = getTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  if (items.length === 0) { navigate('/cart'); return null; }

  const onDeliverySubmit = async (data: DeliveryForm) => {
    try {
      const res = await createOrder({
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
        items: items.map(item => ({ product: item.id, quantity: item.quantity, price: item.price })),
        totalAmount: total,
        paymentMethod: data.paymentMethod,
      }).unwrap();

      if (data.paymentMethod === 'cod') {
        clearCart();
        navigate('/payment-success');
        return;
      }

      setClientSecret(res.data.clientSecret);
      setStep('payment');
    } catch {
      riftToast.error('Failed to create order, try again.');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <header className="mb-10 border-b border-[#1A1A1A]/10 pb-8">
        <button
          onClick={() => step === 'delivery' ? navigate('/cart') : setStep('delivery')}
          className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-all mb-8"
        >
          <ArrowLeft size={14} /> Back to {step === 'delivery' ? 'Cart' : 'Delivery'}
        </button>
        <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
          {step === 'delivery' ? 'Delivery' : 'Payment'}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-8">
          {step === 'delivery' ? (
            <form onSubmit={handleSubmit(onDeliverySubmit)} className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Full Name</label>
                  <input {...register('fullName', { required: 'Required' })}
                    placeholder="E.g. Elias Thorne"
                    className="w-full bg-[#1A1A1A]/5 p-6 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic" />
                  {errors.fullName && <p className="text-[9px] text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Phone Number</label>
                  <input {...register('phone', { required: 'Required' })}
                    placeholder="0300 1234567"
                    className="w-full bg-[#1A1A1A]/5 p-6 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic" />
                  {errors.phone && <p className="text-[9px] text-red-500">{errors.phone.message}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Street Address</label>
                  <input {...register('addressLine1', { required: 'Required' })}
                    placeholder="House #, Street, Area..."
                    className="w-full bg-[#1A1A1A]/5 p-6 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic" />
                  {errors.addressLine1 && <p className="text-[9px] text-red-500">{errors.addressLine1.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">City</label>
                  <input {...register('city', { required: 'Required' })}
                    placeholder="Karachi"
                    className="w-full bg-[#1A1A1A]/5 p-6 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic" />
                  {errors.city && <p className="text-[9px] text-red-500">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">State / Province</label>
                  <input {...register('state', { required: 'Required' })}
                    placeholder="Sindh"
                    className="w-full bg-[#1A1A1A]/5 p-6 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic" />
                  {errors.state && <p className="text-[9px] text-red-500">{errors.state.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Postal Code</label>
                  <input {...register('postalCode', { required: 'Required' })}
                    placeholder="74000"
                    className="w-full bg-[#1A1A1A]/5 p-6 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic" />
                  {errors.postalCode && <p className="text-[9px] text-red-500">{errors.postalCode.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Country</label>
                  <input {...register('country', { required: 'Required' })}
                    placeholder="Pakistan"
                    className="w-full bg-[#1A1A1A]/5 p-6 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic" />
                  {errors.country && <p className="text-[9px] text-red-500">{errors.country.message}</p>}
                </div>

                {/* Payment Method */}
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'stripe', label: 'Credit / Debit Card', sub: 'Powered by Stripe' },
                      { value: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive' },
                    ].map(opt => (
                      <label key={opt.value}
                        className={cn(
                          "flex flex-col gap-1 p-6 border cursor-pointer transition-all",
                          watch('paymentMethod') === opt.value ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFCF8]" : "border-[#1A1A1A]/10 hover:border-[#1A1A1A]/40"
                        )}>
                        <input type="radio" value={opt.value} {...register('paymentMethod', { required: true })} className="hidden" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">{opt.label}</span>
                        <span className="text-[9px] font-mono opacity-40">{opt.sub}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <Button type="submit" disabled={isLoading} className="px-16 h-16 text-[10px] uppercase tracking-widest font-bold">
                  {isLoading ? 'Creating Order...' : 'Proceed to Payment'}
                </Button>
              </div>
            </form>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
              <StripePaymentForm total={total} onBack={() => setStep('delivery')} />
            </Elements>
          ) : (
            <div className="animate-pulse h-64 bg-[#1A1A1A]/5" />
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="bg-[#FDFCF8] border border-[#1A1A1A] p-7 space-y-8">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] opacity-60 border-b border-[#1A1A1A]/10 pb-4">Order Breakdown</h3>
            <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-[12px] font-bold uppercase truncate">{item.name}</p>
                    <p className="text-[11px] font-mono opacity-40 italic">QTY: {item.quantity}</p>
                  </div>
                  <span className="text-[12px] font-bold">{formatPrice((item.discountPrice ?? item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-[#1A1A1A]/10 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold uppercase tracking-widest opacity-80">Sub Total</span>
                <span className="text-sm font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold uppercase tracking-widest opacity-80">Shipping</span>
                <span className="text-sm font-bold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="pt-8 flex justify-between items-end border-t border-[#1A1A1A]/5">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Grand Total</span>
                <span className="text-3xl font-heading font-black tracking-tighter">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};