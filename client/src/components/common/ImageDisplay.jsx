import React from "react";

const ImageDisplay = ({ pictures = [] }) => {
  const [selectedImage, setSelectedImage] = React.useState(null);

  // Filter out invalid/empty images and ensure we have valid URLs
  const validPictures = pictures?.filter(pic => 
    pic && 
    typeof pic === 'string' && 
    pic.trim() !== '' &&
    (pic.startsWith('http') || pic.startsWith('/uploads/') || pic.startsWith('/image/'))
  ).map(pic => {
    // Convert relative paths to full URLs
    if (pic.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_FILE_SERVER_URL || 'http://localhost:5002'}${pic}`;
    } else if (pic.startsWith('/image/')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5002'}${pic}`;
    }
    return pic;
  }) || [];

  if (!validPictures || validPictures.length === 0) {
    return (
      <div className="flex items-center justify-center h-16">
        <span className="text-sm text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex -space-x-2">
        {validPictures.slice(0, 3).map((image, index) => (
          <div 
            key={index}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden cursor-pointer hover:z-10 shadow-sm"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Failed to load image:', image);
                e.target.style.display = 'none';
              }}
            />
          </div>
        ))}
        {validPictures.length > 3 && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-900 shadow-sm">
            +{validPictures.length - 3}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full mx-4">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageDisplay;
