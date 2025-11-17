//! Students: you'll add the actual Map and Marker code.
// This file compiles as-is so you can read the instructions on-device.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
// import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { loadPins, savePins } from "../storage";

export default function MapScreen() {
  // State: region (camera), me (my coords), pins (array), mapType (string)
  const [region, setRegion] = useState(null);
  const [me, setMe] = useState(null);
  const [pins, setPins] = useState([]);
  const [mapType, setMapType] = useState("standard");

  //? 1) Load saved pins (already implemented for you)
  useEffect(() => {
    (async () => {
      const saved = await loadPins();
      setPins(Array.isArray(saved) ? saved : []);
    })();
  }, []);

  //? 2) Request permission + get current location (already implemented)
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location denied",
          "Please enable location to use the map."
        );
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setMe({ latitude: coords.latitude, longitude: coords.longitude });
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  //? 3) Center on me (students can later switch to animateCamera once MapView exists)
  const centerOnMe = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    setMe({ latitude: coords.latitude, longitude: coords.longitude });
    setRegion((r) => ({
      ...(r ?? {}),
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }));
    // Later: use mapRef.animateCamera(...) after you add MapView
  };

  //? 4) Add/Remove/Clear pins (logic is ready; you’ll call these from Map events)
  const addPin = ({ latitude, longitude }) => {
    const pin = {
      id: String(Date.now()),
      title: `Pin ${pins.length + 1}`,
      latitude,
      longitude,
    };
    const next = [pin, ...pins];
    setPins(next);
    savePins(next);
  };

  const removePin = (id) => {
    const next = pins.filter((p) => p.id !== id);
    setPins(next);
    savePins(next);
  };

  const clearPins = async () => {
    setPins([]);
    await savePins([]);
  };

  const toggleMapType = () => {
    setMapType((t) => (t === "standard" ? "satellite" : "standard"));
  };

  // Loading UI
  if (!region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Getting location…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ============================
           TODO: MAP & MARKER INTEGRATION
           1) Import MapView and Marker from "react-native-maps"
           2) Render <MapView />
              - props:
                style={{ flex: 1 }}
                mapType={mapType}
                initialRegion={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation
                showsMyLocationButton={false}
                onLongPress={(e) => addPin(e.nativeEvent.coordinate)}
           3) Inside MapView, render pins with <Marker />
              {pins.map(p => (
                 <Marker
                   key={p.id}
                   coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                   title={p.title}
                   description={`${p.latitude.toFixed(5)}, ${p.longitude.toFixed(5)}`}
                   onCalloutPress={() => removePin(p.id)}
                 />
              ))}
         ============================ */}

      {/* Temporary placeholder so UI looks alive before students add the MapView */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>Map goes here</Text>
        <Text style={styles.placeholderHint}>
          Open this file and complete the TODOs to render MapView and Markers.
        </Text>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Button title="Center" onPress={centerOnMe} />
        <Button
          title={mapType === "standard" ? "Satellite" : "Standard"}
          onPress={toggleMapType}
        />
        <Button title="Clear" onPress={clearPins} disabled={!pins.length} />
      </View>

      {/* Coordinate badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {me
            ? `You: ${me.latitude.toFixed(4)}, ${me.longitude.toFixed(4)}`
            : "No location"}
        </Text>
        <Text style={[styles.badgeText, { opacity: 0.7 }]}>
          Pins: {pins.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  placeholder: {
    flex: 1,
    margin: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#d0d0d0",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fafafa",
  },
  placeholderTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  placeholderHint: { textAlign: "center", opacity: 0.7 },

  toolbar: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 10,
    right: 10,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  badgeText: { color: "white", fontWeight: "600" },
});
