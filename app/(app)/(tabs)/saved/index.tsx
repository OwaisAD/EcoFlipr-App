import { RefreshControl, ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "../../../../components/EditScreenInfo";
import { Text, View } from "../../../../components/Themed";
import { useCallback, useState } from "react";

export default function SavedScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  return (
    <View className="flex-1 gap-4 p-4 bg-[#EEE]">
      <Text className="text-2xl font-light">Saved offers</Text>
      <ScrollView className="bg-[#EEE]" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="items-center justify-center bg-[#EEE] py-2">
          <Text>No saved sale offers.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
