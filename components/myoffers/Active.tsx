import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { OfferType } from "../../types/offerType";
import { useAuth } from "../../context/authContext";
import { StatusTypes } from "../../constants/StatusTypes";
import SaleOffer from "../SaleOffer";
import { getUserSaleOffersByUserId } from "../../helperMethods/saleoffer.methods";

export const Active = () => {
  const { user } = useAuth();
  const [activeOffers, setActiveOffers] = useState<OfferType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      if (user) {
        try {
          const activeOffers = await getUserSaleOffersByUserId(user.userId, StatusTypes.ACTIVE);
          setActiveOffers(activeOffers);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching offers:", error);
        }
      }
    };

    fetchOffers();
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#eee]">
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          className=""
          data={activeOffers}
          renderItem={({ item }) => (
            <View className="my-[6px]">
              <SaleOffer saleOffer={item} user={user} />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text>You currently have no active offers</Text>}
        />
      )}
    </SafeAreaView>
  );
};
