import Login from "@/components/Login";
import React from "react";
import { StyleSheet, View } from "react-native";

const index = () => {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
  },
})