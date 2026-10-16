// Major world cities for documentary storytelling
export const WORLD_CITIES = [
  // Europe
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, region: 'Europe', flag: '🇬🇧' },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, region: 'Europe', flag: '🇫🇷' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.405, region: 'Europe', flag: '🇩🇪' },
  { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, region: 'Europe', flag: '🇮🇹' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, region: 'Europe', flag: '🇪🇸' },
  { id: 'moscow', name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173, region: 'Europe', flag: '🇷🇺' },
  { id: 'athens', name: 'Athens', country: 'Greece', lat: 37.9838, lon: 23.7275, region: 'Europe', flag: '🇬🇷' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784, region: 'Europe/Asia', flag: '🇹🇷' },

  // Middle East & North Africa
  { id: 'cairo', name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, region: 'Middle East', flag: '🇪🇬' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708, region: 'Middle East', flag: '🇦🇪' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753, region: 'Middle East', flag: '🇸🇦' },
  { id: 'baghdad', name: 'Baghdad', country: 'Iraq', lat: 33.3152, lon: 44.3661, region: 'Middle East', flag: '🇮🇶' },
  { id: 'jerusalem', name: 'Jerusalem', country: 'Israel', lat: 31.7683, lon: 35.2137, region: 'Middle East', flag: '🇮🇱' },

  // Asia
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, region: 'Asia', flag: '🇯🇵' },
  { id: 'beijing', name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, region: 'Asia', flag: '🇨🇳' },
  { id: 'shanghai', name: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, region: 'Asia', flag: '🇨🇳' },
  { id: 'hongkong', name: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694, region: 'Asia', flag: '🇭🇰' },
  { id: 'delhi', name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.209, region: 'Asia', flag: '🇮🇳' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777, region: 'Asia', flag: '🇮🇳' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, region: 'Asia', flag: '🇸🇬' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.978, region: 'Asia', flag: '🇰🇷' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018, region: 'Asia', flag: '🇹🇭' },
  { id: 'samarkand', name: 'Samarkand', country: 'Uzbekistan', lat: 39.6542, lon: 66.9597, region: 'Central Asia', flag: '🇺🇿' },

  // Americas
  { id: 'newyork', name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, region: 'Americas', flag: '🇺🇸' },
  { id: 'washington', name: 'Washington D.C.', country: 'United States', lat: 38.9072, lon: -77.0369, region: 'Americas', flag: '🇺🇸' },
  { id: 'losangeles', name: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437, region: 'Americas', flag: '🇺🇸' },
  { id: 'sanfrancisco', name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194, region: 'Americas', flag: '🇺🇸' },
  { id: 'havana', name: 'Havana', country: 'Cuba', lat: 23.1136, lon: -82.3666, region: 'Americas', flag: '🇨🇺' },
  { id: 'panama', name: 'Panama Canal', country: 'Panama', lat: 9.1012, lon: -79.6955, region: 'Americas', flag: '🇵🇦' },
  { id: 'riodejaneiro', name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, region: 'Americas', flag: '🇧🇷' },
  { id: 'buenosaires', name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, region: 'Americas', flag: '🇦🇷' },
  { id: 'lima', name: 'Lima', country: 'Peru', lat: -12.0464, lon: -77.0428, region: 'Americas', flag: '🇵🇪' },

  // Africa
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219, region: 'Africa', flag: '🇰🇪' },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lon: 28.0473, region: 'Africa', flag: '🇿🇦' },
  { id: 'capetown', name: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241, region: 'Africa', flag: '🇿🇦' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792, region: 'Africa', flag: '🇳🇬' },
  { id: 'casablanca', name: 'Casablanca', country: 'Morocco', lat: 33.5731, lon: -7.5898, region: 'Africa', flag: '🇲🇦' },

  // Oceania
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, region: 'Oceania', flag: '🇦🇺' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, region: 'Oceania', flag: '🇦🇺' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', lat: -36.8485, lon: 174.7633, region: 'Oceania', flag: '🇳🇿' }
];

export function getCityById(id) {
  return WORLD_CITIES.find(c => c.id === id);
}

// Convert latitude and longitude to 3D Cartesian coordinates on sphere
export function latLonToVector3(lat, lon, radius = 5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return { x, y, z };
}
