import { Star } from 'lucide-react';
import { cn } from '@/utils/helpers';

const reviews = [
    { id: 1, product: 'Structural Table Lamp', rating: 5, text: 'The geometric integrity matches the architectural specifications perfectly.', date: 'May 11, 2024' },
    { id: 2, product: 'Minimalist Clock', rating: 4, text: 'Functional, though the acoustic output is slightly higher than expected.', date: 'May 02, 2024' },
];

export const ReviewsTab = () => (
    <section className="space-y-12">
        <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">My Reviews</h2>
        </div>
        <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10">
            {reviews.map((r) => (
                <div key={r.id} className="bg-[#FDFCF8] p-10 space-y-6 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-heading font-medium italic mb-2">{r.product}</h3>
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
                    <p className="text-sm font-light leading-relaxed max-w-2xl text-[#1A1A1A]/60 italic">"{r.text}"</p>
                    <p className="text-[9px] font-mono opacity-20 uppercase">{r.date}</p>
                </div>
            ))}
        </div>
    </section>
);