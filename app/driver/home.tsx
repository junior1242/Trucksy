import { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { api } from "../lib/api";
import { useAuth } from "@clerk/clerk-expo";

export default function DriverHome() {
  const [items, setItems] = useState<any[]>([]);
  const { getToken } = useAuth();
  const load = async () =>
    setItems(await api("/api/driver/requests", {}, getToken));
  useEffect(() => {
    load();
  }, []);
  const accept = async (id: string) => {
    await api(`/api/driver/accept/${id}`, { method: "POST" }, getToken);
    await load();
  };
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Open Requests</Text>
      <FlatList
        data={items}
        keyExtractor={(x) => x._id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderWidth: 1, marginBottom: 8 }}>
            <Text>
              {item.pickup?.address} → {item.dropoff?.address}
            </Text>
            <Text>Price: {item.price}</Text>
            <Button title="Accept" onPress={() => accept(item._id)} />
          </View>
        )}
      />
    </View>
  );
}
