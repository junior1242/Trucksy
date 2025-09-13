import { useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import Protected from "../components/../components/Protected"; // relative from (user)
import RoleGate from "../components/../components/RoleGate";

export default function UserLayout() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  
  useEffect(() => {
    if (!isLoaded) return;

    const role = (user?.publicMetadata as any)?.role;
    console.log("Current user role:", role);

   
    if (role === undefined && user) {
      
      router.replace("/(auth)/role-select");
    } else if (role && role !== "user") {
      
      router.replace("/(driver)");
    }
  }, [isLoaded, user, user?.id, user?.publicMetadata, router]);

  return (
    <Protected>
      <RoleGate role="user">
        <Stack />
      </RoleGate>
    </Protected>
  );
}
