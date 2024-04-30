import { RefreshControl, SafeAreaView, ScrollView } from "react-native";

import { Text, View } from "../../../../components/Themed";
import { useCallback, useState } from "react";

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
      <View className="flex-1 p-4 bg-[#eee]">
        <Text className="text-2xl font-light">Search</Text>

        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View>
            <Text>Items</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
