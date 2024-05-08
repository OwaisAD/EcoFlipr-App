import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../../context/authContext";
import { db, saleOfferRef } from "../../../firebaseConfig";
import { DocumentData, getDocs, query, where } from "firebase/firestore";
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
    <SafeAreaView className="flex-1">
      <View className="flex-1 space-y-2 p-4 bg-[#EEE]">
        <Text className="text-2xl font-light">My offers</Text>

        <View>
          <Tabs tabs={options} activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>

        <View className="py-4 flex-1 bg-[#EEE]">{displayContent()}</View>


      </View>
    </SafeAreaView>
  );
}
