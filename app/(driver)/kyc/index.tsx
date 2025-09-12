import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAPI } from "../../lib/api";

const VEHICLE_TYPES = [
  "TRUCK",
  "LOADER_RIKSHAW",
  "PICKUP",
  "MINI_TRUCK",
] as const;
type VehicleType = (typeof VEHICLE_TYPES)[number];

export default function Kyc() {
  const api = useAPI();
  const [cnic, setCnic] = useState("");
  const [licenseNo, setLicense] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("TRUCK");

  const submit = async () => {
    try {
      const r = await api.post("/api/drivers", {
        cnic,
        licenseNo,
        vehicleType,
      });
      Alert.alert("Submitted", r.data.driver.status);
    } catch {
      Alert.alert("Error", "Failed to submit");
    }
  };

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text>CNIC</Text>
      <TextInput
        value={cnic}
        onChangeText={setCnic}
        style={{ borderWidth: 1, padding: 8 }}
      />
      <Text>License #</Text>
      <TextInput
        value={licenseNo}
        onChangeText={setLicense}
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Text style={{ marginTop: 6, fontWeight: "600" }}>Vehicle Type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {VEHICLE_TYPES.map((v) => {
          const selected = v === vehicleType;
          return (
            <TouchableOpacity
              key={v}
              onPress={() => setVehicleType(v)}
              style={{
                backgroundColor: selected ? "#111" : "#f0f0f0",
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: selected ? "white" : "#111" }}>
                {v.replace("_", " ")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Button title="Submit KYC" onPress={submit} />
    </View>
  );
}
