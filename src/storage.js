import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "TRAIL_COMPASS_PINS_V1";

export async function loadPins() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
export async function savePins(pins) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(pins));
  } catch {}
}
