import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";

export default function SpecificFO() {
  const search = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "https://firebasestorage.googleapis.com/v0/b/ecoflipr-app.appspot.com/o/bCJI99v5PKMUdJUInXcV1UntVxh1%2Fsaleoffer%2F2024-05-07T20%3A00%3A44.682Z?alt=media&token=f02571b2-6da0-49ec-a99b-df9a1d4cd3cf",
    "https://firebasestorage.googleapis.com/v0/b/ecoflipr-app.appspot.com/o/bCJI99v5PKMUdJUInXcV1UntVxh1%2Fsaleoffer%2F2024-05-07T20%3A00%3A45.886Z?alt=media&token=87845de2-d47b-4b8e-b47f-e33ea765da2e",
  ];

  const handleImagePress = () => {
    // Implement logic to show the image in full scale
    console.log("Image clicked");
  };

  return (
    <View className="flex-1 items-center bg-[#eee]">
      <Text>asd details for {search.id}</Text>

      {/* IMAGE SLIDER */}
      <View className="w-full h-[300px] bg-red-300">
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
          {images.map((imageUrl, index) => (
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
        <View className="absolute right-2 bottom-2">
          <Text className="text-white">
            {currentIndex + 1}/{images.length}
          </Text>
        </View>
      </View>

      {/* OFFER DETAILS */}
      <View></View>

      {/* SELLER DETAILS */}
      <View></View>

      {/* MESSAGING */}
      <View></View>
    </View>
  );
}
