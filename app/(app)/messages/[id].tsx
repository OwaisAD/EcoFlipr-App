import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, View, Text, Image } from "react-native";
import useGetSaleOfferById from "../../../hooks/useGetSaleOfferId";
import { formatCurrencyDA } from "../../../utils/currencyFormat";
import { formatFirebaseDate } from "../../../utils/formatDate";

export default function Messages() {
  const search = useLocalSearchParams();
  const saleOffer = useGetSaleOfferById(search.id as string);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="bg-[#EEE] flex-1 px-4">
        <Text className="text-2xl font-bold mt-4">Messages</Text>
        {saleOffer && (
          <View className="bg-[#D1D5DB] h-16 rounded-lg flex-row space-x-2">
            {/* IMAGE */}
            <Image
              source={
                saleOffer.images && saleOffer.images.length > 0
                  ? { uri: saleOffer.images[0] }
                  : require("../../../assets/images/No-Image.png")
              }
              className="w-16 h-16 rounded-tl-lg rounded-bl-lg rounded-br-[17px]"
            />
            <View className="flex-row justify-between flex-1 px-2 items-center">
              <View className="">
                <Text className="text-base font-medium">{saleOffer.title}</Text>
                <Text className="text-sm font-light">
                  {saleOffer.cityInfo?.zipCode} {saleOffer.cityInfo?.city}
                </Text>
              </View>
              <View>
                <Text className="text-sm font-medium">{formatCurrencyDA(saleOffer.price)}</Text>
                <Text className="text-sm font-light">
                  {saleOffer.createdAt &&
                    new Date(formatFirebaseDate(saleOffer.createdAt)).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        )}
        <Text className="text-lg font-light mt-2">Your messages</Text>
        <View className="flex-1 mt-4">
          <Text className="text-lg font-bold">No messages yet</Text>
          <Text className="text-lg font-light">You have no messages yet</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
