// Frontend/src/components/VendorDashboard.tsx - Updated with storage

import React, { useState } from 'react';
import appwriteStorage from '../services/appwriteStorage';
import { useAuth } from '../hooks/useAuth';

// Add to your existing VendorDashboard component
export const VendorLogoSection: React.FC = () => {
  const { user } = useAuth(); // Assuming you have user context
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await appwriteStorage.uploadVendorLogo(file, user.uid);
      setLogoUrl(result.url);

      // Update your MongoDB through existing backend
      const response = await fetch(`/api/vendor/${user.uid}/logo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          logoFileId: result.fileId,
          logoUrl: result.url 
        })
      });

      if (response.ok) {
        alert('Logo uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Vendor Logo</h3>
      
      {logoUrl && (
        <div className="mb-4">
          <img 
            src={logoUrl} 
            alt="Vendor Logo" 
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      
      {uploading && (
        <p className="mt-2 text-sm text-gray-600">Uploading...</p>
      )}
    </div>
  );
};