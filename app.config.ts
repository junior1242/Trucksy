import "dotenv/config";
export default {
  expo: {
    name: "Trucksy",
    slug: "trucksy",
    scheme: "trucksy",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      clerkPk: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    android: { package: "com.trucksy.app" },
  },
};
