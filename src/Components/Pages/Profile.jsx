import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuth } from '../AppContext/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setFormData(userDoc.data());
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), formData);
      setUserData(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      setUploading(true);
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
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        profilePictureUrl: data.secure_url
      });

      setUserData(prev => ({ ...prev, profilePictureUrl: data.secure_url }));
      setFormData(prev => ({ ...prev, profilePictureUrl: data.secure_url }));
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-8 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-400">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {error && (
          <div className="bg-red-600 border border-red-400 text-white px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <img
              src={userData?.profilePictureUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-indigo-400">{userData?.userName}</h2>
            <p className="text-indigo-300">@{userData?.userTag}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200">Username</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Profession</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Bio</h3>
              <p className="mt-1">{userData?.bio || 'No bio yet'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Location</h3>
              <p className="mt-1">{userData?.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Profession</h3>
              <p className="mt-2">{userData?.profession}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Date of Birth</h3>
              <p className="mt-2">{userData?.dob}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Gender</h3>
              <p className="mt-2">{userData?.gender}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
