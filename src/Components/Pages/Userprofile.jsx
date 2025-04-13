import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AppContext/AppContext';
import { doc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Avatar } from '@material-tailwind/react';
import avatar from '../../assets/images/avatar.jpg';
import profilePic from '../../assets/images/profilePic.jpg';
import Navbar from '../Navbar/Navbar';
import LeftSide from '../LeftSidebar/LeftSide';
import RightSide from '../RightSidebar/RightSide';

const UserProfile = () => {
    const { user, userData } = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                location: userData.location || '',
                bio: userData.bio || '',
            });
        }
    }, [userData]);

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
            
            await updateDoc(doc(db, 'users', user.uid), {
                image: data.secure_url
            });

            setSuccess('Profile picture updated successfully');
        } catch (err) {
            console.error('Image upload error:', err);
            setError(err.message || 'Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                location: userData.location || '',
                bio: userData.bio || '',
            });
        }
        setEditMode(false);
        setError('');
        setSuccess('');
    };

    const createUserDocument = async () => {
        try {
            if (!user || !user.uid) {
                return false;
            }
            
            console.log('Creating new user document for UID:', user.uid);
            const collectionUsersRef = collection(db, 'users');
            
            await addDoc(collectionUsersRef, {
                uid: user.uid,
                name: formData.name || user.displayName || '',
                email: user.email || '',
                phone: formData.phone || '',
                location: formData.location || '',
                bio: formData.bio || '',
                providerId: user.providerData[0]?.providerId || 'unknown',
                image: user.photoURL || ''
            });
            
            console.log('User document created successfully');
            return true;
        } catch (err) {
            console.error('Error creating user document:', err);
            return false;
        }
    };
    
    const handleSave = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            
            // Check if user is available
            if (!user || !user.uid) {
                setError('User authentication data is not available. Please try logging in again.');
                return;
            }
            
            console.log('Searching for user document with UID:', user.uid);
            const q = query(collection(db, 'users'), where('uid', '==', user.uid));
            const querySnapshot = await getDocs(q);
            
            console.log('Query result:', querySnapshot.empty ? 'No documents found' : `Found ${querySnapshot.docs.length} documents`);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                console.log('User document found with ID:', userDoc.id);
                
                const updatedData = {
                    name: formData.name,
                    phone: formData.phone,
                    location: formData.location,
                    bio: formData.bio,
                };
                
                await updateDoc(doc(db, 'users', userDoc.id), updatedData);
                setSuccess('Profile updated successfully!');
                setEditMode(false);
                
              
            } else {
                console.error('User document not found for UID:', user.uid);
                
                // Attempt to create a new user document
                const created = await createUserDocument();
                
                if (created) {
                    setSuccess('Your profile has been created and updated successfully!');
                    setEditMode(false);
                    
                  
                } else {
                    setError('Unable to create or update your profile. Please try logging out and back in.');
                }
            }
        } catch (err) {
            console.error('Error in handleSave:', err);
            setError('Error updating profile: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="fixed top-0 z-10 w-full bg-white">
                <Navbar />
            </div>
            <div className="flex bg-gray-100">
                <div className="flex-auto w-[20%] fixed top-12">
                    <LeftSide />
                </div>
                <div className="flex-auto w-[60%] absolute left-[20%] top-14 bg-gray-100 rounded-xl">
                    <div className="w-[80%] mx-auto">
                        <div>
                            <div className="relative py-4">
                                <img
                                    className="h-96 w-full rounded-md object-cover"
                                    src={profilePic}
                                    alt="profilePic"
                                />
                                <div className="absolute bottom-10 left-6">
                                    <div className="relative">
                                        <Avatar
                                            size="xl"
                                            variant="circular"
                                            src={userData?.image || user?.photoURL || avatar}
                                            alt="avatar"
                                        />
                                        {editMode && (
                                            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    disabled={uploading}
                                                />
                                                <svg
                                                    className="w-6 h-6 text-gray-600"
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
                                    {uploading && (
                                        <div className="text-white text-sm mt-2">Uploading image...</div>
                                    )}
                                    <p className="py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">
                                        {userData?.email}
                                    </p>
                                    <p className="py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">
                                        {userData?.name}
                                    </p>
                                </div>
                                <div className="flex flex-col absolute right-6 bottom-10">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="#fff"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                            />
                                        </svg>
                                        <span className="ml-2 py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">
                                            {userData?.location || 'Add your location'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-md my-4">
                            <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                            
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            {success && <p className="text-green-500 mb-4">{success}</p>}
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Name:</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{userData?.name || 'Not set'}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Email:</label>
                                    <p className="text-gray-800">{userData?.email || 'Not set'}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Phone:</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{userData?.phone || 'Not set'}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Location:</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{userData?.location || 'Not set'}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Bio:</label>
                                    {editMode ? (
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="4"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{userData?.bio || 'Tell us about yourself'}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                {editMode ? (
                                    <>
                                        <button 
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button 
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={handleEdit}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-auto w-[20%] fixed right-0 top-12">
                    <RightSide />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;