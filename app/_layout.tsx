import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "../components/useColorScheme";
import { AuthContext, AuthContextProvider, useAuth } from "../context/authContext";
import { Text, View } from "react-native";

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
      <Stack.Screen name="signin/index" options={{ headerShown: false }} />
      <Stack.Screen name="signup/index" options={{ headerShown: false }} />
      <Stack.Screen name="forgotPassword/index" options={{ presentation: "modal", headerShown: false }} />
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
    </AuthContextProvider>
  );
}

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//     ...FontAwesome.font,
//   });

//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return <RootLayoutNav />;
// }

// function RootLayoutNav() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="notificationModalScreen" options={{ presentation: "modal", title: "Notifications" }} />
//       </Stack>
//     </ThemeProvider>
//   );
// }
