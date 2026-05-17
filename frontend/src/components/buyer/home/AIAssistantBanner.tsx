import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAppContext } from '@/store/context/AppContext';

export const AIAssistantBanner = () => {
    const { isAiModalOpen, setIsAiModalOpen } = useAppContext();
    return (

        <section className="bg-[#1A1A1A] text-[#FDFCF8] p-10 lg:p-16 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EAE8E2] opacity-[0.03] mix-blend-overlay" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 items-center">
                <div className="lg:col-span-7">
                    <span className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40 mb-8 block">AI SHOPPING</span>
                    <h2 className="text-5xl lg:text-7xl font-heading font-light leading-[1.1] mb-12">
                        Shop Better <br /> <span className="italic font-medium">with</span> <br /> AI Help.
                    </h2>
                    <p className="text-lg font-light text-[#FDFCF8]/60 mb-12 max-w-lg leading-relaxed italic">
                        "Finding what you need shouldn't be hard. Just talk to our AI to find the perfect match."
                    </p>
                    <Button onClick={() => setIsAiModalOpen(!isAiModalOpen)} className="bg-[#FDFCF8] text-[#1A1A1A] hover:bg-[#EAE8E2]">Try AI Assistant</Button>
                </div>
                <div className="lg:col-span-5 flex justify-end">
                    <div className="aspect-[5/5] w-full max-w-xs bg-[#FDFCF8]/5 border border-[#FDFCF8]/10 flex items-center justify-center group overflow-hidden">
                        <div className="text-9xl opacity-20 grayscale group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">🤖</div>
                    </div>
                </div>
            </div>
        </section>
    );
}