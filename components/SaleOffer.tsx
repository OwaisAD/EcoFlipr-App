import { Image, Text, TouchableOpacity, View } from "react-native";
import { OfferType } from "../types/offerType";
import Moment from "react-moment";
import { formatFirebaseDate } from "../utils/formatDate";
import { formatCurrencyDA } from "../utils/currencyFormat";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

interface SaleOfferProps {
  saleOffer: OfferType;
}

const SaleOffer = ({ saleOffer }: SaleOfferProps) => {
  const router = useRouter();

  console.log("saleOffer", saleOffer);

  return (
    <TouchableOpacity
      className="flex-1 flex-row bg-[#D1D5DB] h-28 rounded-xl border-[0.2px] border-indigo-200"
      onPress={() => router.push(`/offer/${saleOffer.saleOfferId}`)}
    >
      <View className="absolute top-0 right-0 bg-white rounded-bl-2xl rounded-tr-lg flex-row items-center py-1 px-2 gap-1">
        <Text className="text-[10px]">{saleOffer.shipping ? "Shippable" : "No shipping"}</Text>
        <FontAwesome5 name="shipping-fast" size={10} color="black" />
      </View>

      {/* IMAGE */}
      <Image
        source={
          saleOffer.images && saleOffer.images.length > 0
            ? { uri: saleOffer.images[0] }
            : require("../assets/images/No-Image.png")
        }
        className="h-full w-28 object-contain rounded-bl-xl rounded-tl-xl rounded-br-[31px]"
      />
      <View className="flex flex-col justify-between p-2">
        <View className="flex flex-col">
          <Text className="text-lg font-light">{saleOffer.title}</Text>
          <Text className="text-sm font-light">{saleOffer.description}</Text>
        </View>

        <View className="flex flex-row items-center justify-between space-x-12">
          <View>
            <Text className="text-sm font-light">{saleOffer.zipCode}</Text>
            <Moment element={Text} fromNow className="text-sm font-light">
              {formatFirebaseDate(saleOffer.createdAt)}
            </Moment>
            <Text className="text-sm font-light">
              {saleOffer.cityInfo?.zipCode} {saleOffer.cityInfo?.city}
            </Text>
          </View>

          <View>
            <Text className="text-lg font-bold">{formatCurrencyDA(saleOffer.price)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SaleOffer;
