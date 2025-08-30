import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpScreen() {
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user"); // "user" or "driver"

  const onSignUpPress = async () => {
    setError("");
    if (!emailAddress || !password) {
      setError("Please enter an email and password.");
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailAddress,
        password
      );
      const user = userCredential.user;

      // 2. Send Firebase email verification
      await sendEmailVerification(user);

      // 3. Save user role and email to Firestore database
      await setDoc(doc(db, "users", user.uid), {
        role: role,
        email: emailAddress,
      });

      // 4. Inform user and redirect
      Alert.alert(
        "Verification Email Sent",
        "Please check your inbox and click the verification link to activate your account before signing in."
      );
      router.push("/sign-in");
    } catch (e) {
      setError(e.message);
      console.error(e);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/TrucksyLogo.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Create Account</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(email) => setEmailAddress(email)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter Password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setRole("user")}
          >
            <Ionicons
              name={role === "user" ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.radioText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setRole("driver")}
          >
            <Ionicons
              name={role === "driver" ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.radioText}>Driver</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}