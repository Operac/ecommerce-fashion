import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../Services/userService';
import { toast } from 'react-toastify';
import { FaTrash, FaEye } from 'react-icons/fa';
import AdminPagination from '../../Components/AdminPagination';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${baseUrl}getAllReceipts?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data || []);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages);
                    setTotalItems(data.pagination.totalItems);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
             const token = localStorage.getItem('token');
             const res = await fetch(`${baseUrl}updateReceiptStatus/${id}`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                 body: JSON.stringify({ status })
             });
             const data = await res.json();
             if (res.ok) {
                 toast.success('Status updated');
                 fetchOrders();
             } else {
                 toast.error(data.message || 'Update failed');
             }
        } catch (err) { toast.error('Update failed'); }
    };

    const handleDeleteOrder = async (id) => {
        if(!window.confirm("Delete this order?")) return;
        try {
             const token = localStorage.getItem('token');
             const res = await fetch(`${baseUrl}deleteReceipt/${id}`, {
                 method: 'DELETE',
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (res.ok) {
                 toast.success('Order deleted');
                 fetchOrders();
             } else {
                 toast.error('Deletion failed');
             }
        } catch (err) { toast.error('Deletion failed'); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-serif">Order Management</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr> : orders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">#{order.id.substring(0,6)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">₦{order.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                         <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 hover:text-red-700 ml-2"><FaTrash/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <AdminPagination currentPage={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
            </div>
        </div>
    );
};

export default OrderManagement;
