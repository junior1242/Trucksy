import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";
const API_BASE = "http://localhost:4000/api/users"; 

export default function RoleSelect() {

  
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<null | "user" | "driver">(null);

  const setRole = async (role: "user" | "driver") => {
    try {
      setLoading(role);

      const token =
        (await getToken({ template: "trucksy" }).catch(() => undefined)) ||
        (await getToken());
      if (!token) throw new Error("Missing auth token");

      const res = await fetch(`${API_BASE}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role,
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      if (!res.ok)
        throw new Error(
          (await res.json().catch(() => ({})))?.error || `HTTP ${res.status}`
        );

      await user?.reload?.();
      router.replace(role === "user" ? "/(user)" : "/(driver)/kyc");
    } catch (e: any) {
      Alert.alert("Failed to set role", e?.message || "Unknown error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Choose your role</Text>
      <Button
        title={loading === "user" ? "Setting…" : "I am a User (Customer)"}
        onPress={() => setRole("user")}
        disabled={!!loading}
      />
      <Button
        title={loading === "driver" ? "Setting…" : "I am a Driver"}
        onPress={() => setRole("driver")}
        disabled={!!loading}
      />
      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
    </View>
  );
}
