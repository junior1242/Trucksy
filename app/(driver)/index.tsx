import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function DriverHome() {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20 }}>Driver Dashboard</Text>
      <Link href="/(driver)/pool">Booking Pool</Link>
      <Link href="/(driver)/kyc">KYC</Link>
    </View>
  );
}
