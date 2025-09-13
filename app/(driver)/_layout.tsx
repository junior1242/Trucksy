import { useUser } from "@clerk/clerk-expo";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import Protected from "../components/Protected";
import RoleGate from "../components/RoleGate";

export default function DriverLayout() {
  const { isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!isLoaded) return;
    const isDriverHomePage =
      pathname === "/(driver)" || pathname === "/(driver)/";
    const isKycPage = pathname.includes("/(driver)/kyc");

    if (isDriverHomePage && !isKycPage) {
      router.replace("/(driver)/kyc");
    }
  }, [isLoaded, pathname, router]);

  return (
    <Protected>
      <RoleGate role="driver">
        <Stack />
      </RoleGate>
    </Protected>
  );
}
