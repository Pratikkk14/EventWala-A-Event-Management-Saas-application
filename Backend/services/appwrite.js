// Backend/services/appwriteStorage.js

const sdk = require('node-appwrite');

class AppwriteStorageService {
  constructor() {
    this.client = new sdk.Client();
    this.storage = new sdk.Storage(this.client);
    
    this.client
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
    
    this.bucketId = process.env.APPWRITE_BUCKET_ID;
    
    this.FILE_PREFIXES = {
      VENDOR_LOGO: 'VL',
      VENUE_IMAGE: 'VI', 
      EVENT_HOST: 'EH',
      EVENT_GUEST: 'EG',
    };
  }

  generateFileName(prefix, identifier, originalName) {
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${prefix}_${identifier}_${timestamp}_${sanitizedName}`;
  }

  parseFileName(fileName) {
    const parts = fileName.split('_');
    return {
      prefix: parts[0],
      identifier: parts[1],
      timestamp: parts[2],
      originalName: parts.slice(3).join('_'),
    };
  }

  async deleteVendorFiles(vendorId) {
    try {
      const files = await this.storage.listFiles(this.bucketId);
      const vendorFiles = files.files.filter(file => 
        file.name.startsWith(this.FILE_PREFIXES.VENDOR_LOGO + '_' + vendorId) ||
        file.name.startsWith(this.FILE_PREFIXES.VENUE_IMAGE + '_' + vendorId)
      );

      const deletePromises = vendorFiles.map(file => 
        this.storage.deleteFile(this.bucketId, file.$id)
      );

      await Promise.all(deletePromises);

      return {
        success: true,
        deletedCount: vendorFiles.length,
      };
    } catch (error) {
      console.error('Error deleting vendor files:', error);
      throw error;
    }
  }

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
        deletedFiles: expiredFiles.map(f => f.name),
      };
    } catch (error) {
      console.error('Error cleaning up expired files:', error);
      throw error;
    }
  }
}

module.exports = new AppwriteStorageService();