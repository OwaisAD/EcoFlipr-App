import { RefreshControl, SafeAreaView, ScrollView, TextInput } from "react-native";

import { Text, View } from "../../../../components/Themed";
import { useCallback, useState } from "react";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function SearchScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

        {/* FILTER SECTION */}
        <View className="flex-row items-center justify-between bg-[#eee]">
          <View className="bg-[#eee]">
            <Text className="text-sm">Found 7 results</Text>
          </View>

          <View className="flex-row items-center bg-[#eee] gap-2">
            <View className="bg-[#eee]">
              <Entypo name="grid" size={30} color="black" />
            </View>
            <View className="bg-[#eee]">
              <FontAwesome5 name="list-ul" size={24} color="black" />
            </View>
            <View className="bg-[#eee]">
              <Ionicons name="filter-circle" size={30} color="black" />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
