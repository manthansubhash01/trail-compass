import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CompassScreen from "../screens/CompassScreen";
import PinsScreen from "../screens/PinsScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Compass"
        screenOptions={{
          headerTitleAlign: "center",
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Compass"
          component={CompassScreen}
          options={{ title: "Trail Compass" }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: "Map Screen", headerShown: true }}
        />

        <Stack.Screen
          name="Pins"
          component={PinsScreen}
          options={{ title: "Saved Pins", headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
