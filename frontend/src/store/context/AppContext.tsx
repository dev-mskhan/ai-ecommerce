import { createContext, useContext, useState } from 'react';

const AppContext = createContext<any>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<string>("all-items");
    return <AppContext.Provider value={{
        currentCategory,
        setCurrentCategory,
        isMobileMenuOpen,
        isAiModalOpen,
        isSearchOpen,
        isWishlistOpen,
        isSupportChatOpen,
        setIsMobileMenuOpen,
        setIsAiModalOpen,
        setIsSearchOpen,
        setIsWishlistOpen,
        setIsSupportChatOpen
    }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);