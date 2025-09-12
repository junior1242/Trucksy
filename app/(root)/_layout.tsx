import { useAuth } from "../../context/AuthContext";
import { Redirect, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function RootLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can add a loading spinner here
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    // If the user is not authenticated, redirect to the sign-in screen
    return <Redirect href="/sign-in" />;
  }

  // If the user is authenticated, render the main app screen
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
