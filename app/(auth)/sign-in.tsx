import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"email" | "code">("email");
  const router = useRouter();

  const onSend = async () => {
    try {
      if (!isLoaded) return;
      await signIn.create({ identifier: email });
      await signIn.prepareFirstFactor({ strategy: "email_code" });
      setPhase("code");
    } catch (e: any) {
      Alert.alert("Error", e?.errors?.[0]?.message || "Failed");
    }
  };

  const onVerify = async () => {
    try {
      const a = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });
      if (a.status === "complete") {
        await setActive({ session: a.createdSessionId });
        router.replace("/(auth)/role-select");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.errors?.[0]?.message || "Failed");
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      {phase === "email" ? (
        <>
          <Text style={{ fontSize: 18 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ borderWidth: 1, padding: 8 }}
          />
          <Button title="Send Code" onPress={onSend} />
        </>
      ) : (
        <>
          <Text style={{ fontSize: 18 }}>Verification Code</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{ borderWidth: 1, padding: 8 }}
          />
          <Button title="Verify" onPress={onVerify} />
        </>
      )}
    </View>
  );
}
