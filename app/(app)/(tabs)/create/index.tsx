import { Button, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "../../../../components/Themed";
import { useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { categories } from "../../../../data/categories";
import Checkbox from "expo-checkbox";
import CustomKeyboardView from "../../../../components/CustomKeyboardView";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function CreateScreen() {
  const MAX_DESCRIPTION_LENGTH = 2000;
  const titleRef = useRef("");
  const [offerDescription, setOfferDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Select a category");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [price, setPrice] = useState<number | null>();
  const [imageUploadModalVisible, setImageUploadModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateOffer = async () => {
    try {
      // validate
      if (!titleRef.current || !offerDescription || selectedCategory == "Select a category" || !price) {
        alert("Please add all required fields: title, description, category, price");
        return;
      }
      // create offer
      // setLoading(true);
      // const offer = {
      //   title: titleRef.current,
      //   description: offerDescription,
      //   category: selectedCategory,
      //   shipping: shipping,
      //   price: price,
      //   images: [],
      //   createdAt: new Date(),
      //   userId: user!.userId,
      // };
      // const offerRef = await addDoc(collection(db, "offers"), offer);
      // console.log("Document written with ID: ", offerRef.id);
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const saveImage = async (image: any) => {
    try {
      // setLoading(true);
      // // save to firebase
      // const blob = await getBlobFroUri(image);
      // const storageRef = ref(storage, `${user?.userId}/profilepic/${user?.userId}`);
      // const snapshot = await uploadBytes(storageRef, blob as Blob);
      // console.log("Uploaded a blob or file!", snapshot);
      // const url = await getDownloadURL(storageRef);
      // // store on the user
      // const userRefDoc = doc(db, "users", user!.userId);
      // await setDoc(userRefDoc, { profileUrl: url }, { merge: true });
      // //update displayed image
      // // setImageUrl(url);
      // setImageUploadModalVisible(false);
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleTakePicture = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1,
      });

      if (!result.canceled) {
        // save image to firebase
        await saveImage(result.assets[0].uri);
      }
    } catch (error: any) {
      alert("An error occurred" + error.message);
      setImageUploadModalVisible(false);
    }
  };

  const handleAddFromGallery = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 0.1,
        allowsMultipleSelection: true,
        selectionLimit: 6,
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error: any) {
      alert("An error occurred" + error.message);
      setImageUploadModalVisible(false);
    }
  };

  return (
    <ScrollView className="flex-1  bg-[#eee] gap-4 p-4">
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
      <View className="rounded-xl px-4 py-1">
        <TouchableOpacity onPress={() => setCategoryModalVisible(true)} className="flex-row space-x-5 items-center h-9">
          <Text className={`font-semibold ${selectedCategory == "Select a category" ? "text-gray-400" : ""}`}>
            {selectedCategory != "Select a category" ? selectedCategory : "Select a category"}
          </Text>
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
            {categories.sort().map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.name} />
            ))}
          </Picker>
          <Button title="Confirm" onPress={() => setCategoryModalVisible(false)} />
        </View>
      </Modal>

      {/* OFFER SHIPPING */}
      <View className="flex-row items-center justify-between rounded-xl px-4 py-3">
        <Text>Do you offer shipping?</Text>
        <Checkbox value={shipping} onValueChange={setShipping} />
      </View>

      {/* OFFER ZIP */}
      <View className="flex-row items-center justify-between rounded-xl">
        <TextInput
          className="bg-white py-4 px-2 rounded-l-md w-full flex-1 font-semibold text-neutral-700"
          placeholder="Enter a zip code"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-[#D1D5DB] py-4 px-2 rounded-r-md w-full flex-1 font-semibold text-white"
          placeholder="Chosen city"
          autoCapitalize="none"
          editable={false}
        />
      </View>

      {/* OFFER PRICE */}
      <View className="flex-row items-center justify-between rounded-xl">
        <TextInput
          onChangeText={(value) => setPrice(parseInt(value))}
          placeholder="Enter a price"
          className="bg-white py-4 px-2 flex-1 rounded-md font-semibold text-neutral-700"
          autoCapitalize="none"
          keyboardType="number-pad"
        />
        <Text className="font-light text-neutral-700 absolute right-2">,-</Text>
      </View>

      {/* OFFER IMAGES */}
      <View className="rounded-md">
        <TouchableOpacity className="p-4" onPress={() => setImageUploadModalVisible(true)}>
          <Text>Click to upload images (6 max)</Text>
        </TouchableOpacity>
        {/* IMAGES UPLOADED GRID VIEW HERE */}
        <View></View>
      </View>
      <Modal
        isVisible={imageUploadModalVisible}
        onBackdropPress={() => setImageUploadModalVisible(false)}
        animationIn={"fadeInUp"}
        animationOut={"fadeOutDown"}
        className="gap-4"
      >
        <View className="bg-[#EEE] rounded-lg  items-center py-2">
          <Text className="text-xl">Upload Images</Text>
        </View>
        <View className="flex-row justify-around rounded-lg bg-[#EEE] py-8 px-10">
          {/* CAMERA */}
          <TouchableOpacity className="items-center p-3 bg-[#e1dcdc] rounded-lg" onPress={handleTakePicture}>
            <Feather name="camera" size={24} color="black" />
            <Text>Camera</Text>
          </TouchableOpacity>
          {/* Gallery */}
          <TouchableOpacity className="items-center p-3 bg-[#e1dcdc] rounded-lg" onPress={handleAddFromGallery}>
            <Feather name="image" size={24} color="black" />
            <Text>Gallery</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* OFFER SHARE BTN */}
      <TouchableOpacity
        onPress={handleCreateOffer}
        style={{ height: hp(5) }}
        className="bg-indigo-500 rounded-xl justify-center items-center"
      >
        <Text style={{ fontSize: hp(2.2) }} className="text-white font-bold tracking-wider">
          Share offer
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
