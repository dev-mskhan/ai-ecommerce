import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

const roleHome: Record<string, string> = { admin: '/admin', vendor: '/vendor', buyer: '/' };

export const UnauthorizedPage = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector(s => s.auth);

    return (
        <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center px-6">
            <div className="text-center space-y-10 max-w-md">
                <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-30">Error 403</p>
                    <h1 className="text-6xl lg:text-8xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Access Denied
                    </h1>
                    <p className="text-sm font-light italic text-[#1A1A1A]/50 leading-relaxed">
                        You don't have permission to view this page.
                    </p>
                </div>
                <button
                    onClick={() => navigate(roleHome[(user as any)?.role ?? ''] ?? '/')}
                    className="px-10 py-4 bg-[#1A1A1A] text-[#FDFCF8] text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};