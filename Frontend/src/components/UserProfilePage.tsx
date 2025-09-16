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

// Avatar type definition
type AvatarType = {
  data: ArrayBuffer | Uint8Array;
  contentType: string;
} | undefined;


const initialProfileData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  socialProfiles: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  personalDetails: {
    dob: "",
    gender: "",
  },
  preferences: {
    notifications: false,
    language: "",
    marketing: false,
  },
  accountManagement: {
    role: "",
    status: "",
    verification: "",
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
    defaultPaymentMethod: "",
    billingAddress: "",
  },
  avatar: undefined as AvatarType, // Explicitly type avatar
};

type ProfileData = typeof initialProfileData & { avatar: AvatarType };

const progressCalculator = (data: ProfileData, profileImage: File | null) => {
  let completedFields = 0;
  const totalFields = 17;

  if (profileImage) completedFields++;
  if (data.name) completedFields++;
  if (data.email) completedFields++;
  if (data.phone) completedFields++;
  if (data.address) completedFields++;
  if (Object.values(data.socialProfiles).some((url) => url)) completedFields++;
  if (data.personalDetails.dob) completedFields++;
  if (data.personalDetails.gender) completedFields++;
  if (data.preferences.notifications) completedFields++;
  if (data.preferences.language) completedFields++;
  if (data.preferences.marketing) completedFields++;
  if (data.accountManagement.role) completedFields++;
  if (data.accountManagement.status) completedFields++;
  if (data.accountManagement.verification) completedFields++;
  if (data.payment.defaultPaymentMethod) completedFields++;
  if (data.payment.billingAddress) completedFields++;

  // Last login is often system-generated, so we can consider it "complete" if it exists
  if (data.activity.lastLogin) completedFields++;

  return (completedFields / totalFields) * 100;
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
};

import type { ReactNode } from "react";

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
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center text-white/80">
      <Icon className="w-5 h-5 mr-3 text-purple-400" />
      <span className="font-medium mr-2">{label}:</span>
      <span className="text-white">{value}</span>
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
          finalValue = value ? parseInt(value, 10) : null;
        } else if (type === "checkbox") {
          finalValue = checked;
        }

        if (section) {
            return {
            ...prevData,
            [section]: {
              ...(typeof prevData[section] === "object" && prevData[section] !== null ? prevData[section] : {}),
              [field]: finalValue,
            },
            };
        } else {
          return {
            ...prevData,
            [field]: finalValue,
          };
        }
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
            <label className="block">
              <span className="text-white/80 font-medium">Address:</span>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange(e, null, "address")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">Date of Birth:</span>
              <input
                type="date"
                value={formData.personalDetails.dob}
                onChange={(e) => handleInputChange(e, "personalDetails", "dob")}
                className="mt-1 block w-full rounded-md border-gray-700 bg-white/10 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-white/80 font-medium">Gender:</span>
              <input
                type="text"
                value={formData.personalDetails.gender}
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
        const transformedData = {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          address: data.address
            ? [
                data.address.street,
                data.address.city,
                data.address.state,
                data.address.country,
                data.address.postalCode,
              ]
                .filter(Boolean)
                .join(", ")
            : "",
          socialProfiles: data.socialProfiles || {},
          personalDetails: {
            dob: data.dateOfBirth ?? "",
            gender: data.gender ?? "",
          },
          preferences: {
            notifications: data.preferences?.eventNotifications ?? false,
            language: data.preferences?.language ?? "",
            marketing: data.preferences?.marketingEmails ?? false,
          },
          accountManagement: {
            role: data.role ?? "",
            status: data.accountStatus ?? "",
            verification: data.isVerified ? "Verified" : "Unverified",
          },
          activity: {
            lastLogin: data.lastLogin ?? "",
            createdAt: data.createdAt ?? "",
            updatedAt: data.updatedAt ?? "",
            hostedEvents: data.eventsHosted?.length ?? 0,
            attendedEvents: data.eventsAttended?.length ?? 0,
            bookmarkedVenues: data.bookmarks?.length ?? 0,
            guests : data.guests ?? 0,
          },
          payment: {
            defaultPaymentMethod: data.defaultPaymentMethod ?? "",
            billingAddress: data.billingAddress
              ? [
                  data.billingAddress.street,
                  data.billingAddress.city,
                  data.billingAddress.state,
                  data.billingAddress.country,
                  data.billingAddress.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")
              : "",
          },
          avatar: data.avatar,
        };

        setProfileData(transformedData);
        setFormData(transformedData); // Update form data

        // If there's an avatar, create the preview
        if (data.avatar?.data) {
          try {
            const imageUrl = `data:${data.avatar.contentType};base64,${arrayBufferToBase64(data.avatar.data)}`;
            setProfileImagePreview(imageUrl);
          } catch (err) {
            setProfileImagePreview("/images/UserAvatars/Male.png");
            toast.error("Failed to load profile picture, using fallback image.");
          }
        } else {
          setProfileImagePreview("/images/UserAvatars/Male.png");
          toast("No profile picture found, using fallback image.", { icon: "ℹ️" });
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
    // Get the current user's UID from Firebase auth
    if (!user?.uid) {
      toast.error("Please login to update your profile");
      return;
    }

    const formDataToSend = new FormData();

    // Add the avatar file if it exists
    if (profileImage) {
      formDataToSend.append("avatar", profileImage);
    }

    // Add other user data
    formDataToSend.append("userData", JSON.stringify(formData));
    
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
      setProfileData({
        ...formData,
        avatar: result.user.avatar,
      });
      setMode("view");
      toast.success("Profile updated successfully!");
    } else {
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
            value={profileData.address}
          />
          <div className="flex items-center space-x-4 pt-2">
            <span className="text-white/80 font-medium">Socials:</span>
            {Object.entries(profileData.socialProfiles).map(([key, url]) => {
              const allowedTypes = ["facebook", "instagram", "linkedin", "twitter"] as const;
              return allowedTypes.includes(key as any) ? (
                <SocialIcon key={key} type={key as typeof allowedTypes[number]} url={url} />
              ) : null;
            })}
          </div>
        </ProfileSection>
        <ProfileSection title="Personal Details">
          <ProfileItem
            icon={Calendar}
            label="Date of Birth"
            value={profileData.personalDetails.dob}
          />
          <ProfileItem
            icon={User}
            label="Gender"
            value={profileData.personalDetails.gender}
          />
        </ProfileSection>
        <ProfileSection title="Preferences">
          <ProfileItem
            icon={Bell}
            label="Notifications"
            value={profileData.preferences.notifications ? "Enabled" : null}
          />
          <ProfileItem
            icon={Globe}
            label="Language"
            value={profileData.preferences.language}
          />
          <ProfileItem
            icon={Mail}
            label="Marketing"
            value={profileData.preferences.marketing ? "Opt-in" : null}
          />
        </ProfileSection>
        <ProfileSection title="Account Management">
          <ProfileItem
            icon={Briefcase}
            label="Role"
            value={profileData.accountManagement.role}
          />
          <ProfileItem
            icon={CheckCircle}
            label="Account Status"
            value={profileData.accountManagement.status}
          />
          <ProfileItem
            icon={Users}
            label="Verification"
            value={profileData.accountManagement.verification}
          />
        </ProfileSection>
        <ProfileSection title="Activity Tracking">
          <ProfileItem
            icon={Clock}
            label="Last Login"
            value={
              profileData.activity.lastLogin
                ? formatDateTime(profileData.activity.lastLogin)
                : null
            }
          />
          <ProfileItem
            icon={BarChart2}
            label="Hosted Events"
            value={profileData.activity.hostedEvents}
          />
          <ProfileItem
            icon={Users}
            label="Attended Events"
            value={profileData.activity.attendedEvents}
          />
          <ProfileItem
            icon={Bookmark}
            label="Bookmarked Venues"
            value={profileData.activity.bookmarkedVenues}
          />
        </ProfileSection>
        <ProfileSection title="Payment Information">
          <ProfileItem
            icon={CreditCard}
            label="Payment Method"
            value={profileData.payment.defaultPaymentMethod}
          />
          <ProfileItem
            icon={MapPin}
            label="Billing Address"
            value={profileData.payment.billingAddress}
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
              {getImageSource(profileData, profileImagePreview) ? (
                <img
                  src={getImageSource(profileData, profileImagePreview)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = "/images/UserAvatars/Male.png"; // Set a valid fallback image
                    console.log("Error loading profile image");
                  }}
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {profileData.name || "Complete Your Profile"}
              </h1>
              <p className="text-white/70 text-sm sm:text-base">
                {profileData.accountManagement.role || "Unspecified Role"}
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

// Helper: Convert ArrayBuffer or Uint8Array to base64 string (browser-safe)
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  let binary = '';
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
// Returns the avatar image URL or a fallback if not available
const getImageSource = (
  profileData: ProfileData,
  profileImagePreview: string | null
): string => {
  if (profileImagePreview) {
    return profileImagePreview;
  }
  if (profileData.avatar?.data) {
    return `data:${profileData.avatar.contentType};base64,${arrayBufferToBase64(
      profileData.avatar.data
    )}`;
  }
  // fallback image
  return "/images/UserAvatars/Male.png";
};