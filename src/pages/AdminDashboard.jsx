import React, { useState, useEffect } from 'react';
import { baseUrl } from '../Services/userService';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaBox, FaChartBar, FaTag, FaPlus, FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
      name: '', description: '', price: '', categoryid: '', quantity: '', currency: 'NGN'
  });

  // Auth check on mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');

        if (!token || !userData) {
          console.log('✗ No authentication found');
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        
        if (parsedUser.role !== 'ADMIN') {
          console.log('✗ User is not an admin');
          toast.error('Admin access required!');
          navigate('/');
          return;
        }

        setUser(parsedUser);
        console.log('✓ Admin access granted for:', parsedUser.firstName);
        await fetchDashboardData();
      } catch (error) {
        console.error('Error in checkAdminAccess:', error);
        navigate('/login');
      }
    };

    checkAdminAccess();
  }, [navigate]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      setLoading(true);
      
      // Fetch products
      try {
        const productsRes = await fetch(`${baseUrl}product/getAllProducts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const productsData = await productsRes.json();
        if (productsData.success) {
          setProducts(productsData.data || []);
          console.log('✓ Products fetched:', productsData.data?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }

      // Fetch categories
      try {
        const categoriesRes = await fetch(`${baseUrl}category/getAllCategories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data || []);
          console.log('✓ Categories fetched:', categoriesData.data?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    console.log('✓ Admin logged out');
    navigate('/login');
  };

  // Delete product
  const handleDeleteProduct = async (productName) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}product/deleteProduct/${productName}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setProducts(products.filter(p => p.name !== productName));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}category/deleteCategory/${categoryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== categoryId));
        toast.success('Category deleted successfully');
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      categoryid: product.categoryid || '',
      discount: product.discount || 0,
      rating: product.rating || 0,
      sizes: product.sizes || '',
      colors: product.colors || '',
      quantity: product.quantity || 0,
    });
    setShowEditModal(true);
  };

  // Save edited product
  const handleSaveEditProduct = async () => {
    if (!editingProduct || !editingProduct.id) {
      toast.error('Product ID is missing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Use FormData for file upload support if needed, or JSON if only text
      // Ideally update backend to accept JSON for updates, but for now assuming JSON or FormData based on previous code.
      // Previous code used JSON body for update, but updateProduct supports FormData. 
      // Let's stick to JSON for now as per `body: JSON.stringify(editFormData)` in original code, 
      // BUT if we want to support image update we need FormData.
      // For consistency with original code, keep JSON for update unless user asks for image update. 
      // For Add Product we definitely need FormData for image.
      
      const response = await fetch(`${baseUrl}product/updateProduct/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        // Refetch to get clean list or update locally
        await fetchDashboardData(); 
        toast.success('Product updated successfully');
        setShowEditModal(false);
        setEditingProduct(null);
        setEditFormData({});
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
  };

  const handleAddProductSubmit = async () => {
      try {
           const token = localStorage.getItem('token');
           const formData = new FormData();
           formData.append('name', addFormData.name);
           formData.append('description', addFormData.description);
           formData.append('price', addFormData.price);
           formData.append('quantity', addFormData.quantity);
           formData.append('categoryid', addFormData.categoryid);
           formData.append('currency', 'NGN');
           if (addFormData.file) {
               formData.append('image', addFormData.file);
           }

           const response = await fetch(`${baseUrl}product/createProduct`, {
               method: 'POST',
               headers: {
                   Authorization: `Bearer ${token}`
               },
               body: formData
           });
           
           const data = await response.json();

           if(response.ok && data.success) {
               toast.success('Product created successfully');
               setShowAddModal(false);
               setAddFormData({ name: '', description: '', price: '', categoryid: '', quantity: '', currency: 'NGN' });
               fetchDashboardData();
           } else {
               toast.error(data.message || 'Failed to create product');
           }

      } catch (error) {
          console.error("Error creating product", error);
          toast.error("Failed to create product");
      }
  };

  const formatPrice = (price) => {
    return `₦${(price || 0).toLocaleString()}`;
  };

  // Overview Component
  const Overview = () => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const outOfStockCount = products.filter(p => (p.quantity || 0) <= 0).length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded border border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-black">{totalProducts}</p>
              </div>
              <FaShoppingBag className="text-black text-4xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded border border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <FaBox className="text-red-600 text-4xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded border border-gray-300">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Categories</p>
                <p className="text-3xl font-bold text-black">{totalCategories}</p>
              </div>
              <FaTag className="text-black text-4xl" />
            </div>
          </div>
         
          <div className="bg-white p-6 rounded border border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-black">{orders.length}</p>
              </div>
              <FaBox className="text-black text-4xl" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Products Component
  const Products = () => {
    const filteredProducts = products.filter(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Products ({filteredProducts.length})</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800"
          >
            <FaPlus size={20} /> Add Product
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="bg-white rounded border border-gray-300 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                 <th className="px-6 py-3 text-left text-sm font-semibold">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium">{product.name}</td>
                    <td className="px-6 py-3 text-sm">{formatPrice(product.price)}</td>
                    <td className="px-6 py-3 text-sm">
                        {product.quantity > 0 ? (
                            <span className="text-green-600 font-bold">{product.quantity}</span>
                        ) : (
                            <span className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded text-xs">OUT OF STOCK</span>
                        )}
                    </td>
                    <td className="px-6 py-3 text-sm">{product.categoryid}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 truncate max-w-xs">{product.description}</td>
                    <td className="px-6 py-3 text-sm flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Categories Component
  const Categories = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Categories ({categories.length})</h2>
          <button
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800"
          >
            <FaPlus size={20} /> Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category.id} className="bg-white p-4 rounded border border-gray-300 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-600">ID: {category.id}</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No categories found
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {user && <p className="text-gray-300">Welcome, {user.firstName}!</p>}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2"
        >
          <FaSignOutAlt size={20} /> Logout
        </button>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-2 border-b-2 ${activeTab === 'overview' ? 'border-black text-black font-semibold' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-2 border-b-2 ${activeTab === 'products' ? 'border-black text-black font-semibold' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-2 border-b-2 ${activeTab === 'categories' ? 'border-black text-black font-semibold' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'categories' && <Categories />}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={editFormData.quantity}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={editFormData.discount}
                  onChange={(e) => setEditFormData({ ...editFormData, discount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  max="5"
                  value={editFormData.rating}
                  onChange={(e) => setEditFormData({ ...editFormData, rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveEditProduct}
                className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                  setEditFormData({});
                }}
                className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal (Reusing structure, could separate but inline is faster for now) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

               <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={addFormData.description}
                  onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={addFormData.price}
                    onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={addFormData.quantity}
                    onChange={(e) => setAddFormData({ ...addFormData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category ID</label>
                <input
                  type="number"
                  value={addFormData.categoryid}
                  onChange={(e) => setAddFormData({ ...addFormData, categoryid: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
                
                {/* Simplified for brevity, normally would use select for Category */}
                
               <div>
                <label className="block text-sm font-medium mb-1">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                   onChange={(e) => setAddFormData({ ...addFormData, file: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddProductSubmit}
                className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Create Product
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
