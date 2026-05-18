import React from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, XCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import {
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useToggleCouponMutation,
} from '@store/api/couponApi';

const EMPTY_FORM = {
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    expiresAt: '',
};

export const AdminCouponsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editTarget, setEditTarget] = React.useState<any>(null);
    const [form, setForm] = React.useState(EMPTY_FORM);
    const [error, setError] = React.useState('');

    const { data, isLoading } = useGetAllCouponsQuery();
    const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
    const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();
    const [toggleCoupon] = useToggleCouponMutation();

    const coupons: any[] = data?.data ?? [];

    const openAdd = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setError('');
        setIsModalOpen(true);
    };

    const openEdit = (coupon: any) => {
        setEditTarget(coupon);
        setForm({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: String(coupon.discountValue),
            minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount) : '',
            maxDiscountAmount: coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : '',
            usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
            expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
        });
        setError('');
        setIsModalOpen(true);
    };

    const handleChange = (field: string, value: string) => {
        setForm(f => ({ ...f, [field]: value }));
    };

    const buildPayload = () => {
        const payload: any = {
            code: form.code.toUpperCase(),
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
        };
        if (form.minOrderAmount) payload.minOrderAmount = Number(form.minOrderAmount);
        if (form.maxDiscountAmount) payload.maxDiscountAmount = Number(form.maxDiscountAmount);
        if (form.usageLimit) payload.usageLimit = Number(form.usageLimit);
        if (form.expiresAt) payload.expiresAt = form.expiresAt;
        return payload;
    };

    const handleSubmit = async () => {
        setError('');
        if (form.code.length < 3) { setError('Code must be at least 3 characters.'); return; }
        if (!form.discountValue || isNaN(Number(form.discountValue))) { setError('Discount value is required.'); return; }
        if (form.discountType === 'percentage' && Number(form.discountValue) > 100) { setError('Percentage cannot exceed 100.'); return; }

        try {
            if (editTarget) {
                await updateCoupon({ id: editTarget._id, data: buildPayload() }).unwrap();
            } else {
                await createCoupon(buildPayload()).unwrap();
            }
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err?.data?.message ?? 'Something went wrong.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this coupon?')) return;
        try { await deleteCoupon(id).unwrap(); } catch { }
    };

    const handleToggle = async (id: string) => {
        try { await toggleCoupon(id).unwrap(); } catch { }
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Promotions</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Coupons <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Discount Codes</span>
                    </h1>
                </div>
                <Button onClick={openAdd} className="flex items-center gap-2">
                    <Plus size={14} /> Add Coupon
                </Button>
            </header>

            {isLoading ? (
                <div className="text-[10px] font-mono opacity-30 py-10">Loading coupons...</div>
            ) : (
                <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
                    <div className="bg-[#FDFCF8] p-6 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">
                        <div className="w-36">Code</div>
                        <div className="w-28 hidden md:block">Type</div>
                        <div className="w-24 text-center">Discount</div>
                        <div className="w-28 hidden md:block text-center">Used / Limit</div>
                        <div className="w-32 hidden lg:block text-center">Expires</div>
                        <div className="w-24 text-center">Status</div>
                        <div className="w-32"></div>
                    </div>

                    {coupons.map((coupon: any) => (
                        <div key={coupon._id} className="bg-[#FDFCF8] p-6 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
                            <div className="w-36">
                                <span className="font-mono font-black text-base tracking-widest">{coupon.code}</span>
                            </div>

                            <div className="w-28 hidden md:block">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{coupon.discountType}</span>
                            </div>

                            <div className="w-24 text-center font-bold">
                                {coupon.discountType === 'percentage'
                                    ? `${coupon.discountValue}%`
                                    : `Rs. ${coupon.discountValue}`
                                }
                            </div>

                            <div className="w-28 hidden md:block text-center">
                                <span className="text-[10px] font-mono opacity-40">
                                    {coupon.usedCount ?? 0} / {coupon.usageLimit ?? '∞'}
                                </span>
                            </div>

                            <div className="w-32 hidden lg:block text-center">
                                <span className="text-[10px] font-mono opacity-40">
                                    {coupon.expiresAt
                                        ? new Date(coupon.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                        : 'No expiry'}
                                </span>
                            </div>

                            <div className="w-24 flex justify-center">
                                <button
                                    onClick={() => handleToggle(coupon._id)}
                                    className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest px-3 py-1 border transition-all",
                                        coupon.isActive
                                            ? "border-green-600/30 text-green-700 bg-green-50 hover:opacity-70"
                                            : "border-[#1A1A1A]/10 text-[#1A1A1A]/40 hover:opacity-70"
                                    )}
                                >
                                    {coupon.isActive ? 'Active' : 'Off'}
                                </button>
                            </div>

                            <div className="w-32 flex justify-end gap-2">
                                <button
                                    onClick={() => openEdit(coupon)}
                                    className="px-3 py-1 border border-[#1A1A1A]/10 text-[9px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all opacity-40 hover:opacity-100"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="w-8 h-8 border border-red-600/10 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all opacity-20 hover:opacity-100"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {coupons.length === 0 && (
                        <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-mono opacity-30">No coupons yet. Create one to get started.</div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FDFCF8]/90 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-[#FDFCF8] border border-[#1A1A1A] w-full max-w-2xl p-12 space-y-10 relative my-8">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 opacity-40 hover:opacity-100">
                            <XCircle size={24} strokeWidth={1} />
                        </button>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">Promotions</p>
                            <h2 className="text-3xl font-heading font-black italic tracking-tighter uppercase">
                                {editTarget ? 'Edit Coupon' : 'New Coupon'}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Code *</label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={e => handleChange('code', e.target.value.toUpperCase())}
                                    maxLength={20}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-mono font-bold uppercase tracking-widest"
                                    placeholder="SAVE20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Discount Type *</label>
                                <select
                                    value={form.discountType}
                                    onChange={e => handleChange('discountType', e.target.value)}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-bold uppercase text-[10px] tracking-widest"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (Rs.)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                    Discount Value * {form.discountType === 'percentage' ? '(%)' : '(Rs.)'}
                                </label>
                                <input
                                    type="number"
                                    value={form.discountValue}
                                    onChange={e => handleChange('discountValue', e.target.value)}
                                    min={0}
                                    max={form.discountType === 'percentage' ? 100 : undefined}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-mono font-bold text-xl"
                                    placeholder="20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Min Order Amount (Rs.)</label>
                                <input
                                    type="number"
                                    value={form.minOrderAmount}
                                    onChange={e => handleChange('minOrderAmount', e.target.value)}
                                    min={0}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-mono"
                                    placeholder="Optional"
                                />
                            </div>

                            {form.discountType === 'percentage' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Max Discount (Rs.)</label>
                                    <input
                                        type="number"
                                        value={form.maxDiscountAmount}
                                        onChange={e => handleChange('maxDiscountAmount', e.target.value)}
                                        min={0}
                                        className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-mono"
                                        placeholder="Optional cap"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Usage Limit</label>
                                <input
                                    type="number"
                                    value={form.usageLimit}
                                    onChange={e => handleChange('usageLimit', e.target.value)}
                                    min={1}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-mono"
                                    placeholder="Unlimited"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Expiry Date</label>
                                <input
                                    type="date"
                                    value={form.expiresAt}
                                    onChange={e => handleChange('expiresAt', e.target.value)}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-mono"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">{error}</p>
                        )}

                        <div className="flex justify-end gap-6 pt-6 border-t border-[#1A1A1A]/5">
                            <button onClick={() => setIsModalOpen(false)} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">Cancel</button>
                            <Button onClick={handleSubmit} disabled={creating || updating} className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest">
                                {creating || updating ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Coupon'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};