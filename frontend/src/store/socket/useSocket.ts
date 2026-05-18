import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '@store/socket/socket';
import { useAppSelector } from '@store/index';

export const useSocket = () => {
    const { isAuthenticated } = useAppSelector(s => s.auth);
    useEffect(() => {
        if (isAuthenticated) connectSocket();
        else disconnectSocket();
        return () => { disconnectSocket(); };
    }, [isAuthenticated]);
};