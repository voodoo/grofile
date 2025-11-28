import SHA256 from 'crypto-js/sha256';

export const hashEmail = (email: string): string => {
  // Follow Gravatar's hash creation process:
  // 1. Trim leading and trailing whitespace
  // 2. Force all characters to lower-case
  // 3. Hash the final string with SHA256
  // Reference: https://docs.gravatar.com/rest/hash/
  const normalizedEmail = email.trim().toLowerCase();
  return SHA256(normalizedEmail).toString();
};

export const getProfileImageUrl = (email: string, baseUrl?: string): string => {
  const hash = hashEmail(email);
  const base = baseUrl || window.location.origin;
  return `${base}/avatar/${hash}`;
};

export const getProfileUrl = (email: string, baseUrl?: string): string => {
  const hash = hashEmail(email);
  const base = baseUrl || window.location.origin;
  return `${base}/profile/${hash}`;
};

