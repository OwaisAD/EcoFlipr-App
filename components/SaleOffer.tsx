import { Image, Text, TouchableOpacity, View } from "react-native";
import { OfferType } from "../types/offerType";
import Moment from "react-moment";
import { formatFirebaseDate } from "../utils/formatDate";
import { formatCurrencyDA } from "../utils/currencyFormat";
import { useRouter } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';

interface SaleOfferProps {
  saleOffer: OfferType;
}

const SaleOffer = ({ saleOffer }: SaleOfferProps) => {
  const router = useRouter();

  console.log("saleOffer", saleOffer);

  return (
    <TouchableOpacity
      className="w-full flex-row bg-[#D1D5DB] h-28 rounded-xl shadow-sm"
      onPress={() => router.push(`/offer/${saleOffer.saleOfferId}`)}
    >
      <View className="absolute top-0 right-0 bg-white h-6 rounded-bl-lg rounded-tr-lg flex-row items-center">
        <Text>{saleOffer.shipping ? "Shippable" : "No shipping"}</Text>
        <FontAwesome5 name="shipping-fast" size={16} color="black" />
      </View>

      {/* IMAGE */}
      <View className="h-28 w-28">
        <Image
          source={require("../assets/images/No-Image.png")}
          className="w-28 h-28 object-contain rounded-br-[31px]"
        />
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
