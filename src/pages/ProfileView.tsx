import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hashEmail } from '../utils/hash';
import { ArrowLeft } from 'lucide-react';

interface ProfileData {
  email: string;
  avatarUrl: string;
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export const ProfileView: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hash) {
      setLoading(false);
      return;
    }

    // Look up profile by hash
    const storedAvatars = JSON.parse(localStorage.getItem('avatars') || '{}');
    const storedUser = localStorage.getItem('user');
    
    // Find email that matches this hash
    let foundProfile: ProfileData | null = null;

    // Check stored avatars
    for (const [email, url] of Object.entries(storedAvatars)) {
      if (hashEmail(email) === hash) {
        foundProfile = {
          email,
          avatarUrl: url as string,
        };
        break;
      }
    }

    // Check current user
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (hashEmail(user.email) === hash) {
        foundProfile = {
          email: user.email,
          avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
          name: user.name,
          bio: user.bio,
          location: user.location,
          website: user.website,
        };
      }
    }

    // If we found an avatar but not full profile, try to get profile from user storage
    if (foundProfile && !foundProfile.name) {
      // Check if there's a stored user with this email
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === foundProfile.email) {
          foundProfile = {
            ...foundProfile,
            name: user.name,
            bio: user.bio,
            location: user.location,
            website: user.website,
          };
        }
      }
    }

    // If still no profile found, create a default one
    if (!foundProfile) {
      // We can't reverse the hash, so we'll show a default profile
      foundProfile = {
        email: 'Unknown',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${hash}`,
      };
    }

    setProfile(foundProfile);
    setLoading(false);
  }, [hash]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-32 h-32 bg-gray-700 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Profile Not Found</h2>
          <p className="text-gray-400 mb-6">This profile doesn't exist.</p>
          <Link to="/avatars" className="text-blue-400 hover:text-blue-300">
            Back to Avatars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/avatars"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-100 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Avatars
      </Link>

      <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-gray-700 shadow-xl bg-gray-700">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name || profile.email}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-100 mb-2">
                {profile.name || profile.email}
              </h1>
              {profile.name && (
                <p className="text-gray-400 mb-6">{profile.email}</p>
              )}

              {profile.bio && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-300 mb-2">Bio</h2>
                  <p className="text-gray-400 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              <div className="space-y-3">
                {profile.location && (
                  <div>
                    <span className="text-sm font-semibold text-gray-300">Location: </span>
                    <span className="text-gray-400">{profile.location}</span>
                  </div>
                )}

                {profile.website && (
                  <div>
                    <span className="text-sm font-semibold text-gray-300">Website: </span>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

