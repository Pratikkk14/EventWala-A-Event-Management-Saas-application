import React, { useEffect, useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import ApiClient from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';


const BecomeVendorForm = () => {

  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [firstName, lastName] = user?.displayName?.split(' ') || ['', ''];

  // Remove UserData and use user from useAuth directly

  const vendorFields = [
    { label: "Business Name", name: "businessName", type: "text", required: true },
    { label: "Contact Person (Full Name)", name: "contactPerson", type: "text", required: true, default: `${firstName} ${lastName}` },
    { label: "Business Email", name: "email", type: "email", required: true, default: user?.email || '', readOnly: false },
    { label: "Business Phone Number", name: "phoneNumber", type: "tel", required: true, default: user?.phone || '', readOnly: false },
    { label: "Website/Portfolio URL", name: "website", type: "text", required: true },
    { label: "Vendor Description (Tell us about your services)", name: "vendorDescription", type: "textarea", required: true },
  ];
  
  const initialFormData = vendorFields.reduce((acc, field) => {
  acc[field.name] = field.default ?? '';
  return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiClient.post('/api/db/vendor/add', formData);
            if (response) {
                console.log('Vendor data submitted successfully');
                // Handle successful submission
                navigate('/vendor-dashboard'); // Redirect to vendor dashboard
            }
        } catch (error) {
            console.error('Error submitting vendor data:', error);
        }
    };

  const isFormValid = vendorFields.every(field => {
    const value = formData[field.name];
    return typeof value === 'string' && value.trim() !== '';
  });


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap');
          
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .font-roboto { font-family: 'Roboto', sans-serif; }
          .card { background-color: #1a1a2e; } /* Deep Navy/Purple Background */
          
          /* Custom Button Style for the Gradient Effect */
          .btn-gradient {
            background-image: linear-gradient(90deg, #6c5ce7, #a29bfe);
            transition: all 0.3s ease;
          }
          .btn-gradient:hover {
            background-image: linear-gradient(90deg, #5c4cae, #8c7aea);
            transform: translateY(-1px);
          }
        `}
      </style>

      <div className="w-full max-w-4xl card rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-poppins font-bold text-center mb-2 text-purple-300">
          Become a Vendor
        </h1>
        <p className="text-center text-gray-400 mb-8 font-roboto">
          Join our platform! Fill out the details below to start listing your venues and services.
        </p>

        {/* --- Form Submission Status Messages --- */}
        {submissionStatus === 'success' && (
          <div className="bg-green-600/30 text-green-300 p-4 rounded-lg mb-6 border border-green-500/50">
            <p className="font-semibold">Success! Your application has been submitted for verification.</p>
            <p className="text-sm mt-1">We will notify you via email when your vendor account is active.</p>
          </div>
        )}
        {submissionStatus === 'error' && (
          <div className="bg-red-600/30 text-red-300 p-4 rounded-lg mb-6 border border-red-500/50">
            <p className="font-semibold">Submission Failed.</p>
            <p className="text-sm mt-1">Please check your network connection and try again.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-poppins font-semibold text-purple-400 border-b border-gray-700 pb-2">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vendorFields.filter(f => f.type !== 'textarea' && f.name !== 'website').map(field => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-purple-300 shadow-sm bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 p-3 transition-colors"
                  required={field.required}
                  readOnly={field.readOnly || false}
                />
              </div>
            ))}
          </div>
          {/* Website/Portfolio URL full width */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Website/Portfolio URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="website"
              value={formData["website"]}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-purple-300 shadow-sm bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 p-3 transition-colors"
              required={true}
            />
          </div>
          {vendorFields.filter(f => f.type === 'textarea').map(field => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-lg border border-purple-300 shadow-sm bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500 p-3 transition-colors"
                required={field.required}
              />
            </div>
          ))}
          <div className="pt-4">
            <button
              type="submit"
              className={`w-full py-3 px-4 font-poppins font-bold text-lg rounded-lg btn-gradient text-white shadow-lg shadow-purple-900/40 transition-all duration-300 ${
                !isFormValid || submissionStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isFormValid || submissionStatus === 'loading'}
            >
              {submissionStatus === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeVendorForm;
