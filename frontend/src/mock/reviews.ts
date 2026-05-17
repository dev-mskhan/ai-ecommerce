export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  dislikes: number;
  purchased: boolean;
  vendorReply?: {
    comment: string;
    date: string;
  };
}

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u1',
    userName: 'Ahmed Ali',
    rating: 5,
    comment: 'Exceptional quality. The material feels premium and the fit is perfect for industrial settings.',
    date: 'Dec 12, 2023',
    likes: 24,
    dislikes: 2,
    purchased: true,
    vendorReply: {
      comment: 'Thank you for your feedback, Ahmed! We strive for archival quality in every piece.',
      date: 'Dec 14, 2023'
    }
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u2',
    userName: 'Sara Khan',
    rating: 4,
    comment: 'Very good design, though the colors are slightly more muted than the preview images.',
    date: 'Jan 05, 2024',
    likes: 12,
    dislikes: 0,
    purchased: true
  }
];
