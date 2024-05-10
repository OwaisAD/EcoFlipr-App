import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../context/authContext";
import { OfferType } from "../../types/offerType";
import { getUserSaleOffersByUserId } from "../../helperMethods/saleoffer.methods";
import { StatusTypes } from "../../constants/StatusTypes";
import SaleOffer from "../SaleOffer";
import Loading from "../Loading";

export const Inactive = () => {
  const { user } = useAuth();
  const [inactiveOffers, setInactiveOffers] = useState<OfferType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    if (user) {
      try {
        const activeOffers = await getUserSaleOffersByUserId(user.userId, StatusTypes.INACTIVE);
        setInactiveOffers(
          activeOffers.sort((a, b) => {
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
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#eee]">
      {loading ? (
        <View className="items-center">
          <Loading size={100} />
        </View>
      ) : (
        <FlatList
          className=""
          data={inactiveOffers}
          renderItem={({ item }) => (
            <View className="my-[6px]">
              <SaleOffer saleOffer={item} user={user} refetch={fetchOffers} />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View className="flex-1 items-center">
              <Text className="text-center text-lg font-light">You currently have no inactive offers</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};
