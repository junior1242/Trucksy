import { Link } from "expo-router";
import { View, Text } from "react-native";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 24 }}>Trucksy</Text>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
      <Link href="/user/home">Continue as User</Link>
      <Link href="/driver/home">Continue as Driver</Link>
    </View>
  );
}
