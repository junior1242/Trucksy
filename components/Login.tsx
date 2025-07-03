import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const Login = () => {
  return (
    <>
      <View style={styles.View}>
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
            style={{ ...styles.username, marginBottom: 0 }}
            placeholder="Password"
            secureTextEntry={true}
          />
        </View>
  </View>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  username: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: 200,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  View: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});
