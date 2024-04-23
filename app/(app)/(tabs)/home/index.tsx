import { StyleSheet } from "react-native";

import EditScreenInfo from "../../../../components/EditScreenInfo";
import { Text, View } from "../../../../components/Themed";

export default function HomeScreen() {
  return (
    <View className="bg-red-400 h-full">
      <Text className="text-xl font-medium">Home</Text>
      <View className="my-32 h-1 w-[80%]" lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
