import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Ticket } from 'lucide-react';
import { useCartStore } from '@store/zustand/cartStore';
import { formatPrice, cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useCouponActions } from '@/store/hooks/useCoupon';

export const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [coupon, setCoupon] = React.useState('');
  const [appliedDiscount, setAppliedDiscount] = React.useState(0);
  const navigate = useNavigate();

  const subtotal = getTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const total = subtotal + shipping - discountAmount;
  const { apply } = useCouponActions();
  const [applyCoupon, { isLoading: isApplying, error, isSuccess, data }] = apply;

  console.log(items);
  const handleApplyCoupon = async () => {
    if (!coupon) {
      toast.error("Please enter a coupon code");
      return;
    }
    const { data } = await applyCoupon({ code: coupon, orderAmount: total });
    console.log(data);
    if (isSuccess) {
      toast.success('Coupon applied successfully');
      setAppliedDiscount(Number(data));
    } else {
      toast.error("Failed to apply coupon");
      return;
    }

  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 text-center space-y-12">
        <div className="w-24 h-24 border border-[#1A1A1A]/10 flex items-center justify-center mx-auto opacity-20">
          <ShoppingBag size={48} strokeWidth={1} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-heading font-black italic tracking-tighter uppercase">Cart Empty</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 max-w-sm mx-auto">No items in cart</p>
        </div>
        <Link to="/category/all-items" className="inline-block">
          <Button variant="outline" className="px-12 py-6">Back to Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      <header className="mb-10 border-b border-[#1A1A1A]/10 pb-12">
        <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
          Cart  <br /> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Products ({items.length})</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="space-y-1 bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
            {items.map((item) => (
              <div key={`${item.id}-${item.variant}`} className="bg-[#FDFCF8] p-8 flex flex-col sm:flex-row items-center gap-8 group hover:bg-[#EAE8E2] transition-colors">
                <div className="w-32 h-40 bg-[#1A1A1A]/5 flex items-center justify-center overflow-hidden border border-[#1A1A1A]/5">
                  <img src={item.images?.[0]} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all" alt={item.name} />
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{item.vendorName}</p>
                  <h3 className="text-xl font-heading font-medium italic">{item.name}</h3>
                  {item.variant && <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Spec: {item.variant}</p>}
                  <p className="text-lg font-bold tracking-tight">{formatPrice(item.discountPrice * item.quantity)}</p>
                </div>

                <div className="flex items-center gap-12">
                  <div className="flex items-center border border-[#1A1A1A]/10 bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-mono text-sm font-bold">{item.quantity < 10 ? `0${item.quantity}` : item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.variant)}
                    className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center opacity-20 hover:opacity-100 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-10 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Ticket size={16} className="opacity-40" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Coupon Protocol</p>
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="ENTER CODE (e.g. RIFT10)"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 bg-white border border-[#1A1A1A]/10 p-4 font-mono text-xs uppercase tracking-widest outline-none focus:border-[#1A1A1A] transition-all"
              />
              <Button
                onClick={handleApplyCoupon}
                variant="outline"
                className="px-8"
              >
                Apply
              </Button>
            </div>
            {appliedDiscount > 0 && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">Protocol Accepted: {appliedDiscount}% Reduction Locked.</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <div className="bg-[#FDFCF8] border border-[#1A1A1A] p-10 space-y-12">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.5em] opacity-70 border-b border-[#1A1A1A]/10 pb-4">Order Summary</h3>

            <div className="space-y-6">
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold uppercase tracking-widest opacity-40">Subtotal</span>
                <span className="text-lg font-bold tracking-tight">{formatPrice(subtotal).replace('Rs. ', '')}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold uppercase tracking-widest opacity-40">Protocol Discount</span>
                <span className="text-lg font-bold tracking-tight text-green-600">-{formatPrice(discountAmount).replace('Rs. ', '')}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold uppercase tracking-widest opacity-40">Shipping</span>
                <span className={cn("text-lg font-bold tracking-tight", shipping === 0 ? "text-green-600" : "")}>
                  {shipping === 0 ? '0.00' : formatPrice(shipping).replace('Rs. ', '')}
                </span>
              </div>
              <div className="pt-6 border-t border-[#1A1A1A]/10 flex justify-between items-start">
                <span className="pt-2 text-[10px] font-bold uppercase tracking-[0.3em]">Total Amount</span>
                <span className="text-3xl font-heading font-black tracking-tighter">{formatPrice(total).replace('Rs. ', '')}</span>
              </div>
              <p className="text-[9px] font-mono opacity-40 uppercase text-right">Currency: PKR / Tax: <span className="text-green-600">0.00</span></p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full h-16 text-[10px] font-bold uppercase tracking-[0.4em]"
              >
                Proceed to Checkout
                <ArrowRight size={16} className="ml-4" />
              </Button>
              <Link to="/category/all-items" className="block text-center pt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:line-through transition-all">Resume Search</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

