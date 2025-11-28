import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hashEmail } from '../utils/hash';

interface AvatarItem {
  email: string;
  avatarUrl: string;
  hash: string;
}

export const AvatarsList: React.FC = () => {
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);

  useEffect(() => {
    // Get all stored avatars from localStorage
    const storedAvatars = JSON.parse(localStorage.getItem('avatars') || '{}');
    
    // Convert to array with hash
    const avatarList: AvatarItem[] = Object.entries(storedAvatars).map(([email, url]) => ({
      email,
      avatarUrl: url as string,
      hash: hashEmail(email),
    }));

    // Also check if there's a current user that might not be in the avatars list
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userHash = hashEmail(user.email);
      
      // Only add if not already in the list
      if (!avatarList.find(a => a.email === user.email)) {
        avatarList.push({
          email: user.email,
          avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
          hash: userHash,
        });
      }
    }

    setAvatars(avatarList);
  }, []);

  if (avatars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">No Avatars Yet</h2>
          <p className="text-gray-400">Create your profile to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">All Avatars</h1>
        <p className="text-gray-400">Browse all registered profile avatars</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {avatars.map((avatar) => (
          <Link
            key={avatar.hash}
            to={`/profile/${avatar.hash}`}
            className="flex flex-col items-center p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 hover:border-2 transition-all cursor-pointer"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-700 mb-2 bg-gray-700">
              <img
                src={avatar.avatarUrl}
                alt={`Avatar for ${avatar.email}`}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

