// components/CustomDrawerContent.tsx
import { useUser } from "@clerk/clerk-expo";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user } = useUser();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.username}>Hello</Text>
        <Text style={styles.email}>
          {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});
