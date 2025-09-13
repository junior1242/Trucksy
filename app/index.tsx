import { useEffect } from "react";
import { View, Text } from "react-native";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

export default function Index() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = (user?.publicMetadata as any)?.role;
    if (role === "user") router.replace("/(user)");
    else if (role === "driver") router.replace("/(driver)");
  }, [user?.id]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <SignedIn>
        <Text style={{ fontSize: 18 }}>Welcome to Trucksy</Text>
        <Link href="/(auth)/sign-in">Sign In</Link>
        <Link href="/(auth)/sign-up">Sign Up</Link>
      </SignedIn>
      <SignedOut>
        <Text>Loading…</Text>
      </SignedOut>
    </View>
  );
}
