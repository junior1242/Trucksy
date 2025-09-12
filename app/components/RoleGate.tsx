import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function RoleGate({
  role,
  children,
}: {
  role: "user" | "driver";
  children: any;
}) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const r = (user?.publicMetadata as any)?.role;
    if (!r) router.replace("/(auth)/role-select");
    else if (r !== role)
      router.replace(r === "driver" ? "/(driver)" : "/(user)");
  }, [user?.id]);

  return children;
}
