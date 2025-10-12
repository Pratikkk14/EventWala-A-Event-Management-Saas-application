import React, { useState, useEffect } from "react";
import {
  Edit3,
  User,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Calendar,
  Users,
  Briefcase,
  BarChart2,
  Clock,
  Bookmark,
  Globe,
  Bell,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import appwriteStorage from '../../services/appwrite'; 


// Type definitions matching MongoDB schema
interface Avatar {
  url?: string;
  fileName?: string;
  fileId?: string;
};

interface PersonalDetails {
  dob?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
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
  personalDetails: PersonalDetails;
  preferences: {
    notifications?: boolean;
    language?: string;
    marketing?: boolean;
  };
  accountManagement: {
    role?: "user" | "vendor" | "admin";
    status?: "active" | "suspended" | "deactivated";
    verification?: string;
  };
  activity: {
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
    hostedEvents?: number;
    attendedEvents?: number;
    bookmarkedVenues?: number;
  };
  payment: {
    defaultPaymentMethod?: string;
    billingAddress?: string;
  };
  avatar?: Avatar;
}

const initialProfileData: ProfileData = {
  name: "",
  email: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
  socialProfiles: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  personalDetails: {
    dob: undefined,
    gender: undefined,
  },
  preferences: {
    notifications: false,
    language: undefined,
    marketing: false,
  },
  accountManagement: {
    role: undefined,
    status: undefined,
    verification: undefined,
  },
  activity: {
    lastLogin: "",
    createdAt: "",
    updatedAt: "",
    hostedEvents: 0,
    attendedEvents: 0,
    bookmarkedVenues: 0,
  },
  payment: {
    defaultPaymentMethod: undefined,
    billingAddress: undefined,
  },
  avatar: {
    url: undefined,
    fileName: undefined,
    fileId: undefined,
  }
};

// Progress calculator now handles the new schema structure
const progressCalculator = (data: ProfileData, profileImage: File | null) => {
  let completedFields = 0;
  const totalFields = 18; // Updated for new schema

  if (profileImage || data.avatar?.url) completedFields++;
  if (data.name) completedFields++;
  if (data.email) completedFields++;
  if (data.phone) completedFields++;
  
  // Address fields
  if (data.address && (data.address.street || data.address.city || data.address.state || 
      data.address.country || data.address.postalCode)) completedFields++;

  // Social profiles
  if (data.socialProfiles && Object.values(data.socialProfiles).some(url => url)) completedFields++;
  
  // Personal details
  if (data.personalDetails?.dob) completedFields++;
  if (data.personalDetails?.gender) completedFields++;
  
  // Preferences
  if (typeof data.preferences?.notifications === 'boolean') completedFields++;
  if (data.preferences?.language) completedFields++;
  if (typeof data.preferences?.marketing === 'boolean') completedFields++;
  
  // Account management
  if (data.accountManagement?.role) completedFields++;
  if (data.accountManagement?.status) completedFields++;
  if (data.accountManagement?.verification) completedFields++;
  
  // Payment info
  if (data.payment?.defaultPaymentMethod) completedFields++;
  if (data.payment?.billingAddress) completedFields++;
  
  // Activity (last login is system-generated)
  if (data.activity?.lastLogin) completedFields++;

  return (completedFields / totalFields) * 100;
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
};

const ProfileSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const hasContent = React.Children.toArray(children).some(
    (child) => child !== null && child !== undefined
  );
  if (!hasContent) return null;

  return (
    <div className="bg-white/5 rounded-2xl p-6 mb-6 backdrop-blur-sm shadow-lg border border-purple-400/20">
      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

type ProfileItemProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: React.ReactNode;
};

const ProfileItem: React.FC<ProfileItemProps> = ({ icon: Icon, label, value }) => {
  // Return null for any falsy value except 0, or if value is an empty object/array
  if ((!value && value !== 0) || 
      (typeof value === 'object' && value !== null && Object.keys(value).length === 0)) {
    return null;
  }
  
  // For arrays and objects, attempt to create a string representation
  const displayValue = typeof value === 'object' && value !== null
    ? JSON.stringify(value)
    : String(value);

  return (
    <div className="flex items-center text-white/80">
      <Icon className="w-5 h-5 mr-3 text-purple-400" />
      <span className="font-medium mr-2">{label}:</span>
      <span className="text-white">{displayValue}</span>
    </div>
  );
};

type SocialItemProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url: string;
};
const SocialProfileItem: React.FC<SocialItemProps> = ({ icon: Icon, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-purple-400 hover:text-white transition-colors duration-200"
  >
    <Icon className="w-6 h-6" />
  </a>
);

type SocialIconProps = {
  type: "facebook" | "instagram" | "linkedin" | "twitter";
  url: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ type, url }) => {
  if (!url) return null;
  let IconComponent;
  switch (type) {
    case "facebook":
      IconComponent = Facebook;
      break;
    case "instagram":
      IconComponent = Instagram;
      break;
    case "linkedin":
      IconComponent = Linkedin;
      break;
    case "twitter":
      IconComponent = Twitter;
      break;
    default:
      return null;
  }
  return <SocialProfileItem icon={IconComponent} url={url} />;
};

// Memoized Edit Mode Component
type EditProfileFormProps = {
  formData: ProfileData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileData>>;
  handleSave: () => void;
  handleCancel: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EditProfileForm: React.FC<EditProfileFormProps> = React.memo(
  ({ formData, setFormData, handleSave, handleCancel, handleFileChange }) => {
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      section: keyof ProfileData | null,
      field: string
    ) => {
      const { value, type, checked } = e.target;
      setFormData((prevData) => {
        let finalValue: any = value;
        if (type === "number") {
          finalValue = value ? parseInt(value, 10) : 0;
        } else if (type === "checkbox") {
          finalValue = checked;
        }

        if (section) {
          // Deep clone the previous data
          const newData = { ...prevData };

          // Handle specific sections
          switch(section) {
            case 'address':
              newData.address = {
                ...prevData.address,
                [field]: finalValue
              };
              break;
            case 'personalDetails':
              newData.personalDetails = {
                ...prevData.personalDetails,
                [field]: finalValue
              };
              break;
            case 'preferences':
              newData.preferences = {
                ...prevData.preferences,
                [field]: finalValue
              };
              break;
            case 'socialProfiles':
              newData.socialProfiles = {
                ...prevData.socialProfiles,
                [field]: finalValue
              };
              break;
            case 'activity':
              newData.activity = {
                ...prevData.activity,
                [field]: finalValue
              };
              break;
            case 'payment':
              newData.payment = {
                ...prevData.payment,
                [field]: finalValue
              };
              break;
            default:
              newData[section] = {
                ...prevData[section],
                [field]: finalValue
              };
          }
          return newData;
        }
        
        return {
          ...prevData,
          [field]: finalValue,
        };
      });
    };

    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Edit Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProfileSection title="Personal & Contact Details">
            <label className="block">
              <span className="text-white/80 font-medium">
                Profile Picture:
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">Full Name:</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange(e, null, "name")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">Email:</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange(e, null, "email")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">Phone Number:</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange(e, null, "phone")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            {/* Address Fields */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-white/80 font-medium">Street:</span>
                <input
                  type="text"
                  value={formData.address?.street || ''}
                  onChange={(e) => handleInputChange(e, "address", "street")}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-white/80 font-medium">City:</span>
                <input
                  type="text"
                  value={formData.address?.city || ''}
                  onChange={(e) => handleInputChange(e, "address", "city")}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-white/80 font-medium">State:</span>
                <input
                  type="text"
                  value={formData.address?.state || ''}
                  onChange={(e) => handleInputChange(e, "address", "state")}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-white/80 font-medium">Country:</span>
                <input
                  type="text"
                  value={formData.address?.country || ''}
                  onChange={(e) => handleInputChange(e, "address", "country")}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-white/80 font-medium">Postal Code:</span>
                <input
                  type="text"
                  value={formData.address?.postalCode || ''}
                  onChange={(e) => handleInputChange(e, "address", "postalCode")}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-white/80 font-medium">Date of Birth:</span>
              <input
                type="date"
                value={formData.personalDetails?.dob || ""}
                onChange={(e) => handleInputChange(e, "personalDetails", "dob")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">Gender:</span>
              <input
                type="text"
                value={formData.personalDetails?.gender || ""}
                onChange={(e) =>
                  handleInputChange(e, "personalDetails", "gender")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
          </ProfileSection>

          <ProfileSection title="Social Profiles">
            <label className="block">
              <span className="text-white/80 font-medium">Facebook:</span>
              <input
                type="text"
                value={formData.socialProfiles.facebook}
                onChange={(e) =>
                  handleInputChange(e, "socialProfiles", "facebook")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">Instagram:</span>
              <input
                type="text"
                value={formData.socialProfiles.instagram}
                onChange={(e) =>
                  handleInputChange(e, "socialProfiles", "instagram")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">LinkedIn:</span>
              <input
                type="text"
                value={formData.socialProfiles.linkedin}
                onChange={(e) =>
                  handleInputChange(e, "socialProfiles", "linkedin")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">Twitter:</span>
              <input
                type="text"
                value={formData.socialProfiles.twitter}
                onChange={(e) =>
                  handleInputChange(e, "socialProfiles", "twitter")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
          </ProfileSection>

          <ProfileSection title="Preferences">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferences.notifications}
                onChange={(e) =>
                  handleInputChange(e, "preferences", "notifications")
                }
                className="form-checkbox rounded text-purple-600 bg-white/10 border-gray-700 focus:ring-purple-500"
              />
              <span className="text-white/80 font-medium">
                Enable Notifications
              </span>
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">
                Language Preference:
              </span>
              <input
                type="text"
                value={formData.preferences.language}
                onChange={(e) =>
                  handleInputChange(e, "preferences", "language")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferences.marketing}
                onChange={(e) =>
                  handleInputChange(e, "preferences", "marketing")
                }
                className="form-checkbox rounded text-purple-600 bg-white/10 border-gray-700 focus:ring-purple-500"
              />
              <span className="text-white/80 font-medium">
                Receive Marketing Emails
              </span>
            </label>
          </ProfileSection>

          <ProfileSection title="Activity Tracking">
            <label className="block">
              <span className="text-white/80 font-medium">Hosted Events:</span>
              <input
                type="number"
                value={formData.activity.hostedEvents ?? ""}
                onChange={(e) =>
                  handleInputChange(e, "activity", "hostedEvents")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">
                Attended Events:
              </span>
              <input
                type="number"
                value={formData.activity.attendedEvents ?? ""}
                onChange={(e) =>
                  handleInputChange(e, "activity", "attendedEvents")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">
                Bookmarked Venues:
              </span>
              <input
                type="number"
                value={formData.activity.bookmarkedVenues ?? ""}
                onChange={(e) =>
                  handleInputChange(e, "activity", "bookmarkedVenues")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
          </ProfileSection>

          <ProfileSection title="Payment Information">
            <label className="block">
              <span className="text-white/80 font-medium">
                Default Payment Method:
              </span>
              <input
                type="text"
                value={formData.payment.defaultPaymentMethod}
                onChange={(e) =>
                  handleInputChange(e, "payment", "defaultPaymentMethod")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">
                Billing Address:
              </span>
              <input
                type="text"
                value={formData.payment.billingAddress}
                onChange={(e) =>
                  handleInputChange(e, "payment", "billingAddress")
                }
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
          </ProfileSection>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleCancel}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }
);

export default function UserProfilePage() {
  const { user } = useAuth(); // Get current user from auth context
  const [profileData, setProfileData] = useState(initialProfileData);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [avatarUploadResult, setAvatarUploadResult] = useState<Avatar | null>(null);
  const [completion, setCompletion] = useState(0);
  const [mode, setMode] = useState("view"); // 'view' or 'edit'
  const [formData, setFormData] = useState(initialProfileData);

  useEffect(() => {
    setCompletion(progressCalculator(profileData, profileImage));
  }, [profileData, profileImage]);

  useEffect(() => {
    if (mode === "edit") {
      setFormData(profileData);
    }
  }, [mode, profileData]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.uid) return;

      try {
        // Using DB_Routes for getting profile data from db
        const response = await fetch(`/api/DB_Routes/user/${user.uid}`, {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const { data } = await response.json();

        // Transform the data to match your frontend structure
        const transformedData: ProfileData = {
          name: data.firstName + (data.lastName ? ` ${data.lastName}` : ""),
          email: data.email || "",
          phone: data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            country: data.address?.country || "",
            postalCode: data.address?.postalCode || "",
          },
          socialProfiles: {
            facebook: data.socialProfiles?.facebook || "",
            twitter: data.socialProfiles?.twitter || "",
            instagram: data.socialProfiles?.instagram || "",
            linkedin: data.socialProfiles?.linkedin || "",
          },
          personalDetails: {
            dob: data.dateOfBirth || "",
            gender: (data.gender as "male" | "female" | "other" | "prefer-not-to-say") || "prefer-not-to-say",
          },
          preferences: {
            notifications: data.preferences?.eventNotifications ?? false,
            language: data.preferences?.language || "",
            marketing: data.preferences?.marketingEmails ?? false,
          },
          accountManagement: {
            role: (data.role as "user" | "vendor" | "admin") || "user",
            status: (data.accountStatus as "active" | "suspended" | "deactivated") || "active",
            verification: data.isVerified ? "Verified" : "Not Verified",
          },
          activity: {
            lastLogin: data.lastLogin || "",
            createdAt: data.createdAt || "",
            updatedAt: data.updatedAt || "",
            hostedEvents: data.eventsHosted?.length || 0,
            attendedEvents: data.eventsAttended?.length || 0,
            bookmarkedVenues: data.bookmarks?.length || 0,
          },
          payment: {
            defaultPaymentMethod: data.defaultPaymentMethod || "",
            billingAddress: data.billingAddress ? 
              [
                data.billingAddress.street,
                data.billingAddress.city,
                data.billingAddress.state,
                data.billingAddress.country,
                data.billingAddress.postalCode
              ].filter(Boolean).join(", ") : ""
          },
          avatar: data.avatar ? {
            url: data.avatar.url || "",
            fileName: data.avatar.fileName || "",
            fileId: data.avatar.fileId || ""
          } : undefined,
        };

        setProfileData(transformedData);
        setFormData(transformedData); // Update form data

        // If there's an avatar URL, use it for preview
        if (data.avatar && typeof data.avatar.url === "string" && data.avatar.url.length > 0) {
          setProfileImagePreview(data.avatar.url);
        } else {
          setProfileImagePreview("/images/UserAvatars/Male.png");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfileData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];

    if (file) {
      // Check file size
      // if (file.size > 504800) {
      //   toast.error("Image size should not exceed 500KB");
      //   return;
      // }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      setProfileImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
  if (!user?.uid) {
    toast.error("Please login to update your profile");
    return;
  }

  let avatarUploadResult: { url: string; fileName: string; fileId: string } | null = null;
  if (profileImage) {
    try {
      // Upload to Appwrite
      const result = await appwriteStorage.uploadEventHostProfile(profileImage, user.uid);
      console.log('Upload result:', result); // Debug log
      
      if (result && result.success) {
        // Get a fresh preview URL from Appwrite
        const previewUrl = result.fileId ? appwriteStorage.getFilePreview(result.fileId) : result.url;
        
        const newAvatar: Avatar = {
          url: previewUrl,
          fileName: result.fileName || '',
          fileId: result.fileId || ''
        };
        
        // Update avatar upload result and form data
        setAvatarUploadResult(newAvatar);
        setFormData(prev => ({
          ...prev,
          avatar: newAvatar
        }));
        
        setProfileImagePreview(previewUrl);
        
        // Log success for debugging
        console.log('Avatar upload successful:', { 
          result, 
          previewUrl,
          avatarUploadResult 
        });
      } else {
        console.error('Upload result missing required fields:', result);
        throw new Error('Upload successful but missing required fields');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile image');
      return; // Exit the save function if image upload fails
    }
  }

  // Wait for setFormData to finish before sending
  const updatedFormData = {
    ...formData,
    personalDetails: {
      ...formData.personalDetails,
      dob: formData.personalDetails?.dob || "",
      gender: formData.personalDetails?.gender || "prefer-not-to-say"
    },
    avatar: avatarUploadResult || formData.avatar
  };

  const formDataToSend = new FormData();
  formDataToSend.append("userData", JSON.stringify(updatedFormData));

  const response = await fetch(
    `/api/DB_Routes/updateuser/${user.uid}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: formDataToSend,
    }
  );

  if (!response.ok) {
    toast.error(`HTTP error! status: ${response.status}`);
    return;
  }

  const result = await response.json();

  if (result.success) {
    // Log the response data for debugging
    console.log('Server response:', result);

    // Make sure we keep the avatar information in sync
    const updatedProfileData = {
      ...result.user,
      avatar: avatarUploadResult || result.user.avatar || formData.avatar
    };

    setProfileData(updatedProfileData);
    
    // Only update preview if we have a valid URL
    const newAvatarUrl = formData.avatar?.url || result.user.avatar?.url;
    if (newAvatarUrl) {
      setProfileImagePreview(newAvatarUrl);
    }

    setMode("view");
    toast.success("Profile updated successfully!");
  } else {
    console.error('Update failed:', result);
    toast.error(result.message || "Failed to update profile");
  }
};

  const handleCancel = () => {
    setMode("view");
  };

  const ViewMode = () => (
    <>
      {/* Profile Completion Bar */}
      <div className="bg-white/10 rounded-full h-4 mb-8">
        <div
          className="bg-purple-500 h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${completion}%` }}
        ></div>
      </div>
      <p className="text-center mb-10 text-sm sm:text-base text-white/80">
        Profile completion:{" "}
        <span className="font-bold text-purple-300">
          {Math.round(completion)}%
        </span>
      </p>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileSection title="Contact Information">
          <ProfileItem icon={Phone} label="Phone" value={profileData.phone} />
          <ProfileItem icon={Mail} label="Email" value={profileData.email} />
          <ProfileItem
            icon={MapPin}
            label="Address"
            value={
              profileData.address 
                ? Object.values(profileData.address)
                    .filter(Boolean)
                    .join(", ")
                : undefined
            }
          />
          <div className="flex items-center space-x-4 pt-2">
            <span className="text-white/80 font-medium">Socials:</span>
              {profileData.socialProfiles && typeof profileData.socialProfiles === "object"
                ? Object.entries(profileData.socialProfiles).map(([key, url]) => {
                    const allowedTypes = ["facebook", "instagram", "linkedin", "twitter"] as const;
                    return allowedTypes.includes(key as any) ? (
                      <SocialIcon key={key} type={key as typeof allowedTypes[number]} url={url} />
                    ) : null;
                  })
                : null}
          </div>
        </ProfileSection>
        <ProfileSection title="Personal Details">
          <ProfileItem
            icon={Calendar}
            label="Date of Birth"
            value={profileData.personalDetails?.dob || "Not specified"}
          />
          <ProfileItem
            icon={User}
            label="Gender"
            value={profileData.personalDetails?.gender || "Not specified"}
          />
        </ProfileSection>
        <ProfileSection title="Preferences">
          <ProfileItem
            icon={Bell}
            label="Notifications"
            value={profileData.preferences?.notifications ? "Enabled" : null}
          />
          <ProfileItem
            icon={Globe}
            label="Language"
            value={profileData.preferences?.language}
          />
          <ProfileItem
            icon={Mail}
            label="Marketing"
            value={profileData.preferences?.marketing ? "Opt-in" : null}
          />
        </ProfileSection>
        <ProfileSection title="Account Management">
          <ProfileItem
            icon={Briefcase}
            label="Role"
            value={profileData.accountManagement?.role}
          />
          <ProfileItem
            icon={CheckCircle}
            label="Account Status"
            value={profileData.accountManagement?.status}
          />
          <ProfileItem
            icon={Users}
            label="Verification"
            value={profileData.accountManagement?.verification}
          />
        </ProfileSection>
        <ProfileSection title="Activity Tracking">
          <ProfileItem
            icon={Clock}
            label="Last Login"
            value={
              profileData.activity?.lastLogin
                ? formatDateTime(profileData.activity.lastLogin)
                : null
            }
          />
          <ProfileItem
            icon={BarChart2}
            label="Hosted Events"
            value={profileData.activity?.hostedEvents ?? 0}
          />
          <ProfileItem
            icon={Users}
            label="Attended Events"
            value={profileData.activity?.attendedEvents ?? 0}
          />
          <ProfileItem
            icon={Bookmark}
            label="Bookmarked Venues"
            value={profileData.activity?.bookmarkedVenues ?? 0}
          />
        </ProfileSection>
        <ProfileSection title="Payment Information">
          <ProfileItem
            icon={CreditCard}
            label="Payment Method"
            value={profileData.payment?.defaultPaymentMethod}
          />
          <ProfileItem
            icon={MapPin}
            label="Billing Address"
            value={profileData.payment?.billingAddress}
          />
        </ProfileSection>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1b40] via-[#2a1a45] to-[#3a205a] text-white font-sans p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20 -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-[150px] opacity-15 -bottom-20 -right-20 animate-pulse-slow"></div>
        </div>

        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-purple-400/30">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-purple-400 shadow-md flex items-center justify-center bg-gray-700">
              <img
                src={getImageSource(profileData, profileImagePreview)}
                alt={profileData.name || "Profile"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const currentSrc = target.src;
                  
                  if (currentSrc.includes('/images/UserAvatars/')) {
                    return; // Already using fallback
                  }

                  // If using Appwrite URL that failed, try using the preview URL
                  if (currentSrc.includes('cloud.appwrite.io')) {
                    const fileId = currentSrc.split('/files/')[1]?.split('/')[0];
                    if (fileId) {
                      try {
                        target.src = appwriteStorage.getFilePreview(fileId);
                        return;
                      } catch (error) {
                        console.error('Error getting preview URL:', error);
                      }
                    }
                  }

                  // Ultimate fallback
                  target.onerror = null;
                  const fallback = `${DEFAULT_AVATAR_PATH}/Male.png`;
                  target.src = fallback;
                  
                  console.log('Using fallback image:', {
                    originalSrc: currentSrc,
                    fallback,
                    profileData
                  });
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {profileData.name || "Complete Your Profile"}
              </h1>
              <p className="text-white/70 text-sm sm:text-base">
                {profileData.accountManagement?.role || "Unspecified Role"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMode(mode === "view" ? "edit" : "view")}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full transition-colors duration-300 shadow-lg flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>{mode === "view" ? "Edit Profile" : "View Profile"}</span>
          </button>
        </header>

        {mode === "view" ? (
          <ViewMode />
        ) : (
          <EditProfileForm
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            handleCancel={handleCancel}
            handleFileChange={handleFileChange}
          />
        )}
      </div>
    </div>
  );
}

// Get the image source with proper fallback handling
const DEFAULT_AVATAR_PATH = "/images/UserAvatars";
const getImageSource = (
  profileData: ProfileData,
  profileImagePreview: string | null
): string => {
  console.log('Getting image source:', { profileData, profileImagePreview });
  
  // First priority: preview of newly uploaded image
  if (profileImagePreview) {
    return profileImagePreview;
  }
  
  // Second priority: existing avatar URL from profile data
  if (profileData?.avatar?.url && typeof profileData.avatar.url === 'string') {
    return profileData.avatar.url;
  }
  
  // Fallback: default avatar based on gender
  const gender = profileData?.personalDetails?.gender;
  const defaultImage = gender === 'female' ? 'Female.png' : 'Male.png';
  return `${DEFAULT_AVATAR_PATH}/${defaultImage}`;
};