import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store';

const roleHome: Record<string, string> = {
    admin: '/admin',
    vendor: '/vendor',
    buyer: '/',
};

const getRoleHome = (role?: string) => roleHome[role ?? ''] ?? '/';

export const RoleRedirect = () => {
    const { isAuthenticated, user, isLoading } = useAppSelector(s => s.auth);
    if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-[2px] bg-[#1A1A1A] animate-pulse"></div></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Navigate to={getRoleHome((user as any)?.role)} replace />;
};

export const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user, isLoading } = useAppSelector(s => s.auth);
    if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-[2px] bg-[#1A1A1A] animate-pulse"></div></div>;
    if (!isAuthenticated) return <>{children}</>;
    return <Navigate to={getRoleHome((user as any)?.role)} replace />;
};

export const ProtectedRoute = ({ roles }: { roles?: string[] }) => {
    const { isAuthenticated, user, isLoading } = useAppSelector(s => s.auth);
    if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-[2px] bg-[#1A1A1A] animate-pulse"></div></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (roles && !roles.includes((user as any)?.role ?? ''))
        return <Navigate to={getRoleHome((user as any)?.role)} replace />;
    return <Outlet />;
};