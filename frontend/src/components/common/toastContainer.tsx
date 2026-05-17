import React from 'react';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils/helpers';

export const CustomToasterContent: React.FC = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                className: 'rounded-none border-0 shadow-2xl bg-[#1A1A1A] text-[#FDFCF8] p-0 font-sans',
                style: {
                    borderRadius: '0px',
                    background: '#1A1A1A',
                    color: '#FDFCF8',
                },
            }}
        >
            {(t) => (
                <ToastBar toast={t} style={{ padding: 0, margin: 0, background: 'transparent', boxShadow: 'none' }}>
                    {({ icon, message }) => {
                        // Determine type based on custom data or default types
                        const type = (t as any).type;
                        const isSuccess = type === 'success';
                        const isError = type === 'error';
                        const isWarning = (t as any).variant === 'warning';
                        const isInfo = (t as any).variant === 'info' || type === 'blank';
                        const isLoading = type === 'loading';

                        return (
                            <div
                                className={cn(
                                    "flex items-stretch min-w-[320px] bg-[#1A1A1A] border-l-4 shadow-[20px_20px_60px_rgba(0,0,0,0.3)]",
                                    isSuccess && "border-green-500",
                                    isError && "border-red-600",
                                    isWarning && "border-amber-500",
                                    isInfo && "border-blue-500",
                                    isLoading && "border-white/20",
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-12 border-r border-white/5",
                                    isSuccess && "bg-green-500/10",
                                    isError && "bg-red-600/10",
                                    isWarning && "bg-amber-500/10",
                                    isInfo && "bg-blue-500/10",
                                    isLoading && "bg-white/5",
                                )}>
                                    {isSuccess && <CheckCircle2 size={18} className="text-green-500" />}
                                    {isError && <AlertCircle size={18} className="text-red-600" />}
                                    {isWarning && <AlertTriangle size={18} className="text-amber-500" />}
                                    {isInfo && <Info size={18} className="text-blue-500" />}
                                    {isLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />}
                                </div>

                                <div className="flex-1 p-4">
                                    <div className="text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                                        {message}
                                    </div>
                                </div>

                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="w-12 flex items-center justify-center text-[#FDFCF8]/20 hover:text-white transition-colors border-l border-white/5 hover:bg-white/5"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        );
                    }}
                </ToastBar>
            )}
        </Toaster>
    );
};

// Export a helper for easier themed toasts
export const riftToast = {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    warning: (msg: string) => toast(msg, {
        icon: null,
        variant: 'warning'
    } as any),
    info: (msg: string) => toast(msg, {
        icon: null,
        variant: 'info'
    } as any),
    loading: (msg: string) => toast.loading(msg),
    dismiss: (id?: string) => toast.dismiss(id),
};

