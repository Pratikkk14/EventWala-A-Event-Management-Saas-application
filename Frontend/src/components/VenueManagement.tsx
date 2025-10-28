import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { uploadVenuePhotos } from '../services/venueStorage';
import { ApiClient } from '../utils/apiConfig';
import { 
  PlusCircle,
  Image as ImageIcon,
  Edit,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  X as XIcon,
  Loader,
  ArrowLeft
} from 'lucide-react';

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface VendorResponse {
  _id: string;
  [key: string]: any;
}

interface VenuesResponse {
  success: boolean;
  message?: string;
  venues: VenueDetails[];
}

// Types from the backend venue model
interface VenuePrice {
  eventType: string;
  price: number;
}

interface VenueLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

interface VenuePhoto {
  fileId: string;
  url: string;
  fileName: string;
  uploadedAt?: Date;
}

interface VenueDetails {
  _id?: string;
  name: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    street: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    [key: string]: string | undefined;
  };
  photo: VenuePhoto[];
  vendor?: string; // This will be set automatically by the backend
  capacity: number;
  amenities: string[];
  eventTypes: string[];
  venuePrices: VenuePrice[];
  location: VenueLocation;
  [key: string]: any; // Add index signature for dynamic access
}

// Form section interface similar to UserProfilePage
interface FormSection {
  section: string;
  fields: FormField[];
}

interface FormField {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

// Available event types from the venue model
const EVENT_TYPES = [
  "Baby Shower",
  "Birthday Party",
  "Engagement",
  "Wedding",
  "Housewarming",
  "Anniversary",
  "Corporate Event",
  "Farewell",
  "Conference",
  "Workshop"
];

// Common amenities for venues
const COMMON_AMENITIES = [
  "Parking",
  "WiFi",
  "Air Conditioning",
  "Catering Services",
  "Stage",
  "Sound System",
  "Projector",
  "Backup Power",
  "Dressing Room",
  "Security",
  "Wheelchair Access"
];

const formFields: FormSection[] = [
  {
    section: "Basic Information",
    fields: [
      { label: "Venue Name", name: "name", type: "text", required: true },
      { label: "Capacity", name: "capacity", type: "number", required: true },
    ]
  },
  {
    section: "Address",
    fields: [
      { label: "Address Line 1", name: "address.addressLine1", type: "text", required: true },
      { label: "Address Line 2", name: "address.addressLine2", type: "text" },
      { label: "Street", name: "address.street", type: "text", required: true },
      { label: "City", name: "address.city", type: "text", required: true },
      { label: "Pincode", name: "address.pincode", type: "text", required: true },
      { label: "State", name: "address.state", type: "text", required: true },
      { label: "Country", name: "address.country", type: "text", required: true }
    ]
  }
];

export default function VenueManagement() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<VenueDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueDetails | null>(null);
  // These states might be used later for upload progress
  const [isUploading, setIsUploading] = useState(false);

  // Initialize with empty form data
  const getInitialFormData = (): VenueDetails => ({
    name: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      street: '',
      city: '',
      pincode: '',
      state: '',
      country: ''
    },
    photo: [],
    capacity: 0,
    amenities: [],
    eventTypes: [],
    venuePrices: [],
    location: {
      type: "Point",
      coordinates: [0, 0]
    }
  });

  const [formData, setFormData] = useState<VenueDetails>(getInitialFormData());
  const [vendorData, setVendorData] = useState<any>(null);

  // Fetch all venues for the vendor
  useEffect(() => {
    const fetchVenues = async () => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);
        const token = await user.getIdToken();

        // First get the vendor object
        const vendorData = await ApiClient.get<VendorResponse>(`/vendors/${user.uid}`, token);
        setVendorData(vendorData);

        // Then fetch venues using vendor's ID
        const venuesData = await ApiClient.get<VenuesResponse>(`/explore-venues/venues-by-vendor/${vendorData._id}`, token);
        
        if (venuesData.success) {
          setVenues(venuesData.venues);
        } else {
          throw new Error(venuesData.message || 'Failed to fetch venues');
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
        toast.error('Failed to load venues');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [user]);

  // Handle image uploads to Appwrite
  const handleImageUpload = async (files: FileList) => {
    if (!user?.uid) {
      toast.error('Please login to upload images');
      return;
    }

    const newFiles = Array.from(files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    try {
      setIsUploading(true);
      
      // Use the venue ID if it exists, otherwise create a temporary ID
      const tempVenueId = selectedVenue?._id || `temp-${Date.now()}`;
      
      // Use the uploadVenuePhotos utility from venueStorage
      const uploadedPhotos = await uploadVenuePhotos(validFiles, tempVenueId);
      
      setFormData(prev => ({
        ...prev,
        photo: [...(prev.photo || []), ...uploadedPhotos]
      }));

      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove an uploaded image
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photo: prev.photo.filter((_: any, i: number) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      toast.error('Please login to save venue');
      return;
    }

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const endpoint = selectedVenue?._id 
        ? `/explore-venues/${selectedVenue._id}`
        : '/explore-venues';

      // Add vendor ID to form data if creating new venue
      const updatedFormData = {
        ...formData,
        vendor: vendorData._id, // Add the vendor reference
      };

      // Create or update venue
      if (selectedVenue?._id) {
        await ApiClient.put<ApiResponse<VenueDetails>>(endpoint, updatedFormData, token);
      } else {
        await ApiClient.post<ApiResponse<VenueDetails>>(endpoint, updatedFormData, token);
      }
      
      toast.success(`Venue ${selectedVenue?._id ? 'updated' : 'created'} successfully`);
      setIsCreating(false);
      setSelectedVenue(null);
      
      // Refresh venues list using vendor ID
      if (vendorData?._id) {
        const updatedVenuesData = await ApiClient.get<VenuesResponse>(`/explore-venues/venues-by-vendor/${vendorData._id}`, token);
        if (updatedVenuesData.success) {
          setVenues(updatedVenuesData.venues);
        }
      }
    } catch (error) {
      console.error('Error saving venue:', error);
      toast.error('Failed to save venue');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => {
      const newData = { ...prev };
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        newData[parent] = {
          ...newData[parent],
          [child]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        };
      } else {
        newData[name] = isCheckbox ? (e.target as HTMLInputElement).checked : value;
      }
      return newData;
    });
  };

  // Start creating a new venue
  const handleCreateNew = () => {
    setFormData(getInitialFormData());
    setSelectedVenue(null);
    setIsCreating(true);
  };

  // Edit existing venue
  const handleEdit = (venue: VenueDetails) => {
    setFormData(venue);
    setSelectedVenue(venue);
    setIsCreating(true);
  };

  // Render venue list or form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isCreating ? (
          // Venue List View
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">My Venues</h1>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FFB347] hover:bg-[#f2a537] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB347]"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Venue
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 text-[#FFB347] animate-spin" />
              </div>
            ) : venues.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No venues</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new venue.</p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FFB347] hover:bg-[#f2a537]"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New Venue
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {venues.map((venue) => (
                  <div key={venue._id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={venue.photo?.[0]?.url || '/default-venue.jpg'}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleEdit(venue)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      >
                        <Edit className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          {venue.address.city}, {venue.address.state}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          Capacity: {venue.capacity}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {venue.eventTypes.length} Event Types
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Venue Creation/Edit Form
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setIsCreating(false)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedVenue ? 'Edit Venue' : 'Create New Venue'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Venue Photos</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photo.map((photo: VenuePhoto, index: number) => (
                    <div key={photo.fileId} className="relative">
                      <img
                        src={photo.url}
                        alt={`Venue photo ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="relative h-24 w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-[#FFB347] transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-[#FFB347]">
                      <ImageIcon className="w-8 h-8" />
                      <span className="mt-2 text-sm">Add Photos</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              {formFields.map((section) => (
                <div key={section.section} className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{section.section}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            name={field.name}
                            value={field.name.includes('.') ? 
                              formData[field.name.split('.')[0]][field.name.split('.')[1]] :
                              formData[field.name]}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFB347] focus:ring-[#FFB347]"
                            required={field.required}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={field.name.includes('.') ? 
                              formData[field.name.split('.')[0]][field.name.split('.')[1]] :
                              formData[field.name]}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FFB347] focus:ring-[#FFB347]"
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Event Types and Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Event Types & Pricing</h3>
                <div className="space-y-2">
                  {EVENT_TYPES.map((type) => (
                    <div key={type} className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        id={`eventType-${type}`}
                        checked={formData.eventTypes.includes(type)}
                        onChange={(e) => {
                          const newEventTypes = e.target.checked
                            ? [...formData.eventTypes, type]
                            : formData.eventTypes.filter(t => t !== type);
                          setFormData(prev => ({
                            ...prev,
                            eventTypes: newEventTypes
                          }));
                        }}
                        className="rounded border-gray-300 text-[#FFB347] focus:ring-[#FFB347]"
                      />
                      <label htmlFor={`eventType-${type}`} className="flex-1">{type}</label>
                      {formData.eventTypes.includes(type) && (
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.venuePrices.find(p => p.eventType === type)?.price || ''}
                            onChange={(e) => {
                              const newPrices = formData.venuePrices.filter(p => p.eventType !== type);
                              if (e.target.value) {
                                newPrices.push({
                                  eventType: type,
                                  price: Number(e.target.value)
                                });
                              }
                              setFormData(prev => ({
                                ...prev,
                                venuePrices: newPrices
                              }));
                            }}
                            className="ml-2 w-24 rounded-md border-gray-300 focus:border-[#FFB347] focus:ring-[#FFB347]"
                            placeholder="Price"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {COMMON_AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => {
                          const newAmenities = e.target.checked
                            ? [...formData.amenities, amenity]
                            : formData.amenities.filter(a => a !== amenity);
                          setFormData(prev => ({
                            ...prev,
                            amenities: newAmenities
                          }));
                        }}
                        className="rounded border-gray-300 text-[#FFB347] focus:ring-[#FFB347]"
                      />
                      <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB347]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FFB347] hover:bg-[#f2a537] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB347] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      {selectedVenue ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{selectedVenue ? 'Update Venue' : 'Create Venue'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}