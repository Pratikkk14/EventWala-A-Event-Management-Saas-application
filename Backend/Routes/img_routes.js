const express = require('express');
const multer = require('multer');
const imgController = require('../Controller/img_controller');

const router = express.Router();

// Configure multer for file uploads (in-memory storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Image upload routes
/**
 * @route POST /api/upload/profile
 * @desc Upload user profile image
 * @access Public (should be protected with auth in production)
 */
router.post('/profile', upload.single('file'), imgController.uploadProfileImage);

/**
 * @route POST /api/upload/vendor-logo
 * @desc Upload vendor logo image
 * @access Public (should be protected with auth in production)
 */
router.post('/vendor-logo', upload.single('file'), imgController.uploadVendorLogo);

/**
 * @route POST /api/upload/venue-image
 * @desc Upload venue image
 * @access Public (should be protected with auth in production)
 */
router.post('/venue-image', upload.single('file'), imgController.uploadVenueImage);

/**
 * @route POST /api/upload/event-image
 * @desc Upload event image
 * @access Public (should be protected with auth in production)
 */
router.post('/event-image', upload.single('file'), imgController.uploadEventImage);

/**
 * @route POST /api/upload/event-guest-image
 * @desc Upload event guest image
 * @access Public (should be protected with auth in production)
 */
router.post('/event-guest-image', upload.single('file'), imgController.uploadEventGuestImage);

/**
 * @route DELETE /api/upload/:fileId
 * @desc Delete uploaded file
 * @access Public (should be protected with auth in production)
 */
router.delete('/:fileId', imgController.deleteFile);

/**
 * @route GET /api/upload/:fileId
 * @desc Get file information
 * @access Public (should be protected with auth in production)
 */
router.get('/:fileId', imgController.getFileInfo);

// Error handling middleware for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed'
    });
  }
  
  next(err);
});

module.exports = router;