import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { assignTechnicians, getLocations } from '../../../services/locationService';
import { getTechnicians } from '../../../services/userService';

const AssignTechniciansModal = ({ isOpen, onClose, location, onAssign }) => {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianIds, setSelectedTechnicianIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [assignedTechniciansMap, setAssignedTechniciansMap] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTechniciansAndAssignments();

      if (location && location.assignedTechnicians) {
        const techIds = Array.isArray(location.assignedTechnicians)
          ? location.assignedTechnicians.map(tech => typeof tech === 'object' ? tech._id : tech)
          : [];
        setSelectedTechnicianIds(techIds);
      } else {
        setSelectedTechnicianIds([]);
      }
    }
  }, [isOpen, location]);

  const fetchTechniciansAndAssignments = async () => {
    setFetchingUsers(true);
    setError('');
    try {
      const [technicianUsers, locationsData] = await Promise.all([
        getTechnicians(),
        getLocations()
      ]);

      setTechnicians(technicianUsers);

      const technicianAssignmentMap = {};
      const locations = locationsData?.locations || locationsData?.data || [];

      locations.forEach(loc => {
        if (loc.assignedTechnicians && Array.isArray(loc.assignedTechnicians)) {
          loc.assignedTechnicians.forEach(techId => {
            if (location && loc._id !== location._id) {
              const technicianId = typeof techId === 'object' ? techId._id : techId;
              technicianAssignmentMap[technicianId] = loc;
            }
          });
        }
      });

      setAssignedTechniciansMap(technicianAssignmentMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load technicians and assignments');
      toast.error('Failed to load technician data');
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleToggleTechnician = (techId) => {
    if (!selectedTechnicianIds.includes(techId) && assignedTechniciansMap[techId]) {
      const assignedLocation = assignedTechniciansMap[techId];
      toast.warning(`This technician is already assigned to location: ${assignedLocation.name}`);
      return;
    }

    setSelectedTechnicianIds(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await assignTechnicians(location._id, selectedTechnicianIds);
      toast.success('Technicians assigned successfully');
      onAssign && onAssign();
      onClose();
    } catch (error) {
      console.error('Error assigning technicians:', error);
      toast.error(error.message || 'Failed to assign technicians');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0E1530] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Technicians
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Select technicians for <span className="font-semibold text-[#0E1530]">{location?.name}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {fetchingUsers ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#0E1530] mb-4"></div>
              <p className="text-gray-600 font-medium">Loading technicians...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-900 font-semibold mb-4 text-lg">
                  Select Technicians
                </label>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-700 font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {technicians.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No technicians available</h3>
                    <p className="text-gray-500">Please add technicians to the system first.</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                    {technicians.map((tech) => {
                      const isAssignedElsewhere = assignedTechniciansMap[tech._id];
                      const isSelected = selectedTechnicianIds.includes(tech._id);

                      return (
                        <div
                          key={tech._id}
                          className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                            isAssignedElsewhere
                              ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#0E1530]/5 border-[#0E1530] shadow-lg'
                              : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md cursor-pointer'
                          }`}
                          onClick={() => !isAssignedElsewhere && handleToggleTechnician(tech._id)}
                        >
                          <div className="flex items-start gap-4">
                            {/* Custom Checkbox */}
                            <div className="flex-shrink-0 pt-1">
                              <div
                                className={`
                                  w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                                  ${
                                    isAssignedElsewhere
                                      ? 'border-gray-300 bg-gray-200'
                                      : isSelected
                                      ? 'border-[#0E1530] bg-[#0E1530]'
                                      : 'border-gray-300 hover:border-[#0E1530]'
                                  }
                                `}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>

                            {/* Technician Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#0E1530] rounded-xl flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">
                                    {tech.firstname?.[0]}{tech.lastname?.[0]}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className={`font-semibold text-lg ${
                                    isAssignedElsewhere ? 'text-gray-500' : 'text-gray-900'
                                  }`}>
                                    {tech.firstname} {tech.lastname}
                                  </h3>
                                  <p className={`text-sm ${
                                    isAssignedElsewhere ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {tech.email}
                                  </p>
                                </div>
                              </div>
                              
                              {isAssignedElsewhere && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-3">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-blue-800 text-sm font-medium">
                                      Already assigned to: {assignedTechniciansMap[tech._id].name}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0E1530] text-white rounded-xl font-semibold hover:bg-[#0E1530]/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none"
                  disabled={loading || fetchingUsers}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    `Assign ${selectedTechnicianIds.length} Technician${selectedTechnicianIds.length !== 1 ? 's' : ''}`
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTechniciansModal;
