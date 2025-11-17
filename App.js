import "react-native-gesture-handler";
import * as React from "react";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import RootNavigator from "./src/navigation/RootNavigation";
import { registerForPushNotificationsAsync } from "./src/utils/notification";

export default function App() {
  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();

      // In real app: send this token to your backend
      // For demo: just console.log, or show via Toast/Alert
    })();
  }, []);

  return (
    <PaperProvider>
      <RootNavigator />
    </PaperProvider>
  );
}
