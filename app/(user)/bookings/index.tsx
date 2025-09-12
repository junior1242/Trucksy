import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useAPI } from "../../lib/api";

export default function MyBookings() {
  const api = useAPI();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/api/bookings");
        setItems(r.data.bookings || []);
      } catch {}
    })();
  }, []);
  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, marginBottom: 8 }}>
            <Text>
              {item.pickup?.address} ➝ {item.dropoff?.address}
            </Text>
            <Text>Load: {item.loadType || "General Goods"}</Text>
            <Text>Vehicle: {item.requiredVehicleType}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
