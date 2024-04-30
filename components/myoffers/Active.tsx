import { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { OfferType } from "../../types/offerType";
import { useAuth } from "../../context/authContext";
import { DocumentData, getDocs, query, where } from "firebase/firestore";
import { saleOfferRef } from "../../firebaseConfig";
import { StatusTypes } from "../../constants/StatusTypes";

export const Active = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<OfferType[]>([]);
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
        // Query the sale offers collection for the user's offers
        const userOffersQuery = query(
          saleOfferRef,
          where("userId", "==", user.userId),
          where("status", "==", StatusTypes.ACTIVE)
        );

        try {
          // Execute the query
          const offersSnapshot = await getDocs(userOffersQuery);
          // Extract the data from the documents
          const offersData: OfferType[] = offersSnapshot.docs.map((doc) => {
            const data = doc.data() as DocumentData; // Assuming DocumentData is the type of your Firestore documents
            return {
              title: data.title,
              description: data.description,
              category: data.category,
              shipping: data.shipping,
              zipCode: data.zipCode,
              price: data.price,
              status: data.status,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              userId: data.userId,
              id: data.id,
              cityInfo: data.cityInfo
                ? {
                    x: data.cityInfo.x,
                    y: data.cityInfo.y,
                    city: data.cityInfo.city,
                    zipCode: data.cityInfo.zipCode,
                  }
                : undefined,
            };
          });
          setOffers(offersData);
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
          <Text>Active</Text>
        </View>

        {loading && <Text>Loading...</Text>}

        <Text>{JSON.stringify(offers)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
