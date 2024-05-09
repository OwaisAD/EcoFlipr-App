import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import { getSaleOfferById } from "../../../helperMethods/saleoffer.methods";
import MapView, { Marker } from "react-native-maps";
import Moment from "react-moment";
import { formatFirebaseDate } from "../../../utils/formatDate";
import { formatCurrencyDA } from "../../../utils/currencyFormat";
import { useAuth } from "../../../context/authContext";
import { getUserById } from "../../../helperMethods/user.methods";
import moment from "moment";

export default function ViewSaleOffer() {
  const { user } = useAuth();
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
  const [seller, setSeller] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: {
      tekst: "",
      addresse: {
        postnr: "",
        postnrnavn: "",
        x: "",
        y: "",
      },
    },
    createdAt: "",
    updatedAt: "",
    profileUrl: "",
  });

  const [initialRegion, setInitialRegion] = useState({
    latitude: 55.676098,
    longitude: 12.568337,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getSaleOfferAndSellerInfo = async () => {
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

      const sellerId = saleOffer[0].userId;
      const seller = await getUserById(sellerId);
      setSeller(seller[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSaleOfferAndSellerInfo();
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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, alignItems: "center", backgroundColor: "#eee", paddingBottom: 100 }}
    >
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
              {saleOffer.userId !== user?.userId && (
                <TouchableOpacity className="bg-white rounded-full p-1" onPress={handleSaveOffer}>
                  <Feather name="bookmark" size={14} color="gray" />
                </TouchableOpacity>
              )}
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
        <Text className="text-sm font-light">{saleOffer.shipping ? "Shipping" : "Not shipping"}</Text>
      </View>

      {/* SELLER DETAILS */}
      <TouchableOpacity
        className="w-full h-28 bg-[#D9D9D9] my-2 rounded-lg flex-row items-center p-4 space-x-4"
        style={{ width: Dimensions.get("window").width - 24 }}
      >
        {/* PROFILE PIC */}
        <View className="w-20 h-20 rounded-full bg-[#D9D9D9]">
          <Image
            source={{ uri: seller.profileUrl || "https://via.placeholder.com/150" }}
            className="w-full h-full rounded-full"
            style={{ width: 80, height: 80 }}
          />
        </View>
        {/* SELLER INFO */}
        <View className="flex-col">
          {/* SELLER NAME */}
          <Text className="text-lg font-medium">
            {seller.firstName} {seller.lastName}
          </Text>
          {/* SELLER SINCE */}
          <Text className="text-sm font-light">
            Member for {moment(seller.createdAt).fromNow(true)} since{" "}
            {new Date(seller.createdAt)
              .toLocaleDateString("da-DK", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\./g, "-")}
          </Text>
          {/* SELLER LOCATION */}
          {seller.address && (
            <Text className="text-sm font-light">
              {seller.address.addresse.postnr} {seller.address.addresse.postnrnavn}
            </Text>
          )}
          {/* SELLER RATING */}
        </View>
      </TouchableOpacity>

      {/* MESSAGING */}
      <View>
        <TouchableOpacity className="bg-[#D9D9D9] w-full p-2 rounded-lg">
          <Text className="text-lg font-medium">Message seller</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity className="bg-[#D9D9D9] w-full p-2 rounded-lg">
          <Text className="text-lg font-medium">Message seller</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity className="bg-[#D9D9D9] w-full p-2 rounded-lg">
          <Text className="text-lg font-medium">Message seller</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity className="bg-[#D9D9D9] w-full p-2 rounded-lg">
          <Text className="text-lg font-medium">Message seller</Text>
        </TouchableOpacity>
      </View>

      <MapView style={{ width: "100%", height: 200 }} region={initialRegion} showsScale>
        <Marker
          coordinate={initialRegion}
          title="Offer location"
          description={`${saleOffer.cityInfo.city}, ${saleOffer.cityInfo.zipCode}`}
        />
      </MapView>
    </ScrollView>
  );
}
