import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import EditScreenInfo from "../../../../components/EditScreenInfo";
import { Text, View } from "../../../../components/Themed";
import CustomKeyboardView from "../../../../components/CustomKeyboardView";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HomeScreen() {
  const options = ["For you", "Recent", "Random", "Viewed", "Saved"];

  return (
    <CustomKeyboardView>
      <View className="bg-[#EEE] flex-1 px-4">
        <View className="flex-row space-x-5 px-2 py-1 items-center rounded-xl border-blue-100 border my-4">
          <TextInput
            className="bg-white p-2 rounded-lg w-full flex-1 font-semibold text-neutral-700"
            placeholder="Search on EcoFlipr"
            autoCapitalize="none"
          />
          <View className="px-1">
            <FontAwesome5 name="search" size={20} color="#1DAEFF" />
          </View>
        </View>

        <View className="bg-[#EEE] mb-4">
          <ScrollView className="flex-row space-x-2 bg-[#EEE]" horizontal>
            {options.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                className="items-center justify-center px-[10px] py-[6px] rounded-lg bg-[#AFDBF3]"
              >
                <Text className="text-sm font-medium">{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-1 bg-[#EEE]">
          <Text>Sale offers</Text>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
