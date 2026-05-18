import React from 'react';
import { AlertTriangle, ShieldCheck, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useGetReportedProductsQuery, useHandleReportedProductMutation } from '@store/api/adminApi';

export const AdminReportsPage: React.FC = () => {
    const { data, isLoading } = useGetReportedProductsQuery();
    const [handleReport, { isLoading: handling }] = useHandleReportedProductMutation();

    const products: any[] = data?.data ?? [];

    const doAction = async (id: string, action: 'remove' | 'dismiss') => {
        const confirm = action === 'remove'
            ? window.confirm('Permanently remove this product?')
            : true;
        if (!confirm) return;
        try { await handleReport({ id, action }).unwrap(); } catch { }
    };

    const severityLabel = (reportCount: number) => {
        if (reportCount >= 10) return 'CRITICAL';
        if (reportCount >= 5) return 'HIGH';
        return 'LOW';
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Moderation</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Reports <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Flagged Products</span>
                    </h1>
                </div>
                <div className="text-[10px] font-mono opacity-40">{products.length} flagged products</div>
            </header>

            {isLoading ? (
                <div className="text-[10px] font-mono opacity-30 py-10">Loading reported products...</div>
            ) : products.length === 0 ? (
                <div className="bg-[#FDFCF8] border border-[#1A1A1A]/10 p-16 text-center">
                    <ShieldCheck size={32} className="mx-auto mb-6 opacity-20" />
                    <p className="text-[10px] font-mono opacity-30 uppercase tracking-widest">No reported products. All clear.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                    {products.map((product: any) => {
                        const severity = severityLabel(product.reportCount ?? 0);
                        return (
                            <div key={product._id} className="bg-[#FDFCF8] p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 group hover:bg-[#EAE8E2] transition-colors">
                                <div className="flex items-center gap-8 flex-1">
                                    <div className="w-16 h-20 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 overflow-hidden relative shrink-0">
                                        {product.images?.[0] && (
                                            <img src={product.images[0]} className="w-full h-full object-cover grayscale opacity-40" alt="" />
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <AlertTriangle size={22} className={cn(
                                                "opacity-80",
                                                severity === 'CRITICAL' ? "text-red-600" :
                                                    severity === 'HIGH' ? "text-amber-600" : "text-blue-500"
                                            )} />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[9px] font-mono opacity-40 uppercase mb-1">
                                            ID: {product._id?.slice(-8).toUpperCase()} // Level: {severity} // Reports: {product.reportCount ?? 0}
                                        </p>
                                        <h3 className="text-xl font-heading font-medium italic">{product.name}</h3>
                                        <p className="mt-3 text-[10px] font-bold uppercase tracking-widest opacity-50 italic">
                                            Vendor: {product.vendor?.storeName ?? product.vendor?.name ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col lg:items-end gap-5">
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest px-3 py-1 border w-fit",
                                        severity === 'CRITICAL' ? "border-red-600/30 text-red-700 bg-red-50" :
                                            severity === 'HIGH' ? "border-amber-600/30 text-amber-700 bg-amber-50" :
                                                "border-blue-600/30 text-blue-700 bg-blue-50"
                                    )}>
                                        {severity}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => doAction(product._id, 'dismiss')}
                                            disabled={handling}
                                            className="flex items-center gap-2 px-5 py-2.5 border border-[#1A1A1A]/10 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all disabled:opacity-40"
                                        >
                                            <ShieldCheck size={13} /> Dismiss
                                        </button>
                                        <button
                                            onClick={() => doAction(product._id, 'remove')}
                                            disabled={handling}
                                            className="flex items-center gap-2 px-5 py-2.5 border border-red-600/10 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-40"
                                        >
                                            <Trash2 size={13} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};