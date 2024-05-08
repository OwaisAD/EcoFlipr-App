import { Image, Text, TouchableOpacity, View } from "react-native";
import { OfferType } from "../types/offerType";
import Moment from "react-moment";
import { formatFirebaseDate } from "../utils/formatDate";
import { formatCurrencyDA } from "../utils/currencyFormat";
import { useRouter } from "expo-router";
import { FontAwesome5, Feather } from "@expo/vector-icons";

interface SaleOfferProps {
  saleOffer: OfferType;
  user: any;
  isGrid?: boolean;
}

const SaleOffer = ({ saleOffer, user, isGrid = false }: SaleOfferProps) => {
  const router = useRouter();

  console.log("saleOffer", saleOffer);

  const handleSaveOffer = async () => {};

  return (
    <TouchableOpacity
      className={`flex-1 ${
        isGrid ? "flex-col h-[180px] w-[180px]" : "flex-row h-28"
      } bg-[#D1D5DB]  rounded-xl border-[0.2px] border-indigo-200 shadow-sm`}
      onPress={() => router.push(`/offer/${saleOffer.saleOfferId}`)}
    >
      <View className="absolute shadow-sm right-0 bg-white rounded-bl-2xl rounded-tr-lg flex-row items-center py-1 px-2 gap-1 z-10">
        {saleOffer.shipping ? (
          <>
            {!isGrid && <Text className="text-[10px]">{saleOffer.shipping ? "Shippable" : "No shipping"}</Text>}
            <FontAwesome5 name="shipping-fast" size={10} color="black" />
          </>
        ) : (
          <>
            <Text className="text-[10px]">{saleOffer.shipping ? "Shippable" : "Not shipping"}</Text>
          </>
        )}
      </View>

      {/* IMAGE */}
      <Image
        source={
          saleOffer.images && saleOffer.images.length > 0
            ? { uri: saleOffer.images[0] }
            : require("../assets/images/No-Image.png")
        }
        className={`h-full ${
          isGrid ? "h-28 w-full" : "h-full w-28 rounded-bl-xl rounded-br-[31px] rounded-tl-xl"
        }  object-contain`}
      />
      <View className="flex flex-col justify-between p-2">
        <View className="flex flex-col">
          <Text className={`${isGrid ? "text-sm" : "text-lg"} font-light`}>{saleOffer.title}</Text>
          {!isGrid && <Text className={`${isGrid ? "text-xs" : "text-sm"} font-light`}>{saleOffer.description.slice(0,30)}...</Text>}
        </View>

        <View className="flex flex-row items-center justify-between space-x-12">
          <View>
            <Text className="text-sm font-light">{saleOffer.zipCode}</Text>
            <Moment element={Text} fromNow className={`${isGrid ? "text-xs" : "text-sm"} font-light`}>
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
      {/* Save button - only show on offers made by others */}
      {saleOffer.userId !== user?.userId && (
        <TouchableOpacity className="absolute right-1 bottom-1 bg-white rounded-full p-1" onPress={handleSaveOffer}>
          <Feather name="bookmark" size={14} color="gray" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default SaleOffer;
