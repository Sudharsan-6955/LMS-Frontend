// Use Vercel deployment URL as default API base; override with REACT_APP_API_BASE_URL if needed.
const config = {
	// Set local dev default to port 5000 (your backend). Override with REACT_APP_API_BASE_URL.
	API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
	ASSET_PATH: process.env.REACT_APP_ASSET_PATH || '/assets/',
	DEFAULT_AVATAR: process.env.REACT_APP_DEFAULT_AVATAR || 'assets/images/instructor/01.jpg',
	// add other shared values here as needed
};

export default config;
export const API_BASE_URL = config.API_BASE_URL;
// Keep alias for older imports
export const API_BASE = config.API_BASE_URL;
export const ASSET_PATH = config.ASSET_PATH;
export const DEFAULT_AVATAR = config.DEFAULT_AVATAR;
