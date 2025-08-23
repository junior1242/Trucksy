import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { router } from "expo-router";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  if (!isLoaded) return null;

  const go = async () => {
    try {
      const res = await signIn.create({ identifier: email, password });
      await setActive({ session: res.createdSessionId });
      router.replace("/user/home");
    } catch (e: any) {
      setErr(e.errors?.[0]?.message || e.message);
    }
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Sign In" onPress={go} />
      {!!err && <Text style={{ color: "red" }}>{err}</Text>}
    </View>
  );
}
