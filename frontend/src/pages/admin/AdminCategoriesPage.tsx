import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, XCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import { riftToast } from '@/components/common/toastContainer';
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useToggleCategoryStatusMutation,
} from '@store/api/categoryApi';

interface CategoryForm {
    name: string;
    description: string;
    image: FileList;
}

export const AdminCategoriesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editTarget, setEditTarget] = React.useState<any>(null);
    const [preview, setPreview] = React.useState<string>('');

    const { data, isLoading } = useGetAllCategoriesQuery();
    const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [toggleStatus] = useToggleCategoryStatusMutation();

    const categories: any[] = data?.data ?? [];

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CategoryForm>();

    const imageWatch = watch('image');
    React.useEffect(() => {
        if (imageWatch?.[0]) setPreview(URL.createObjectURL(imageWatch[0]));
    }, [imageWatch]);

    const openAdd = () => {
        setEditTarget(null);
        setPreview('');
        reset({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const openEdit = (cat: any) => {
        setEditTarget(cat);
        setPreview(cat.images?.[0] ?? '');
        reset({ name: cat.name, description: cat.description ?? '' });
        setIsModalOpen(true);
    };

    const onSubmit = async (values: CategoryForm) => {
        const fd = new FormData();
        fd.append('name', values.name.trim());
        if (values.description?.trim()) fd.append('description', values.description.trim());
        if (values.image?.[0]) fd.append('images', values.image[0]);

        await riftToast.promise(
            editTarget
                ? updateCategory({ id: editTarget._id, data: fd }).unwrap()
                : createCategory(fd).unwrap(),
            {
                loading: editTarget ? 'Updating category...' : 'Creating category...',
                success: editTarget ? 'Category updated!' : 'Category created!',
                error: editTarget ? 'Failed to update category' : 'Failed to create category',
            }
        );
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this category?')) return;
        await riftToast.promise(deleteCategory(id).unwrap(), {
            loading: 'Deleting category...',
            success: 'Category deleted!',
            error: 'Failed to delete category',
        });
    };

    const handleToggle = async (id: string) => {
        await riftToast.promise(toggleStatus(id).unwrap(), {
            loading: 'Updating status...',
            success: 'Status updated!',
            error: 'Failed to update status',
        });
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-[#1A1A1A]/10 pb-10 gap-8">
                <div>
                    <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Category Management</div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black italic tracking-tighter uppercase leading-none">
                        Categories <br /> <span className="not-italic font-sans text-xs tracking-[0.5em] font-bold opacity-40">Manage All</span>
                    </h1>
                </div>
                <Button onClick={openAdd} className="flex items-center gap-2">
                    <Plus size={14} /> Add Category
                </Button>
            </header>

            {isLoading ? (
                <div className="text-[10px] font-mono opacity-30 py-10">Loading categories...</div>
            ) : (
                <div className="space-y-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 overflow-hidden">
                    <div className="bg-[#FDFCF8] p-6 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">
                        <div className="w-20">Image</div>
                        <div className="flex-1 px-8">Name & Description</div>
                        <div className="w-32 hidden md:block">Added</div>
                        <div className="w-32 text-center">Status</div>
                        <div className="w-36"></div>
                    </div>

                    {categories.map((cat) => (
                        <div key={cat._id} className="bg-[#FDFCF8] p-8 flex items-center justify-between group hover:bg-[#EAE8E2] transition-colors">
                            <div className="w-20 h-20 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                {cat.images?.[0] && <img src={cat.images[0]} className="w-full h-full object-cover" alt="" />}
                            </div>
                            <div className="flex-1 px-8">
                                <h3 className="text-base font-heading font-medium italic mb-1">{cat.name}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 max-w-md truncate">{cat.description}</p>
                            </div>
                            <div className="w-32 hidden md:block text-[10px] font-mono opacity-40">
                                {new Date(cat.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                            </div>
                            <div className="w-32 flex justify-center">
                                <button
                                    onClick={() => handleToggle(cat._id)}
                                    className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest px-3 py-1 border transition-all hover:opacity-80",
                                        cat.isActive !== false
                                            ? "border-green-600/30 text-green-700 bg-green-50"
                                            : "border-[#1A1A1A]/10 text-[#1A1A1A]/40"
                                    )}
                                >
                                    {cat.isActive !== false ? 'Active' : 'Inactive'}
                                </button>
                            </div>
                            <div className="w-36 flex justify-end gap-2">
                                <button
                                    onClick={() => openEdit(cat)}
                                    className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center opacity-20 hover:opacity-100 hover:bg-[#1A1A1A] hover:text-[#FDFCF8] transition-all"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="w-10 h-10 border border-[#1A1A1A]/10 flex items-center justify-center opacity-20 hover:opacity-100 hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="bg-[#FDFCF8] p-12 text-center text-[10px] font-mono opacity-30">No categories found.</div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FDFCF8]/90 backdrop-blur-sm">
                    <div className="bg-[#FDFCF8] border border-[#1A1A1A] w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-12 pb-0 shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 opacity-40 hover:opacity-100">
                                <XCircle size={24} strokeWidth={1} />
                            </button>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">Category</p>
                            <h2 className="text-3xl font-heading font-black italic tracking-tighter uppercase">
                                {editTarget ? 'Edit Category' : 'Add Category'}
                            </h2>
                        </div>

                        {/* Scrollable Body */}
                        <div className="overflow-y-auto px-12 py-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Name *</label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic"
                                    placeholder="e.g. Winter Collection"
                                />
                                {errors.name && <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Description</label>
                                <textarea
                                    rows={3}
                                    {...register('description')}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic resize-none"
                                    placeholder="Short description..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 block">
                                    Image {editTarget ? '(leave blank to keep current)' : '*'}
                                </label>
                                {preview && (
                                    <img src={preview} alt="preview" className="w-24 h-24 object-cover grayscale border border-[#1A1A1A]/10" />
                                )}
                                <label className="w-full border-2 border-dashed border-[#1A1A1A]/10 p-10 text-center hover:bg-[#1A1A1A]/5 transition-all cursor-pointer block">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Click to upload image</p>
                                    <p className="text-[9px] font-mono mt-2 opacity-20">JPG, PNG — Max 5MB</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register('image', { required: !editTarget ? 'Image is required' : false })}
                                    />
                                </label>
                                {errors.image && <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">{errors.image.message as string}</p>}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-12 py-8 flex justify-end gap-6 border-t border-[#1A1A1A]/5 shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">
                                Cancel
                            </button>
                            <Button onClick={handleSubmit(onSubmit)} disabled={creating || updating} className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest">
                                {creating || updating ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Category'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};