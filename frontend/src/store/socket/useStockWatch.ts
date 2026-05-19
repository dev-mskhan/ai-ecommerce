import { useEffect } from 'react';
import { getSocket } from '@store/socket/socket';

export const useStockWatch = (productId: string, onUpdate: (stock: number) => void) => {
    useEffect(() => {
        if (!productId) return;
        const s = getSocket();

        s.emit('stock:watch', productId);
        s.on('stock:updated', ({ productId: id, stock }) => {
            if (id === productId) onUpdate(stock);
        });

        return () => {
            s.emit('stock:unwatch', productId);
            s.off('stock:updated');
        };
    }, [productId]);
};