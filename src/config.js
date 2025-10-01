// Minimal config used by pages/components that import "../config"
const config = {
	API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://example.com/api',
	ASSET_PATH: process.env.REACT_APP_ASSET_PATH || '/assets/',
	DEFAULT_AVATAR: process.env.REACT_APP_DEFAULT_AVATAR || 'assets/images/instructor/01.jpg',
	// add other shared values here as needed
};

export default config;
export const API_BASE_URL = config.API_BASE_URL;
// Add alias to satisfy imports that expect API_BASE
export const API_BASE = config.API_BASE_URL;
export const ASSET_PATH = config.ASSET_PATH;
export const DEFAULT_AVATAR = config.DEFAULT_AVATAR;
