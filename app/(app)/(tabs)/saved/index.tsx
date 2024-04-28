import { ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "../../../../components/EditScreenInfo";
import { Text, View } from "../../../../components/Themed";

export default function SavedScreen() {
  return (
    <ScrollView className="bg-[#EEE]">
      <Text className="text-2xl font-light">Saved offers</Text>
    </ScrollView>
  );
}
