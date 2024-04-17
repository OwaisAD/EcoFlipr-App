import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Image, Pressable } from "react-native";

import Colors from "../../constants/Colors";
import { useColorScheme } from "../../components/useColorScheme";
import { useClientOnlyValue } from "../../components/useClientOnlyValue";
import { AntDesign, Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#FFF",
          position: "absolute",
          bottom: 0,
          padding: 10,
          width: "100%",
          zIndex: 0,
        },
        tabBarItemStyle: {
          // backgroundColor: "#00ff00",
          // borderRadius: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "",
          title: "Home",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "bold",
            fontVariant: ["small-caps"],
          },
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          headerLeft: () => (
            <Image
              source={require("../../assets/images/ecoflipr-logo-black.png")}
              style={{ width: 100, height: 20, marginLeft: 15 }}
            />
          ),
          headerRight: () => (
            <Link href="/notificationModalScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          title: "Search",
          headerTitle: "",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "bold",
            fontVariant: ["small-caps"],
          },
          tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color={color} />,
          headerLeft: () => (
            <Image
              source={require("../../assets/images/ecoflipr-logo-black.png")}
              style={{ width: 100, height: 20, marginLeft: 15 }}
            />
          ),
          headerRight: () => (
            <Link href="/notificationModalScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "Create",
          headerTitle: "",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "bold",
            fontVariant: ["small-caps"],
          },
          tabBarIcon: ({ color }) => <AntDesign name="pluscircle" size={24} color={color} />,
          headerLeft: () => (
            <Image
              source={require("../../assets/images/ecoflipr-logo-black.png")}
              style={{ width: 100, height: 20, marginLeft: 15 }}
            />
          ),
          headerRight: () => (
            <Link href="/notificationModalScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="saved/index"
        options={{
          title: "Saved",
          headerTitle: "",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "bold",
            fontVariant: ["small-caps"],
          },
          tabBarIcon: ({ color }) => <Feather name="bookmark" size={24} color={color} />,
          headerLeft: () => (
            <Image
              source={require("../../assets/images/ecoflipr-logo-black.png")}
              style={{ width: 100, height: 20, marginLeft: 15 }}
            />
          ),
          headerRight: () => (
            <Link href="/notificationModalScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          headerTitle: "",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "bold",
            fontVariant: ["small-caps"],
          },
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle-outline" size={24} color={color} />,
          headerLeft: () => (
            <Image
              source={require("../../assets/images/ecoflipr-logo-black.png")}
              style={{ width: 100, height: 20, marginLeft: 15 }}
            />
          ),
          headerRight: () => (
            <Link href="/notificationModalScreen" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
