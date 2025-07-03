import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
          <View>
            <Text>Login Screen</Text>
            <Text>Please enter your credentials</Text>
          </View>

          <View>
            <TextInput
              style={styles.username}
              placeholder="Username"
              keyboardType="default"
            />

            <TextInput
              style={styles.username}
              placeholder="Password"
              secureTextEntry={true}
            />
          </View>
          <View>
            <Text>Forgot Password?</Text>
            <Text> Dont have an account? Sign Up</Text>
          </View>
      </SafeAreaView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    minWidth: "100%",
    borderColor: "black",
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  username: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    maxHeight:"33%",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 15,
  },
});
