import { useCallback, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";

export const Recent = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
          <Text>Recent</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
