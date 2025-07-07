const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const { ensureContainerExists } = require('./config/azureStorage');
const path = require('path');
const fs = require('fs');

// Load .env file from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug log to verify
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('Azure Storage configured for container:', process.env.AZURE_CONTAINER_NAME || 'confined-space-images');

// Connect to MongoDB
connectDB();

// Initialize Azure Blob Storage container
ensureContainerExists()
  .then(() => {
    console.log('Azure Blob Storage container initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize Azure Blob Storage container:', error);
  });

// Ensure uploads directory exists (for backward compatibility)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory (for legacy support)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Confined Space Inventory API - Now with Azure Blob Storage support!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Image uploads will be stored in Azure Blob Storage');
});