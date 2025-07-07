import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LocationPicker from './LocationPicker';
import LocationSearchBar from './LocationSearchBar';

const LocationModal = ({ isOpen, onClose, onSubmit, location, isEdit, mapRef }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: null,
    longitude: null
  });
  const [loading, setLoading] = useState(false);

  // Initialize form data when editing an existing location
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        description: location.description || '',
        address: location.address || '',
        latitude: location.latitude || null,
        longitude: location.longitude || null
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Location name is required');
      return;
    }
    
    if (!formData.latitude || !formData.longitude) {
      toast.error('Please select a location on the map');
      return;
    }

    if (!formData.address) {
      toast.error('Address is required');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error(error.message || 'Error saving location');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 lg:p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0E1530] rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {location ? 'Edit Location' : 'Add New Location'}
              </h2>
              <p className="text-gray-500 mt-1">
                {location ? 'Update location details and coordinates' : 'Create a new location with map coordinates'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all"
                    placeholder="e.g. Main Building, Warehouse A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all"
                    placeholder="e.g. 123 Main Street, City, State"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all resize-none"
                  placeholder="Brief description of this location, facilities, or special considerations"
                ></textarea>
              </div>
            </div>

            {/* Coordinates Section */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Coordinates</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude || ''}
                    onChange={handleChange}
                    required
                    step="0.000001"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all"
                    placeholder="e.g. 41.40338"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude || ''}
                    onChange={handleChange}
                    required
                    step="0.000001"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all"
                    placeholder="e.g. 2.17403"
                  />
                </div>
              </div>

              {formData.latitude && formData.longitude && (
                <div className="mt-4 p-4 bg-[#0E1530]/5 border border-[#0E1530]/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0E1530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-[#0E1530]">
                      Selected coordinates: {Number(formData.latitude).toFixed(6)}, {Number(formData.longitude).toFixed(6)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Map Selection</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Search Location *
                  </label>
                  <LocationSearchBar 
                    onLocationFound={(coords) => {
                      setFormData(prev => ({
                        ...prev,
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        address: coords.address || prev.address
                      }));
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Click on Map to Select *
                  </label>
                  <LocationPicker 
                    onLocationSelected={(coords) => {
                      setFormData(prev => ({
                        ...prev,
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        address: coords.address || prev.address
                      }));
                    }}
                    initialLocation={
                      formData.latitude && formData.longitude
                        ? [formData.latitude, formData.longitude]
                        : null
                    }
                  />
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Location Selection</p>
                      <p className="text-sm text-blue-700">
                        {formData.address || 'No address selected yet. Search above or click on the map to select a location.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#0E1530] text-white rounded-xl font-semibold hover:bg-[#0E1530]/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {location ? 'Updating...' : 'Adding...'}
                  </div>
                ) : (
                  location ? 'Update Location' : 'Add Location'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
