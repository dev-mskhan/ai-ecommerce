import { useEffect } from 'react';
import { getSocket } from '@store/socket/socket';

export const useOrderTracking = (onStatusUpdate: (orderId: string, status: string) => void) => {
    useEffect(() => {
        const s = getSocket();
        s.emit('orders:subscribe');

        s.on('order:status_updated', ({ orderId, status }) => {
            onStatusUpdate(orderId, status);
        });

        return () => { s.off('order:status_updated'); };
    }, []);

    const watchOrder = (orderId: string) => getSocket().emit('order:watch', orderId);
    const unwatchOrder = (orderId: string) => getSocket().emit('order:unwatch', orderId);

    return { watchOrder, unwatchOrder };
};