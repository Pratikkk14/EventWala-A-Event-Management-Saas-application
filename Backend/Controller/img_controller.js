const imageUploadService = require('../services/imageUploadService');

/**
 * Upload user profile image
 */
const uploadProfileImage = async (req, res) => {
  try {
    console.log('=== Upload Profile Image Debug ===');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    console.log('req.headers:', req.headers);
    
    if (!req.file) {
      console.log('ERROR: No file found in request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { userId } = req.body;
    if (!userId) {
      console.log('ERROR: No userId found in request body');
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Use InputFile from Appwrite SDK for proper file handling
    const fileBuffer = req.file.buffer;
    console.log('File buffer length:', fileBuffer.length);
    console.log('Original filename:', req.file.originalname);

    const result = await imageUploadService.uploadUserProfile(fileBuffer, userId, req.file.originalname);
    
    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        fileId: result.fileId,
        url: result.url,
        fileName: result.fileName
      }
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      error: error.message
    });
  }
};

/**
 * Upload vendor logo image
 */
const uploadVendorLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { vendorId } = req.body;
    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required'
      });
    }

    const fileBuffer = req.file.buffer;

    const result = await imageUploadService.uploadVendorLogo(fileBuffer, vendorId, req.file.originalname);
    
    res.json({
      success: true,
      message: 'Vendor logo uploaded successfully',
      data: {
        fileId: result.fileId,
        url: result.url,
        fileName: result.fileName
      }
    });
  } catch (error) {
    console.error('Vendor logo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload vendor logo',
      error: error.message
    });
  }
};

/**
 * Upload venue image
 */
const uploadVenueImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { vendorId, venueId } = req.body;
    if (!vendorId || !venueId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID and Venue ID are required'
      });
    }

    const fileBuffer = req.file.buffer;

    const result = await imageUploadService.uploadVenueImage(fileBuffer, vendorId, venueId, req.file.originalname);
    
    res.json({
      success: true,
      message: 'Venue image uploaded successfully',
      data: {
        fileId: result.fileId,
        url: result.url,
        fileName: result.fileName
      }
    });
  } catch (error) {
    console.error('Venue image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload venue image',
      error: error.message
    });
  }
};

/**
 * Upload event image
 */
const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    const fileBuffer = req.file.buffer;

    const result = await imageUploadService.uploadEventImage(fileBuffer, eventId, req.file.originalname);
    
    res.json({
      success: true,
      message: 'Event image uploaded successfully',
      data: {
        fileId: result.fileId,
        url: result.url,
        fileName: result.fileName
      }
    });
  } catch (error) {
    console.error('Event image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload event image',
      error: error.message
    });
  }
};

/**
 * Upload event guest image
 */
const uploadEventGuestImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    const fileBuffer = req.file.buffer;

    const result = await imageUploadService.uploadEventGuestImage(fileBuffer, eventId, req.file.originalname);
    
    res.json({
      success: true,
      message: 'Event guest image uploaded successfully',
      data: {
        fileId: result.fileId,
        url: result.url,
        fileName: result.fileName
      }
    });
  } catch (error) {
    console.error('Event guest image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload event guest image',
      error: error.message
    });
  }
};

/**
 * Delete uploaded file
 */
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }
    
    const result = await imageUploadService.deleteFile(fileId);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};

/**
 * Get file information
 */
const getFileInfo = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }
    
    const result = await imageUploadService.getFileInfo(fileId);
    
    res.json({
      success: true,
      message: 'File information retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file information',
      error: error.message
    });
  }
};

module.exports = {
  uploadProfileImage,
  uploadVendorLogo,
  uploadVenueImage,
  uploadEventImage,
  uploadEventGuestImage,
  deleteFile,
  getFileInfo
};