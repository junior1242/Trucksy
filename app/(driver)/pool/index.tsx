import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { useAPI } from "../../lib/api";
import { useSocket } from "../../lib/socket";

export default function Pool() {
  const api = useAPI();
  const socket = useSocket("driver");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/api/bookings");
        setItems(r.data.bookings || []);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    socket.on("booking:new", (b: any) => setItems((prev) => [b, ...prev]));
    return () => {
      socket.off("booking:new");
    };
  }, [socket]);

  const accept = async (id: string) => {
    try {
      await api.post(`/api/bookings/${id}/accept`);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch {
      Alert.alert("Error", "Failed to accept");
    }
  };

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
            <Text style={{ marginTop: 4 }}>
              Load Type:{" "}
              <Text style={{ fontWeight: "600" }}>
                {item.loadType || "General Goods"}
              </Text>
            </Text>
            <Text>Required Vehicle: {item.requiredVehicleType}</Text>
            <Button title="Accept" onPress={() => accept(item._id)} />
          </View>
        )}
      />
    </View>
  );
}
