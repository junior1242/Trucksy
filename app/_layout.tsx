// import SafeScreen from '@/components/SafeScreen'
// import { ClerkProvider } from '@clerk/clerk-expo'
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
// import { Slot } from 'expo-router'

// export default function RootLayout() {
//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//         <SafeScreen>
//         <Slot />
//     </SafeScreen>
//       </ClerkProvider>
//   );
// }
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Stack } from "expo-router";

const tokenCache = {
  getToken: (k: string) => SecureStore.getItemAsync(k),
  saveToken: (k: string, v: string) => SecureStore.setItemAsync(k, v),
  clearToken: (k: string) => SecureStore.deleteItemAsync(k),
};

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}