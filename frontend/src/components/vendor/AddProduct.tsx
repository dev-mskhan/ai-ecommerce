import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";
import { useCreateProductMutation, useUpdateProductMutation } from "@/store/api/productApi";
import { useFieldArray, useForm } from "react-hook-form";
import { riftToast } from "@/components/common/toastContainer";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useRef, useEffect } from "react";

interface ProductForm {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: string;
    tags: string;
    variants: { name: string; options: string }[];
    metaTitle?: string;
    metaDescription?: string;
}

interface Props {
    onClose: () => void;
    showAddProduct: boolean;
    setShowAddProduct: (value: boolean) => void;
    editProduct?: any | null; // pass existing product to enable edit mode
}

const AddProductModal: React.FC<Props> = ({ onClose, editProduct }) => {
    const isEdit = !!editProduct;

    const { data: catData } = useGetAllCategoriesQuery();
    const categories: any[] = catData?.data ?? [];
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ProductForm>({
        defaultValues: { variants: [] },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

    // Pre-fill form when editing
    useEffect(() => {
        if (editProduct) {
            reset({
                name: editProduct.name ?? '',
                description: editProduct.description ?? '',
                price: editProduct.price ?? 0,
                discountPrice: editProduct.discountPrice,
                stock: editProduct.stock ?? 0,
                category: editProduct.category?._id ?? editProduct.category ?? '',
                tags: (editProduct.tags ?? []).join(', '),
                metaTitle: editProduct.seo?.metaTitle ?? '',
                metaDescription: editProduct.seo?.metaDescription ?? '',
                variants: (editProduct.variants ?? []).map((v: any) => ({
                    name: v.name,
                    options: (v.options ?? []).join(', '),
                })),
            });
        } else {
            reset({ variants: [] });
        }
    }, [editProduct, reset]);

    const onSubmit = async (values: ProductForm) => {
        const fd = new FormData();
        fd.append('name', values.name);
        fd.append('description', values.description);
        fd.append('price', String(values.price));
        if (values.discountPrice) fd.append('discountPrice', String(values.discountPrice));
        fd.append('stock', String(values.stock));
        fd.append('category', values.category);

        const tags = values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        tags.forEach(t => fd.append('tags[]', t));

        const variants = fields.map((_, i) => ({
            name: values.variants[i].name,
            options: values.variants[i].options.split(',').map(o => o.trim()).filter(Boolean),
        }));
        fd.append('variants', JSON.stringify(variants));

        if (values.metaTitle || values.metaDescription) {
            fd.append('seo', JSON.stringify({ metaTitle: values.metaTitle, metaDescription: values.metaDescription }));
        }

        const files = fileInputRef.current?.files;

        if (!isEdit) {
            // Create: images required
            if (!files || files.length === 0) {
                riftToast.error('At least one image is required');
                return;
            }
            for (let i = 0; i < files.length; i++) {
                fd.append('images', files[i]);
            }
            await riftToast.promise(createProduct(fd).unwrap(), {
                loading: 'Creating product...',
                success: 'Product created!',
                error: 'Failed to create product',
            });
        } else {
            // Update: images optional (only append if user picked new ones)
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    fd.append('images', files[i]);
                }
            }
            await riftToast.promise(updateProduct({ id: editProduct._id, data: fd }).unwrap(), {
                loading: 'Updating product...',
                success: 'Product updated!',
                error: 'Failed to update product',
            });
        }

        onClose();
    };

    const inputCls = "w-full bg-[#1A1A1A]/5 p-4 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all text-sm font-mono";
    const labelCls = "text-[10px] font-bold uppercase tracking-widest opacity-40";
    const errCls = "text-[10px] text-red-600 font-bold uppercase tracking-widest mt-1";

    return (
        <div className="fixed h-screen inset-0 z-50 flex items-start justify-center p-6 bg-[#FDFCF8]/90 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#FDFCF8] border border-[#1A1A1A] w-full max-w-2xl p-12 space-y-10 relative my-8">
                <button onClick={onClose} className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity">
                    <X size={22} strokeWidth={1.5} />
                </button>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">Products</p>
                    <h2 className="text-3xl font-heading font-black italic tracking-tighter uppercase">
                        {isEdit ? 'Edit Product' : 'Add Product'}
                    </h2>
                    {isEdit && (
                        <p className="text-[10px] font-mono opacity-30 mt-2">ID: {editProduct._id?.slice(-8).toUpperCase()}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-30 border-b border-[#1A1A1A]/5 pb-3">Basic Info</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-1">
                                <label className={labelCls}>Product Name *</label>
                                <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                                    className={inputCls} placeholder="e.g. Premium Leather Wallet" />
                                {errors.name && <p className={errCls}>{errors.name.message}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className={labelCls}>Description *</label>
                                <textarea {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Min 10 chars' } })}
                                    rows={4} className={inputCls + ' resize-none'} placeholder="Describe the product..." />
                                {errors.description && <p className={errCls}>{errors.description.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className={labelCls}>Price (Rs.) *</label>
                                <input type="number" min={0} {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be ≥ 0' } })}
                                    className={inputCls} placeholder="2500" />
                                {errors.price && <p className={errCls}>{errors.price.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className={labelCls}>Discount Price (Rs.)</label>
                                <input type="number" min={0} {...register('discountPrice', { min: { value: 0, message: 'Must be ≥ 0' } })}
                                    className={inputCls} placeholder="Optional" />
                                {errors.discountPrice && <p className={errCls}>{errors.discountPrice.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className={labelCls}>Stock *</label>
                                <input type="number" min={0} {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Must be ≥ 0' } })}
                                    className={inputCls} placeholder="100" />
                                {errors.stock && <p className={errCls}>{errors.stock.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className={labelCls}>Category *</label>
                                <select {...register('category', { required: 'Category is required', pattern: { value: /^[a-f\d]{24}$/i, message: 'Select a valid category' } })}
                                    className={inputCls + ' cursor-pointer'}>
                                    <option value="">Select category</option>
                                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                {errors.category && <p className={errCls}>{errors.category.message}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className={labelCls}>Tags (comma separated)</label>
                                <input {...register('tags')} className={inputCls} placeholder="leather, wallet, men" />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className={labelCls}>
                                    Images {isEdit ? '(leave empty to keep existing)' : '*'}
                                </label>
                                {/* Show existing images in edit mode */}
                                {isEdit && editProduct?.images?.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mb-2">
                                        {editProduct.images.map((img: string, i: number) => (
                                            <div key={i} className="w-14 h-14 border border-[#1A1A1A]/10 overflow-hidden grayscale">
                                                <img src={img} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="w-full text-[11px] font-mono opacity-60 file:mr-4 file:py-2 file:px-4 file:border file:border-[#1A1A1A]/20 file:bg-transparent file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#1A1A1A] hover:file:text-[#FDFCF8] file:transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-[#1A1A1A]/5 pb-3">
                            <p className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-30">Variants</p>
                            <button type="button" onClick={() => append({ name: '', options: '' })}
                                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                                <Plus size={11} /> Add Variant
                            </button>
                        </div>
                        {fields.map((field, i) => (
                            <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-start">
                                <div className="space-y-1">
                                    <label className={labelCls}>Name *</label>
                                    <input {...register(`variants.${i}.name`, { required: true })}
                                        className={inputCls} placeholder="Size" />
                                </div>
                                <div className="space-y-1">
                                    <label className={labelCls}>Options (comma sep) *</label>
                                    <input {...register(`variants.${i}.options`, { required: true })}
                                        className={inputCls} placeholder="S, M, L, XL" />
                                </div>
                                <button type="button" onClick={() => remove(i)}
                                    className="mt-7 w-9 h-9 border border-red-600/10 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all opacity-40 hover:opacity-100">
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* SEO */}
                    <div className="space-y-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-30 border-b border-[#1A1A1A]/5 pb-3">SEO (Optional)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className={labelCls}>Meta Title</label>
                                <input {...register('metaTitle', { maxLength: { value: 60, message: 'Max 60 chars' } })}
                                    className={inputCls} placeholder="Max 60 characters" />
                                {errors.metaTitle && <p className={errCls}>{errors.metaTitle.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>Meta Description</label>
                                <input {...register('metaDescription', { maxLength: { value: 160, message: 'Max 160 chars' } })}
                                    className={inputCls} placeholder="Max 160 characters" />
                                {errors.metaDescription && <p className={errCls}>{errors.metaDescription.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-6 pt-6 border-t border-[#1A1A1A]/5">
                        <button type="button" onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">Cancel</button>
                        <Button type="submit" disabled={isSubmitting} className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest">
                            {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;