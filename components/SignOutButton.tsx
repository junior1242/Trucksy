import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { useClerk } from "@clerk/clerk-expo";
// import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Alert, Text } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              Alert.alert(
                "Logout",
                "You have been logged out successfully.",
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert(
                "Logout Error",
                "Failed to logout. Please try again.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Text style={{ color: COLORS.text }}>Logout</Text>
    </TouchableOpacity>
  );
};
