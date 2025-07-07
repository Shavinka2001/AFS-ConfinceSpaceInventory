import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getBuildingsForLocation, addBuildingToLocation, updateBuildingInLocation, deleteBuildingFromLocation } from '../../../services/buildingService';

const BuildingManagement = ({ location, onClose, isOpen }) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (isOpen && location) {
      fetchBuildings();
    }
  }, [isOpen, location]);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const response = await getBuildingsForLocation(location._id);
      setBuildings(response.buildings || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast.error(error.message || 'Failed to load buildings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Building name is required');
      return;
    }

    setLoading(true);
    try {
      if (editingBuilding) {
        await updateBuildingInLocation(location._id, editingBuilding._id, formData);
        toast.success('Building updated successfully');
      } else {
        await addBuildingToLocation(location._id, formData);
        toast.success('Building added successfully');
      }
      
      resetForm();
      fetchBuildings();
    } catch (error) {
      console.error('Error saving building:', error);
      toast.error(error.message || 'Failed to save building');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (building) => {
    setEditingBuilding(building);
    setFormData({ name: building.name, description: building.description || '' });
    setIsFormVisible(true);
  };

  const handleDelete = async (buildingId) => {
    if (!window.confirm('Are you sure you want to delete this building?')) return;

    setLoading(true);
    try {
      await deleteBuildingFromLocation(location._id, buildingId);
      toast.success('Building deleted successfully');
      fetchBuildings();
    } catch (error) {
      console.error('Error deleting building:', error);
      toast.error(error.message || 'Failed to delete building');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingBuilding(null);
    setIsFormVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 lg:p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0E1530] rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Building Management</h2>
              <p className="text-gray-500 mt-1">Manage buildings for <span className="font-semibold text-[#0E1530]">{location?.name}</span></p>
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

        <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add Building Button */}
          <div className="mb-8">
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                isFormVisible 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-[#0E1530] text-white hover:bg-[#0E1530]/90 shadow-lg hover:shadow-xl'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {isFormVisible ? 'Cancel' : 'Add New Building'}
            </button>
          </div>

          {/* Add/Edit Building Form */}
          {isFormVisible && (
            <div className="bg-gray-50 rounded-3xl p-6 lg:p-8 mb-8 border-2 border-dashed border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingBuilding ? 'Edit Building' : 'Add New Building'}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Building Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all"
                      placeholder="e.g. Building A, Main Building"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E1530] focus:border-[#0E1530] transition-all"
                      placeholder="Brief description of the building"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
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
                        Saving...
                      </div>
                    ) : (
                      editingBuilding ? 'Update Building' : 'Add Building'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Buildings List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Buildings
                </h3>
                <span className="px-3 py-1 bg-[#0E1530]/10 text-[#0E1530] rounded-full text-sm font-semibold">
                  {buildings.length} building{buildings.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#0E1530] mb-4"></div>
                <p className="text-gray-600 font-medium">Loading buildings...</p>
              </div>
            ) : buildings.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No buildings found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Add buildings to organize your location and manage confined spaces effectively.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buildings.map((building) => (
                  <div key={building._id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0E1530] rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-lg text-gray-900">{building.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(building)}
                          className="p-2 text-[#0E1530] hover:bg-[#0E1530]/10 rounded-xl transition-colors"
                          title="Edit building"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(building._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete building"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {building.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{building.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        building.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {building.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 012 2z" />
                        </svg>
                        {new Date(building.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingManagement;
