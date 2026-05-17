import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    image: string;
    categoryName: string;
    vendorName: string;
}

interface WishlistStore {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const { items } = get();
                const exists = items.find((item) => item.id === newItem.id);
                if (!exists) {
                    set({ items: [...items, newItem] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
            isInWishlist: (id) => get().items.some((item) => item.id === id),
            clearWishlist: () => set({ items: [] }),
        }),
        { name: 'wishlist-storage' }
    )
);