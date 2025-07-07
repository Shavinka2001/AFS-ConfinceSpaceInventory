const Order = require('../../src/model/order.js');
const path = require('path');
const { deleteBlobFromStorage, extractBlobNameFromUrl } = require('../config/azureStorage');

// Helper function to convert Azure blob URLs to local proxy URLs
const convertAzureUrlsToProxy = (pictures) => {
  if (!Array.isArray(pictures)) return pictures;
  
  return pictures.map(pic => {
    if (typeof pic === 'string' && pic.includes('afsconfined.blob.core.windows.net')) {
      const blobName = extractBlobNameFromUrl(pic);
      return blobName ? `/image/${blobName}` : pic;
    }
    return pic;
  });
};

// Helper function to convert local proxy URLs back to Azure URLs (for deletion purposes)
const convertProxyUrlsToAzure = (pictures) => {
  if (!Array.isArray(pictures)) return pictures;
  
  return pictures.map(pic => {
    if (typeof pic === 'string' && pic.startsWith('/image/')) {
      const blobName = pic.replace('/image/', '');
      return `https://afsconfined.blob.core.windows.net/confined-space-images/${blobName}`;
    }
    return pic;
  });
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Handle Azure blob URLs from uploadToAzure middleware
    const pictures = [];
    
    // Get uploaded image URLs from Azure middleware
    if (req.uploadedImageUrls && req.uploadedImageUrls.length > 0) {
      pictures.push(...req.uploadedImageUrls);
    }
    
    // Also handle existing pictures from request body (for updates with existing images)
    if (req.body.pictures) {
      try {
        const existingPictures = typeof req.body.pictures === 'string' 
          ? JSON.parse(req.body.pictures) 
          : req.body.pictures;
        
        if (Array.isArray(existingPictures)) {
          pictures.push(...existingPictures);
        }
      } catch (error) {
        console.error('Error parsing existing pictures:', error);
      }
    }

    // Limit to maximum 5 images
    const limitedPictures = pictures.slice(0, 5);

    // Merge file URLs with other data
    const orderData = { 
      ...req.body,
      pictures: limitedPictures
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();
    
    console.log(`Order created with ${limitedPictures.length} images`);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all orders (admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    // Convert Azure URLs to local proxy URLs for frontend consumption
    const ordersWithProxyUrls = orders.map(order => ({
      ...order.toObject(),
      pictures: convertAzureUrlsToProxy(order.pictures)
    }));
    res.json(ordersWithProxyUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders by userId
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    // Convert Azure URLs to local proxy URLs for frontend consumption
    const ordersWithProxyUrls = orders.map(order => ({
      ...order.toObject(),
      pictures: convertAzureUrlsToProxy(order.pictures)
    }));
    res.json(ordersWithProxyUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders for current user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    // Convert Azure URLs to local proxy URLs for frontend consumption
    const ordersWithProxyUrls = orders.map(order => ({
      ...order.toObject(),
      pictures: convertAzureUrlsToProxy(order.pictures)
    }));
    res.json(ordersWithProxyUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search orders by various fields
exports.searchOrders = async (req, res) => {
  try {
    const { id, uniqueId, confinedSpaceNameOrId, building, dateOfSurvey } = req.query;
    const query = {};

    if (id) {
      query.$or = [
        { _id: { $regex: id, $options: "i" } },
        { uniqueId: { $regex: id, $options: "i" } }
      ];
    }
    if (uniqueId) {
      query.uniqueId = { $regex: uniqueId, $options: "i" };
    }
    if (confinedSpaceNameOrId) {
      query.confinedSpaceNameOrId = { $regex: confinedSpaceNameOrId, $options: "i" };
    }
    if (building) {
      query.building = { $regex: building, $options: "i" };
    }
    // --- Date filter: match only date part ---
    if (dateOfSurvey) {
      // Parse the date string and create a range for the whole day
      const start = new Date(dateOfSurvey);
      const end = new Date(dateOfSurvey);
      end.setDate(end.getDate() + 1);
      query.dateOfSurvey = { $gte: start, $lt: end };
    }

    const orders = await Order.find(query).sort({ dateOfSurvey: -1 });
    // Convert Azure URLs to local proxy URLs for frontend consumption
    const ordersWithProxyUrls = orders.map(order => ({
      ...order.toObject(),
      pictures: convertAzureUrlsToProxy(order.pictures)
    }));
    res.json(ordersWithProxyUrls);
  } catch (error) {
    res.status(500).json({ message: "Error searching orders", error: error.message });
  }
};

// Get a single order by id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Convert Azure URLs to local proxy URLs for frontend consumption
    const orderWithProxyUrls = {
      ...order.toObject(),
      pictures: convertAzureUrlsToProxy(order.pictures)
    };
    
    res.json(orderWithProxyUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    // Get existing order to handle pictures
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) return res.status(404).json({ error: 'Order not found' });
    
    // Start with existing pictures
    let pictures = [...(existingOrder.pictures || [])];
    
    // Add new pictures from Azure uploads if any
    if (req.uploadedImageUrls && req.uploadedImageUrls.length > 0) {
      pictures.push(...req.uploadedImageUrls);
    }
    
    // Handle existing pictures from request body (for frontend state management)
    if (req.body.pictures) {
      try {
        const requestPictures = typeof req.body.pictures === 'string' 
          ? JSON.parse(req.body.pictures) 
          : req.body.pictures;
        
        if (Array.isArray(requestPictures)) {
          // If replaceImages is true, replace all pictures with the new ones
          if (req.body.replaceImages === 'true') {
            // Delete old Azure blobs that are not in the new list
            const picturesToDelete = existingOrder.pictures?.filter(
              oldPic => !requestPictures.includes(oldPic)
            ) || [];
            
            // Delete old blobs from Azure (fire and forget)
            picturesToDelete.forEach(async (picUrl) => {
              try {
                if (picUrl.includes('afsconfined.blob.core.windows.net')) {
                  await deleteBlobFromStorage(picUrl);
                }
              } catch (error) {
                console.error('Error deleting old blob:', error);
              }
            });
            
            pictures = requestPictures;
          } else {
            // Merge unique pictures
            const allPictures = [...requestPictures, ...req.uploadedImageUrls || []];
            pictures = [...new Set(allPictures)]; // Remove duplicates
          }
        }
      } catch (error) {
        console.error('Error parsing pictures from request:', error);
      }
    }
    
    // Limit to maximum 5 images
    pictures = pictures.slice(0, 5);
    
    // Prepare update data
    const updateData = { 
      ...req.body,
      pictures: pictures
    };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.replaceImages;
    
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    console.log(`Order updated with ${pictures.length} images`);
    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(400).json({ error: err.message });
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    // Get the order first to access its pictures for cleanup
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Delete associated Azure blobs
    if (order.pictures && order.pictures.length > 0) {
      order.pictures.forEach(async (picUrl) => {
        try {
          if (picUrl.includes('afsconfined.blob.core.windows.net')) {
            await deleteBlobFromStorage(picUrl);
            console.log(`Deleted blob: ${picUrl}`);
          }
        } catch (error) {
          console.error('Error deleting blob during order deletion:', error);
        }
      });
    }
    
    // Delete the order from database
    await Order.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Order and associated images deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: err.message });
  }
};
