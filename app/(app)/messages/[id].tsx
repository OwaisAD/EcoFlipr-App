import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, View, Text } from "react-native";

export default function Messages() {
  const search = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="bg-[#EEE] flex-1 px-4">
        <Text className="text-2xl font-bold mt-4">Messages</Text>
        <Text>for offer {search.id}</Text>
        <Text className="text-lg font-light mt-2">Your messages</Text>
        <View className="flex-1 mt-4">
          <Text className="text-lg font-bold">No messages yet</Text>
          <Text className="text-lg font-light">You have no messages yet</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
