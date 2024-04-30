import { Image, Text, TouchableOpacity, View } from "react-native";
import { OfferType } from "../types/offerType";
import Moment from "react-moment";
import { formatFirebaseDate } from "../utils/formatDate";
import { formatCurrencyDA } from "../utils/currencyFormat";
import { useRouter } from "expo-router";

interface SaleOfferProps {
  saleOffer: OfferType;
}

const SaleOffer = ({ saleOffer }: SaleOfferProps) => {
  const router = useRouter();

  console.log("saleOffer", saleOffer);

  return (
    <TouchableOpacity
      className="w-full flex-row bg-[#D1D5DB] h-28 rounded-xl shadow-lg"
      onPress={() => router.push(`/offer/${saleOffer.saleOfferId}`)}
    >
      {/* IMAGE */}
      <View className="h-28 w-28">
        <Image source={require("../assets/images/No-Image.png")} className="w-28 h-28 object-contain rounded-xl" />
      </View>
      {/* ... */}
      <View className="flex flex-col justify-between">
        <View className="flex flex-row items-center truncate">
          <Text className="text-lg font-bold">{saleOffer.title}</Text>
          <Text className="text-sm">{saleOffer.description}</Text>
        </View>
        <View className="flex flex-col">
          <Text className="text-lg font-bold">{formatCurrencyDA(saleOffer.price)}</Text>
          <Text className="text-sm">{saleOffer.zipCode}</Text>
          <Moment element={Text} fromNow>
            {formatFirebaseDate(saleOffer.createdAt)}
          </Moment>
          <Text>
            {saleOffer.cityInfo?.zipCode} {saleOffer.cityInfo?.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SaleOffer;
