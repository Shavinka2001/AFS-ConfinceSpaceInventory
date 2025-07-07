import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getLocations, createLocation, deleteLocation, updateLocation } from '../../services/locationService';
import LocationMap from '../../components/admin/location/LocationMap';
import LocationTable from '../../components/admin/location/LocationTable';
import LocationModal from '../../components/admin/location/LocationModal';
import AssignedLocations from '../../components/admin/location/AssignedLocations';
import AssignTechniciansModal from '../../components/admin/location/AssignTechniciansModal';
import BuildingManagement from '../../components/admin/location/BuildingManagement';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 }); // Default center (Sri Lanka)
  const [mapZoom, setMapZoom] = useState(7);
  
  const mapRef = useRef(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await getLocations();
      setLocations(data.locations || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError(err.message || "Failed to fetch locations");
      toast.error(err.message || "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setIsEdit(true);
    setShowModal(true);
    
    // Center map on the location being edited
    if (location.latitude && location.longitude) {
      setMapCenter({ lat: location.latitude, lng: location.longitude });
      setMapZoom(15);
    }
  };

  // Helper for system-style confirmation using toast
  const confirmDialog = (message) => {
    return new Promise((resolve) => {
      const toastId = toast(
        ({ closeToast }) => (
          <div>
            <div className="font-semibold mb-2">{message}</div>
            <div className="flex gap-2">
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => {
                  resolve(true);
                  toast.dismiss(toastId);
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                onClick={() => {
                  resolve(false);
                  toast.dismiss(toastId);
                }}
              >
                No
              </button>
            </div>
          </div>
        ),
        { autoClose: false, closeOnClick: false }
      );
    });
  };

  const handleDeleteLocation = async (location) => {
    const confirmed = await confirmDialog(`Are you sure you want to delete ${location.name}?`);
    if (confirmed) {
      try {
        await deleteLocation(location._id);
        toast.success("Location deleted successfully");
        fetchLocations();
      } catch (err) {
        toast.error(err.message || "Failed to delete location");
      }
    }
  };

  const handleSubmitLocation = async (formData) => {
    try {
      if (isEdit && selectedLocation) {
        await updateLocation(selectedLocation._id, formData);
        toast.success("Location updated successfully");
      } else {
        await createLocation(formData);
        toast.success("Location created successfully");
      }
      fetchLocations();
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to save location");
    }
  };

  const handleViewOnMap = (location) => {
    if (location.latitude && location.longitude) {
      setMapCenter({ lat: location.latitude, lng: location.longitude });
      setMapZoom(15);
      
      // Scroll to map if on mobile
      const mapElement = document.getElementById('location-map');
      if (mapElement && window.innerWidth < 768) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAssignTechnicians = (location) => {
    setSelectedLocation(location);
    setShowAssignModal(true);
  };

  const handleManageBuildings = (location) => {
    setSelectedLocation(location);
    setShowBuildingModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-6 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Location Management</h1>
                  <p className="text-lg text-gray-600 mt-2">Manage locations, buildings, and technician assignments</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span>Total Locations: {locations.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Active: {locations.filter(l => l.isActive !== false).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>With Buildings: {locations.filter(l => l.buildings && l.buildings.length > 0).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>With Technicians: {locations.filter(l => l.assignedTechnicians && l.assignedTechnicians.length > 0).length}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddLocation}
                className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Location
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-6 bg-white border-l-4 border-red-500 rounded-2xl shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-900 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Locations Table Section */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-white border-b border-gray-100 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Locations</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {locations.length} location{locations.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>
            </div>
            <LocationTable 
              locations={locations} 
              loading={loading}
              onEdit={handleEditLocation}
              onDelete={handleDeleteLocation}
              onViewOnMap={handleViewOnMap}
              onAssignTechnicians={handleAssignTechnicians}
              onManageBuildings={handleManageBuildings}
            />
          </div>

          {/* Map View Section */}
          <div id="location-map" className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-white border-b border-gray-100 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Map View</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Interactive map showing all locations
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Click markers to edit locations</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-gray-100">
                <LocationMap 
                  locations={locations}
                  center={mapCenter}
                  zoom={mapZoom}
                  onMarkerClick={handleEditLocation}
                  mapRef={mapRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {showModal && (
        <LocationModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitLocation}
          location={selectedLocation}
          isEdit={isEdit}
          mapRef={mapRef}
        />
      )}
      
      {showAssignModal && (
        <AssignTechniciansModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          location={selectedLocation}
          onAssign={fetchLocations}
        />
      )}

      {showBuildingModal && (
        <BuildingManagement
          isOpen={showBuildingModal}
          onClose={() => setShowBuildingModal(false)}
          location={selectedLocation}
        />
      )}
    </div>
  );
};

export default LocationManagement;
