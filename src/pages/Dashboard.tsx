import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, Camera, Save, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { getProfileImageUrl } from '../utils/hash';

export const Dashboard: React.FC = () => {
  const { user, updateAvatar, updateProfile, logout } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    websiteProtocol: 'https',
    website: '',
  });
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      // Parse protocol from existing website URL
      let websiteProtocol = 'https';
      let website = user.website || '';
      
      if (website) {
        if (website.startsWith('http://')) {
          websiteProtocol = 'http';
          website = website.replace('http://', '');
        } else if (website.startsWith('https://')) {
          websiteProtocol = 'https';
          website = website.replace('https://', '');
        }
      }
      
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        websiteProtocol: websiteProtocol,
        website: website,
      });
    }
  }, [user]);

  if (!user) {
    return <div className="text-gray-100">Please log in to view this page.</div>;
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine protocol and website
    const websiteUrl = profileData.website 
      ? `${profileData.websiteProtocol}://${profileData.website.replace(/^https?:\/\//, '')}`
      : '';
    
    updateProfile({
      ...profileData,
      website: websiteUrl,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleProfileChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const profileImageUrl = user ? getProfileImageUrl(user.email) : '';
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileImageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          updateAvatar(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
        <div className="bg-gray-800 px-8 py-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Manage Avatar</h2>
            <p className="text-gray-400 mt-1">{user.email}</p>
          </div>
          <button 
            onClick={logout}
            className="text-sm text-red-400 hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-gray-800 shadow-xl bg-gray-700">
                  <img 
                    src={user.avatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
                >
                  <Camera size={20} />
                </button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-100">Current Avatar</h3>
                <p className="text-xs text-gray-400 mt-1">Visible on enabled sites</p>
              </div>

              {/* Profile Link Section */}
              <div className="mt-6 w-full max-w-xs">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon size={16} className="text-gray-400" />
                    <label className="text-xs font-medium text-gray-300">Your Profile Image URL</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={profileImageUrl}
                      className="flex-1 text-xs px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200 font-mono truncate"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={handleCopyLink}
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
                      title="Copy link"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Use this URL to display your avatar anywhere
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="flex-1 w-full">
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-blue-900/50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Upload a new image
                </h3>
                <p className="text-gray-400 mb-6">
                  Drag and drop an image here, or click to select a file.
                  <br />
                  <span className="text-xs mt-2 block">Supports JPG, PNG, GIF (Max 10MB)</span>
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button className="bg-gray-700 border border-gray-600 text-gray-200 px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors">
                  Choose File
                </button>
              </div>

              {/* Profile Information Form */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-100 border-b border-gray-700 pb-2 mb-4">
                  Profile Information
                </h4>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      readOnly
                      value={user.email}
                      className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Display Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      placeholder="Tell us about yourself"
                      className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      placeholder="City, Country"
                      className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      value={profileData.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                      Website
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="websiteProtocol"
                        className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        value={profileData.websiteProtocol}
                        onChange={(e) => handleProfileChange('websiteProtocol', e.target.value)}
                      >
                        <option value="https">HTTPS</option>
                        <option value="http">HTTP</option>
                      </select>
                      <input
                        id="website"
                        type="text"
                        placeholder="example.com"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        value={profileData.website}
                        onChange={(e) => handleProfileChange('website', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save Profile
                    </button>
                    {saveSuccess && (
                      <span className="text-sm text-green-400 flex items-center gap-1">
                        <Check size={16} />
                        Profile saved!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

