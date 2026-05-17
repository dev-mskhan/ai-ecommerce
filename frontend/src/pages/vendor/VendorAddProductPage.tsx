import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

export const VendorAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = React.useState('Electronics');

  return (
    <div className="max-w-4xl space-y-16">
      <header className="flex flex-col gap-8 border-b border-[#1A1A1A]/10 pb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Products
        </button>
        <h1 className="text-5xl lg:text-6xl font-heading font-black italic tracking-tighter uppercase leading-none">
          New <br/> <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">Product</span>
        </h1>
      </header>

      <form className="space-y-20">
        {/* Section: Basic Data */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 text-left">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">I. Details</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">Define the primary features of the item.</p>
          </div>
          <div className="md:col-span-8 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Product Name</label>
              <input 
                type="text" 
                placeholder="Item Title"
                className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-4 text-2xl font-heading focus:border-[#1A1A1A] outline-none transition-all italic text-left"
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Category</label>
                <CustomDropdown 
                  value={category}
                  onChange={(val) => setCategory(val)}
                  options={[
                    { label: 'Electronics', value: 'Electronics' },
                    { label: 'Fashion', value: 'Fashion' },
                    { label: 'Living', value: 'Living' }
                  ]}
                  className="bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Price (RS.)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-[#1A1A1A]/5 border-none p-4 text-lg font-mono outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Visuals */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">II. Visuals</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">Upload architectural renderings or photography of the product.</p>
          </div>
          <div className="md:col-span-8">
            <div className="aspect-video bg-[#1A1A1A]/5 border-2 border-dashed border-[#1A1A1A]/10 flex flex-col items-center justify-center gap-6 group hover:border-[#1A1A1A]/30 transition-all cursor-pointer">
              <Upload size={32} className="opacity-20 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">Main Image</span>
                <span className="text-[9px] opacity-40 uppercase tracking-tighter">Drag to upload or click to browse</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Narrative */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">III. Description</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">The story behind the item and its specifications.</p>
          </div>
          <div className="md:col-span-8 space-y-8">
            <textarea 
              rows={6}
              placeholder="Describe the product..."
              className="w-full bg-[#1A1A1A]/5 border-none p-8 text-sm font-light leading-relaxed outline-none focus:bg-[#EAE8E2] transition-all"
            ></textarea>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Tags</label>
              <div className="flex flex-wrap gap-2">
                {['Premium', 'Sustainable', 'Limited Edition', 'Industrial'].map(tag => (
                  <button key={tag} type="button" className="px-3 py-1 bg-[#1A1A1A]/5 text-[9px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all">
                    {tag}
                  </button>
                ))}
                <button type="button" className="px-3 py-1 border border-dashed border-[#1A1A1A]/20 text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all flex items-center gap-1">
                   <Plus size={10} /> Add
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Configuration */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">IV. Inventory</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">Define variations and stock parameters.</p>
          </div>
          <div className="md:col-span-8 space-y-8">
            <div className="bg-[#1A1A1A]/5 p-8 space-y-6">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Variants (Size / Color)</span>
                 <button type="button" className="text-[9px] font-bold uppercase tracking-widest border-b border-[#1A1A1A] pb-1 hover:opacity-50 transition-all">Add Config</button>
              </div>
              <div className="flex items-center gap-4 bg-[#FDFCF8] p-4 border border-[#1A1A1A]/5">
                 <input type="text" placeholder="Size" className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-24" defaultValue="M" />
                 <input type="text" placeholder="Color" className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest flex-1" defaultValue="Basalt" />
                 <input type="number" placeholder="Qty" className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-16 text-right" defaultValue={42} />
                 <button type="button" className="text-red-400 hover:text-red-600 transition-colors"><X size={12} /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Total Stock</label>
                  <input type="number" defaultValue={100} className="w-full bg-[#1A1A1A]/5 border-none p-4 text-[10px] font-bold uppercase tracking-widest outline-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">SKU Reference</label>
                  <input type="text" defaultValue="STR-882-X" className="w-full bg-[#1A1A1A]/5 border-none p-4 text-[10px] font-bold uppercase tracking-widest outline-none" />
               </div>
            </div>
          </div>
        </section>

        {/* Section: Search Optimization */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">V. SEO</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">Optimize for search engines.</p>
          </div>
          <div className="md:col-span-8 space-y-8">
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">SEO Meta Title</label>
                   <input type="text" className="w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">SEO Meta Description</label>
                   <textarea rows={3} className="w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-light leading-relaxed resize-none"></textarea>
                </div>
             </div>
          </div>
        </section>

        <div className="pt-12 border-t border-[#1A1A1A]/10 flex justify-end gap-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button className="px-12 py-4">Save Product</Button>
        </div>
      </form>
    </div>
  );
};
