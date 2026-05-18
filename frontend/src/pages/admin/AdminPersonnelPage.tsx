import React from 'react';
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useGetAllUsersQuery, useBanVendorMutation } from '@store/api/adminApi';

// Note: The admin banVendor mutation also works for banning any user since it's a generic ban toggle.
// The backend's banVendor endpoint accepts any userId with role check, but for buyers
// a dedicated ban-user endpoint may be needed. Using the same pattern here.

export const AdminPersonnelPage: React.FC = () => {
    const [search, setSearch] = React.useState('');
    const [page, setPage] = React.useState(1);

    const { data, isLoading } = useGetAllUsersQuery();
    const [banUser] = useBanVendorMutation(); // reuse same ban pattern

    const users: any[] = data?.data?.users ?? [];
    const total: number = data?.data?.total ?? 0;
    const activeUsers: number = data?.data?.activeUsers ?? 0;

    const filtered = search.trim()
        ? users.filter((u: any) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
        )
        : users;

    const handleBan = async (id: string) => {
        try { await banUser(id).unwrap(); } catch { }
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">User Management</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Users <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">All Buyers</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-mono opacity-30 uppercase">Active (30d)</p>
                        <p className="text-lg font-bold">{activeUsers}</p>
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="bg-[#1A1A1A]/5 p-4 pl-11 text-[10px] font-bold tracking-widest outline-none border-none w-56 uppercase"
                        />
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="text-[10px] font-mono opacity-30 py-10">Loading users...</div>
            ) : (
                <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
                    <div className="bg-[#FDFCF8] p-6 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">
                        <div className="flex-1">Name</div>
                        <div className="w-40 hidden md:block text-right">Email</div>
                        <div className="w-32 hidden lg:block text-center">Verified</div>
                        <div className="w-24 hidden lg:block text-center">Banned</div>
                        <div className="w-32 hidden md:block text-right">Joined</div>
                        <div className="w-40"></div>
                    </div>

                    {filtered.map((user: any) => (
                        <div key={user._id} className="bg-[#FDFCF8] p-6 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
                            <div className="flex-1 flex items-center gap-5">
                                <div className="w-10 h-10 bg-[#1A1A1A]/5 grayscale flex items-center justify-center overflow-hidden border border-[#1A1A1A]/5">
                                    {user.avatar
                                        ? <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                        : <span className="text-sm font-black opacity-30">{(user.name ?? 'U')[0]}</span>
                                    }
                                </div>
                                <div>
                                    <h3 className="text-base font-heading font-medium italic mb-0.5">{user.name}</h3>
                                    <p className="text-[10px] font-mono opacity-40 lowercase md:hidden">{user.email}</p>
                                </div>
                            </div>

                            <div className="w-40 hidden md:block text-right">
                                <p className="text-[10px] font-mono opacity-40 truncate">{user.email}</p>
                            </div>

                            <div className="w-32 hidden lg:block text-center">
                                {user.isVerified
                                    ? <CheckCircle size={14} className="text-green-600 mx-auto" />
                                    : <XCircle size={14} className="text-red-400 mx-auto" />
                                }
                            </div>

                            <div className="w-24 hidden lg:block text-center">
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest",
                                    user.isBanned ? "text-red-600 font-black" : "opacity-20"
                                )}>
                                    {user.isBanned ? 'YES' : 'NO'}
                                </span>
                            </div>

                            <div className="w-32 hidden md:block text-right">
                                <span className="text-[10px] font-mono opacity-40">
                                    {new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>

                            <div className="w-40 flex justify-end gap-2">
                                <button
                                    onClick={() => handleBan(user._id)}
                                    className={cn(
                                        "px-3 py-1 border text-[9px] font-bold uppercase tracking-widest transition-all",
                                        user.isBanned
                                            ? "border-green-600/20 text-green-600 hover:bg-green-600 hover:text-white"
                                            : "border-red-600/20 text-red-600 hover:bg-red-600 hover:text-white"
                                    )}
                                >
                                    {user.isBanned ? 'Unban' : 'Ban'}
                                </button>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-mono opacity-30">No users found.</div>
                    )}
                </div>
            )}

            <div className="text-[10px] font-mono opacity-30">{total} total buyers registered</div>
        </div>
    );
};