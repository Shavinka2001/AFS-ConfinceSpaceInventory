const multer = require('multer');
const { uploadFileToBlob } = require('../config/azureStorage');

// Configure multer to use memory storage (we'll upload to Azure instead of disk)
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Check if file is an image
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        
        // Check for supported image formats
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed!'), false);
        }
        
        cb(null, true);
    }
});

/**
 * Middleware to upload files to Azure Blob Storage
 * This middleware should be used after multer middleware
 */
const uploadToAzure = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            // No files to upload, continue
            return next();
        }

        const uploadPromises = req.files.map(async (file) => {
            try {
                // Upload file buffer to Azure Blob Storage
                const blobUrl = await uploadFileToBlob(
                    file.buffer, 
                    file.originalname, 
                    file.mimetype
                );
                
                return blobUrl;
            } catch (error) {
                console.error('Error uploading file to Azure:', error);
                throw new Error(`Failed to upload ${file.originalname}: ${error.message}`);
            }
        });

        // Wait for all uploads to complete
        const uploadedUrls = await Promise.all(uploadPromises);
        
        // Add the uploaded URLs to the request object
        req.uploadedImageUrls = uploadedUrls;
        
        console.log(`Successfully uploaded ${uploadedUrls.length} files to Azure Blob Storage`);
        
        next();
    } catch (error) {
        console.error('Azure upload middleware error:', error);
        res.status(500).json({ 
            error: 'Failed to upload images to storage',
            details: error.message 
        });
    }
};

/**
 * Combined middleware for handling file uploads and Azure storage
 */
const handleImageUpload = [
    upload.array('images', 5), // Allow up to 5 images
    uploadToAzure
];

module.exports = {
    upload,
    uploadToAzure,
    handleImageUpload
};
