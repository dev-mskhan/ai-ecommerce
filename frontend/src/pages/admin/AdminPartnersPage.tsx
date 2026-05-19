import React from 'react';
import { Eye } from 'lucide-react';
import { cn, formatPrice } from '@/utils/helpers';
import {
    useGetAllVendorsQuery,
    useApproveVendorMutation,
    useRejectVendorMutation,
    useBanVendorMutation,
} from '@store/api/adminApi';
import { riftToast } from '@/components/common/toastContainer';

export const AdminPartnersPage: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState('All');
    const [rejectReason, setRejectReason] = React.useState('');
    const [rejectTarget, setRejectTarget] = React.useState<string | null>(null);

    const { data, isLoading } = useGetAllVendorsQuery();
    const [approveVendor] = useApproveVendorMutation();
    const [rejectVendor, { isLoading: rejecting }] = useRejectVendorMutation();
    const [banVendor] = useBanVendorMutation();

    const allVendors: any[] = data?.data?.vendors ?? [];

    const filtered = allVendors.filter((v: any) => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Pending') return !v.isApproved && !v.isBanned;
        if (activeTab === 'Banned') return v.isBanned;
        return true;
    });

    const handleApprove = async (id: string) => {
        await riftToast.promise(approveVendor(id).unwrap(), {
            loading: 'Approving Vendor...',
            success: 'Vendor Approved Successfully!',
            error: 'Failed to approve vendor',
        })
    };

    const handleReject = async () => {
        if (!rejectTarget || !rejectReason.trim()) return;
        await riftToast.promise(rejectVendor({ id: rejectTarget, reason: rejectReason }).unwrap(), {
            loading: 'Rejecting Vendor...',
            success: 'Vendor Rejected Successfully!',
            error: 'Failed to reject vendor',
        })
        setRejectTarget(null);
        setRejectReason('');
    };

    const handleBan = async (id: string, isBanned: boolean) => {
        await riftToast.promise(banVendor(id).unwrap(), {
            loading: isBanned ? 'Banning Vendor...' : 'Unbanning Vendor...',
            success: isBanned ? 'Vendor Banned Successfully!' : 'Vendor Unbanned Successfully!',
            error: isBanned ? 'Failed to ban vendor' : 'Failed to unban vendor',
        });
    };

    const getStatus = (v: any) => {
        if (v.isBanned) return 'BANNED';
        if (v.isApproved) return 'APPROVED';
        return 'PENDING';
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Vendor Management</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Vendors <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">All Partners</span>
                    </h1>
                </div>
            </header>

            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest border-b border-[#1A1A1A]/5 pb-4">
                {['All', 'Pending', 'Banned'].map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveTab(f)}
                        className={cn("transition-all hover:opacity-100", activeTab === f ? "opacity-100 border-b border-[#1A1A1A] pb-4 -mb-4.5" : "opacity-40")}
                    >
                        {f} ({f === 'All' ? allVendors.length : f === 'Pending' ? allVendors.filter((v: any) => !v.isApproved && !v.isBanned).length : allVendors.filter((v: any) => v.isBanned).length})
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="text-[10px] font-mono opacity-30 py-10">Loading vendors...</div>
            ) : (
                <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
                    <div className="bg-[#FDFCF8] p-6 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">
                        <div className="w-16">Logo</div>
                        <div className="flex-1 px-8">Vendor</div>
                        <div className="w-28 hidden md:block text-center">Products</div>
                        <div className="w-44 hidden lg:block text-right">Total Sales</div>
                        <div className="w-28 text-center">Status</div>
                        <div className="w-56"></div>
                    </div>

                    {filtered.map((vendor: any) => {
                        const status = getStatus(vendor);
                        return (
                            <div key={vendor._id} className="bg-[#FDFCF8] p-6 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
                                <div className="w-16 h-16 bg-[#1A1A1A]/5 grayscale flex items-center justify-center border border-[#1A1A1A]/5 overflow-hidden">
                                    {vendor.storeAvatar
                                        ? <img src={vendor.storeAvatar} className="w-full h-full object-cover" alt="" />
                                        : <span className="text-xl font-black opacity-20">{(vendor.storeName ?? vendor.name ?? 'V')[0]}</span>
                                    }
                                </div>

                                <div className="flex-1 px-8">
                                    <h3 className="text-base font-heading font-medium italic mb-1">{vendor.storeName ?? vendor.name}</h3>
                                    <p className="text-[10px] font-mono opacity-40 lowercase">{vendor.email}</p>
                                </div>

                                <div className="w-28 hidden md:block text-center font-bold tracking-tighter text-base">
                                    {vendor.totalProducts ?? '—'}
                                </div>

                                <div className="w-44 hidden lg:block text-right">
                                    <span className="text-lg font-bold tracking-tight">
                                        {vendor.totalSales ? formatPrice(vendor.totalSales).replace('Rs. ', '') : '—'}
                                    </span>
                                </div>

                                <div className="w-28 flex justify-center">
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest px-3 py-1 border",
                                        status === 'APPROVED' ? "border-green-600/30 text-green-700 bg-green-50" :
                                            status === 'PENDING' ? "border-amber-600/30 text-amber-700 bg-amber-50" :
                                                "border-red-600/30 text-red-700 bg-red-50"
                                    )}>
                                        {status}
                                    </span>
                                </div>

                                <div className="w-56 flex justify-end gap-2">
                                    {status === 'PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => handleApprove(vendor._id)}
                                                className="px-3 py-1 border border-green-600/20 text-green-700 text-[9px] font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
                                            >Approve</button>
                                            <button
                                                onClick={() => setRejectTarget(vendor._id)}
                                                className="px-3 py-1 border border-red-600/20 text-red-700 text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                            >Reject</button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleBan(vendor._id, vendor.isBanned)}
                                            className={cn(
                                                "px-3 py-1 border text-[9px] font-bold uppercase tracking-widest transition-all",
                                                vendor.isBanned
                                                    ? "border-green-600/20 text-green-600 hover:bg-green-600 hover:text-white"
                                                    : "border-red-600/20 text-red-600 hover:bg-red-600 hover:text-white"
                                            )}
                                        >
                                            {vendor.isBanned ? 'Unban' : 'Ban'}
                                        </button>
                                    )}
                                    <button className="w-9 h-9 border border-[#1A1A1A]/10 flex items-center justify-center opacity-20 hover:opacity-100 transition-all">
                                        <Eye size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-mono opacity-30">No vendors found.</div>
                    )}
                </div>
            )}

            {/* Reject Reason Modal */}
            {rejectTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FDFCF8]/90 backdrop-blur-sm">
                    <div className="bg-[#FDFCF8] border border-[#1A1A1A] w-full max-w-lg p-10 space-y-8">
                        <h2 className="text-2xl font-heading font-black italic uppercase">Reject Vendor</h2>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Reason *</label>
                            <textarea
                                rows={4}
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic resize-none"
                                placeholder="Explain the reason for rejection..."
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setRejectTarget(null)} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">Cancel</button>
                            <button
                                onClick={handleReject}
                                disabled={rejecting || !rejectReason.trim()}
                                className="px-8 py-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest disabled:opacity-40"
                            >
                                {rejecting ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};