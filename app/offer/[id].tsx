import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SpecificSaleOffer() {
  const search = useLocalSearchParams();

  return (
    <View className="flex-1 items-center">
      <Text>Offer details for {search.id}</Text>
    </View>
  );
}
