import React from 'react';
import { cn } from '@/utils/helpers';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    variant?: 'body' | 'description' | 'label' | 'metadata' | 'error';
}

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'body',
    className,
    ...props
}) => {
    const variants = {
        error: "text-[8px] font-light text-red-600 uppercase tracking-widest",
        body: 'text-sm font-medium text-[#1A1A1A] leading-relaxed',
        description: 'text-sm font-light text-[#1A1A1A]/60 italic leading-relaxed',
        label: 'text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]',
        metadata: 'text-[9px] font-bold uppercase tracking-[0.3em] opacity-30 font-mono'
    };

    return (
        <p
            className={cn(variants[variant], className)}
            {...props}
        >
            {children}
        </p>
    );
};
