import AsyncStorage from '@react-native-async-storage/async-storage';

// Caching the bundled JSON into AsyncStorage on first load means the exact
// same lookup will work later even if a future version of the app starts
// fetching city data from a server instead of a local file.
const keyFor = (cityId) => `rotfinder_city_${cityId}`;

export async function getCachedCityData(cityId) {
  const raw = await AsyncStorage.getItem(keyFor(cityId));
  return raw ? JSON.parse(raw) : null;
}

export async function setCachedCityData(cityId, data) {
  await AsyncStorage.setItem(keyFor(cityId), JSON.stringify(data));
}
