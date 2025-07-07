import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { mapsLoaderOptions, defaultMapCenter } from '../../config/mapsConfig';

const LocationMapView = ({ location, height = '300px' }) => {
  const { isLoaded } = useJsApiLoader(mapsLoaderOptions);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center bg-gray-50 rounded-2xl border border-gray-100" style={{ height }}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#0E1530] border-t-transparent"></div>
          <p className="text-gray-600 font-medium text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!location || !location.latitude || !location.longitude) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-gray-50 rounded-2xl border border-gray-100 p-6" style={{ height }}>
        <div className="w-16 h-16 bg-[#0E1530] rounded-2xl flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Location Data</h3>
        <p className="text-gray-600 text-center text-sm">Location coordinates are not available</p>
        <p className="text-gray-500 text-center text-xs mt-1">Please contact an administrator</p>
      </div>
    );
  }

  const position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude)
  };

  return (
    <div
      className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white"
      style={{ height, minHeight: height, width: '100%' }}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={position}
        zoom={15}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        <Marker
          position={position}
          onClick={() => setShowInfoWindow(true)}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#0E1530"/>
                <circle cx="20" cy="20" r="8" fill="white"/>
                <circle cx="20" cy="20" r="4" fill="#0E1530"/>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }}
        >
          {showInfoWindow && (
            <InfoWindow
              position={position}
              onCloseClick={() => setShowInfoWindow(false)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -40),
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div className="p-4 max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0E1530] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      {location.isDeleted
                        ? (location.confinedSpaceNameOrId || location.name)
                        : location.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg className="w-3 h-3 text-[#0E1530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="truncate">
                          {location.isDeleted
                            ? (location.locationDescription || location.address || 'No address provided')
                            : (location.address || 'No address provided')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg className="w-3 h-3 text-[#0E1530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span>
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </span>
                      </div>
                      {location.description && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-700 leading-relaxed">{location.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </div>
  );
};

export default LocationMapView;
