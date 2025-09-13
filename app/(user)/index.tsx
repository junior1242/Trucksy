import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function UserHome() {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20 }}>User Dashboard</Text>
      <Link href="/(user)/bookings/create">Create Booking</Link>
      <Link href="/(user)/bookings">My Bookings</Link>
    </View>
  );
}
