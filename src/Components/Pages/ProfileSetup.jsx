import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    userTag: '',
    dob: null,
    location: '',
    gender: '',
    profession: '',
    profilePic: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dob: date
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      setLoading(true);
      setError(null);
      
      console.log('Uploading image to Cloudinary...');
      console.log('Cloudinary Configuration:', {
        url: import.meta.env.VITE_CLOUDINARY_URL,
        preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY
      });

      const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      console.log('Cloudinary Response:', responseText);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Cloudinary authentication failed. Please check your upload preset and API key configuration.');
        }
        throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Cloudinary response:', parseError);
        throw new Error('Invalid response from Cloudinary');
      }

      if (!data.secure_url) {
        throw new Error('No secure URL returned from Cloudinary');
      }

      console.log('Image uploaded successfully:', data.secure_url);
      setFormData(prev => ({
        ...prev,
        profilePic: data.secure_url
      }));
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate date of birth
      if (!formData.dob) {
        throw new Error('Please select your date of birth');
      }

      // Validate user tag length
      if (formData.userTag.length < 3) {
        throw new Error('User tag must be at least 3 characters long');
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create user document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        userName: formData.userName,
        userTag: formData.userTag.toLowerCase(),
        dob: formData.dob.toISOString(),
        location: formData.location,
        gender: formData.gender,
        profession: formData.profession,
        profilePic: formData.profilePic,
        email: user.email,
        createdAt: new Date().toISOString(),
        profileCompleted: true,
        followers: 0,
        following: 0
      });

      // Update user profile
      await updateProfile(user, {
        displayName: formData.userName,
        photoURL: formData.profilePic
      });

      // Navigate to the home page
      navigate('/');
    } catch (err) {
      console.error('Error setting up profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/starfield-deep-space-many-light-years-far-from-earth_112293-501.jpg?semt=ais_hybrid&w=740')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent"></div>
      
      {/* Profile Setup Form */}
      <div className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-black/20 shadow-[0_0_40px_rgba(8,_112,_184,_0.7)] border border-white/10">
        <h2 className="text-4xl font-bold text-center mb-8 text-white bg-clip-text">Complete Your Profile</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 group">
                {formData.profilePic ? (
                  <img 
                    src={formData.profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <label 
                  htmlFor="profilePic" 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="text-white text-sm font-medium">Change Photo</span>
                </label>
              </div>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
              {loading && (
                <div className="text-white/60 text-sm">Uploading image...</div>
              )}
            </div>

            <div className="relative group">
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <input
                type="text"
                name="userTag"
                value={formData.userTag}
                onChange={handleChange}
                placeholder="User Tag (Unique)"
                required
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <DatePicker
                selected={formData.dob}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                placeholderText="Date of Birth"
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
                required
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                popperClassName="bg-black/80 text-white border border-white/10 rounded-lg shadow-lg"
                calendarClassName="bg-black/80 text-white border border-white/10 rounded-lg"
                dayClassName={() => "text-white hover:bg-white/10 rounded-full"}
                monthClassName={() => "text-white"}
                yearClassName={() => "text-white hover:bg-white/10 rounded-full"}
                weekDayClassName={() => "text-white/70"}
                timeClassName={() => "text-white"}
                popperModifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 8],
                    },
                  },
                ]}
                popperPlacement="bottom"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20 appearance-none"
              >
                <option value="" className="bg-black/80">Select Gender</option>
                <option value="male" className="bg-black/80">Male</option>
                <option value="female" className="bg-black/80">Female</option>
                <option value="other" className="bg-black/80">Other</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Profession"
                required
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold 
            transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(79,_70,_229,_0.5)] active:scale-[0.98]
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black/20 disabled:opacity-50"
          >
            {loading ? 'Setting up profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup; 