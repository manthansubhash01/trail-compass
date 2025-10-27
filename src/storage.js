import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "TRAIL_COMPASS_PINS_V1";

// TODO: Load the saved pins
export async function loadPins() {
  try {
    const pin = await AsyncStorage.getItem(KEY)
    if(pin == null){
      return []
    }
    return JSON.parse(pin)
  } catch {
    return [];
  }
}

// TODO: Save the pins locally
export async function savePins(pins) {
  try {
    await AsyncStorage.setItem(KEY,JSON.stringify(pins))
  } catch {
    console.log("Error occured while storing pins")
  }
}
