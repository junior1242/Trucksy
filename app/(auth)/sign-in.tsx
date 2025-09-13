// app/(auth)/sign-in.tsx
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import { Alert, Button, Image, Text, TextInput, View } from "react-native";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [phase, setPhase] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

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
      const identifier = email.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(identifier)) {
        Alert.alert("Invalid email", "Please enter a valid email address.");
        return;
      }
      setLoading(true);

      // 1) Initialize the sign-in with the email
      await signIn.create({ identifier });

      // 2) Send the email code
      const emailFactor = (signIn.supportedFirstFactors || []).find(
        (f: any) => f.strategy === "email_code"
      ) as any;
      if (!emailFactor?.emailAddressId) {
        throw new Error("No email address factor available for this account.");
      }
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      setPhase("code");
    } catch (e: any) {
      // If the account doesn't exist, Clerk returns "identifier_not_found"
      // You can route to sign-up to keep the UX smooth.
      const code = e?.errors?.[0]?.code;
      if (code === "identifier_not_found") {
        Alert.alert(
          "No account found",
          "We couldn't find an account for this email. Create one now?"
        );
      }
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

      // 3) Verify the code
      const res = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: c,
      });

      if (res.status === "complete") {
        const sess = await setActive({ session: res.createdSessionId });

        console.log("session", sess);

        router.replace("/(auth)/role-select");
      } else {
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

      const emailFactor = (signIn.supportedFirstFactors || []).find(
        (f: any) => f.strategy === "email_code"
      ) as any;
      if (!emailFactor?.emailAddressId) {
        throw new Error("No email address factor available for this account.");
      }

      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });
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
          <Image
            source={require("../../assets/images/TrucksyLogo.png")}
            style={styles.illustration}
          />
          <Text style={styles.title}>Welcome</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="you@example.com"
            onSubmitEditing={start}
            
          />
          <Button
            title={loading ? "Sending..." : "Continue"}
            onPress={start}
            disabled={loading}
          />
          <Button
            title="Create an account"
            onPress={() => router.push("/(auth)/sign-up")}
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
            <Button
              title="Use a different email"
              onPress={() => setPhase("email")}
            />
          </View>
        </>
      )}
    </View>
  );
}
