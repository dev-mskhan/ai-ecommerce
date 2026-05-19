import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number;
    images: string[];
    vendorName?: string;
    categoryName?: string;
    vendorId?: string;
    categoryId?: string;
    quantity: number;
    variant?: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string, variant?: string) => void;
    updateQuantity: (id: string, quantity: number, variant?: string) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const { items } = get();

                // normalize: discountPrice always falls back to price
                const normalized: CartItem = {
                    ...newItem,
                    price: Number(newItem.price) || 0,
                    discountPrice: Number(newItem.discountPrice) || Number(newItem.price) || 0,
                    quantity: Math.max(1, newItem.quantity ?? 1),
                };

                const existingItem = items.find(
                    (item) => item.id === normalized.id && item.variant === normalized.variant
                );

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === normalized.id && item.variant === normalized.variant
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, normalized] });
                }
            },
            removeItem: (id, variant) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.id === id && item.variant === variant)
                    ),
                });
            },
            updateQuantity: (id, quantity, variant) => {
                set({
                    items: get().items.map((item) =>
                        item.id === id && item.variant === variant
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + (item.discountPrice ?? item.price) * item.quantity,
                    0
                );
            },
        }),
        {
            name: 'cart-storage',
            version: 2,
            migrate: (persistedState: any, version) => {
                if (version < 2) return { items: [] };
                return persistedState;
            },
        }
    )
);