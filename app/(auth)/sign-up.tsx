import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showError = (e: any, fallback = "Something went wrong") => {
    const msg =
      e?.errors?.[0]?.longMessage ||
      e?.errors?.[0]?.message ||
      e?.message ||
      fallback;
    Alert.alert("Error", msg);
  };

  const start = async () => {
    try {
      if (!isLoaded || loading) return;
      const emailAddress = email.trim().toLowerCase();

      // quick client-side validation
      if (!/^\S+@\S+\.\S+$/.test(emailAddress)) {
        Alert.alert("Invalid email", "Please enter a valid email address.");
        return;
      }

      setLoading(true);
      await signUp.create({ emailAddress }); // passwordless
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPhase("code");
    } catch (e: any) {
      // If email is already registered, Clerk returns an error here.
      // You can route to sign-in screen if desired.
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    try {
      if (!isLoaded || loading) return;
      const c = code.trim();

      if (c.length < 6) {
        Alert.alert("Invalid code", "Enter the 6-digit verification code.");
        return;
      }

      setLoading(true);
      const res = await signUp.attemptEmailAddressVerification({ code: c });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.replace("/(auth)/role-select");
      } else {
        // Other statuses are rare here but let's cover them
        Alert.alert("Not complete", `Status: ${res.status}`);
      }
    } catch (e: any) {
      showError(e, "Verification failed. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      if (!isLoaded || loading) return;
      setLoading(true);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Code sent", "We’ve sent a new code to your email.");
    } catch (e: any) {
      showError(e, "Could not resend the code.");
    } finally {
      setLoading(false);
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
            autoComplete="email"
            placeholder="you@example.com"
            onSubmitEditing={start}
            style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
          />
          <Button
            title={loading ? "Sending..." : "Sign Up"}
            onPress={start}
            disabled={loading}
          />
        </>
      ) : (
        <>
          <Text style={{ fontSize: 18 }}>Verification Code</Text>
          <TextInput
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, "").slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="6-digit code"
            onSubmitEditing={verify}
            style={{
              borderWidth: 1,
              padding: 8,
              borderRadius: 8,
              letterSpacing: 4,
            }}
          />
          <View style={{ gap: 8 }}>
            <Button
              title={loading ? "Verifying..." : "Verify"}
              onPress={verify}
              disabled={loading}
            />
            <Button title="Resend Code" onPress={resend} disabled={loading} />
          </View>
        </>
      )}
    </View>
  );
}
