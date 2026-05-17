import React from 'react';
import { HeroSection } from '@/components/buyer/home/HeroSection';
import { CategoriesSlider } from '@/components/buyer/home/CategoriesSlider';
import { FlashSale } from '@/components/buyer/home/FlashSale';
import { AIAssistantBanner } from '@/components/buyer/home/AIAssistantBanner';
import { BestSellers } from '@/components/buyer/home/BestSellers';

export const HomePage: React.FC = () => (
  <div className="flex flex-col">
    <HeroSection />
    <div className="px-6 lg:px-12 py-10 lg:py-20 flex flex-col gap-25 max-w-[1440px] mx-auto w-full">
      <CategoriesSlider />
      <FlashSale />
      <AIAssistantBanner />
      <BestSellers />
    </div>
  </div>
);