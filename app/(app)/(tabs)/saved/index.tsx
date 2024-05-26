import { FlatList, RefreshControl } from "react-native";
import { Text, View } from "../../../../components/Themed";
import { useCallback, useEffect, useState } from "react";
import { getSavedOffers } from "../../../../helperMethods/saleoffer.methods";
import { useAuth } from "../../../../context/authContext";
import { OfferType } from "../../../../types/offerType";
import Loading from "../../../../components/Loading";
import SaleOffer from "../../../../components/SaleOffer";
import { Feather } from "@expo/vector-icons";

export default function SavedScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [savedOffers, setSavedOffers] = useState<OfferType[]>([]);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSavedOffers();
    setRefreshing(false);
  }, []);

  const fetchSavedOffers = async () => {
    try {
      setLoading(true);
      const savedOffers = await getSavedOffers(user?.savedOffers || []);
      setSavedOffers(savedOffers);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error("Error fetching saved offers:", error);
    }
  };

  useEffect(() => {
    fetchSavedOffers();
  }, []);

  return (
    <View className="flex-1 gap-4 p-4 bg-[#EEE]">
      <Text className="text-2xl font-light">Saved offers</Text>
      {loading ? (
        <View className="items-center bg-[#EEE]">
          <Loading size={100} />
        </View>
      ) : (
        <FlatList
          data={savedOffers}
          renderItem={({ item }) => (
            <View className="my-[6px] bg-[#EEE] flex-1">
              <SaleOffer saleOffer={item} user={user} refetch={fetchSavedOffers} />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View className="flex-1 bg-[#eee] justify-center items-center mt-10">
              <Text className="text-center text-base font-light">No saved offers</Text>
              <Text className="font-light text-sm">
                Save offers by clicking the <Feather name="bookmark" size={14} color={"gray"} /> icon
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
