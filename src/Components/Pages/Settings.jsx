import React, { useState } from 'react';
import { FaQuestionCircle, FaEnvelope, FaBook, FaTools, FaPhone, FaHeadset, FaTimes } from 'react-icons/fa';

const Settings = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Help and Support</h2>
          
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FaQuestionCircle className="text-blue-500 text-xl mr-2" />
              <h3 className="text-xl font-medium text-gray-700">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-800">How do I update my profile?</h4>
                <p className="text-gray-600 mt-2">You can update your profile by clicking on your profile picture in the top right corner and selecting "Edit Profile".</p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-800">How do I change my password?</h4>
                <p className="text-gray-600 mt-2">Go to Account Settings {'>'} Security {'>'} Change Password to update your password.</p>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-800">How do I report a problem?</h4>
                <p className="text-gray-600 mt-2">You can report any issues by clicking the "Contact Support" button below or emailing support@orbitweb.com</p>
              </div>
            </div>
          </div>

          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-green-500 text-xl mr-2" />
              <h3 className="text-xl font-medium text-gray-700">Contact Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Need help? Our support team is here to assist you.</p>
            
            <button 
              onClick={() => setShowContactModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Contact Support
            </button>
          </div>

          
          {showContactModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
                  <button 
                    onClick={() => setShowContactModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaPhone className="text-green-500 text-xl mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Customer Support</h4>
                      <p className="text-gray-600">+91 8272848608</p>
                      <p className="text-gray-600">Available Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-blue-500 text-xl mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Email Support</h4>
                      <p className="text-gray-600">support@orbitweb.com</p>
                      <p className="text-gray-600">For general inquiries and support</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-purple-500 text-xl mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Technical Support</h4>
                      <p className="text-gray-600">tech@orbitweb.com</p>
                      <p className="text-gray-600">For technical issues and bug reports</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FaBook className="text-purple-500 text-xl mr-2" />
              <h3 className="text-xl font-medium text-gray-700">Documentation</h3>
            </div>
            <p className="text-gray-600 mb-4">Access our comprehensive documentation to learn more about Orbit Web features.</p>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors">
              View Documentation
            </button>
          </div>

          
          <div>
            <div className="flex items-center mb-4">
              <FaTools className="text-orange-500 text-xl mr-2" />
              <h3 className="text-xl font-medium text-gray-700">Troubleshooting</h3>
            </div>
            <p className="text-gray-600 mb-4">Having issues? Check our troubleshooting guides for common problems.</p>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
              Troubleshooting Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 