import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#1A1A1A]/5 p-4 text-[10px] font-bold uppercase tracking-widest outline-none transition-all hover:bg-[#EAE8E2]"
      >
        <span className={cn(selectedOption ? "text-[#1A1A1A]" : "opacity-40")}>
          {selectedOption ? selectedOption.label : placeholder || 'Select Option'}
        </span>
        <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-[#FDFCF8] border border-[#1A1A1A] shadow-2xl">
          <div className="max-h-60 overflow-y-auto no-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left p-4 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-[#1A1A1A] hover:text-[#FDFCF8]",
                  value === option.value ? "bg-[#1A1A1A] text-[#FDFCF8]" : ""
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
