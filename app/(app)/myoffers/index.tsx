import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Active } from "../../../components/myoffers/Active";
import { Inactive } from "../../../components/myoffers/Inactive";
import { Sold } from "../../../components/myoffers/Sold";
import { Archived } from "../../../components/myoffers/Archived";
import Tabs from "../../../components/Tabs";
import { StatusTypes } from "../../../constants/StatusTypes";

export default function MyOffersScreen() {
  const options = [StatusTypes.ACTIVE, StatusTypes.INACTIVE, StatusTypes.SOLD, StatusTypes.ARCHIVED];
  const [activeTab, setActiveTab] = useState(options[0]);

  const displayContent = () => {
    switch (activeTab) {
      case StatusTypes.ACTIVE:
        return <Active setActiveTab={setActiveTab} />;
      case StatusTypes.INACTIVE:
        return <Inactive setActiveTab={setActiveTab} />;
      case StatusTypes.SOLD:
        return <Sold setActiveTab={setActiveTab} />;
      case StatusTypes.ARCHIVED:
        return <Archived setActiveTab={setActiveTab} />;
      default:
        return <Active setActiveTab={setActiveTab} />;
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
