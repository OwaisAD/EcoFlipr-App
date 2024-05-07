import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { AuthContext, AuthContextProvider, useAuth } from "../context/authContext";
import FlashMessage from "react-native-flash-message";
import { View } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/app/index.tsx",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // check if the user is authenticated
    if (typeof isAuthenticated === "undefined") return;

    const inApp = segments[0] === "(app)";
    console.log(inApp, isAuthenticated, segments[0]);

    if (isAuthenticated && !inApp) {
      // redirect to home
      router.replace("/(app)/(tabs)/home");
    } else if (isAuthenticated === false) {
      // redirect to signIn
      router.replace("/signin/");
    } else {
    }
  }, [isAuthenticated]);
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signin/index" options={{ headerShown: false }} />
      <Stack.Screen name="signup/index" options={{ headerShown: false }} />
      <Stack.Screen name="forgotPassword/index" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="addressSearch/index" options={{ headerShown: false }} />
      <Stack.Screen name="(app)/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(app)/editprofile/index"
        options={{
          headerShown: true,
          headerBackTitle: "Profile",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#EEE",
          },
        }}
      />
      <Stack.Screen
        name="(app)/settings/index"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#EEE",
          },
        }}
      />
      <Stack.Screen name="notificationModalScreen" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen
        name="(app)/offersinteractedwith/index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: "#EEE",
          },
        }}
      />
      <Stack.Screen
        name="(app)/myoffers/index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: "#EEE",
          },
        }}
      />
      {/* why does the above not work? */}
    </Stack>
  );
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContextProvider>
      <MainLayout />
      <FlashMessage position="bottom" style={{ backgroundColor: "#333" }} />
    </AuthContextProvider>
  );
}
