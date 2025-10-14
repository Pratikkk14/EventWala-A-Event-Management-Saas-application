import React, { useEffect, useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import { toast } from 'react-hot-toast';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  socialProfiles: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  preferences: {
    eventNotifications: boolean;
    marketingEmails: boolean;
    language: string;
  };
  avatar?: {
    fileId?: string;
    url?: string;
    fileName?: string;
  };
}

interface FormField {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

interface FormSection {
  section: string;
  fields: FormField[];
}

const profileFields: FormSection[] = [
  {
    section: "Personal Details",
    fields: [
      { label: "First Name", name: "firstName", type: "text", required: true },
      { label: "Last Name", name: "lastName", type: "text", required: false },
      { label: "Email", name: "email", type: "email", required: true },
      { label: "Phone Number", name: "phone", type: "tel", required: false },
      { label: "Date of Birth", name: "dateOfBirth", type: "date", required: false },
      { 
        label: "Gender", 
        name: "gender", 
        type: "select", 
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
          { value: "prefer-not-to-say", label: "Prefer not to say" }
        ],
        required: false 
      },
    ]
  },
  {
    section: "Address",
    fields: [
      { label: "Street Address", name: "address.street", type: "text", required: false },
      { label: "City", name: "address.city", type: "text", required: false },
      { label: "State", name: "address.state", type: "text", required: false },
      { label: "Country", name: "address.country", type: "text", required: false },
      { label: "Postal Code", name: "address.postalCode", type: "text", required: false },
    ]
  },
  {
    section: "Social Profiles",
    fields: [
      { label: "Facebook Profile", name: "socialProfiles.facebook", type: "url" },
      { label: "Instagram Profile", name: "socialProfiles.instagram", type: "url" },
      { label: "LinkedIn Profile", name: "socialProfiles.linkedin", type: "url" },
      { label: "Twitter Profile", name: "socialProfiles.twitter", type: "url" },
    ]
  },
  {
    section: "Preferences",
    fields: [
      { label: "Event Notifications", name: "preferences.eventNotifications", type: "checkbox" },
      { label: "Marketing Emails", name: "preferences.marketingEmails", type: "checkbox" },
      { 
        label: "Preferred Language", 
        name: "preferences.language", 
        type: "select",
        options: [
          { value: "en", label: "English" },
          { value: "es", label: "Spanish" },
          { value: "fr", label: "French" },
          { value: "de", label: "German" }
        ],
        required: true
      },
    ]
  }
];

// SVG Icons Components
const CameraIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const DEFAULT_AVATAR = '/images/UserAvatars/default.png';

export default function UserProfilePage() {
  const { user } = useAuth();
  
  const getInitialFormData = (): UserProfile => ({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    socialProfiles: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: ''
    },
    preferences: {
      eventNotifications: true,
      marketingEmails: true,
      language: 'en'
    },
    avatar: {
      fileId: '',
      url: '',
      fileName: ''
    }
  });

  const [formData, setFormData] = useState<UserProfile>(getInitialFormData());
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Log form data changes
  useEffect(() => {
    console.log('Current form data:', formData);
  }, [formData]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      const displayNameParts = user.displayName?.split(' ') || ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || displayNameParts[0] || '',
        lastName: prev.lastName || displayNameParts.slice(1).join(' ') || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/DB_Routes/user/' + user.uid, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (!response.ok) {
          console.log('Profile not found, using default values');
          // If user profile doesn't exist, keep the default form data
          return;
        }
        
        const data = await response.json();
        console.log('Profile data:', data); // Debug log
        
        if (data.success && data.data) {
          const userData = data.data;
          // Merge fetched data with default structure to ensure all fields exist
          const mergedData: UserProfile = {
            firstName: userData.firstName || user?.displayName?.split(' ')[0] || '',
            lastName: userData.lastName || user?.displayName?.split(' ').slice(1).join(' ') || '',
            email: userData.email || user?.email || '',
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || 'prefer-not-to-say',
            address: {
              street: (typeof userData.address === 'object' && userData.address?.street) || '',
              city: (typeof userData.address === 'object' && userData.address?.city) || '',
              state: (typeof userData.address === 'object' && userData.address?.state) || '',
              country: (typeof userData.address === 'object' && userData.address?.country) || '',
              postalCode: (typeof userData.address === 'object' && userData.address?.postalCode) || ''
            },
            socialProfiles: {
              facebook: userData.socialProfiles?.facebook || '',
              instagram: userData.socialProfiles?.instagram || '',
              linkedin: userData.socialProfiles?.linkedin || '',
              twitter: userData.socialProfiles?.twitter || ''
            },
            preferences: {
              eventNotifications: userData.preferences?.eventNotifications !== undefined ? userData.preferences.eventNotifications : true,
              marketingEmails: userData.preferences?.marketingEmails !== undefined ? userData.preferences.marketingEmails : true,
              language: userData.preferences?.language || 'en'
            },
            avatar: {
              fileId: (typeof userData.avatar === 'object' && userData.avatar?.fileId) || '',
              url: (typeof userData.avatar === 'object' && userData.avatar?.url) || '',
              fileName: (typeof userData.avatar === 'object' && userData.avatar?.fileName) || ''
            }
          };
          
          console.log('Setting form data:', mergedData); // Debug log
          setFormData(mergedData);
          
          if (typeof userData.avatar === 'object' && userData.avatar?.url) {
            setProfileImagePreview(userData.avatar.url);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Keep default form data if fetch fails
      }
    };

    fetchUserProfile();
  }, [user]);

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const parts = path.split('.');
    const lastPart = parts.pop()!;
    const target = parts.reduce((acc, part) => {
      acc[part] = acc[part] || {};
      return acc[part];
    }, obj);
    target[lastPart] = value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const fieldValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    const newFormData = { ...formData };
    setNestedValue(newFormData, name, fieldValue);
    setFormData(newFormData);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      toast.error('Please login to update profile');
      return;
    }

    setIsLoading(true);
    try {
      let avatarData = null;
      if (profileImage) {
        // Upload profile image if changed
        const formData = new FormData();
        formData.append('file', profileImage);
        formData.append('userId', user.uid);

        const uploadResponse = await fetch('/api/upload/profile', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        avatarData = await uploadResponse.json();
      }

      // Update user profile
      const updateResponse = await fetch('/api/DB_Routes/updateuser/' + user.uid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (await user.getIdToken())
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarData
        })
      });

      if (!updateResponse.ok) throw new Error('Failed to update profile');
      
      const result = await updateResponse.json();
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1b40] via-[#2a1a45] to-[#3a205a] text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl border border-purple-400/20">
          <h1 className="text-3xl font-bold text-center mb-8">User Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={profileImagePreview || DEFAULT_AVATAR}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-400/50"
                />
                <label className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                  <CameraIcon />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Form Sections */}
            {profileFields.map((section, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-300">
                  {section.section}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={getNestedValue(formData, field.name) || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-lg border border-purple-300 bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 p-3"
                          required={field.required}
                        >
                          {field.options?.map((option, i) => (
                            <option key={i} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <label className="inline-flex items-center mt-1">
                          <input
                            type="checkbox"
                            name={field.name}
                            checked={getNestedValue(formData, field.name) || false}
                            onChange={handleInputChange}
                            className="form-checkbox h-5 w-5 text-purple-500 rounded border-purple-300 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-white">Enable</span>
                        </label>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          value={getNestedValue(formData, field.name) || ''}
                          onChange={(e) => handleInputChange(e as any)}
                          rows={4}
                          className="mt-1 block w-full rounded-lg border border-purple-300 bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 p-3"
                          required={field.required}
                          placeholder="Enter your complete address"
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={getNestedValue(formData, field.name) || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-lg border border-purple-300 bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 p-3"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="py-3 px-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Updating...</span>
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}