import { SignOutButton } from "@/components/SignOutButton";
import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawerContent from "../../components/CustomDriverContent";

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />; // ✅ fix path
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="index" options={{ drawerLabel: "Home" }} />
        <Drawer.Screen name="Setting" options={{ drawerLabel: "Setting" }} />
      </Drawer>
      {/* ⚡ Move SignOutButton into CustomDrawerContent if you want it in drawer */}
      <SignOutButton />
    </GestureHandlerRootView>
  );
}
