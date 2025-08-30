import { useAuth } from "../../context/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
