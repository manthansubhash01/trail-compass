// src/screens/CompassScreen.js
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Share, Animated, Easing } from "react-native";
import {
  Appbar,
  Card,
  Text,
  Button,
  Snackbar,
  IconButton,
  Chip,
} from "react-native-paper";
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { fmt, toCardinal, nowISO } from "../utils/geo";
import { loadPins, savePins } from "../storage";

export default function CompassScreen({ navigation }) {
  const [heading, setHeading] = useState(null);
  const [coords, setCoords] = useState(null);
  const [pins, setPins] = useState([]);
  const [snack, setSnack] = useState("");

  // useRef for Animated value (prevents re-creation)
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let headingSub = null;
    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setSnack("Location permission denied");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      if (mounted) setCoords(pos.coords);

      headingSub = await Location.watchHeadingAsync(({ trueHeading }) => {
        if (mounted && typeof trueHeading === "number") setHeading(trueHeading);
      });

      const saved = await loadPins();
      if (mounted) setPins(saved);
    })();

    return () => {
      mounted = false;
      headingSub?.remove?.();
    };
  }, []);

  // Gentle bob loop
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  const dropPin = async () => {
    if (!coords) return setSnack("No GPS fix yet");
    const pin = {
      id: Date.now().toString(),
      lat: coords.latitude,
      lon: coords.longitude,
      heading: heading ?? 0,
      ts: nowISO(),
    };
    const next = [pin, ...pins];
    setPins(next);
    await savePins(next);
    setSnack("Pin saved");
  };

  const copyCoords = async () => {
    if (!coords) return;
    const text = `${fmt(coords.latitude)}, ${fmt(coords.longitude)}`;
    await Clipboard.setStringAsync(text);
    setSnack("Copied coordinates");
  };

  const shareCoords = async () => {
    if (!coords) return;
    const text = `I am here: ${fmt(coords.latitude)}, ${fmt(
      coords.longitude
    )} (${toCardinal(heading ?? 0)} ${Math.round(heading ?? 0)}°)`;
    await Share.share({ message: text });
  };

  // Gradient orientation from heading (0° = up, clockwise)
  const pointsForHeading = (deg = 0) => {
    const rad = (deg * Math.PI) / 180;
    const vx = Math.sin(rad);
    const vy = -Math.cos(rad);
    const k = 0.45;
    const sx = 0.5 - k * vx;
    const sy = 0.5 - k * vy;
    const ex = 0.5 + k * vx;
    const ey = 0.5 + k * vy;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    return {
      start: { x: clamp(sx), y: clamp(sy) },
      end: { x: clamp(ex), y: clamp(ey) },
    };
  };

  // Make the dark end point opposite the heading: +180°
  const { start, end } = pointsForHeading(((heading ?? 0) + 180) % 360);

  const gradientTransform = {
    transform: [
      {
        translateY: bob.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
    ],
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Trail Compass" />
        <Appbar.Action icon="map" onPress={() => navigation.navigate("Map")} />
        <Appbar.Action
          icon="map-marker"
          onPress={() => navigation.navigate("Pins")}
        />
      </Appbar.Header>

      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.center}>
            <Animated.View style={[styles.gradWrap, gradientTransform]}>
              <LinearGradient
                start={start}
                end={end}
                colors={["#00D2FF", "#3A7BD5", "#1E3C72"]}
                style={styles.gradient}
              />
            </Animated.View>

            <Text variant="displaySmall" style={styles.headingText}>
              {heading != null ? `${Math.round(heading)}°` : "—"}
            </Text>
            <Chip>{toCardinal(heading ?? 0)}</Chip>

            <Text style={styles.coords}>
              {coords
                ? `${fmt(coords.latitude)}, ${fmt(coords.longitude)}`
                : "Locating…"}
            </Text>

            <View style={styles.actionsRow}>
              <Button onPress={dropPin}>Drop Pin</Button>
              <Button onPress={copyCoords}>Copy</Button>
              <IconButton icon="share-variant" onPress={shareCoords} />
            </View>
          </Card.Content>
        </Card>
      </View>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack("")}
        duration={1200}
      >
        {snack}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16 },
  center: { alignItems: "center", gap: 12, paddingVertical: 20 },
  gradWrap: {
    width: 180,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  gradient: { flex: 1 },
  headingText: { fontWeight: "700" },
  coords: { opacity: 0.8, marginTop: 6, letterSpacing: 0.5 },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
  },
});
