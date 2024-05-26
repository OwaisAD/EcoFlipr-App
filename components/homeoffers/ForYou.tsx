import { collection, getDocs, limit, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, Text, View } from "react-native";
import { db } from "../../firebaseConfig";
import SaleOffer from "../SaleOffer";
import Loading from "../Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ForYouProps {
  user: {
    firstName: string;
    lastName: string;
    userId: string;
    phoneNumber: string;
    email?: string | undefined;
    address: any;
    profileUrl?: string | undefined;
    createdAt?: string | undefined;
    savedOffers: string[];
  } | null;
}

export const ForYou = ({ user }: ForYouProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRandomOffers = useCallback(async () => {
    try {
      setLoading(true);
      const offersQuery = query(collection(db, "saleoffers"), limit(100));
      const offersSnapshot = await getDocs(offersQuery);
      const offersData = offersSnapshot.docs.map((doc) => ({
        offerId: doc.id,
        ...doc.data(),
      }));

      const shuffledOffers = offersData.sort(() => 0.5 - Math.random());

      // Save fetched offers to AsyncStorage
      await AsyncStorage.setItem("cachedOffersForYou", JSON.stringify(shuffledOffers));

      setOffers(shuffledOffers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setLoading(false);
      return [];
    }
  }, []);

  const loadCachedOffers = useCallback(async () => {
    try {
      setLoading(true);
      const cachedOffers = await AsyncStorage.getItem("cachedOffersForYou");
      if (cachedOffers) {
        setOffers(JSON.parse(cachedOffers));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading cached offers:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCachedOffers();
    fetchRandomOffers();
  }, [loadCachedOffers, fetchRandomOffers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRandomOffers();
    setRefreshing(false);
  }, [fetchRandomOffers]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View className="items-center justify-center">
          <Loading size={100} />
        </View>
      ) : (
        <FlatList
          data={offers}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          className="flex-1 mb-14"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ margin: 10 }}>
              <SaleOffer user={user} saleOffer={item} key={item.id} />
            </View>
          )}
          keyExtractor={(item) => item.offerId}
        />
      )}
    </SafeAreaView>
  );
};
