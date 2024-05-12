import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function EditOffer() {
  const search = useLocalSearchParams();

  return (
    <View>
      <Text>EditOffer</Text>
      <Text>{search.id}</Text>
    </View>
  );
}
