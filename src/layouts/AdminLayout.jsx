import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaChartBar, FaShoppingBag, FaBox, FaUsers, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userData');
        navigate('/login');
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const navItems = [
        { path: '/admin', end: true, label: 'Overview', icon: <FaChartBar /> },
        { path: '/admin/products', label: 'Products', icon: <FaShoppingBag /> },
        { path: '/admin/orders', label: 'Orders', icon: <FaBox /> },
        { path: '/admin/users', label: 'Customers', icon: <FaUsers /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h1 className="text-2xl font-bold font-serif">Grandeur Admin</h1>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
                           <FaTimes size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end={item.end}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                                                isActive ? 'bg-gray-100 border-r-4 border-black font-semibold' : ''
                                            }`
                                        }
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-6 py-3 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header (Mobile Only) */}
                <header className="bg-white shadow-sm p-4 lg:hidden flex items-center justify-between">
                     <button onClick={toggleSidebar} className="text-gray-600">
                        <FaBars size={24} />
                    </button>
                    <span className="font-bold">Dashboard</span>
                    <div className="w-6"></div> {/* Spacer */}
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
