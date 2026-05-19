import { Star } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useUserReviews } from '@store/hooks/useReview';

export const ReviewsTab = () => {
    const { data: reviews = [], isLoading, isError } = useUserReviews();
    if (isLoading) return <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Loading reviews...</p>;
    if (isError) return <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">Failed to load reviews.</p>;

    return (
        <section className="space-y-12">
            <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
                <h2 className="text-[14px] font-bold uppercase tracking-[0.5em] opacity-70">My Reviews</h2>
            </div>
            {reviews?.data?.length === 0 ? (
                <p className="text-sm font-light opacity-40">No reviews yet.</p>
            ) : (
                <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
                    {reviews?.data?.map((r: any) => (
                        <div key={r._id ?? r.id} className="bg-[#FDFCF8] p-10 space-y-6 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-heading font-medium italic mb-2">{r.product?.name ?? r.productName}</h3>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className={cn(i < r.rating ? "fill-[#1A1A1A] text-[#1A1A1A]" : "text-[#1A1A1A]/10")} />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[10px] font-bold uppercase tracking-widest border-b border-[#1A1A1A] pb-1 hover:opacity-50">Edit</button>
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 border-b border-red-600 pb-1 hover:opacity-50">Delete</button>
                                </div>
                            </div>
                            <p className="text-sm font-light leading-relaxed max-w-2xl text-[#1A1A1A]/60 italic">"{r.text ?? r.comment}"</p>
                            <p className="text-[9px] font-mono opacity-20 uppercase">{r.date ?? r.createdAt?.slice(0, 10)}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};