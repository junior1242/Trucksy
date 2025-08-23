import { View, Text, TextInput, Button } from "react-native";
import { api } from "../lib/api";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function UserHome() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [price, setPrice] = useState("1000");
  const { getToken } = useAuth();

  const create = async () => {
    const res = await api(
      "/api/user/bookings",
      {
        method: "POST",
        body: {
          pickup: { address: pickup },
          dropoff: { address: dropoff },
          price: Number(price),
        },
      },
      getToken
    );
    alert("Created #" + res._id);
  };
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20 }}>Book a Truck</Text>
      <TextInput placeholder="Pickup" value={pickup} onChangeText={setPickup} />
      <TextInput
        placeholder="Dropoff"
        value={dropoff}
        onChangeText={setDropoff}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Create Booking" onPress={create} />
    </View>
  );
}
