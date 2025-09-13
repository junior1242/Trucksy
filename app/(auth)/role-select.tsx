import { View, Text, Button } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function RoleSelect() {
  const { user } = useUser();
  const router = useRouter();

  const setRole = async (role: "user" | "driver") => {
    await user?.update({
      publicMetadata: { ...(user.publicMetadata || {}), role },
    });
    router.replace(role === "user" ? "/(user)" : "/(driver)");
  };

  return (
    <View style={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Choose your role</Text>
      <Button title="I am a User (Customer)" onPress={() => setRole("user")} />
      <Button title="I am a Driver" onPress={() => setRole("driver")} />
    </View>
  );
}
