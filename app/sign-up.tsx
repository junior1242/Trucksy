import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { router } from "expo-router";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "driver">("user");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"collect" | "verify">("collect");
  const [err, setErr] = useState("");
  if (!isLoaded) return null;

  const start = async () => {
    try {
      setErr("");
      await signUp.create({ emailAddress: email, password });
      await signUp.update({ publicMetadata: { role } });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (e: any) {
      setErr(e.errors?.[0]?.message || e.message);
    }
  };
  const verify = async () => {
    try {
      const done = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: done.createdSessionId });
      router.replace(role === "user" ? "/user/home" : "/driver/home");
    } catch (e: any) {
      setErr(e.errors?.[0]?.message || e.message);
    }
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      {step === "collect" ? (
        <>
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
          <Button
            title={`Role: ${role}`}
            onPress={() => setRole(role === "user" ? "driver" : "user")}
          />
          <Button title="Sign Up" onPress={start} />
        </>
      ) : (
        <>
          <Text>Enter code sent to {email}</Text>
          <TextInput
            placeholder="123456"
            keyboardType="number-pad"
            onChangeText={setCode}
            value={code}
          />
          <Button title="Verify" onPress={verify} />
        </>
      )}
      {!!err && <Text style={{ color: "red" }}>{err}</Text>}
    </View>
  );
}
