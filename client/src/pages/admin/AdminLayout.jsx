import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HomeIcon,
    UsersIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    ClipboardDocumentListIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ firstname: "", lastname: "" });
    const { user: authUser, isAuthenticated, logout: authLogout, isAdmin, isLoading } = useAuth();

    useEffect(() => {
        // Wait for loading to finish before checking privileges
        if (isLoading) return;

        if (authUser) {
            if (!isAdmin) {
                navigate('/user/dashboard', { replace: true });
                return;
            }
            setUser(authUser);
        } else {
            const userData = localStorage.getItem("User") || sessionStorage.getItem("User");
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    if (!(parsedUser.isAdmin || parsedUser.userType === 'admin')) {
                        navigate('/user/dashboard', { replace: true });
                        return;
                    }
                    setUser(parsedUser);
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    navigate('/login', { replace: true });
                }
            } else {
                navigate('/login', { replace: true });
            }
        }
    }, [authUser, isAdmin, isLoading, navigate]);

    // Show loading spinner while loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    const stats = {
        totalWorkOrders: 150,
        totalTechnician: 20,
        totalLocations: 25,
        totalUsers: 45,
    };

    const navigation = [
        { 
            name: 'Dashboard', 
            to: '/admin/dashboard', 
            icon: HomeIcon,
            color: 'bg-[#0E1530]',
            bgColor: 'bg-[#0E1530]/5',
            textColor: 'text-[#0E1530]'
        },
        { 
            name: 'User Management', 
            to: '/admin/users', 
            icon: UsersIcon,
            color: 'bg-[#0E1530]',
            bgColor: 'bg-[#0E1530]/5',
            textColor: 'text-[#0E1530]'
        },
        { 
            name: 'Confine Space Work Orders', 
            to: '/admin/workorders', 
            icon: ClipboardDocumentListIcon,
            color: 'bg-[#0E1530]',
            bgColor: 'bg-[#0E1530]/5',
            textColor: 'text-[#0E1530]'
        },
        { 
            name: 'Location Management', 
            to: '/admin/locations', 
            icon: MapPinIcon,
            color: 'bg-[#0E1530]',
            bgColor: 'bg-[#0E1530]/5',
            textColor: 'text-[#0E1530]'
        },
    ];
    
    const handleLogout = () => {
        // Use the logout function from AuthContext
        authLogout();
    };

    const SidebarNavLink = ({ item }) => (
        <NavLink
            to={item.to}
            className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive
                        ? `${item.color} text-white font-semibold shadow-lg transform scale-105`
                        : `text-gray-700 hover:bg-gray-50 hover:text-gray-900 ${item.bgColor} hover:${item.textColor}`
                }`
            }
        >
            <item.icon className={`h-5 w-5 transition-all duration-300 ${
                location.pathname === item.to ? 'text-white' : 'group-hover:scale-110'
            }`} />
            <span className="font-medium">{item.name}</span>
        </NavLink>
    );

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-80 flex-col bg-white border-r border-gray-100 shadow-2xl">
                <div className="h-20 flex items-center justify-center border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    </div>
                </div>
                
                <nav className="flex-1 p-6 space-y-3">
                    {navigation.map((item) => (
                        <SidebarNavLink key={item.name} item={item} />
                    ))}
                </nav>
                
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-4 mb-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                                {user.firstname?.[0] || ""}{user.lastname?.[0] || ""}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 shadow-lg border border-gray-100 hover:border-red-200"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Navbar */}
            <header className="lg:hidden fixed top-0 w-full bg-white shadow-xl z-50 flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                </div>
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
            </header>

            {/* Mobile Sidebar Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex pointer-events-none">
                    <div className="fixed inset-0 bg-black/50 pointer-events-auto" onClick={() => setSidebarOpen(false)}></div>
                    <div
                        className="relative z-50 w-80 bg-white shadow-2xl flex flex-col h-full pointer-events-auto"
                        style={{ transition: 'transform 0.3s ease-out', transform: 'translateX(0)' }}
                    >
                        <div className="h-20 flex items-center justify-center border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-white">Menu</h2>
                            </div>
                            <button 
                                onClick={() => setSidebarOpen(false)}
                                className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <nav className="flex-1 p-6 space-y-3">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                                            isActive
                                                ? `${item.color} text-white font-semibold shadow-lg transform scale-105`
                                                : `text-gray-700 hover:bg-gray-50 hover:text-gray-900 ${item.bgColor} hover:${item.textColor}`
                                        }`
                                    }
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className={`h-5 w-5 transition-all duration-300 ${
                                        location.pathname === item.to ? 'text-white' : 'group-hover:scale-110'
                                    }`} />
                                    <span className="font-medium">{item.name}</span>
                                </NavLink>
                            ))}
                        </nav>
                        
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-4 mb-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                        {user.firstname?.[0] || ""}{user.lastname?.[0] || ""}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSidebarOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 shadow-lg border border-gray-100 hover:border-red-200"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 mt-16 lg:mt-0">
                    {location.pathname === '/admin' || location.pathname === '/admin/' ? (
                        <div className="space-y-8">
                            {/* Welcome Card */}
                            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h2 className="text-3xl lg:text-4xl font-bold">
                                                    Welcome back, {user?.firstname || ""} {user?.lastname || ""}!
                                                </h2>
                                                <p className="text-lg mt-2 text-gray-300">
                                                    {new Date().toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-300">Role</p>
                                            <p className="text-xl font-bold">Administrator</p>
                                        </div>
                                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-inner">
                                            <span className="text-gray-900 font-bold text-xl">
                                                {user?.firstname?.[0] || ""}{user?.lastname?.[0] || ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-[#0E1530] rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalWorkOrders}</p>
                                            <p className="text-sm text-gray-500">Total</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 font-semibold">Work Orders</p>
                                </div>

                                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-[#0E1530] rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalTechnician}</p>
                                            <p className="text-sm text-gray-500">Total</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 font-semibold">Technicians</p>
                                </div>

                                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-[#0E1530] rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalLocations}</p>
                                            <p className="text-sm text-gray-500">Total</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 font-semibold">Locations</p>
                                </div>

                                <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-[#0E1530] rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                                            <p className="text-sm text-gray-500">Total</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 font-semibold">Users</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
