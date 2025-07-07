import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkOrderModal from '../../components/admin/confined/WorkOrderModel';
import WorkOrderTable from '../../components/admin/confined/WorkOrderTable';
import { createWorkOrder, updateWorkOrder, getWorkOrders, deleteWorkOrder, getWorkOrdersByUserId } from '../../services/workOrderService';
import { getAssignedLocations, detachTechnicianFromLocation } from '../../services/locationService';
import { toast } from 'react-toastify';
import ProfileHeader from '../../components/user/ProfileHeader';
import PersonalInformation from '../../components/user/PersonalInformation';
import UserForm from '../../components/user/UserForm';
import LocationMapView from '../../components/user/LocationMapView';
import { updateProfile } from '../../services/userService';

// Confirm Modal Component
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0E1530] rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[#0E1530] text-white rounded-xl hover:bg-[#0E1530]/90 transition-all duration-200 font-semibold shadow-lg"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// Clock component to display current time
const Clock = () => {
    const [time, setTime] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        
        return () => {
            clearInterval(timer);
        };
    }, []);
    
    return (
        <div className="font-bold text-gray-900 text-lg">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
    );
};

function TechnicianDashboard() {
    const [user, setUser] = useState({ firstname: "", lastname: "", profileImage: "" });
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [assignedLocations, setAssignedLocations] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    
    // Toggle mobile menu
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    
    useEffect(() => {
        // Close mobile menu when changing tabs
        setMobileMenuOpen(false);
        
        const userData = localStorage.getItem("User") || sessionStorage.getItem("User");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                
                // Check if user is admin - redirect to admin dashboard
                if (parsedUser && (parsedUser.isAdmin || parsedUser.userType === 'admin')) {
                    toast.info('Admin users should use the admin dashboard');
                    navigate('/admin/dashboard');
                    return;
                }
                
                setUser(parsedUser);
                if (parsedUser.profileImage) {
                    setPreviewImage(parsedUser.profileImage);
                }
                // Fetch the user's assigned locations when the component mounts
                fetchAssignedLocations();
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate('/login');
            }
        } else {
            // If no user data, redirect to login
            navigate('/login');
        }
        
        // Verify auth status when component mounts
        import('../../services/userService').then(({ verifyAuth }) => {
            verifyAuth().catch(() => {
                navigate('/login');
            });
        });
    }, [navigate]);

    // Fetch work orders when tasks tab is active
    useEffect(() => {
        if (activeTab === 'tasks') {
            fetchWorkOrders();
        }
    }, [activeTab]);

    const fetchWorkOrders = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem("User"));
            console.log('Fetching work orders for user:', user);
            
            const response = await getWorkOrdersByUserId(user.id);
            console.log('Work orders API response:', response);
            
            if (response && (Array.isArray(response) || Array.isArray(response.data))) {
                const orders = Array.isArray(response) ? response : response.data;
                console.log('Setting work orders:', orders);
                setWorkOrders(orders);
            } else {
                console.warn('Unexpected response format:', response);
                setWorkOrders([]);
                toast.warning('No work orders available');
            }
        } catch (error) {
            console.error('Error fetching work orders:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch work orders';
            toast.error(errorMessage);
            setWorkOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // New function to fetch assigned locations
    const fetchAssignedLocations = async () => {
        try {
            setLoadingLocations(true);
            const response = await getAssignedLocations();
            console.log('Assigned locations response:', response);
            if (response && response.data) {
                setAssignedLocations(response.data);
            } else if (response && response.locations) {
                setAssignedLocations(response.locations);
            } else {
                setAssignedLocations([]);
            }
        } catch (error) {
            console.error('Error fetching assigned locations:', error);
            toast.error('Failed to load your assigned locations');
            setAssignedLocations([]);
        } finally {
            setLoadingLocations(false);
        }
    };

    // State to track which location is being closed and confirm modal state
    const [closingLocationId, setClosingLocationId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        locationId: null
    });
    
    // Handle closing work (detaching technician from location)
    const handleCloseWork = (locationId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Close Work',
            message: 'Are you sure you want to close this work? This will remove your assignment from this location.',
            locationId
        });
    };
    
    // Handle confirm close work
    const handleConfirmCloseWork = async () => {
        const locationId = confirmModal.locationId;
        
        try {
            setClosingLocationId(locationId);
            setConfirmModal({ isOpen: false, title: '', message: '', locationId: null });
            
            await detachTechnicianFromLocation(locationId);
            toast.success("Work closed successfully. You have been unassigned from this location.");
            
            await fetchAssignedLocations();
        } catch (error) {
            console.error("Error closing work:", error);
            toast.error(error.message || "Failed to close work. Please try again.");
        } finally {
            setClosingLocationId(null);
        }
    };
    
    // Handle cancel close work
    const handleCancelCloseWork = () => {
        setConfirmModal({ isOpen: false, title: '', message: '', locationId: null });
    };

    const handleLogout = () => {
        import('../../services/userService').then(({ logout }) => {
            logout(navigate);
        });
    };

    const handleEditWorkOrder = (order) => {
        setSelectedWorkOrder(order);
        setShowWorkOrderModal(true);
    };

    const [deletingOrderId, setDeletingOrderId] = useState(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        orderId: null
    });
    
    // Handle initiating work order deletion
    const handleDeleteWorkOrder = (orderId) => {
        setDeleteConfirmModal({
            isOpen: true,
            title: 'Delete Work Order',
            message: 'Are you sure you want to delete this work order? This action cannot be undone.',
            orderId
        });
    };
    
    // Handle confirmed work order deletion
    const handleConfirmDeleteWorkOrder = async () => {
        const orderId = deleteConfirmModal.orderId;
        
        try {
            setDeletingOrderId(orderId);
            setDeleteConfirmModal({ isOpen: false, title: '', message: '', orderId: null });
            
            const response = await deleteWorkOrder(orderId);
            if (response) {
                toast.success('Work order deleted successfully');
                await fetchWorkOrders();
            }
        } catch (error) {
            console.error('Error deleting work order:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete work order';
            toast.error(errorMessage);
        } finally {
            setDeletingOrderId(null);
        }
    };
    
    // Handle cancel delete work order
    const handleCancelDeleteWorkOrder = () => {
        setDeleteConfirmModal({ isOpen: false, title: '', message: '', orderId: null });
    };

    // State to prevent duplicate form submissions
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleWorkOrderSubmit = async (formData, savedResponse) => {
        if (savedResponse) {
            setShowWorkOrderModal(false);
            await fetchWorkOrders();
            setIsSubmitting(false);
            return;
        }
        
        if (isSubmitting) {
            toast.info("Your request is being processed, please wait...");
            return;
        }

        try {
            setIsSubmitting(true);
            
            const user = JSON.parse(localStorage.getItem("User"));
            if (!user || !user.id) {
                toast.error('User information not found');
                setIsSubmitting(false);
                return;
            }

            const formattedData = {
                userId: user.id,
                dateOfSurvey: formData.dateOfSurvey ? new Date(formData.dateOfSurvey).toISOString() : new Date().toISOString(),
                surveyors: formData.surveyors ? (
                    Array.isArray(formData.surveyors) 
                        ? formData.surveyors 
                        : formData.surveyors.split(',').map(s => s.trim())
                ) : [],
                confinedSpaceNameOrId: formData.confinedSpaceNameOrId || '',
                building: formData.building || '',
                locationDescription: formData.locationDescription || '',
                confinedSpaceDescription: formData.confinedSpaceDescription || '',
                confinedSpace: Boolean(formData.confinedSpace),
                permitRequired: Boolean(formData.permitRequired),
                entryRequirements: formData.entryRequirements || '',
                atmosphericHazard: Boolean(formData.atmosphericHazard),
                atmosphericHazardDescription: formData.atmosphericHazardDescription || '',
                engulfmentHazard: Boolean(formData.engulfmentHazard),
                engulfmentHazardDescription: formData.engulfmentHazardDescription || '',
                configurationHazard: Boolean(formData.configurationHazard),
                configurationHazardDescription: formData.configurationHazardDescription || '',
                otherRecognizedHazards: Boolean(formData.otherRecognizedHazards),
                otherHazardsDescription: formData.otherHazardsDescription || '',
                ppeRequired: Boolean(formData.ppeRequired),
                ppeList: formData.ppeList || '',
                forcedAirVentilationSufficient: Boolean(formData.forcedAirVentilationSufficient),
                dedicatedContinuousAirMonitor: Boolean(formData.dedicatedContinuousAirMonitor),
                warningSignPosted: Boolean(formData.warningSignPosted),
                otherPeopleWorkingNearSpace: Boolean(formData.otherPeopleWorkingNearSpace),
                canOthersSeeIntoSpace: Boolean(formData.canOthersSeeIntoSpace),
                contractorsEnterSpace: Boolean(formData.contractorsEnterSpace),
                numberOfEntryPoints: formData.numberOfEntryPoints ? Number(formData.numberOfEntryPoints) : 0,
                notes: formData.notes || '',
                pictures: Array.isArray(formData.pictures) ? formData.pictures : []
            };

            let response;
            if (selectedWorkOrder) {
                response = await updateWorkOrder(selectedWorkOrder._id, formattedData);
                if (response) {
                    toast.success('Work order updated successfully');
                    setShowWorkOrderModal(false);
                    setSelectedWorkOrder(null);
                    await fetchWorkOrders();
                }
            } else {
                let retries = 0;
                const maxRetries = 3;
                const retryDelay = 1000;
                
                while (retries < maxRetries) {
                    try {
                        response = await createWorkOrder(formattedData);
                        if (response) {
                            toast.success('Work order created successfully');
                            setShowWorkOrderModal(false);
                            setSelectedWorkOrder(null);
                            await fetchWorkOrders();
                            break;
                        }
                    } catch (retryError) {
                        if (retryError.response && retryError.response.status === 429 && retries < maxRetries - 1) {
                            retries++;
                            toast.info(`Request rate limited. Retrying in ${retryDelay/1000} seconds... (${retries}/${maxRetries})`);
                            await new Promise(resolve => setTimeout(resolve, retryDelay));
                        } else {
                            throw retryError;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error saving work order:', error);
            let errorMessage = error.message || 'Failed to save work order';
            
            if (error.response) {
                switch (error.response.status) {
                    case 429:
                        errorMessage = 'Too many requests. Please wait a moment and try again.';
                        break;
                    case 400:
                        errorMessage = error.response.data?.message || 'Invalid data. Please check your form.';
                        break;
                    case 401:
                        errorMessage = 'Your session has expired. Please login again.';
                        break;
                    case 403:
                        errorMessage = 'You do not have permission to create work orders.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = error.response.data?.message || errorMessage;
                }
            }
            
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (formData) => {
        try {
            setLoading(true);
            const response = await updateProfile(formData);
            if (response) {
                const userData = JSON.parse(localStorage.getItem("User") || sessionStorage.getItem("User"));
                const updatedUser = { ...userData, ...response };
                localStorage.setItem("User", JSON.stringify(updatedUser));
                sessionStorage.setItem("User", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setShowUpdateForm(false);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const navItems = [
        { 
            id: 'dashboard', 
            label: 'Dashboard', 
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            description: 'Your workspace overview and assigned locations'
        },
        { 
            id: 'profile', 
            label: 'Profile', 
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            description: 'Manage your personal information' 
        },
        { 
            id: 'tasks', 
            label: 'Tasks', 
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            description: 'Manage your confined space work orders'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Menu Button */}
            <button 
                className="fixed top-4 left-4 p-3 rounded-2xl bg-[#0E1530] text-white shadow-lg xl:hidden z-50 hover:bg-[#0E1530]/90 transition-all duration-200"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                )}
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl border-r border-gray-100 z-40 overflow-y-auto transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0`}>
                {/* Sidebar header */}
                <div className="bg-[#0E1530] p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/30">
                            <span className="text-white font-bold text-2xl">
                                {user.firstname?.[0] || "T"}
                                {user.lastname?.[0] || ""}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-white truncate">
                                {user.firstname} {user.lastname}
                            </p>
                            <div className="mt-2 flex items-center">
                                <span className="inline-flex h-3 w-3 rounded-full bg-green-400 mr-2"></span>
                                <p className="text-sm font-medium text-gray-200">Technician</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Navigation */}
                <div className="p-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-200 group ${
                                    activeTab === item.id
                                        ? 'bg-[#0E1530] text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center">
                                    <div className={`mr-4 p-2 rounded-xl ${activeTab === item.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                                        <svg className={`h-5 w-5 transition-colors ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} 
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <span className="font-semibold">{item.label}</span>
                                        <p className={`text-xs mt-1 transition-colors ${activeTab === item.id ? 'text-gray-200' : 'text-gray-500'}`}>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Logout button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-white">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold bg-[#0E1530] text-white hover:bg-[#0E1530]/90 rounded-2xl transition-all duration-200 shadow-lg"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 xl:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 ml-0 xl:ml-80 transition-all duration-300">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                    <div className="px-6 lg:px-8 py-6 flex flex-wrap justify-between items-center gap-4">
                        <div className="ml-12 xl:ml-0 flex-1 min-w-0">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                Technician Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your assigned locations and work orders</p>
                        </div>
                        
                        <div className="flex flex-col items-end">
                            <Clock />
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-6 lg:p-8 bg-gray-50">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">My Assigned Locations</h2>
                                    <p className="text-gray-600 mt-1">View and manage your assigned confined space locations</p>
                                </div>
                            </div>

                            {loadingLocations ? (
                                <div className="flex justify-center items-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0E1530] border-t-transparent"></div>
                                        <p className="text-gray-600 font-medium">Loading your locations...</p>
                                    </div>
                                </div>
                            ) : assignedLocations.length === 0 ? (
                                <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-gray-100">
                                    <div className="w-20 h-20 bg-[#0E1530] rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No locations assigned</h3>
                                    <p className="text-gray-600 mb-1">You haven't been assigned to any locations yet</p>
                                    <p className="text-sm text-gray-500">Please contact an administrator to get access to locations</p>
                                </div>
                            ) : (
                                <div className="grid gap-8">
                                    {assignedLocations.map((location) => (
                                        <div
                                            key={location._id}
                                            className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                        >
                                            <div className="flex flex-col lg:flex-row">
                                                {/* Map Section */}
                                                <div className="lg:w-2/5 w-full min-h-[280px] bg-gray-50">
                                                    <LocationMapView location={location} height="280px" />
                                                </div>
                                                
                                                {/* Info Section */}
                                                <div className="flex-1 flex flex-col justify-between p-6 lg:p-8">
                                                    <div>
                                                        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                                                {location.name}
                                                            </h3>
                                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                                                                location.isActive
                                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                                    : 'bg-red-100 text-red-800 border border-red-200'
                                                            }`}>
                                                                <div className={`w-2 h-2 rounded-full mr-2 ${location.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                                {location.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                            <div className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-xl">
                                                                <svg className="h-5 w-5 mr-3 text-[#0E1530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                </svg>
                                                                <span className="text-sm font-medium">{location.address || 'No address provided'}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-xl">
                                                                <svg className="h-5 w-5 mr-3 text-[#0E1530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                                </svg>
                                                                <span className="text-sm font-medium">
                                                                    {location.latitude
                                                                        ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                                                                        : 'No coordinates'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        {location.description && (
                                                            <div className="p-4 bg-[#0E1530]/5 rounded-2xl border border-[#0E1530]/10">
                                                                <h4 className="text-sm font-bold text-[#0E1530] mb-2">Description:</h4>
                                                                <p className="text-sm text-gray-700">{location.description}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedWorkOrder(null);
                                                                setShowWorkOrderModal(true);
                                                            }}
                                                            className="flex-1 px-6 py-3 bg-[#0E1530] text-white rounded-2xl hover:bg-[#0E1530]/90 transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                            <span>Create Work Order</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleCloseWork(location._id)}
                                                            disabled={closingLocationId === location._id}
                                                            className={`flex-1 px-6 py-3 border-2 border-red-600 text-red-600 bg-white hover:bg-red-50 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold ${
                                                                closingLocationId === location._id ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        >
                                                            {closingLocationId === location._id ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                                                    <span>Closing...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                    <span>Close Work</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Confined Space Work Orders</h2>
                                    <p className="text-gray-600 mt-1">Manage and track your confined space assessments</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedWorkOrder(null);
                                        setShowWorkOrderModal(true);
                                    }}
                                    className="w-full sm:w-auto px-6 py-3 bg-[#0E1530] text-white rounded-2xl hover:bg-[#0E1530]/90 transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>New Work Order</span>
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0E1530] border-t-transparent"></div>
                                        <p className="text-gray-600 font-medium">Loading work orders...</p>
                                    </div>
                                </div>
                            ) : workOrders.length === 0 ? (
                                <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-gray-100">
                                    <div className="w-20 h-20 bg-[#0E1530] rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No work orders found</h3>
                                    <p className="text-gray-600">Create your first confined space work order to get started</p>
                                </div>
                            ) : (
                                <WorkOrderTable
                                    orders={workOrders}
                                    onEdit={handleEditWorkOrder}
                                    onDelete={handleDeleteWorkOrder}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <ProfileHeader 
                                user={user} 
                                onProfileUpdate={() => setShowUpdateForm(true)} 
                            />
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <PersonalInformation user={user} />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Work Order Modal */}
            {showWorkOrderModal && (
                <WorkOrderModal
                    show={showWorkOrderModal}
                    onClose={() => {
                        setShowWorkOrderModal(false);
                        setSelectedWorkOrder(null);
                    }}
                    onSubmit={(responseData) => handleWorkOrderSubmit(null, responseData)}
                    order={selectedWorkOrder}
                    isEdit={!!selectedWorkOrder}
                    assignedLocationData={assignedLocations.length === 1 ? assignedLocations[0] : null}
                />
            )}

            {/* Update Profile Form */}
            {showUpdateForm && (
                <UserForm
                    user={user}
                    onSubmit={handleProfileUpdate}
                    onClose={() => setShowUpdateForm(false)}
                />
            )}

            {/* Work Close Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={handleConfirmCloseWork}
                onCancel={handleCancelCloseWork}
            />
            
            {/* Work Order Delete Confirm Modal */}
            <ConfirmModal
                isOpen={deleteConfirmModal.isOpen}
                title={deleteConfirmModal.title}
                message={deleteConfirmModal.message}
                onConfirm={handleConfirmDeleteWorkOrder}
                onCancel={handleCancelDeleteWorkOrder}
            />
        </div>
    );
}

export default TechnicianDashboard;