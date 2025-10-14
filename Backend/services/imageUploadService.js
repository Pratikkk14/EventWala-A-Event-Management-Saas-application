const sdk = require('node-appwrite');

class ImageUploadService {
  constructor() {
    this.client = new sdk.Client();
    this.storage = new sdk.Storage(this.client);
    
    if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY || !process.env.APPWRITE_BUCKET_ID) {
      throw new Error('Missing required Appwrite environment variables');
    }
    
    // Initialize Appwrite client
    this.client
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
    
    this.bucketId = process.env.APPWRITE_BUCKET_ID;
    
    // File prefixes for different types of uploads
    this.FILE_PREFIXES = {
      USER_PROFILE: 'UP',    // User profile photos
      VENDOR_LOGO: 'VL',     // Vendor business logos
      VENUE_IMAGE: 'VI',     // Venue images
      EVENT_IMAGE: 'EI',     // Event images
      EVENT_GUEST: 'EG'      // Event guest uploads (temporary)
    };
  }

  /**
   * Generate a unique filename with proper prefix
   */
  generateFileName(prefix, identifier, originalName) {
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${prefix}_${identifier}_${timestamp}_${sanitizedName}`;
  }

  /**
   * Parse a filename to extract its components
   */
  parseFileName(fileName) {
    const parts = fileName.split('_');
    return {
      prefix: parts[0],
      identifier: parts[1],
      timestamp: parts[2],
      originalName: parts.slice(3).join('_')
    };
  }

  /**
   * Upload a user profile photo
   */
  async uploadUserProfile(fileBuffer, userId, originalName) {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.USER_PROFILE,
        userId,
        originalName
      );

      console.log('Attempting to upload file with name:', fileName);
      console.log('Buffer size:', fileBuffer.length);

      const response = await this.storage.createFile(
        this.bucketId,
        sdk.ID.unique(),
        sdk.InputFile.fromBuffer(fileBuffer, fileName)
      );

      return {
        success: true,
        fileId: response.$id,
        fileName,
        url: this.getFileUrl(response.$id),
        type: 'profile'
      };
    } catch (error) {
      console.error('Error uploading user profile:', error);
      throw error;
    }
  }

  /**
   * Upload a vendor's business logo
   */
  async uploadVendorLogo(fileBuffer, vendorId, originalName) {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.VENDOR_LOGO,
        vendorId,
        originalName
      );

      const response = await this.storage.createFile(
        this.bucketId,
        sdk.ID.unique(),
        sdk.InputFile.fromBuffer(fileBuffer, fileName)
      );

      return {
        success: true,
        fileId: response.$id,
        fileName,
        url: this.getFileUrl(response.$id),
        type: 'vendor-logo'
      };
    } catch (error) {
      console.error('Error uploading vendor logo:', error);
      throw error;
    }
  }

  /**
   * Upload a venue image
   */
  async uploadVenueImage(fileBuffer, vendorId, venueId, originalName) {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.VENUE_IMAGE,
        `${vendorId}-${venueId}`,
        originalName
      );

      const response = await this.storage.createFile(
        this.bucketId,
        sdk.ID.unique(),
        sdk.InputFile.fromBuffer(fileBuffer, fileName)
      );

      return {
        success: true,
        fileId: response.$id,
        fileName,
        url: this.getFileUrl(response.$id),
        type: 'venue-image'
      };
    } catch (error) {
      console.error('Error uploading venue image:', error);
      throw error;
    }
  }

  /**
   * Upload an event image
   */
  async uploadEventImage(fileBuffer, eventId, originalName) {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.EVENT_IMAGE,
        eventId,
        originalName
      );

      const response = await this.storage.createFile(
        this.bucketId,
        sdk.ID.unique(),
        sdk.InputFile.fromBuffer(fileBuffer, fileName)
      );

      return {
        success: true,
        fileId: response.$id,
        fileName,
        url: this.getFileUrl(response.$id),
        type: 'event-image'
      };
    } catch (error) {
      console.error('Error uploading event image:', error);
      throw error;
    }
  }

  /**
   * Upload event guest images (temporary uploads)
   */
  async uploadEventGuestImage(fileBuffer, eventId, originalName) {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.EVENT_GUEST,
        eventId,
        originalName
      );

      const response = await this.storage.createFile(
        this.bucketId,
        sdk.ID.unique(),
        sdk.InputFile.fromBuffer(fileBuffer, fileName)
      );

      return {
        success: true,
        fileId: response.$id,
        fileName,
        url: this.getFileUrl(response.$id),
        type: 'event-guest'
      };
    } catch (error) {
      console.error('Error uploading event guest image:', error);
      throw error;
    }
  }

  /**
   * Get file URL for preview
   */
  getFileUrl(fileId, width = 800, height = 600) {
    return this.storage.getFileView(
      this.bucketId,
      fileId,
      width,
      height
    );
  }

  /**
   * Get file download URL
   */
  getFileDownload(fileId) {
    return this.storage.getFileDownload(
      this.bucketId,
      fileId
    );
  }

  /**
   * Delete a file by ID
   */
  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(this.bucketId, fileId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Delete all files related to a vendor (logos and venue images)
   */
  async deleteVendorFiles(vendorId) {
    try {
      const files = await this.storage.listFiles(this.bucketId);
      const vendorFiles = files.files.filter(file => 
        file.name.startsWith(`${this.FILE_PREFIXES.VENDOR_LOGO}_${vendorId}`) ||
        file.name.startsWith(`${this.FILE_PREFIXES.VENUE_IMAGE}_${vendorId}`)
      );

      const deletePromises = vendorFiles.map(file => 
        this.storage.deleteFile(this.bucketId, file.$id)
      );

      await Promise.all(deletePromises);

      return {
        success: true,
        deletedCount: vendorFiles.length
      };
    } catch (error) {
      console.error('Error deleting vendor files:', error);
      throw error;
    }
  }

  /**
   * Clean up expired guest uploads (older than 15 days)
   */
  async cleanupExpiredGuestUploads() {
    try {
      const files = await this.storage.listFiles(this.bucketId);
      const fifteenDaysAgo = Date.now() - (15 * 24 * 60 * 60 * 1000);
      
      const expiredFiles = files.files.filter(file => {
        const parsed = this.parseFileName(file.name);
        if (parsed.prefix === this.FILE_PREFIXES.EVENT_GUEST) {
          const fileTimestamp = parseInt(parsed.timestamp);
          return fileTimestamp < fifteenDaysAgo;
        }
        return false;
      });

      const deletePromises = expiredFiles.map(file => 
        this.storage.deleteFile(this.bucketId, file.$id)
      );

      await Promise.all(deletePromises);

      return {
        success: true,
        deletedCount: expiredFiles.length,
        deletedFiles: expiredFiles.map(f => f.name)
      };
    } catch (error) {
      console.error('Error cleaning up expired files:', error);
      throw error;
    }
  }

  /**
   * List all files for a specific event
   */
  async listEventFiles(eventId) {
    try {
      const files = await this.storage.listFiles(this.bucketId);
      const eventFiles = files.files.filter(file => 
        file.name.includes(`${this.FILE_PREFIXES.EVENT_IMAGE}_${eventId}`) ||
        file.name.includes(`${this.FILE_PREFIXES.EVENT_GUEST}_${eventId}`)
      );

      return eventFiles.map(file => ({
        fileId: file.$id,
        fileName: file.name,
        size: file.sizeOriginal,
        mimeType: file.mimeType,
        createdAt: file.$createdAt,
        url: this.getFileUrl(file.$id),
        downloadUrl: this.getFileDownload(file.$id)
      }));
    } catch (error) {
      console.error('Error listing event files:', error);
      throw error;
    }
  }
}

module.exports = new ImageUploadService();