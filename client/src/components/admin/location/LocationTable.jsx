import React, { useState } from 'react';

const LocationTable = ({ locations = [], loading, onEdit, onDelete, onViewOnMap, onAssignTechnicians, onManageBuildings }) => {
  const [expanded, setExpanded] = useState({});

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0E1530] border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading locations...</p>
        </div>
      </div>
    );
  }
  
  if (locations.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 bg-[#0E1530] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No locations found</h3>
        <p className="text-gray-600 mb-1">Get started by adding your first location</p>
        <p className="text-sm text-gray-500">Locations help organize your confined space inventory</p>
      </div>
    );
  }
  
  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Location Management</h3>
        <p className="text-sm text-gray-600 mt-1">Manage and organize your confined space locations</p>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Location Details
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Address
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Technicians
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {locations.map((location) => (
              <React.Fragment key={location._id}>
                <tr className="hover:bg-gray-50 group transition-all duration-200">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleExpand(location._id)}
                        className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-[#0E1530]/10 transition-colors"
                        title={expanded[location._id] ? "Hide details" : "Show details"}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${expanded[location._id] ? "rotate-90 text-[#0E1530]" : "text-gray-400"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-gray-900 cursor-pointer hover:text-[#0E1530] transition-colors" onClick={() => toggleExpand(location._id)}>
                            {location.isDeleted
                              ? (location.confinedSpaceNameOrId || location.name)
                              : location.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          {location.latitude && location.longitude ? 
                            `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 
                            'No coordinates'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {location.isDeleted
                        ? (location.locationDescription || location.address)
                        : location.address}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      location.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${location.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {location.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm">
                      {location.assignedTechnicians && location.assignedTechnicians.length > 0 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0E1530]/10 text-[#0E1530] border border-[#0E1530]/20">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          {location.assignedTechnicians.length} assigned
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          No technicians assigned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onViewOnMap && onViewOnMap(location)}
                        className="p-2 text-gray-600 hover:text-[#0E1530] hover:bg-[#0E1530]/10 rounded-xl transition-all duration-200"
                        title="View on map"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onAssignTechnicians && onAssignTechnicians(location)}
                        className="p-2 text-gray-600 hover:text-[#0E1530] hover:bg-[#0E1530]/10 rounded-xl transition-all duration-200"
                        title="Assign technicians"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onManageBuildings && onManageBuildings(location)}
                        className="p-2 text-gray-600 hover:text-[#0E1530] hover:bg-[#0E1530]/10 rounded-xl transition-all duration-200"
                        title="Manage buildings"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(location)}
                        className="p-2 text-gray-600 hover:text-[#0E1530] hover:bg-[#0E1530]/10 rounded-xl transition-all duration-200"
                        title="Edit location"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(location)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        title="Delete location"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                {expanded[location._id] && (
                  <tr>
                    <td colSpan={5} className="bg-[#0E1530]/5 border-t border-[#0E1530]/10">
                      <div className="px-8 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900">Description</h4>
                              </div>
                              <div className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                                {location.description || <span className="italic text-gray-400">No description provided</span>}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900">Created At</h4>
                              </div>
                              <div className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
                                {location.createdAt ? new Date(location.createdAt).toLocaleString() : "N/A"}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-[#0E1530] rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <h4 className="text-sm font-bold text-gray-900">Buildings</h4>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                              {location.buildings && location.buildings.length > 0 ? (
                                <div className="space-y-3">
                                  {location.buildings.map((b, i) => (
                                    <div key={b._id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                      <div className="flex-1">
                                        <div className="font-semibold text-sm text-gray-900">{b.name}</div>
                                        {b.description && (
                                          <div className="text-xs text-gray-500 mt-1">{b.description}</div>
                                        )}
                                      </div>
                                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        b.isActive 
                                          ? 'bg-green-100 text-green-800 border border-green-200' 
                                          : 'bg-red-100 text-red-800 border border-red-200'
                                      }`}>
                                        {b.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  <p className="text-sm text-gray-500">No buildings added yet</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationTable;
