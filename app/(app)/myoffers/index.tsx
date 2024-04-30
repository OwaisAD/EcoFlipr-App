import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useAuth } from "../../../context/authContext";
import { db, saleOfferRef } from "../../../firebaseConfig";
import { DocumentData, getDocs, query, where } from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import { OfferType } from "../../../types/offerType";
import { Active } from "../../../components/myoffers/Active";
import { Inactive } from "../../../components/myoffers/Inactive";
import { Sold } from "../../../components/myoffers/Sold";
import { Archived } from "../../../components/myoffers/Archived";
import Tabs from "../../../components/Tabs";

export default function MyOffersScreen() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<OfferType[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825, // Default to San Francisco
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      if (user) {
        // Query the sale offers collection for the user's offers
        const userOffersQuery = query(saleOfferRef, where("userId", "==", user.userId));

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

  useEffect(() => {
    if (offers.length > 0 && offers[0].cityInfo) {
      setInitialRegion({
        latitude: offers[0].cityInfo.x,
        longitude: offers[0].cityInfo.y,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [offers]);

  const options = ["Active", "Inactive", "Sold", "Archived"];
  const [activeTab, setActiveTab] = useState(options[0]);

  const displayContent = () => {
    switch (activeTab) {
      case "Active":
        return <Active />;
      case "Inactive":
        return <Inactive />;
      case "Sold":
        return <Sold />;
      case "Archived":
        return <Archived />;
      default:
        return <Active />;
    }
  };

  return (
    <ScrollView className="flex-1 gap-2 p-4">
      <Text className="text-2xl font-light">My offers</Text>

      <Tabs tabs={options} activeTab={activeTab} setActiveTab={setActiveTab} />

      <View className="py-4 flex-1 bg-[#EEE]">{displayContent()}</View>

      {/* <Text>{JSON.stringify(offers)}</Text>
      {loading && <Text>Loading...</Text>}

      <MapView style={{ width: "100%", height: 200 }} region={initialRegion} showsScale>
        <Marker coordinate={initialRegion} title="Seller location" description="Description" />
      </MapView> */}
    </ScrollView>
  );
}
