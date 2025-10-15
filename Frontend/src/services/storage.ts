import { Client, Storage, ID } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export const FILE_PREFIXES = {
    USER_PROFILE: 'UP',
    VENDOR_LOGO: 'VL',
    VENUE_IMAGE: 'VI',
    EVENT_IMAGE: 'EI',
    EVENT_GUEST: 'EG'
};

export const generateFileName = (prefix: string, identifier: string, originalName: string): string => {
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${prefix}_${identifier}_${timestamp}_${sanitizedName}`;
};

export const uploadUserProfileImage = async (file: File, userId: string) => {
    try {
        const fileName = generateFileName(FILE_PREFIXES.USER_PROFILE, userId, file.name);
        
        const response = await storage.createFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            ID.unique(),
            file
        );

        const fileUrl = getFileView(response.$id);

        return {
            success: true,
            fileId: response.$id,
            fileName,
            url: fileUrl
        };
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

export const getFileView = (fileId: string): string => {
    return storage.getFileView(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        fileId
    ).toString();
};

export const deleteFile = async (fileId: string) => {
    try {
        await storage.deleteFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            fileId
        );
        return { success: true };
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};