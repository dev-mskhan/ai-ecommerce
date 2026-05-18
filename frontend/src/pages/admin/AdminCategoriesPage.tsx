import React from 'react';
import { Plus, Edit2, Trash2, XCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useToggleCategoryStatusMutation,
} from '@store/api/categoryApi';

export const AdminCategoriesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editTarget, setEditTarget] = React.useState<any>(null);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState<string>('');
    const [error, setError] = React.useState('');

    const { data, isLoading } = useGetAllCategoriesQuery();
    const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [toggleStatus] = useToggleCategoryStatusMutation();

    const categories: any[] = data?.data ?? [];

    const openAdd = () => {
        setEditTarget(null);
        setName('');
        setDescription('');
        setImageFile(null);
        setPreview('');
        setError('');
        setIsModalOpen(true);
    };

    const openEdit = (cat: any) => {
        setEditTarget(cat);
        setName(cat.name);
        setDescription(cat.description ?? '');
        setImageFile(null);
        setPreview(cat.images?.[0] ?? '');
        setError('');
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        setError('');
        if (name.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
        if (!editTarget && !imageFile) { setError('At least one image is required.'); return; }

        const fd = new FormData();
        fd.append('name', name.trim());
        if (description.trim()) fd.append('description', description.trim());
        if (imageFile) fd.append('images', imageFile);

        try {
            if (editTarget) {
                await updateCategory({ id: editTarget._id, data: fd }).unwrap();
            } else {
                await createCategory(fd).unwrap();
            }
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err?.data?.message ?? 'Something went wrong.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this category?')) return;
        try { await deleteCategory(id).unwrap(); } catch { }
    };

    const handleToggle = async (id: string) => {
        try { await toggleStatus(id).unwrap(); } catch { }
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
                    <div className="bg-[#FDFCF8] border border-[#1A1A1A] w-full max-w-2xl p-12 space-y-10 relative overflow-hidden">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 opacity-40 hover:opacity-100">
                            <XCircle size={24} strokeWidth={1} />
                        </button>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 mb-4">Category</p>
                            <h2 className="text-3xl font-heading font-black italic tracking-tighter uppercase">
                                {editTarget ? 'Edit Category' : 'Add Category'}
                            </h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-[#1A1A1A]/5 p-5 outline-none border-b border-transparent focus:border-[#1A1A1A] transition-all font-light italic"
                                    placeholder="e.g. Winter Collection"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
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
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>

                            {error && (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">{error}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-6 pt-6 border-t border-[#1A1A1A]/5">
                            <button onClick={() => setIsModalOpen(false)} className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">
                                Cancel
                            </button>
                            <Button onClick={handleSubmit} disabled={creating || updating} className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest">
                                {creating || updating ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Category'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};