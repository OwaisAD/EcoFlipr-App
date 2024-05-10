import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import { useRouter } from "expo-router";

export default function searchFilterModalScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-[#eee] p-10">
      <Text className="text-2xl font-light">Filters</Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      {/* apply button */}
      <View className="flex-row justify-center mt-4 bg-[#eee]">
        <TouchableOpacity
          className="bg-[#1E40AF] py-2 px-4 rounded-lg"
          onPress={() => {
            router.replace("/(app)/(tabs)/search");
          }}
        >
          <Text className="text-white">Apply</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
