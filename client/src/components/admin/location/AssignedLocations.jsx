import React, { useState, useEffect } from 'react';
import { getAssignedLocations } from '../../../services/locationService';
import { getTechnicianById } from '../../../services/userService';
import { toast } from 'react-toastify';
import AssignTechniciansModal from './AssignTechniciansModal';

const AssignedLocations = ({ isAdmin = false }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [technicianDetails, setTechnicianDetails] = useState({});

  useEffect(() => {
    fetchAssignedLocations();
  }, []);

  const fetchAssignedLocations = async () => {
    setLoading(true);
    try {
      const data = await getAssignedLocations();
      setLocations(data.data || []);
    } catch (error) {
      console.error('Error fetching assigned locations:', error);
      toast.error(error.message || 'Failed to load your assigned locations');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (location) => {
    setSelectedLocation(location);
  };

  const handleAssignTechnicians = () => {
    if (selectedLocation) {
      setShowAssignModal(true);
    } else {
      toast.info('Please select a location first');
    }
  };

  const handleAssignmentComplete = () => {
    fetchAssignedLocations();
    setShowAssignModal(false);
  };

  const fetchTechnicianDetails = async (technicianIds) => {
    const techDetails = {};
    
    if (!technicianIds || !technicianIds.length) return;
    
    for (const id of technicianIds) {
      try {
        if (!technicianDetails[id]) {
          const techData = await getTechnicianById(id);
          techDetails[id] = techData;
        }
      } catch (error) {
        console.error(`Error fetching details for technician ${id}:`, error);
      }
    }
    
    setTechnicianDetails(prevDetails => ({
      ...prevDetails,
      ...techDetails
    }));
  };

  useEffect(() => {
    if (selectedLocation?.assignedTechnicians?.length > 0) {
      fetchTechnicianDetails(selectedLocation.assignedTechnicians);
    }
  }, [selectedLocation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#0E1530]"></div>
          <p className="text-gray-600 font-medium">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0E1530] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isAdmin ? 'Manage Location Assignments' : 'My Assigned Locations'}
            </h2>
            <p className="text-gray-500 mt-1">
              {locations.length} location{locations.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <button 
            onClick={handleAssignTechnicians}
            disabled={!selectedLocation}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              !selectedLocation 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-[#0E1530] text-white hover:bg-[#0E1530]/90 shadow-lg hover:shadow-xl'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Assign Technicians
          </button>
        )}
      </div>
      
      {/* Empty State */}
      {locations.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {isAdmin ? 'No locations found' : 'No assigned locations'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {isAdmin 
              ? 'Please add locations first to manage assignments.' 
              : "You don't have any assigned locations yet."
            }
          </p>
        </div>
      ) : (
        /* Locations Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map(location => (
            <div 
              key={location._id} 
              className={`bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedLocation?._id === location._id 
                  ? 'border-[#0E1530] bg-[#0E1530]/5 shadow-lg' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => handleViewDetails(location)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#0E1530] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  location.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {location.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {/* Show saved name if deleted */}
                {location.isDeleted
                  ? (location.confinedSpaceNameOrId || location.name)
                  : location.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {/* Show saved address/description if deleted */}
                {location.isDeleted
                  ? (location.locationDescription || location.address)
                  : location.address}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 012 2z" />
                  </svg>
                  {new Date(location.createdAt).toLocaleDateString()}
                </div>
                <button 
                  className="text-[#0E1530] hover:text-[#0E1530]/80 font-semibold text-sm flex items-center gap-1 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(location);
                  }}
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="mt-8 p-6 border-2 border-gray-100 rounded-3xl bg-gray-50">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0E1530] rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedLocation.name}</h3>
                <p className="text-gray-500">Location Details</p>
              </div>
            </div>
            <button 
              className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-white transition-colors"
              onClick={() => setSelectedLocation(null)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Location Information</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span> {selectedLocation.address}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Description:</span> {selectedLocation.description || 'No description provided'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Coordinates:</span> {selectedLocation.latitude?.toFixed(6)}, {selectedLocation.longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Status Information</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedLocation.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedLocation.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Created:</span> {new Date(selectedLocation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Assigned Work Section */}
          <div className="bg-white rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Assigned Work</h4>
            <p className="text-gray-600 text-sm">Work orders related to this location will appear here.</p>
          </div>
          
          {/* Assigned Technicians Section */}
          <div className="bg-white rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Assigned Technicians</h4>
            {selectedLocation.assignedTechnicians?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedLocation.assignedTechnicians.map((techId) => {
                  const tech = technicianDetails[techId];
                  return (
                    <div key={techId} className="bg-[#0E1530]/5 border border-[#0E1530]/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0E1530] rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {tech ? `${tech.firstname?.[0]}${tech.lastname?.[0]}` : 'T'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        {tech ? (
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {tech.firstname} {tech.lastname}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600 truncate">
                            Technician ({techId.substring(0, 6)}...)
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No technicians assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <AssignTechniciansModal 
        isOpen={showAssignModal} 
        onClose={() => setShowAssignModal(false)} 
        location={selectedLocation} 
        onAssign={handleAssignmentComplete}
      />
    </div>
  );
};

export default AssignedLocations;
