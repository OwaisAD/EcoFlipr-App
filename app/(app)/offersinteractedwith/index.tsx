import { useCallback, useEffect, useState } from "react";
import { View, Text, SafeAreaView, FlatList, RefreshControl } from "react-native";
import Loading from "../../../components/Loading";
import SaleOffer from "../../../components/SaleOffer";
import { useAuth } from "../../../context/authContext";
import { getSaleOffersInteractedWith } from "../../../helperMethods/saleoffer.methods";

export default function OffersInteractedWithScreen() {
  const { user } = useAuth();
  const [offersInteractedWith, setOffersInteractedWith] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOffers();
    setRefreshing(false);
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    if (user) {
      try {
        const offers = await getSaleOffersInteractedWith(user.userId);
        setOffersInteractedWith(
          offers.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.seconds - a.createdAt.seconds;
            }
            return 0;
          })
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching offers:", error);
      }
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="space-y-2 p-4 bg-[#EEE]">
        <Text className="text-2xl font-light">SaleOffers interacted with</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center bg-[#eee]">
          <Loading size={100} />
        </View>
      ) : (
        <FlatList
          className="bg-[#eee] px-4 py-2 flex-1"
          data={offersInteractedWith}
          renderItem={({ item }) => <SaleOffer saleOffer={item} user={user} />}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-lg text-gray-500">No offers interacted with</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
