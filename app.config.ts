import "dotenv/config";
export default {
  expo: {
    name: "Trucksy",
    slug: "trucksy",
    scheme: "trucksy",
    userInterfaceStyle: "automatic",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      // clerkPk: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      eas: {
        projectId: "bb8af1b4-9ccf-4029-ac91-6297e3ab2c07",
      },
    },
    android: { package: "com.trucksy.app" },
  },
};
