import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Protected({ children }: { children: any }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Only navigate if we know the user is not signed in
    if (isSignedIn === false) {
      router.replace("/(auth)/sign-in");
    }
  }, [isSignedIn, router]);

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        {/* Don't navigate directly in render */}
        <RedirectFallback />
      </SignedOut>
    </>
  );
}

// A simple fallback component to show while redirecting
function RedirectFallback() {
  return null; // Or return a loading indicator if needed
}
