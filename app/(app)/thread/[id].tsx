import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Thread() {
  const search = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 p-4">
      <Text>Thread</Text>
      <Text>saleoffer id: {search.id}</Text>
      <Text>sellerId: {search.sellerId}</Text>
      <Text>senderId: {search.senderId}</Text>
    </ScrollView>
  );
}
