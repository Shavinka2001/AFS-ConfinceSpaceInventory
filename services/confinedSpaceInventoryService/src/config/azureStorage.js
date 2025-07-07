const { BlobServiceClient } = require('@azure/storage-blob');

// Azure Storage connection string from environment variables
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Validate that connection string is provided
if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is required');
}

// Container name for confined space work order images
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'confined-space-images';

// Create the BlobServiceClient object which will be used to create a container client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// Get a reference to a container
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

/**
 * Ensure the container exists, create it if it doesn't
 */
async function ensureContainerExists() {
  try {
    // Check if container exists, if not create it
    // Remove public access since the storage account doesn't allow it
    const createContainerResponse = await containerClient.createIfNotExists();
    
    if (createContainerResponse.succeeded) {
      console.log(`Container "${CONTAINER_NAME}" was created successfully.`);
    } else {
      console.log(`Container "${CONTAINER_NAME}" already exists.`);
    }
  } catch (error) {
    console.error('Error ensuring container exists:', error.message);
    throw error;
  }
}

/**
 * Upload a file buffer to Azure Blob Storage
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - The name for the blob
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<string>} - The URL of the uploaded blob
 */
async function uploadFileToBlob(fileBuffer, fileName, mimeType) {
  try {
    // Ensure container exists
    await ensureContainerExists();
    
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1E9);
    const blobName = `confined-space-${timestamp}-${randomSuffix}-${fileName}`;
    
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Upload data to the blob
    const uploadBlobResponse = await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: {
        blobContentType: mimeType
      }
    });
    
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    
    // Return the URL of the uploaded blob
    return blockBlobClient.url;
  } catch (error) {
    console.error('Error uploading file to blob:', error.message);
    throw error;
  }
}

/**
 * Delete a blob from Azure Blob Storage
 * @param {string} blobUrl - The URL of the blob to delete
 * @returns {Promise<boolean>} - True if deleted successfully
 */
async function deleteBlobFromStorage(blobUrl) {
  try {
    // Extract blob name from URL
    const url = new URL(blobUrl);
    const blobName = url.pathname.split('/').pop();
    
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Delete the blob
    const deleteResponse = await blockBlobClient.deleteIfExists();
    
    if (deleteResponse.succeeded) {
      console.log(`Blob ${blobName} deleted successfully`);
      return true;
    } else {
      console.log(`Blob ${blobName} does not exist`);
      return false;
    }
  } catch (error) {
    console.error('Error deleting blob:', error.message);
    return false;
  }
}

/**
 * List all blobs in the container
 * @returns {Promise<Array>} - Array of blob items
 */
async function listBlobs() {
  try {
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({
        name: blob.name,
        url: `${containerClient.url}/${blob.name}`,
        lastModified: blob.properties.lastModified,
        contentLength: blob.properties.contentLength
      });
    }
    return blobs;
  } catch (error) {
    console.error('Error listing blobs:', error.message);
    throw error;
  }
}

/**
 * Get blob data as a stream for serving through Express
 * @param {string} blobName - The name of the blob
 * @returns {Promise<Object>} - Object containing blob stream and metadata
 */
async function getBlobData(blobName) {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Check if blob exists
    const exists = await blockBlobClient.exists();
    if (!exists) {
      throw new Error('Blob not found');
    }
    
    // Get blob properties
    const properties = await blockBlobClient.getProperties();
    
    // Download blob
    const downloadResponse = await blockBlobClient.download();
    
    return {
      stream: downloadResponse.readableStreamBody,
      contentType: properties.contentType || 'application/octet-stream',
      contentLength: properties.contentLength
    };
  } catch (error) {
    console.error('Error getting blob data:', error.message);
    throw error;
  }
}

/**
 * Extract blob name from Azure blob URL
 * @param {string} blobUrl - The full Azure blob URL
 * @returns {string} - The blob name
 */
function extractBlobNameFromUrl(blobUrl) {
  try {
    const url = new URL(blobUrl);
    return url.pathname.split('/').pop();
  } catch (error) {
    console.error('Error extracting blob name from URL:', error.message);
    return null;
  }
}

module.exports = {
  uploadFileToBlob,
  deleteBlobFromStorage,
  listBlobs,
  ensureContainerExists,
  containerClient,
  blobServiceClient,
  getBlobData,
  extractBlobNameFromUrl
};
