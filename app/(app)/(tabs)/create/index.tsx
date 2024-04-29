import { Button, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "../../../../components/Themed";
import { useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { categories } from "../../../../data/categories";

export default function CreateScreen() {
  const MAX_DESCRIPTION_LENGTH = 2000;
  const titleRef = useRef("");
  const [offerDescription, setOfferDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Select a category");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const handleCreateOffer = async () => {};

  return (
    <ScrollView className="flex-1 bg-[#EEE] p-4 space-y-3">
      <Text className="text-2xl font-light">Create offer</Text>

      {/* OFFER TITLE */}
      <View className="flex-row space-x-5 px-2 py-1 items-center rounded-xl">
        <TextInput
          onChangeText={(text) => (titleRef.current = text)}
          className="bg-white p-2 rounded-md w-full flex-1 font-semibold text-neutral-700"
          placeholder="Title"
          autoCapitalize="none"
        />
      </View>

      {/* OFFER DESCRIPTION */}
      <View className="flex-row space-x-5 px-2 py-1 items-center rounded-xl">
        <TextInput
          onChangeText={(value) => setOfferDescription(value)}
          className="bg-white p-2 rounded-md w-full flex-1 font-semibold text-neutral-700"
          placeholder="Add offer description"
          autoCapitalize="none"
          multiline={true}
          maxLength={MAX_DESCRIPTION_LENGTH}
          numberOfLines={10}
          style={{ height: 200, textAlignVertical: "top", padding: 10 }}
          scrollEnabled={true}
        />
        <Text
          className={`absolute bottom-2 right-2 font-light text-[12px] text-gray-400 ${
            offerDescription.length > MAX_DESCRIPTION_LENGTH && "text-red-500"
          }`}
        >
          {offerDescription.length}/{MAX_DESCRIPTION_LENGTH}
        </Text>
      </View>

      {/* OFFER CATEGORY */}
      <View className="rounded-xl px-2 py-1">
        <TouchableOpacity
          onPress={() => setCategoryModalVisible(true)}
          className="flex-row space-x-5 items-center h-9"
        >
          <Text className={`${selectedCategory == "Select a category" ? "text-gray-400" : "font-medium"}`}>{selectedCategory != "Select a category" ? selectedCategory : "Select a category"}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={categoryModalVisible}
        onBackdropPress={() => setCategoryModalVisible(false)}
        animationIn={"fadeInUp"}
        animationOut={"fadeOutDown"}
      >
        {/* Have a list of categories */}
        <View className="rounded-lg bg-[#EEE] py-8">
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
          >
            <Picker.Item enabled={false} label={"Please select a category"} value={"Select a category"} />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.name} />
            ))}
          </Picker>
          <Button title="Confirm" onPress={() => setCategoryModalVisible(false)} />
        </View>
      </Modal>

      {/* OFFER SHIPPING */}
      {/* OFFER ZIP */}
      {/* OFFER PRICE */}
      {/* OFFER IMAGES */}
      {/* OFFER SHARE BTN */}

      <Text>Do you offer shipping?</Text>
      {/* Have a json file of all danish zip codes */}
      <Text>Enter zip code</Text>
      <Text>Enter a price</Text>
      <Text>Image upload</Text>
      <Text>Share offer button</Text>
    </ScrollView>
  );
}
