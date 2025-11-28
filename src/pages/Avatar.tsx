import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { hashEmail } from '../utils/hash';

export const Avatar: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hash) {
      setLoading(false);
      return;
    }

    // Look up avatar by hash
    // Check all stored avatars to find one matching this hash
    const storedAvatars = JSON.parse(localStorage.getItem('avatars') || '{}');
    
    // Find email that matches this hash
    for (const [email, url] of Object.entries(storedAvatars)) {
      if (hashEmail(email) === hash) {
        setAvatarUrl(url as string);
        setLoading(false);
        return;
      }
    }

    // If not found in custom avatars, check if there's a user with this email hash
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (hashEmail(user.email) === hash) {
        // Use the user's avatar or generate a default one
        setAvatarUrl(user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`);
        setLoading(false);
        return;
      }
    }

    // Default avatar if not found
    setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${hash}`);
    setLoading(false);
  }, [hash]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-32 h-32 bg-gray-700 rounded-full animate-pulse" />
      </div>
    );
  }

  // Display the image directly
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <img 
        src={avatarUrl || ''} 
        alt="Avatar" 
        className="w-64 h-64 rounded-full object-cover shadow-xl ring-4 ring-gray-800"
      />
    </div>
  );
};

