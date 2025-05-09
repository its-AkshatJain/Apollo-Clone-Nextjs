"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaUserMd, FaFilter, FaSearch, FaThumbsUp, FaPlus } from "react-icons/fa";

// Doctor interface
interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  location: string;
  experience: string;
  rating: number;
  image?: string;
}

export default function DestinationPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const limit = 10;

  // Dynamic dropdown options
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [searchName, setSearchName] = useState("");

  // Fetch doctors - now wrapped with useCallback to prevent unstable references
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/list-doctor-with-filter`,
        {
          params: {
            specialty,
            location,
            page,
            limit,
            name: searchName, // Add name parameter for search
          },
        }
      );
      setDoctors(data.doctors || []);
      setTotalDoctors(data.total || 0);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setLoading(false);
    }
  }, [specialty, location, page, searchName]);
  
  // Fetch filter options only once on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [specRes, locRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/specialties`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations`),
        ]);
        setSpecialties(specRes.data.specialties || []);
        setLocations(locRes.data.locations || []);
      } catch (error) {
        console.error("Error fetching filter options", error);
      }
    };
  
    fetchFilters();
  }, []);
  
  // Re-fetch doctors when filters or page changes
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);
  
  // Handle search by name
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchDoctors();
  };

  // Generate star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={`${
              i < Math.floor(rating) 
                ? "text-yellow-400" 
                : i < rating 
                  ? "text-yellow-400" 
                  : "text-gray-300"
            } w-3 h-3`} 
          />
        ))}
        <span className="ml-1 text-xs text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Toggle mobile filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Function to get full image URL - UPDATED
  // Update the getImageUrl function
  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return '/placeholder-doctor.png';
    
    // Handle cases where imageUrl might have leading/trailing slashes
    const cleanImageUrl = imageUrl.replace(/^\/+|\/+$/g, '');
    
    // For production
    if (process.env.NODE_ENV === 'production') {
      return `https://your-render-app-name.onrender.com/${cleanImageUrl}`;
    }
    
    // For development
    return `http://localhost:5000/${cleanImageUrl}`;
  };

  return (
    <>
      <Head>
        <title>General Physician & Internal Medicine Specialists | Apollo 247</title>
        <meta 
          name="description" 
          content="Consult with experienced General Physicians and Internal Medicine specialists at Apollo 247. Book appointments online with top doctors."
        />
        <meta name="keywords" content="general physician, internal medicine, doctor appointment, Apollo 247" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Top navigation bar - Apollo style */}
        <div className="bg-white text-gray-800 py-3 shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
              <Image 
                src="/apollo247.svg" 
                alt="Apollo 247" 
                width={100} 
                height={28}
                className="mr-6 h-auto w-auto" // Add this
                priority // For above-the-fold images
              />
              </Link>
              <div className="hidden md:flex space-x-8">
                <span className="cursor-pointer hover:text-blue-600 font-medium text-blue-700">Doctors</span>
                <span className="cursor-pointer hover:text-blue-600">Pharmacy</span>
                <span className="cursor-pointer hover:text-blue-600">Lab Tests</span>
                <span className="cursor-pointer hover:text-blue-600">Health Records</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
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

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-500 mb-4">
            Home &gt; Find Doctors &gt; General Physician / Internal Medicine
          </div>
          
          {/* Add Doctor button - prominently positioned */}
          <div className="mb-6">
            <Link 
              href="/add-doctor" 
              className="bg-orange-500 text-white flex items-center justify-center px-4 py-3 rounded-md hover:bg-orange-600 transition shadow-md max-w-md mx-auto md:mx-0"
            >
              <FaPlus className="mr-2" /> Add a New Doctor
            </Link>
          </div>

          {/* Mobile filters toggle button */}
          <div className="md:hidden mb-4">
            <button 
              onClick={toggleFilters}
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-md py-2 px-4 shadow-sm"
            >
              <FaFilter className="mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-20">
                <div className="p-4 bg-blue-50 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-medium text-gray-800">Filters</h2>
                  <button 
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => {
                      setSpecialty("");
                      setLocation("");
                      setSearchName("");
                      setPage(1);
                    }}
                  >
                    Reset All
                  </button>
                </div>
                
                {/* Search by name */}
                <div className="p-4 border-b border-gray-200">
                  <form onSubmit={handleSearch}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Doctor's name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <button 
                        type="submit" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                      >
                        Go
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Specialty filter */}
                <div className="p-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={specialty}
                    onChange={(e) => {
                      setSpecialty(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Location filter */}
                <div className="p-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Consultation fee */}
                <div className="p-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="fee1" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="fee1" className="ml-2 text-sm text-gray-600">₹0 - ₹500</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="fee2" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="fee2" className="ml-2 text-sm text-gray-600">₹501 - ₹1000</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="fee3" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="fee3" className="ml-2 text-sm text-gray-600">₹1001 - ₹2000</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="fee4" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="fee4" className="ml-2 text-sm text-gray-600">₹2000+</label>
                    </div>
                  </div>
                </div>
                
                {/* Availability */}
                <div className="p-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="avail1" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="avail1" className="ml-2 text-sm text-gray-600">Available Today</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="avail2" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="avail2" className="ml-2 text-sm text-gray-600">Available Tomorrow</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="avail3" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="avail3" className="ml-2 text-sm text-gray-600">Available This Week</label>
                    </div>
                  </div>
                </div>
                
                {/* Gender */}
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="gender1" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="gender1" className="ml-2 text-sm text-gray-600">Male</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="gender2" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="gender2" className="ml-2 text-sm text-gray-600">Female</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaUserMd className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">
                        General Physician / Internal Medicine
                      </h1>
                      <p className="text-gray-600 text-sm mt-1">
                        Consult with top doctors online or visit nearby clinics
                      </p>
                    </div>
                  </div>
                  <div className="self-start md:self-auto">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-xs text-blue-700 flex items-center">
                      <FaThumbsUp className="mr-1" />
                      97% (4738 ratings)
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">
                    General Physicians are skilled doctors trained to diagnose and treat a wide range of health conditions. They provide comprehensive healthcare and can refer patients to specialists when necessary. Apollo General Physicians have vast experience in treating various ailments and offer expert medical advice.
                  </p>
                </div>
              </div>
              
              {/* Results count */}
              <div className="mb-4">
                <p className="text-gray-700 font-medium">
                  {totalDoctors} Doctor{totalDoctors !== 1 ? 's' : ''} Found
                </p>
              </div>

              {/* Loading state */}
              {loading ? (
                <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {/* Doctor Cards */}
                  <div className="space-y-4">
                    {doctors.length === 0 ? (
                      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
                        <p className="text-gray-500 text-lg">No doctors found matching your criteria</p>
                      </div>
                    ) : (
                      doctors.map((doc) => (
                        <div
                          key={doc._id}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                        >
                          <div className="p-4 md:p-6 flex flex-col md:flex-row">
                            {/* Doctor avatar */}
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex justify-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
  {doc.image ? (
    <img
      src={getImageUrl(doc.image)}
      alt={doc.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = '/Doctor-placeholder.svg.';
        target.onerror = null; // Prevent infinite loop if placeholder also fails
      }}
    />
  ) : (
    <FaUserMd className="text-gray-400 text-4xl" />
  )}
</div>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex flex-wrap justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <h2 className="text-lg font-bold text-blue-800">Dr. {doc.name}</h2>
                                    <div className="ml-2">{renderStars(doc.rating)}</div>
                                  </div>
                                  <p className="text-blue-600 text-sm font-medium mt-1">{doc.specialty}</p>
                                </div>
                                <div className="mt-2 md:mt-0 bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-xs">
                                  Video Consult Available
                                </div>
                              </div>
                              
                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex items-center text-gray-600 text-sm">
                                  <FaBriefcase className="mr-2 text-gray-500 text-xs" />
                                  <span>{doc.experience}</span>
                                </div>
                                
                                <div className="flex items-center text-gray-600 text-sm">
                                  <FaMapMarkerAlt className="mr-2 text-gray-500 text-xs" />
                                  <span>{doc.location}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                <div>
                                  <div className="text-green-600 font-medium text-sm">
                                    Available Today
                                  </div>
                                  <div className="text-gray-600 text-xs mt-1">
                                    Next available at: 10:30 AM
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                                  <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg text-sm transition">
                                    Book Hospital Visit
                                  </button>
                                  <button className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-6 rounded-lg text-sm transition">
                                    Video Consult
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pagination */}
                  {doctors.length > 0 && (
                    <div className="mt-8 flex justify-center items-center space-x-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded ${
                          page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border border-gray-300 text-blue-700 hover:bg-blue-50"
                        }`}
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      <div className="flex space-x-1">
                        {[...Array(Math.min(5, Math.ceil(totalDoctors / limit)))].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              page === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        {Math.ceil(totalDoctors / limit) > 5 && (
                          <span className="w-8 h-8 flex items-center justify-center">...</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(totalDoctors / limit)}
                        className={`px-3 py-1 rounded ${
                          page >= Math.ceil(totalDoctors / limit)
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border border-gray-300 text-blue-700 hover:bg-blue-50"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
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