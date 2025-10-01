// Export API base URL read from env. Default to deployed backend so frontend on Vercel calls correct host.
export const API_BASE = process.env.REACT_APP_API_URL || 'https://lms-backend-6ik3.onrender.com';
