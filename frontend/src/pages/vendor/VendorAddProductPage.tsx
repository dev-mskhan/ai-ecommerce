import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Upload, X, Plus, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { cn } from '@/utils/helpers';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from '@/store/api/productApi';
import { useGetAllCategoriesQuery } from '@/store/api/categoryApi';

interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  category: string;
  tags: string[];
  variants: { name: string; options: string }[];
  seo: { metaTitle: string; metaDescription: string };
  images: FileList | null;
}

export const VendorAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const { data: existingProduct, isLoading: productLoading } = useGetProductByIdQuery(id!, { skip: !id });
  const { data: categoriesData } = useGetAllCategoriesQuery();

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [activeTag, setActiveTag] = React.useState<string[]>([]);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      stock: '',
      category: '',
      tags: [],
      variants: [{ name: 'Size', options: 'M, L, XL' }],
      seo: { metaTitle: '', metaDescription: '' },
      images: null,
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  // Populate form on edit
  React.useEffect(() => {
    const p = existingProduct?.data;
    if (p) {
      reset({
        name: p.name ?? '',
        description: p.description ?? '',
        price: String(p.price ?? ''),
        discountPrice: String(p.discountPrice ?? ''),
        stock: String(p.stock ?? ''),
        category: p.category?._id ?? p.category ?? '',
        tags: p.tags ?? [],
        variants: p.variants?.map((v: any) => ({ name: v.name, options: v.options.join(', ') })) ?? [],
        seo: { metaTitle: p.seo?.metaTitle ?? '', metaDescription: p.seo?.metaDescription ?? '' },
        images: null,
      });
      setActiveTag(p.tags ?? []);
      if (p.images?.[0]) setPreviewUrl(p.images[0]);
    }
  }, [existingProduct, reset]);

  const categoryOptions = (categoriesData?.data ?? []).map((c: any) => ({
    label: c.name,
    value: c._id,
  }));

  const toggleTag = (tag: string) => {
    setActiveTag((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      setValue('tags', next);
      return next;
    });
  };

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('description', values.description);
    fd.append('price', values.price);
    if (values.discountPrice) fd.append('discountPrice', values.discountPrice);
    fd.append('stock', values.stock);
    fd.append('category', values.category);
    values.tags.forEach((t) => fd.append('tags[]', t));

    // Variants: backend expects array of {name, options[]}
    values.variants.forEach((v, i) => {
      fd.append(`variants[${i}][name]`, v.name);
      v.options.split(',').map((o) => o.trim()).forEach((o) => fd.append(`variants[${i}][options][]`, o));
    });

    fd.append('seo[metaTitle]', values.seo.metaTitle);
    fd.append('seo[metaDescription]', values.seo.metaDescription);

    if (values.images && values.images.length > 0) {
      Array.from(values.images).forEach((file) => fd.append('images', file));
    }

    try {
      if (isEditMode && id) {
        await updateProduct({ id, data: fd }).unwrap();
      } else {
        await createProduct(fd).unwrap();
      }
      navigate('/vendor/products');
    } catch (err: any) {
      setServerError(err?.data?.message ?? 'Something went wrong');
    }
  };

  if (isEditMode && productLoading) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="animate-spin opacity-30" size={28} />
      </div>
    );
  }

  const isSubmitting = creating || updating;

  return (
    <div className="max-w-4xl space-y-14">
      <header className="flex flex-col gap-6 border-b border-[#1A1A1A]/10 pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft size={13} />
          Back to Products
        </button>
        <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
          {isEditMode ? 'Edit' : 'New'} <br />
          <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Product</span>
        </h1>
      </header>

      {serverError && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 border border-red-100">
          <AlertCircle size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        {/* Section I: Details */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 text-left">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-3">I. Details</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">Basic product information.</p>
          </div>
          <div className="md:col-span-8 space-y-7">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Product Name *</label>
              <input
                {...register('name', { required: 'Product name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                placeholder="Item Title"
                className={cn(
                  'w-full bg-transparent border-b py-3 text-xl font-heading focus:border-[#1A1A1A] outline-none transition-all italic text-left',
                  errors.name ? 'border-red-400' : 'border-[#1A1A1A]/10',
                )}
              />
              {errors.name && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-7">
              {/* Category */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Category *</label>
                <Controller
                  control={control}
                  name="category"
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <CustomDropdown
                      value={field.value}
                      onChange={field.onChange}
                      options={categoryOptions.length ? categoryOptions : [{ label: 'Loading...', value: '' }]}
                      className="bg-transparent"
                    />
                  )}
                />
                {errors.category && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.category.message}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Price (RS.) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be 0 or more' } })}
                  placeholder="0.00"
                  className={cn(
                    'w-full bg-[#1A1A1A]/5 border-none p-4 text-base font-mono outline-none',
                    errors.price ? 'ring-1 ring-red-400' : '',
                  )}
                />
                {errors.price && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.price.message}</p>}
              </div>

              {/* Discount Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Discount Price (RS.)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('discountPrice')}
                  placeholder="0.00"
                  className="w-full bg-[#1A1A1A]/5 border-none p-4 text-base font-mono outline-none"
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Stock *</label>
                <input
                  type="number"
                  {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Cannot be negative' } })}
                  placeholder="0"
                  className={cn(
                    'w-full bg-[#1A1A1A]/5 border-none p-4 text-base font-mono outline-none',
                    errors.stock ? 'ring-1 ring-red-400' : '',
                  )}
                />
                {errors.stock && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.stock.message}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Section II: Images */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-3">II. Images</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">
              {isEditMode ? 'Upload new images to replace existing ones.' : 'Upload product photos.'}
            </p>
          </div>
          <div className="md:col-span-8">
            <label className="block aspect-video bg-[#1A1A1A]/5 border-2 border-dashed border-[#1A1A1A]/10 flex flex-col items-center justify-center gap-5 group hover:border-[#1A1A1A]/30 transition-all cursor-pointer overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover grayscale" />
              ) : (
                <>
                  <Upload size={28} className="opacity-20 group-hover:scale-110 transition-transform" />
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">
                      {isEditMode ? 'Replace Images' : 'Upload Images'}
                    </span>
                    <span className="text-[9px] opacity-40 uppercase tracking-tighter">Drag or click to browse</span>
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                {...register('images')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPreviewUrl(URL.createObjectURL(file));
                  register('images').onChange(e);
                }}
              />
            </label>
            {!isEditMode && (
              <p className="text-[9px] opacity-30 uppercase tracking-widest mt-2">* At least one image required for new products</p>
            )}
          </div>
        </section>

        {/* Section III: Description */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-3">III. Description</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">Product details and tags.</p>
          </div>
          <div className="md:col-span-8 space-y-7">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Description *</label>
              <textarea
                rows={5}
                {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Min 10 characters' } })}
                placeholder="Describe the product..."
                className={cn(
                  'w-full bg-[#1A1A1A]/5 border-none p-6 text-sm font-light leading-relaxed outline-none focus:bg-[#EAE8E2] transition-all resize-none',
                  errors.description ? 'ring-1 ring-red-400' : '',
                )}
              />
              {errors.description && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.description.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Tags</label>
              <div className="flex flex-wrap gap-2">
                {['Premium', 'Sustainable', 'Limited Edition', 'Industrial', 'New Arrival', 'Sale'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all',
                      activeTag.includes(tag)
                        ? 'bg-[#1A1A1A] text-[#FDFCF8]'
                        : 'bg-[#1A1A1A]/5 hover:bg-[#1A1A1A] hover:text-[#FDFCF8]',
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section IV: Variants */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-3">IV. Variants</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">Size, color, or other options.</p>
          </div>
          <div className="md:col-span-8 space-y-5">
            <div className="bg-[#1A1A1A]/5 p-7 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Variant Groups</span>
                <button
                  type="button"
                  onClick={() => appendVariant({ name: '', options: '' })}
                  className="text-[9px] font-bold uppercase tracking-widest border-b border-[#1A1A1A] pb-0.5 hover:opacity-50 transition-all"
                >
                  + Add Variant
                </button>
              </div>

              {variantFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 bg-[#FDFCF8] p-4 border border-[#1A1A1A]/5">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <input
                        {...register(`variants.${index}.name`)}
                        placeholder="Name (e.g. Size)"
                        className="w-full bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest"
                      />
                    </div>
                    <div>
                      <input
                        {...register(`variants.${index}.options`)}
                        placeholder="Options (e.g. S, M, L)"
                        className="w-full bg-transparent border-none outline-none text-[10px] font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section V: SEO */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-3">V. SEO</h3>
            <p className="text-sm font-light leading-relaxed text-[#1A1A1A]/60 italic">Search engine settings.</p>
          </div>
          <div className="md:col-span-8 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Meta Title</label>
              <input
                {...register('seo.metaTitle')}
                maxLength={60}
                className="w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Meta Description</label>
              <textarea
                rows={3}
                {...register('seo.metaDescription')}
                maxLength={160}
                className="w-full bg-[#1A1A1A]/5 p-4 border-none outline-none text-sm font-light leading-relaxed resize-none"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-10 border-t border-[#1A1A1A]/10 flex justify-end gap-5">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-10 py-4 flex items-center gap-2">
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isEditMode ? 'Update Product' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};
