const express = require('express');
const router = express.Router();
const orderController = require('../../src/controllers/orderController.js');
const jwt = require('jsonwebtoken');
const { handleImageUpload } = require('../middleware/azureUpload');
const { getBlobData } = require('../config/azureStorage');
const Order = require('../model/order.js');

// Helper function to convert Azure blob URLs to local proxy URLs (duplicate from controller for test)
const convertAzureUrlsToProxy = (pictures) => {
  if (!Array.isArray(pictures)) return pictures;
  
  return pictures.map(pic => {
    if (typeof pic === 'string' && pic.includes('afsconfined.blob.core.windows.net')) {
      const url = new URL(pic);
      const blobName = url.pathname.split('/').pop();
      return `/image/${blobName}`;
    }
    return pic;
  });
};

// Authentication middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Test route to verify URL conversion
router.get('/test-urls', async (req, res) => {
  try {
    // Get a sample order with images
    const order = await Order.findOne({ pictures: { $exists: true, $ne: [] } });
    if (!order) {
      return res.json({ message: 'No orders with images found' });
    }
    
    res.json({
      originalPictures: order.pictures,
      convertedPictures: convertAzureUrlsToProxy(order.pictures)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image proxy route to serve Azure blobs (no authentication required for image viewing)
router.get('/image/:blobName', async (req, res) => {
  try {
    const { blobName } = req.params;
    
    if (!blobName) {
      return res.status(400).json({ error: 'Blob name is required' });
    }

    const blobData = await getBlobData(blobName);
    
    // Set appropriate headers
    res.set({
      'Content-Type': blobData.contentType,
      'Content-Length': blobData.contentLength,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'ETag': `"${blobName}"` // Simple ETag for caching
    });
    
    // Pipe the blob stream to the response
    blobData.stream.pipe(res);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(404).json({ error: 'Image not found' });
  }
});

// Protected routes
router.post('/', protect, handleImageUpload, orderController.createOrder);
router.get('/', orderController.getOrders); // Admin: all orders (now public)
router.get('/user/:userId', protect, orderController.getOrdersByUserId); // Get orders by specific userId
router.get('/my-orders', protect, orderController.getMyOrders); // Get current user's orders
router.get('/:id', orderController.getOrderById); // Public: get order by ID
router.put('/:id', protect, handleImageUpload, orderController.updateOrder); // Update order
router.delete('/:id', protect, orderController.deleteOrder); // Delete order

module.exports = router;
