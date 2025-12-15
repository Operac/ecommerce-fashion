import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../Services/userService';
import { FaShoppingBag, FaBox, FaChartBar, FaTag, FaUsers } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        lowStockCount: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for charts (since backend doesn't support historical endpoints yet)
    const salesData = [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 2000 },
        { name: 'Apr', sales: 2780 },
        { name: 'May', sales: 1890 },
        { name: 'Jun', sales: 2390 },
        { name: 'Jul', sales: 3490 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const headers = { Authorization: `Bearer ${token}` };

                // Parallel fetch for overview data
                const [productsRes, ordersRes, usersRes] = await Promise.all([
                    fetch(`${baseUrl}product/getAllProducts?limit=1000`, { headers }), // Fetching all for accurate stats for now
                    fetch(`${baseUrl}payment/getAllReceipts?limit=5`, { headers }), // Just get recent 5
                    fetch(`${baseUrl}user/getAllUsers?limit=1`, { headers }) // Just need count ideally
                ]);

                const productsData = await productsRes.json();
                const ordersData = await ordersRes.json();
                const usersData = await usersRes.json();

                if (productsData.success) {
                   const products = productsData.data || [];
                   const lowStock = products.filter(p => (p.quantity || 0) < 5).length;
                   
                   // Recalculate total revenue and orders manually if pagination is active on backend
                   // Note: Backend pagination response usually includes 'pagination.totalItems'.
                   // We will use that if available, else fallback to array length (which might be partial)
                   
                   const totalRevenue = (ordersData.data || []).reduce((acc, order) => acc + (Number(order.amount) || 0), 0);
                   
                   setStats({
                       totalProducts: productsData.pagination?.totalItems || products.length,
                       lowStockCount: lowStock,
                       totalOrders: ordersData.pagination?.totalItems || 0,
                       totalUsers: usersData.pagination?.totalItems || 0,
                       totalRevenue: totalRevenue // NOTE: This revenue is only for the visible page if paginated. Backend needs a /stats endpoint for true revenue.
                   });
                }
                
                if (ordersData.success) {
                    setRecentOrders(ordersData.data || []);
                }

                setLoading(false);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatPrice = (price) => `₦${(price || 0).toLocaleString()}`;

    if (loading) return <div className="p-8 text-center">Loading dashboard stats...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={formatPrice(stats.totalRevenue)} 
                    icon={<FaChartBar className="text-green-600" />} 
                    color="green" 
                    subtext="from recent orders"
                />
                <StatCard 
                    title="Total Orders" 
                    value={stats.totalOrders} 
                    icon={<FaBox className="text-blue-600" />} 
                    color="blue" 
                />
                <StatCard 
                    title="Total Products" 
                    value={stats.totalProducts} 
                    icon={<FaShoppingBag className="text-purple-600" />} 
                    color="purple" 
                />
                 <StatCard 
                    title="Total Customers" 
                    value={stats.totalUsers} 
                    icon={<FaUsers className="text-orange-600" />} 
                    color="orange" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-bold mb-4">Sales Analytics (Mock)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#1f2937" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Urgent Actions</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 rounded border border-red-100 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-red-800">Low Stock Alert</p>
                                <p className="text-sm text-red-600">{stats.lowStockCount} products are running low</p>
                            </div>
                            <span className="text-xl font-bold text-red-700">{stats.lowStockCount}</span>
                        </div>
                         <div className="p-4 bg-yellow-50 rounded border border-yellow-100">
                            <p className="font-semibold text-yellow-800">Pending Orders</p>
                            <p className="text-sm text-yellow-600">Review new incoming orders</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                    <a href="/admin/orders" className="text-sm text-blue-600 hover:underline">View All</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium">#{order.orderId ? order.orderId.substring(0,6) : order.id}...</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{order.name}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.amount)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 border-${color}-600`}>
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <div className={`p-2 bg-${color}-50 rounded-full`}>{icon}</div>
        </div>
        <div className="flex items-end items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {subtext && <span className="text-xs text-gray-400">{subtext}</span>}
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        successful: 'bg-green-100 text-green-800',
        delivered: 'bg-green-100 text-green-800',
        shipped: 'bg-blue-100 text-blue-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
            {status || 'Pending'}
        </span>
    );
};

export default DashboardOverview;
