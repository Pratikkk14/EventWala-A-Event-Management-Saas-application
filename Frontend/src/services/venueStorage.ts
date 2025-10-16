import { Client, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

/**
 * Upload multiple venue photos to Appwrite storage
 * @param files Array of files to upload
 * @param venueId Venue ID to use as prefix for the files
 * @returns Array of uploaded file information
 */
export const uploadVenuePhotos = async (files: File[], venueId: string) => {
  try {
    const uploadPromises = files.map(async (file) => {
      // Create a unique ID for each file
      const fileId = `${venueId}-${Math.random().toString(36).substring(7)}`;
      
      // Upload file to Appwrite storage
      await storage.createFile(
                  import.meta.env.VITE_APPWRITE_BUCKET_ID,
                  fileId,
                  file
              );

      // Get the file URL
      const fileUrl = storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileId);

        return {
          success: true,
        fileId,
        url: fileUrl.toString(),
        fileName: file.name,
        uploadedAt: new Date()
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading venue photos:', error);
    throw error;
  }
};

/**
 * Delete a venue photo from Appwrite storage
 * @param fileId ID of the file to delete
 */
export const deleteVenuePhoto = async (fileId: string) => {
  try {
    await storage.deleteFile(
                  import.meta.env.VITE_APPWRITE_BUCKET_ID,
                  fileId
    );
      return { success: true };
  } catch (error) {
    console.error('Error deleting venue photo:', error);
    throw error;
  }
};