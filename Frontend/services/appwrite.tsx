import { Client, Storage, ID, Permission, Role } from 'appwrite';

interface UploadResult {
  success: boolean;
  fileId: string;
  fileName: string;
  url: string;
  type?: string;
  expiresAt?: string;
}

interface FileMetadata {
  fileId: string;
  fileName: string;
  size: number;
  mimeType: string;
  createdAt: string;
  url: string;
  downloadUrl: string;
}

class AppwriteStorageService {
  private client: Client;
  private storage: Storage;
  private bucketId: string;
  
  private FILE_PREFIXES = {
    VENDOR_LOGO: 'VL',
    VENUE_IMAGE: 'VI',
    EVENT_HOST: 'EH',
    EVENT_GUEST: 'EG',
  };

  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

    this.storage = new Storage(this.client);
    this.bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
  }

  private generateFileName(prefix: string, identifier: string, originalName: string): string {
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${prefix}_${identifier}_${timestamp}_${sanitizedName}`;
  }

  async uploadVendorLogo(file: File, vendorId: string): Promise<UploadResult> {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.VENDOR_LOGO,
        vendorId,
        file.name
      );

      const response = await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        file
      );

      return {
        success: true,
        fileId: response.$id,
        fileName: fileName,
        url: this.getFilePreview(response.$id),
      };
    } catch (error) {
      console.error('Error uploading vendor logo:', error);
      throw error;
    }
  }

  async uploadVenueImage(file: File, vendorId: string, venueId: string): Promise<UploadResult> {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.VENUE_IMAGE,
        `${vendorId}_${venueId}`,
        file.name
      );

      const response = await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        file
      );

      return {
        success: true,
        fileId: response.$id,
        fileName: fileName,
        url: this.getFilePreview(response.$id),
      };
    } catch (error) {
      console.error('Error uploading venue image:', error);
      throw error;
    }
  }

  async uploadEventHostProfile(file: File, userId: string): Promise<UploadResult> {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.EVENT_HOST,
        userId,
        file.name
      );

      const response = await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        file
      );

      return {
        success: true,
        fileId: response.$id,
        fileName: fileName,
        url: this.getFilePreview(response.$id),
        type: 'profile',
      };
    } catch (error) {
      console.error('Error uploading host profile:', error);
      throw error;
    }
  }

  async uploadEventGuestImage(file: File, eventId: string, guestId: string = 'guest'): Promise<UploadResult> {
    try {
      const fileName = this.generateFileName(
        this.FILE_PREFIXES.EVENT_GUEST,
        `${eventId}_${guestId}`,
        file.name
      );

      const response = await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        file
      );

      return {
        success: true,
        fileId: response.$id,
        fileName: fileName,
        url: this.getFilePreview(response.$id),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'guest_upload',
      };
    } catch (error) {
      console.error('Error uploading guest image:', error);
      throw error;
    }
  }

  getFilePreview(fileId: string, width: number = 800, height: number = 600): string {
    return this.storage.getFilePreview(
      this.bucketId,
      fileId,
      width,
      height,
      'center' as any,
      100
    ).toString();
  }

  getFileDownload(fileId: string): string {
    return this.storage.getFileDownload(this.bucketId, fileId).toString();
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.storage.deleteFile(this.bucketId, fileId);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async listEventGuestFiles(eventId: string): Promise<FileMetadata[]> {
    try {
      const files = await this.storage.listFiles(this.bucketId);
      const eventFiles = files.files.filter(file => {
        return file.name.includes(`EG_${eventId}`);
      });

      return eventFiles.map(file => ({
        fileId: file.$id,
        fileName: file.name,
        size: file.sizeOriginal,
        mimeType: file.mimeType,
        createdAt: file.$createdAt,
        url: this.getFilePreview(file.$id),
        downloadUrl: this.getFileDownload(file.$id),
      }));
    } catch (error) {
      console.error('Error listing event files:', error);
      throw error;
    }
  }
}

export default new AppwriteStorageService();