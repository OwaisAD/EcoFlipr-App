import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import EditScreenInfo from "../../../../components/EditScreenInfo";
import { Text, View } from "../../../../components/Themed";
import CustomKeyboardView from "../../../../components/CustomKeyboardView";

export default function HomeScreen() {
  const options = ["For you", "Recent", "Random", "Viewed", "Saved"];

  return (
    <CustomKeyboardView>
      <View className="bg-[#EEE] h-full">
        <TextInput className="bg-white p-2 rounded-lg w-full" placeholder="Search on EcoFlipr" autoCapitalize="none" />
        <View className="h-10">
          <ScrollView className="flex-row space-x-2 bg-[#EEE]" horizontal>
            {options.map((option, idx) => (
              <TouchableOpacity className="items-center justify-center p-2 rounded-lg bg-[#AFDBF3]">
                <Text key={idx} className="text-sm font-medium">
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text>Hu</Text>
      </View>
    </CustomKeyboardView>
  );
}
