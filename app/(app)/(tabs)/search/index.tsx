import { ScrollView } from "react-native";

import { Text, View } from "../../../../components/Themed";

export default function SearchScreen() {
  return (
    <ScrollView className="bg-[#EEE] gap-4 p-4">
      <Text className="text-2xl font-light">Search</Text>
    </ScrollView>
  );
}
