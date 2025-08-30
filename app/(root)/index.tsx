import { Text, View, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserRole(docSnap.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };
      fetchUserRole();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // The AuthProvider will automatically redirect to the sign-in screen.
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
      {userRole ? (
        <Text style={styles.roleText}>
          You are logged in as a {userRole}.
        </Text>
      ) : (
        <Text style={styles.roleText}>Loading your role...</Text>
      )}
      <Pressable onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  roleText: {
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FF3B30", // A red color for sign out
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
