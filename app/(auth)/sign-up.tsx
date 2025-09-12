import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"email" | "code">("email");
  const router = useRouter();

  const start = async () => {
    try {
      if (!isLoaded) return;
      await signUp.create({ emailAddress: email });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPhase("code");
    } catch (e: any) {
      Alert.alert("Error", e?.errors?.[0]?.message || "Failed");
    }
  };

  const verify = async () => {
    try {
      const a = await signUp.attemptEmailAddressVerification({ code });
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
          <Button title="Sign Up" onPress={start} />
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
          <Button title="Verify" onPress={verify} />
        </>
      )}
    </View>
  );
}
