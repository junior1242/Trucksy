import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function RoleGate({
  role,
  children,
}: {
  role: "user" | "driver";
  children: any;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const r = (user?.publicMetadata as any)?.role;

    if (r === undefined && user) {
      router.replace("/(auth)/role-select");
    } else if (r && r !== role) {
      router.replace(r === "driver" ? "/(driver)/kyc" : "/(user)");
    }
  }, [isLoaded, user, user?.id, user?.publicMetadata, role, router]);

  return children;
}
