import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import { getSaleOfferById } from "../../../helperMethods/saleoffer.methods";
import MapView, { Marker } from "react-native-maps";
import Moment from "react-moment";
import { formatFirebaseDate } from "../../../utils/formatDate";
import { formatCurrencyDA } from "../../../utils/currencyFormat";

export default function SpecificFO() {
  const search = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [saleOffer, setSaleOffer] = useState({
    saleOfferId: "",
    title: "",
    description: "",
    category: "",
    shipping: false,
    zipCode: "",
    price: 0,
    status: "",
    createdAt: {
      nanoseconds: 0,
      seconds: 0,
    },
    updatedAt: "",
    userId: "",
    id: "",
    images: [],
    cityInfo: {
      x: 0,
      y: 0,
      city: "",
      zipCode: "",
    },
  });
  const [initialRegion, setInitialRegion] = useState({
    latitude: 55.676098,
    longitude: 12.568337,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getSaleOffer = async () => {
    try {
      const saleOfferId = search.id as string;
      console.log(saleOfferId);
      const saleOffer = await getSaleOfferById(saleOfferId);
      setInitialRegion({
        latitude: saleOffer[0].cityInfo?.x || 37.78825,
        longitude: saleOffer[0].cityInfo?.y || -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSaleOffer(saleOffer[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSaleOffer();
  }, []);

  const handleImagePress = () => {
    // Implement logic to show the image in full scale
    console.log("Image clicked");
  };

  const handleSaveOffer = () => {
    // Implement logic to save the offer
    console.log("Offer saved");
  };

  return (
    <View className="flex-1 items-center bg-[#eee]">
      {/* IMAGE SLIDER */}
      {saleOffer.images && saleOffer.images.length > 0 ? (
        <>
          <View className="w-full h-[300px] bg-slate-500">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(contentOffsetX / 500); // Assuming images are full width
                setCurrentIndex(index);
              }}
              style={{ width: "100%", height: "100%" }}
            >
              {saleOffer.images.map((imageUrl, index) => (
                <TouchableOpacity key={index} onPress={handleImagePress}>
                  <Image
                    source={{ uri: imageUrl }}
                    resizeMode="cover"
                    className="w-full h-full object-contain"
                    style={{ width: Dimensions.get("screen").width, height: 300 }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View className="absolute right-2 bottom-2 flex-row space-x-2">
              <View className="bg-black rounded-full px-2 py-1">
                <Text className="text-white text-xs font-light">
                  {currentIndex + 1}/{saleOffer.images.length}
                </Text>
              </View>
              {/* {saleOffer.userId !== user?.userId && ( */}
              <TouchableOpacity className="bg-white rounded-full p-1" onPress={handleSaveOffer}>
                <Feather name="bookmark" size={14} color="gray" />
              </TouchableOpacity>
              {/* )} */}
            </View>
          </View>
        </>
      ) : (
        <></>
      )}

      {/* OFFER DETAILS */}
      <View className="w-full flex-row my-2 justify-between px-2">
        <Text className="text-sm font-light">
          {saleOffer.cityInfo.city}, {saleOffer.cityInfo.zipCode}
        </Text>
        <Moment element={Text} fromNow className="text-sm font-light">
          {formatFirebaseDate(saleOffer.createdAt)}
        </Moment>
      </View>

      <View className="w-full p-2 space-y-1">
        <Text className="text-lg leading-7 font-medium">{saleOffer.title}</Text>
        <Text className="text-2xl leading-8 font-semibold">{formatCurrencyDA(saleOffer.price)}</Text>
        <Text className="text-sm font-light">{saleOffer.description}</Text>
      </View>

      <MapView style={{ width: "100%", height: 200 }} region={initialRegion} showsScale>
        <Marker
          coordinate={initialRegion}
          title="Seller location"
          description={`${saleOffer.cityInfo.city}, ${saleOffer.cityInfo.zipCode}`}
        />
      </MapView>

      {/* SELLER DETAILS */}
      <View></View>

      {/* MESSAGING */}
      <View></View>
    </View>
  );
}
