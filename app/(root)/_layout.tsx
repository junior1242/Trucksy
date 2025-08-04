// app/_layout.tsx or wherever your layout file is
import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "../../components/CustomDriverContent";
import { SignOutButton } from "@/components/SignOutButton";

export default function Layout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="index" options={{ drawerLabel: "Home" }} />
        <Drawer.Screen name="Setting" options={{ drawerLabel: "Setting" }} />
      </Drawer>
      <SignOutButton />
    </GestureHandlerRootView>
  );
}
