"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { FaUserMd, FaArrowLeft, FaHospital, FaMapMarkerAlt, FaBriefcase, FaStar, FaUpload, FaImage } from "react-icons/fa";

export default function AddDoctorPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    location: "",
    experience: "",
    rating: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form data
      if (!form.name || !form.specialty || !form.location || !form.experience || !form.rating) {
        throw new Error("All fields are required");
      }
      
      // Validate rating
      const rating = parseFloat(form.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        throw new Error("Rating must be between 0 and 5");
      }
      
      // Create FormData object for file upload
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Append image file if selected
      if (file) {
        formData.append("image", file);
      }
      
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/add-doctor`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ 
        text: "Doctor added successfully! Redirecting...", 
        type: "success" 
      });
      
      // Clear form
      setForm({
        name: "",
        specialty: "",
        location: "",
        experience: "",
        rating: "",
      });
      setFile(null);
      setPreviewUrl(null);
      
      // Redirect after successful submit with delay
      setTimeout(() => {
        router.push("/specialties/general-physician-internal-medicine");
      }, 2000);
      
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({ text: "Failed to add doctor. Please try again.", type: "error" });
      }
    }    
  };

  return (
    <>
      <Head>
        <title>Add Doctor | Apollo 247 Admin</title>
        <meta 
          name="description" 
          content="Add new doctors to the Apollo 247 platform."
        />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Top navigation bar - Apollo style (matched with home page) */}
        <div className="bg-white text-gray-800 py-3 shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/apollo247.svg" 
                alt="Apollo 247" 
                width={120} 
                height={30} 
                className="mr-6"
              />
              <div className="hidden md:flex space-x-8">
                <span className="cursor-pointer hover:text-blue-600 font-medium">Doctors</span>
                <span className="cursor-pointer hover:text-blue-600">Pharmacy</span>
                <span className="cursor-pointer hover:text-blue-600">Lab Tests</span>
                <span className="cursor-pointer hover:text-blue-600">Health Records</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                Sign In / Sign Up
              </button>
              <button className="md:hidden text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Breadcrumb - matching with home page */}
          <div className="text-xs text-gray-500 mb-4">
            Home &gt; Find Doctors &gt; Add Doctor
          </div>
          
          {/* Back button */}
          <Link 
            href="/specialties/general-physician-internal-medicine" 
            className="flex items-center text-blue-700 hover:text-blue-800 mb-6 font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Doctor Listing
          </Link>
          
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FaUserMd className="text-blue-700 text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                Add New Doctor
              </h1>
            </div>
            <p className="text-gray-600">Add a new doctor to the Apollo 247 platform database.</p>
          </header>

          {/* Status messages */}
          {message.text && (
            <div 
              className={`mb-6 p-4 rounded-md ${
                message.type === "success" 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image upload section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Doctor Profile Image
                </label>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                    {previewUrl ? (
                      <Image 
                      src={previewUrl} 
                      alt="Doctor preview" 
                      width={96} 
                      height={96} 
                      className="object-cover rounded-full" 
                    />                    
                    ) : (
                      <FaImage className="text-gray-400 text-4xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="image-upload" 
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <FaUpload className="mr-2 text-blue-600" />
                      Upload Photo
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      JPG, PNG, or GIF up to 5MB. A professional photo is recommended.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                Doctor&apos;s Name *
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md p-3">
                    <FaUserMd className="text-gray-500" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    placeholder="Dr. Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded-r-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="specialty">
                  Specialty *
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md p-3">
                    <FaHospital className="text-gray-500" />
                  </div>
                  <input
                    id="specialty"
                    name="specialty"
                    placeholder="e.g. General Physician, Cardiologist"
                    value={form.specialty}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded-r-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="location">
                  Location *
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md p-3">
                    <FaMapMarkerAlt className="text-gray-500" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    placeholder="City, State"
                    value={form.location}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded-r-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="experience">
                  Experience *
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md p-3">
                    <FaBriefcase className="text-gray-500" />
                  </div>
                  <input
                    id="experience"
                    name="experience"
                    placeholder="e.g. 5+ years, 10 years"
                    value={form.experience}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded-r-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="rating">
                  Rating (0-5) *
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md p-3">
                    <FaStar className="text-gray-500" />
                  </div>
                  <input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="Rating between 0 and 5"
                    value={form.rating}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded-r-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Enter a value between 0 and 5. Decimals allowed (e.g. 4.5)</p>
              </div>

              <div className="pt-4 flex justify-end space-x-4">
                <Link
                  href="/specialties/general-physician-internal-medicine"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition flex items-center ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Add Doctor"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Footer - matched with home page */}
        <footer className="bg-blue-900 text-white py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Apollo 247</h3>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li className="hover:text-white cursor-pointer">About Us</li>
                  <li className="hover:text-white cursor-pointer">Contact Us</li>
                  <li className="hover:text-white cursor-pointer">FAQ</li>
                  <li className="hover:text-white cursor-pointer">Health Blogs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-4">For Patients</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li className="hover:text-white cursor-pointer">Find Doctors</li>
                  <li className="hover:text-white cursor-pointer">Book Lab Tests</li>
                  <li className="hover:text-white cursor-pointer">Order Medicines</li>
                  <li className="hover:text-white cursor-pointer">Read Health Articles</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-4">For Doctors</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li className="hover:text-white cursor-pointer">Join Apollo</li>
                  <li className="hover:text-white cursor-pointer">Apollo Pro</li>
                  <li className="hover:text-white cursor-pointer">Resources</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-4">Download App</h4>
                <div className="flex space-x-2">
                  <div className="p-2 bg-white bg-opacity-10 rounded cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.9 3H6.1C5.5 3 5 3.5 5 4.1v15.8c0 .6.5 1.1 1.1 1.1h11.8c.6 0 1.1-.5 1.1-1.1V4.1c0-.6-.5-1.1-1.1-1.1zM12 19c-.8 0-1.5-.7-1.5-1.5S11.2 16 12 16s1.5.7 1.5 1.5S12.8 19 12 19zm5-3H7V5h10v11z"/>
                    </svg>
                  </div>
                  <div className="p-2 bg-white bg-opacity-10 rounded cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.7 19.5H5.3c-.8 0-1.5-.7-1.5-1.5V6c0-.8.7-1.5 1.5-1.5h13.4c.8 0 1.5.7 1.5 1.5v12c0 .8-.7 1.5-1.5 1.5zM12 16l6-4-6-4v8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-blue-800 pt-6 text-sm text-blue-200 flex flex-col md:flex-row justify-between items-center">
              <div>© 2025 Apollo 247. All Rights Reserved.</div>
              <div className="mt-4 md:mt-0">
                <span className="mr-4 hover:text-white cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
