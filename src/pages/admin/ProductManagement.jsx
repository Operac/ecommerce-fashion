import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../Services/userService';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import AdminPagination from '../../Components/AdminPagination';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    
    // Modal & Form States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [addFormData, setAddFormData] = useState({
        name: '', description: '', price: '', categoryid: '', quantity: '', currency: 'NGN',
        oldPrice: '', discount: 0, rating: 0, bestSelling: false, newArrival: false,
        subcategory: '', defaultSize: '', defaultColor: '', sizes: '', colors: '', tags: []
    });
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSubcategories();
        fetchTags();
    }, [page]); 

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${baseUrl}getAllProducts?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProducts(data.data || []);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages);
                    setTotalItems(data.pagination.totalItems);
                }
            } else {
                toast.error(data.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
             const res = await fetch(`${baseUrl}getAllCategories`, { headers: { Authorization: `Bearer ${token}` } });
             const data = await res.json();
             if (data.success) setCategories(data.data || []);
        } catch (error) { console.error(error); }
    };

    const fetchSubcategories = async () => {
        try {
            const token = localStorage.getItem('token');
             const res = await fetch(`${baseUrl}subcategory/getAll`, { headers: { Authorization: `Bearer ${token}` } });
             const data = await res.json();
             // Assuming structure matches others
             if (data && Array.isArray(data)) setSubcategories(data); 
             else if (data.success) setSubcategories(data.data || []);
        } catch (error) { console.error(error); }
    };

    const fetchTags = async () => {
        try {
            const token = localStorage.getItem('token');
             const res = await fetch(`${baseUrl}tag/getAll`, { headers: { Authorization: `Bearer ${token}` } });
             const data = await res.json();
             if (data && Array.isArray(data)) setAllTags(data);
             else if (data.success) setAllTags(data.data || []);
        } catch (error) { console.error(error); }
    };

    const handleCreateTag = async () => {
        if (!newTag.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${baseUrl}tag/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: newTag })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Tag created!');
                setNewTag('');
                fetchTags();
            } else {
                toast.error(data.message || 'Failed to create tag');
            }
        } catch (error) { console.error(error); toast.error('Error creating tag'); }
    };

    // --- Delete Logic ---
    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseUrl}deleteProduct/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Product deleted successfully');
                fetchProducts(); 
            } else {
                toast.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product');
        }
    };

    // --- Add Logic ---
    const handleAddChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setAddFormData({ ...addFormData, [name]: files[0] });
        } else if (type === 'checkbox') {
            setAddFormData({ ...addFormData, [name]: checked });
        } else {
            setAddFormData({ ...addFormData, [name]: value });
        }
    };

    const parseList = (str) => {
        if (!str) return [];
        if (Array.isArray(str)) return str;
        return str.split(',').map(item => item.trim()).filter(Boolean);
    };

    // Handler for Arrays (Tags, etc)
    const handleArrayToggle = (field, value) => {
        setAddFormData(prev => {
            const current = Array.isArray(prev[field]) ? prev[field] : [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            
            // Append basic fields
            Object.keys(addFormData).forEach(key => {
                if (key === 'sizes' || key === 'colors' || key === 'tags' || key === 'file') return;
                formData.append(key, addFormData[key]);
            });

            // Handle Arrays
            parseList(addFormData.sizes).forEach(s => formData.append('sizes', s));
            parseList(addFormData.colors).forEach(c => formData.append('colors', c));
            
            // Tags is usually an array now
            const finalTags = Array.isArray(addFormData.tags) ? addFormData.tags : parseList(addFormData.tags);
            finalTags.forEach(t => formData.append('tags', t));

            if (addFormData.file) formData.append('image', addFormData.file);

            const response = await fetch(`${baseUrl}createProduct`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            
            const data = await response.json();
            if (response.ok && data.success) {
                toast.success('Product created successfully');
                setShowAddModal(false);
                setAddFormData({ 
                    name: '', description: '', price: '', categoryid: '', quantity: '', currency: 'NGN',
                    oldPrice: '', discount: 0, rating: 0, bestSelling: false, newArrival: false,
                    subcategory: '', defaultSize: '', defaultColor: '', sizes: '', colors: '', tags: []
                });
                fetchProducts();
            } else {
                toast.error(data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error("Error creating product", error);
            toast.error("Failed to create product");
        }
    };

    // --- Edit Logic ---
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditFormData({ ...product }); // Helper to prefill
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
       const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setEditFormData({ ...editFormData, [name]: checked });
        } else {
            setEditFormData({ ...editFormData, [name]: value });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
             const token = localStorage.getItem('token');
             const payload = {
                 ...editFormData,
                 sizes: typeof editFormData.sizes === 'string' ? parseList(editFormData.sizes) : editFormData.sizes,
                 colors: typeof editFormData.colors === 'string' ? parseList(editFormData.colors) : editFormData.colors,
                 tags: typeof editFormData.tags === 'string' ? parseList(editFormData.tags) : editFormData.tags,
             };
             
             // Remove image field if it's a string url (updates usually don't send image URL as text unless handled by backend, but backend expects mulipart for NEW images)
             // If we want to support image update, we need multipart form data for edit too. simpler to skip for now unless requested.
             delete payload.image; 

             const response = await fetch(`${baseUrl}updateProduct/${editingProduct.id}`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                 body: JSON.stringify(payload)
             });
             
             if (response.ok) {
                 toast.success('Product updated');
                 setShowEditModal(false);
                 fetchProducts();
             } else {
                 toast.error('Update failed');
             }
        } catch (err) { console.error(err); toast.error('Update failed'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-serif">Product Management</h1>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <FaPlus /> Add Product
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">No products found</td></tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-full object-cover" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦{product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.quantity > 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditClick(product)} className="text-indigo-600 hover:text-indigo-900 mr-4"><FaEdit /></button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <AdminPagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                    totalItems={totalItems} 
                />
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">Add New Product</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500">&times;</button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Basic Info */}
                                <input name="name" placeholder="Product Name *" value={addFormData.name} onChange={handleAddChange} required className="border p-2 rounded" />
                                
                                {/* Category Dropdown */}
                                <select name="categoryid" value={addFormData.categoryid} onChange={handleAddChange} required className="border p-2 rounded">
                                    <option value="">Select Category *</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                                {/* Subcategory Dropdown - Filtered */}
                                <select name="subcategory" value={addFormData.subcategory} onChange={handleAddChange} className="border p-2 rounded">
                                    <option value="">Select Subcategory</option>
                                    {subcategories
                                        .filter(sub => !addFormData.categoryid || sub.categoryId === parseInt(addFormData.categoryid))
                                        .map(sub => (
                                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                                        ))
                                    }
                                </select>
                                
                                {/* Pricing */}
                                <input name="currency" placeholder="Currency (e.g. NGN)" value={addFormData.currency} onChange={handleAddChange} className="border p-2 rounded" />
                                <input name="price" type="number" placeholder="Price *" value={addFormData.price} onChange={handleAddChange} required className="border p-2 rounded" />
                                <input name="oldPrice" type="number" placeholder="Old Price" value={addFormData.oldPrice} onChange={handleAddChange} className="border p-2 rounded" />
                                <input name="discount" type="number" placeholder="Discount %" value={addFormData.discount} onChange={handleAddChange} className="border p-2 rounded" />

                                {/* Inventory & Details */}
                                <input name="quantity" type="number" placeholder="Quantity" value={addFormData.quantity} onChange={handleAddChange} className="border p-2 rounded" />
                                <input name="defaultSize" placeholder="Default Size" value={addFormData.defaultSize} onChange={handleAddChange} className="border p-2 rounded" />
                                <input name="defaultColor" placeholder="Default Color" value={addFormData.defaultColor} onChange={handleAddChange} className="border p-2 rounded" />
                                <input name="rating" type="number" placeholder="Rating (0-5)" max="5" min="0" step="0.1" value={addFormData.rating} onChange={handleAddChange} className="border p-2 rounded" />

                                {/* Lists */}
                                <input name="sizes" placeholder="Sizes (S, M, L)" value={addFormData.sizes} onChange={handleAddChange} className="border p-2 rounded" />
                                <input name="colors" placeholder="Colors (Red, Blue)" value={addFormData.colors} onChange={handleAddChange} className="border p-2 rounded" />
                                
                                {/* Tags Management */}
                                <div className="border p-2 rounded flex flex-col gap-2">
                                    <label className="text-xs text-gray-500">Tags</label>
                                    <div className="flex flex-wrap gap-1">
                                        {Array.isArray(addFormData.tags) && addFormData.tags.map(tag => (
                                            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                                                {tag} 
                                                <button type="button" onClick={() => handleArrayToggle('tags', tag)} className="ml-1 text-red-500 hover:text-red-700">&times;</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <select 
                                            className="border p-1 rounded text-sm flex-1"
                                            onChange={(e) => {
                                                if (e.target.value) handleArrayToggle('tags', e.target.value);
                                                e.target.value = ""; // Reset select
                                            }}
                                        >
                                            <option value="">Add existing tag...</option>
                                            {allTags.map(t => (
                                                <option key={t.id} value={t.name}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input 
                                            placeholder="New tag name" 
                                            value={newTag} 
                                            onChange={(e) => setNewTag(e.target.value)}
                                            className="border p-1 rounded text-sm flex-1"
                                        />
                                        <button type="button" onClick={handleCreateTag} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Create</button>
                                    </div>
                                </div>

                                {/* Booleans */}
                                <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                                    <input type="checkbox" name="bestSelling" id="bestSelling" checked={addFormData.bestSelling} onChange={handleAddChange} />
                                    <label htmlFor="bestSelling" className="text-sm cursor-pointer select-none">Best Selling</label>
                                </div>
                                <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                                    <input type="checkbox" name="newArrival" id="newArrival" checked={addFormData.newArrival} onChange={handleAddChange} />
                                    <label htmlFor="newArrival" className="text-sm cursor-pointer select-none">New Arrival</label>
                                </div>
                            </div>

                            {/* Full Width Fields */}
                            <textarea name="description" placeholder="Product Description" rows="3" onChange={handleAddChange} className="border p-2 rounded w-full" />
                            <div className="border p-2 rounded w-full">
                                <span className="block text-sm text-gray-500 mb-1">Product Image</span>
                                <input type="file" name="file" onChange={handleAddChange} className="w-full" />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

             {/* Edit Modal (Simplified) */}
             {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">Edit Product</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500">&times;</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <input name="name" value={editFormData.name || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Name" />
                                <input name="price" type="number" value={editFormData.price || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Price" />
                                <input name="oldPrice" type="number" value={editFormData.oldPrice || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Old Price" />
                                <input name="discount" type="number" value={editFormData.discount || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Discount" />
                                <input name="quantity" type="number" value={editFormData.quantity || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Quantity" />
                                <input name="subcategory" value={editFormData.subcategory || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Subcategory" />
                                <input name="sizes" value={editFormData.sizes || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Sizes (comma sep)" />
                                <input name="colors" value={editFormData.colors || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Colors (comma sep)" />
                                <input name="tags" value={editFormData.tags || ''} onChange={handleEditChange} className="border p-2 rounded" placeholder="Tags (comma sep)" />
                                 <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                                    <input type="checkbox" name="bestSelling" id="editBestSelling" checked={editFormData.bestSelling || false} onChange={handleEditChange} />
                                    <label htmlFor="editBestSelling" className="text-sm cursor-pointer select-none">Best Selling</label>
                                </div>
                                <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                                    <input type="checkbox" name="newArrival" id="editNewArrival" checked={editFormData.newArrival || false} onChange={handleEditChange} />
                                    <label htmlFor="editNewArrival" className="text-sm cursor-pointer select-none">New Arrival</label>
                                </div>
                            </div>
                            <textarea name="description" value={editFormData.description || ''} onChange={handleEditChange} rows="3" className="border p-2 rounded w-full" placeholder="Description" />
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
