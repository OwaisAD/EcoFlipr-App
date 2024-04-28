import { StyleSheet } from "react-native";

import EditScreenInfo from "../../../../components/EditScreenInfo";
import { Text, View } from "../../../../components/Themed";

export default function CreateScreen() {
  return (
    <View className="bg-[#EEE]">
      <Text className="text-2xl font-light">Create offer</Text>
      <Text>Title</Text>
      <Text>Add offer description</Text>
      {/* Have a list of categories */}
      <Text>Select category</Text>
      <Text>Do you offer shipping?</Text>
      {/* Have a json file of all danish zip codes */}
      <Text>Enter zip code</Text>
      <Text>Enter a price</Text>
      <Text>Image upload</Text>
      <Text>Share offer button</Text>
    </View>
  );
}
