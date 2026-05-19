import { Link } from 'react-router-dom';

export const HeroSection = () => (
    <section className="relative min-h-[80vh] w-full flex flex-col px-6 lg:px-12 py-12">
        <header className="flex justify-between items-baseline mb-10 pb-4">
            <div className="text-[10px] tracking-[0.4em] font-bold uppercase opacity-40">Collection — S/S 2024</div>
            <div className="text-[10px] tracking-[0.4em] font-bold uppercase opacity-40">Est. 2024 — Karachi</div>
        </header>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-12">

            {/* Image panel — fixed height on mobile, stretches on md+ */}
            <div className="md:col-span-7 relative group overflow-hidden bg-[#EAE8E2] min-h-[420px] sm:min-h-[520px] md:min-h-0">
                <div className="absolute inset-0 p-8">
                    <div className="w-full h-full border border-[#1A1A1A]/5 flex">
                        <div className="w-1/3 border-r border-[#1A1A1A]/5" />
                        <div className="w-1/3 border-r border-[#1A1A1A]/5 bg-[#D9D7D0]/30" />
                        <div className="w-1/3" />
                    </div>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200"
                    alt="Editorial"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 bg-[#FDFCF8] p-6 md:p-8 max-w-[260px] md:max-w-sm border border-[#1A1A1A]/10 shadow-2xl">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40 mb-4 block text-left">New Collection</span>
                    <h1 className="text-3xl md:text-4xl leading-[1.1] font-heading font-medium italic text-left">
                        Great <br /> Items for <br /> Your <br /> <span className="not-italic font-black">Home.</span>
                    </h1>
                </div>
            </div>

            {/* Text panel */}
            <div className="md:col-span-5 flex flex-col justify-center lg:pr-12 text-left">
                <div className="max-w-md">
                    <h3 className="text-5xl lg:text-7xl leading-[0.85] mb-8 md:mb-12 font-heading font-light italic">
                        Best <br /> Selection <br /> <span className="font-black not-italic lg:ml-12 text-[#1A1A1A]">For All.</span>
                    </h3>
                    <p className="text-sm leading-relaxed text-[#1A1A1A]/60 mb-8 md:mb-12 font-light tracking-wide max-w-xs">
                        We find the best products for your daily life. From high-quality clothes to top electronics.
                    </p>
                    <Link to="/category/all-items">
                        <div className="flex items-center gap-6 group cursor-pointer">
                            <div className="w-12 h-12 rounded-full border border-[#1A1A1A] flex items-center justify-center text-xl transition-all group-hover:bg-[#1A1A1A] group-hover:text-white">→</div>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold group-hover:translate-x-2 transition-transform">Shop Now</span>
                        </div>
                    </Link>
                </div>
            </div>

        </div>
    </section>
);