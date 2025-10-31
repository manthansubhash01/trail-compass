import React, { useEffect, useState } from "react";
import { View, StyleSheet, Share } from "react-native";
import { Card, List, IconButton, Text, Snackbar } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { loadPins, savePins } from "../storage";
import { fmt } from "../utils/geo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PinsScreen() {
  const [pins, setPins] = useState([]);
  const [snack, setSnack] = useState("");

  useEffect(() => {
    (async () => setPins(await loadPins()))();
  }, []);

  const remove = async (id) => {
    const next = pins.filter((p) => p.id !== id);
    setPins(next);
    await savePins(next);
    setSnack("Pin deleted");
  };
  const copy = async (p) => {
    await Clipboard.setStringAsync(`${fmt(p.lat)}, ${fmt(p.lon)}`);
    setSnack("Copied coordinates");
  };
  const share = async (p) => {
    await Share.share({
      message: `Pin: ${fmt(p.lat)}, ${fmt(p.lon)} • heading ${Math.round(
        p.heading
      )}°`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Saved Pins" />
        <Card.Content>
          {pins.length === 0 ? (
            <Text>No pins yet. Go drop one!</Text>
          ) : (
            <List.Section>
              {pins.map((p) => (
                <List.Item
                  key={p.id}
                  title={`${fmt(p.lat)}, ${fmt(p.lon)}`}
                  description={`${new Date(
                    p.ts
                  ).toLocaleString()} • ${Math.round(p.heading)}°`}
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                  right={() => (
                    <View style={styles.row}>
                      <IconButton icon="content-copy" onPress={() => copy(p)} />
                      <IconButton
                        icon="share-variant"
                        onPress={() => share(p)}
                      />
                      <IconButton icon="delete" onPress={() => remove(p.id)} />
                    </View>
                  )}
                />
              ))}
            </List.Section>
          )}
        </Card.Content>
      </Card>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack("")}
        duration={1200}
      >
        {snack}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16 },
  row: { flexDirection: "row", alignItems: "center" },
});
