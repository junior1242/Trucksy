import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image, Alert } from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailAddress, password);
      
      if (userCredential.user.emailVerified) {
        // User's email is verified, allow sign-in
        router.replace("/");
      } else {
        // User's email is not verified
        await signOut(auth); // Immediately sign the user out
        Alert.alert(
          "Verify Your Email",
          "You must verify your email address before you can sign in. Please check your inbox for the verification link."
        );
        setError("Please verify your email to sign in.");
      }
    } catch (e) {
      // Handle errors like wrong password, user not found, etc.
      setError(e.message);
    }
  }

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
        <Text style={styles.title}>Welcome Back</Text>
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
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter Password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Don&apos;t have an account?
          </Text>
          <Link href={'/sign-up'} asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>
                Sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
