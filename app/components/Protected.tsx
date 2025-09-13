import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Protected({ children }: { children: any }) {
  const router = useRouter();
  useEffect(() => {}, []);
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>{router.replace("/(auth)/sign-in")}</SignedOut>
    </>
  );
}
