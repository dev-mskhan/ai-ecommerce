import React from 'react';
import { ThumbsUp, ThumbsDown, Store, CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { RatingStars } from '../common/RatingStars';
import { Button } from '../ui/Button';
import { CustomDropdown } from '../ui/CustomDropdown';
import { useProductReviews, useReviewActions } from '@store/hooks/useReview';
import { useAppSelector } from '@store/index';
import { useForm } from 'react-hook-form';
import { riftToast } from '../common/toastContainer';

interface ReviewsSectionProps {
  productId: string;
  vendorId: string;
}

interface ReviewForm {
  title: string;
  comment: string;
  rating: number;
  order: string;  // required — user must select which order
}

interface VendorReplyForm {
  comment: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId, vendorId }) => {
  const { data, isLoading } = useProductReviews(productId);
  const reviews = data?.data?.reviews ?? [];
  const summary = data?.data?.summary;

  const { user, isAuthenticated } = useAppSelector(s => s.auth);
  const isVendor = (user as any)?.role === 'vendor' && (user as any)?.id === vendorId;

  const [sortOrder, setSortOrder] = React.useState('newest');
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);

  const { create, toggleLike: toggle, vendorReply: vendor } = useReviewActions();
  const [createReview, { isLoading: creating, error: createError }] = create;
  const [toggleLike, { isLoading: liking }] = toggle;
  const [vendorReply, { isLoading: replying }] = vendor;
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewForm>({ defaultValues: { rating: 5, comment: '' } });
  const { register: replyRegister, handleSubmit: handleReplySubmit, reset: resetReply } = useForm<VendorReplyForm>();

  const rating = watch('rating');

  const onSubmitReview = async (formData: ReviewForm) => {
    const result = await createReview({ product: productId, ...formData });
    if ((createError as any)?.status === 403) {
      riftToast.error("You can only review a product after you have ordered it.");
    } else if (result) {
      riftToast.success("Your review has been submitted for approval.");
    } else {
      riftToast.error("Failed to create review");
    }
    reset();
  };

  const onSubmitReply = async (reviewId: string, formData: VendorReplyForm) => {
    await vendorReply({ id: reviewId, productId: productId, message: formData.comment });
    resetReply();
    setReplyingTo(null);
  };

  const sortedReviews = [...reviews].sort((a: any, b: any) => {
    if (sortOrder === 'rating') return b.rating - a.rating;
    if (sortOrder === 'helpful') return (b.likes?.length ?? 0) - (a.likes?.length ?? 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mt-32 border-t border-[#1A1A1A]/10 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Summary & Add Review */}
        <div className="lg:col-span-4 space-y-12">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-8">Customer Reviews</h3>
            <div className="flex items-end gap-4 mb-4">
              <span className="text-6xl font-heading font-black italic leading-none">
                {summary?.average?.toFixed(1) ?? '0.0'}
              </span>
              <div className="pb-1 text-left">
                <RatingStars rating={summary?.average ?? 0} size={16} />
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1">
                  Based on {summary?.total ?? reviews.length} reviews
                </p>
              </div>
            </div>
          </div>

          {isAuthenticated && !isVendor ? (
            <div className="bg-[#1A1A1A]/5 p-8 border border-[#1A1A1A]/5 text-left">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6">Write a Review</h4>
              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setValue('rating', s)}
                      className={cn("p-2 transition-all", rating >= s ? "text-[#1A1A1A]" : "text-[#1A1A1A]/20")}>
                      <Star size={18} fill={rating >= s ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea
                  {...register('comment', { required: 'Review cannot be empty' })}
                  placeholder="Share your thoughts about this product..."
                  className="w-full bg-white border border-[#1A1A1A]/10 p-4 text-xs font-light outline-none focus:border-[#1A1A1A] min-h-[120px] transition-all"
                />
                {errors.comment && <p className="text-[9px] text-red-500">{errors.comment.message}</p>}
                <Button type="submit" disabled={creating} className="w-full h-12 text-[9px] font-bold uppercase tracking-widest">
                  {creating ? 'Posting...' : 'Post Review'}
                </Button>
              </form>
            </div>
          ) : !isAuthenticated ? (
            <div className="p-8 border border-dashed border-[#1A1A1A]/10 text-left">
              <p className="text-xs font-light italic text-[#1A1A1A]/40">Sign in to leave a review.</p>
            </div>
          ) : null}
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-12 border-b border-[#1A1A1A]/5 pb-4">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">All Reviews</span>
            <div className="w-48 text-right">
              <CustomDropdown
                value={sortOrder}
                onChange={setSortOrder}
                options={[
                  { label: 'Newest First', value: 'newest' },
                  { label: 'Highest Rating', value: 'rating' },
                  { label: 'Most Helpful', value: 'helpful' }
                ]}
                className="bg-transparent p-0"
              />
            </div>
          </div>

          {isLoading && (
            <div className="space-y-8">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-[#1A1A1A]/5 animate-pulse" />)}
            </div>
          )}

          <div className="space-y-16">
            {sortedReviews.map((review: any) => (
              <div key={review._id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#1A1A1A]/5 flex items-center justify-center font-heading italic text-xl">
                      {review.user?.name?.[0] ?? '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h5 className="text-[11px] font-bold uppercase tracking-widest">{review.user?.name}</h5>
                        {review.verifiedPurchase && (
                          <span className="flex items-center gap-1 text-[8px] font-bold text-green-700 uppercase tracking-tighter bg-green-50 px-1">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        )}
                      </div>
                      <RatingStars rating={review.rating} size={10} />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono italic opacity-30">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/80 pl-16">{review.comment}</p>

                <div className="flex items-center gap-8 pl-16">
                  <button onClick={() => toggleLike({ id: review._id, type: 'like' })}
                    className="flex items-center gap-2 text-[10px] font-bold opacity-30 hover:opacity-100 transition-opacity">
                    <ThumbsUp size={14} /> {review.likes?.length ?? 0}
                  </button>
                  <button onClick={() => toggleLike({ id: review._id, type: 'dislike' })}
                    className="flex items-center gap-2 text-[10px] font-bold opacity-30 hover:opacity-100 transition-opacity">
                    <ThumbsDown size={14} /> {review.dislikes?.length ?? 0}
                  </button>
                  {isVendor && !review.vendorReply && (
                    <button onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}
                      className="text-[10px] font-bold opacity-40 underline uppercase tracking-widest ml-auto">
                      Reply
                    </button>
                  )}
                </div>

                {/* Vendor Reply Form */}
                {isVendor && replyingTo === review._id && (
                  <form onSubmit={handleReplySubmit(d => onSubmitReply(review._id, d))} className="ml-16 space-y-4">
                    <textarea
                      {...replyRegister('comment', { required: true })}
                      placeholder="Write your reply..."
                      className="w-full bg-white border border-[#1A1A1A]/10 p-4 text-xs font-light outline-none focus:border-[#1A1A1A] min-h-[80px] transition-all"
                    />
                    <div className="flex gap-4">
                      <Button type="submit" disabled={replying} className="h-10 text-[9px] font-bold uppercase tracking-widest">
                        {replying ? 'Sending...' : 'Send Reply'}
                      </Button>
                      <button type="button" onClick={() => setReplyingTo(null)}
                        className="text-[10px] opacity-40 uppercase tracking-widest font-bold hover:opacity-100">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Vendor Reply Display */}
                {review.vendorReply && (
                  <div className="ml-16 bg-[#1A1A1A] text-[#FDFCF8] p-8 space-y-4 relative text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Store size={14} className="opacity-40" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Seller Reply</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-20 italic">
                        {new Date(review.vendorReply.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-light italic leading-relaxed opacity-80">"{review.vendorReply.comment}"</p>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10" />
                    <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};