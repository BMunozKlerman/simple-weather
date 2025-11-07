const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL;
const ICON_BASE_URL = import.meta.env.VITE_OPENWEATHER_ICON_URL;

// Validate required environment variables
if (!API_KEY) {
  throw new Error('VITE_OPENWEATHER_API_KEY is not set in environment variables');
}
if (!BASE_URL) {
  throw new Error('VITE_OPENWEATHER_BASE_URL is not set in environment variables');
}
if (!ICON_BASE_URL) {
  throw new Error('VITE_OPENWEATHER_ICON_URL is not set in environment variables');
}

/**
 * Fetches weather forecast data from OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather forecast data
 */
export const getWeatherForecast = async (lat, lon) => {
  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Gets the weather icon URL from OpenWeatherMap
 * @param {string} iconCode - Icon code from weather API response
 * @returns {string} Full URL to the weather icon
 */
export const getWeatherIconUrl = (iconCode) => {
  return `${ICON_BASE_URL}/${iconCode}@2x.png`;
};

