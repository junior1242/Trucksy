import { Alert ,TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'

const Signup = () => {
    const [name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const navigation = useNavigation();
    const handleSignup = () => {
    if (!name || !Email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
        }
        

  return (
    <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Signup Screen</Text>
          <Text>Please enter your details to sign up</Text>
          
            <TextInput placeholder="Name" style={styles.input}  />
          <TextInput placeholder="Email" style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#999"
              autoComplete="email"
              textContentType="emailAddress"
          />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry />
            <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry />
          

            <TouchableOpacity onPress={handleSignup}> 
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity> 
    </SafeAreaView>
  );
}








export default Signup
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
    input:{},
    buttonText:{},
})