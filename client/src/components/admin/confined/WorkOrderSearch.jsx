import React from "react";

const WorkOrderSearch = ({ search, onChange, onSearch, onClear }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(e);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Work Orders</h3>
        <p className="text-sm text-gray-500">Find specific work orders using the filters below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Order ID Search */}
          <div className="space-y-2">
            <label htmlFor="id" className="block text-sm font-semibold text-gray-700">
              Order ID
            </label>
            <input
              type="text"
              name="id"
              id="id"
              value={search.id || ''}
              onChange={onChange}
              placeholder="Enter order ID..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-white text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500">
              Search by full or partial order ID
            </p>
          </div>

          {/* Space Name/ID Search */}
          <div className="space-y-2">
            <label htmlFor="confinedSpaceNameOrId" className="block text-sm font-semibold text-gray-700">
              Space Name/ID
            </label>
            <input
              type="text"
              name="confinedSpaceNameOrId"
              id="confinedSpaceNameOrId"
              value={search.confinedSpaceNameOrId || ''}
              onChange={onChange}
              placeholder="Enter space name..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-white text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500">
              Search by confined space name or ID
            </p>
          </div>

          {/* Building Search */}
          <div className="space-y-2">
            <label htmlFor="building" className="block text-sm font-semibold text-gray-700">
              Building
            </label>
            <input
              type="text"
              name="building"
              id="building"
              value={search.building || ''}
              onChange={onChange}
              placeholder="Enter building name..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-white text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500">
              Search by building name
            </p>
          </div>

          {/* Survey Date Search */}
          <div className="space-y-2">
            <label htmlFor="dateOfSurvey" className="block text-sm font-semibold text-gray-700">
              Survey Date
            </label>
            <input
              type="date"
              name="dateOfSurvey"
              id="dateOfSurvey"
              value={search.dateOfSurvey || ''}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-white text-gray-900"
            />
            <p className="text-xs text-gray-500">
              Filter by survey date
            </p>
          </div>

          {/* Permit Required Filter */}
          <div className="space-y-2">
            <label htmlFor="permitRequired" className="block text-sm font-semibold text-gray-700">
              Permit Required
            </label>
            <select
              name="permitRequired"
              id="permitRequired"
              value={search.permitRequired || ''}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-white text-gray-900"
            >
              <option value="">All permits</option>
              <option value="true">Required</option>
              <option value="false">Not Required</option>
            </select>
            <p className="text-xs text-gray-500">
              Filter by permit requirement
            </p>
          </div>

          {/* Confined Space Filter */}
          <div className="space-y-2">
            <label htmlFor="confinedSpace" className="block text-sm font-semibold text-gray-700">
              Confined Space
            </label>
            <select
              name="confinedSpace"
              id="confinedSpace"
              value={search.confinedSpace || ''}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all bg-white text-gray-900"
            >
              <option value="">All spaces</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <p className="text-xs text-gray-500">
              Filter by confined space status
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Orders
            </div>
          </button>
          
          <button
            type="button"
            onClick={onClear}
            className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkOrderSearch;