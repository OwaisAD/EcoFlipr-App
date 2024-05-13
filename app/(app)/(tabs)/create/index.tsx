import * as FileSystem from "expo-file-system";
import { Alert, Button, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "../../../../components/Themed";
import { useEffect, useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { categories } from "../../../../data/categories";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { createOfferSchema } from "../../../../validations/createOfferSchema";
import { ZodError } from "zod";
import axios from "axios";
import { useAuth } from "../../../../context/authContext";
import { StatusTypes } from "../../../../constants/StatusTypes";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../../firebaseConfig";
import { useRouter } from "expo-router";
import Loading from "../../../../components/Loading";
import CustomKeyboardView from "../../../../components/CustomKeyboardView";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";

export default function CreateScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const MAX_DESCRIPTION_LENGTH = 2000;
  const [title, setTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Select a category");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [cityInfo, setCityInfo] = useState({
    zipCode: 0,
    city: "",
    x: 0,
    y: 0,
  });
  const [price, setPrice] = useState("");
  const [imageUploadModalVisible, setImageUploadModalVisible] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [zipCode, setZipCode] = useState("");

  const handleCreateOffer = async () => {
    try {
      setLoadingShare(true);
      // validate
      createOfferSchema.parse({
        title: title,
        description: offerDescription,
        category: selectedCategory,
        shipping: shipping,
        zipCode: +zipCode,
        price: +price,
      });

      const saleOfferId = uuidv4().toString();

      // create offer
      const saleoffer = {
        saleOfferId: saleOfferId,
        userId: user!.userId,
        title: title,
        description: offerDescription,
        category: selectedCategory,
        shipping: shipping,
        price: price,
        cityInfo: cityInfo,
        images,
        createdAt: new Date(),
        lastUpdated: new Date(),
        status: StatusTypes.ACTIVE,
        title_lowercase: title.toLowerCase(),
        description_lowercase: offerDescription.toLowerCase(),
      };

      const saleOfferRef = await addDoc(collection(db, "saleoffers"), saleoffer);
      // clear fields
      setTitle("");
      setOfferDescription("");
      setSelectedCategory("Select a category");
      setShipping(false);

      setCityInfo({ zipCode: 0, city: "", x: 0, y: 0 });
      setZipCode("");
      setPrice("");
      setImages([]);
      router.push({ pathname: `/offer/${saleOfferId}` });
      setLoadingShare(false);
    } catch (error) {
      setLoadingShare(false);
      if (error instanceof ZodError) {
        Alert.alert("Create offer", error.errors[0].message);
      }
      console.log("error", error);
    }
  };

  const getBlobFromUri = async (uri: any) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    return blob;
  };

  const saveImage = async (image: any) => {
    try {
      // save to firebase
      const blob = await getBlobFromUri(image);
      const storageRef = ref(storage, `${user?.userId}/saleoffer/${new Date().toISOString()}`);
      const snapshot = await uploadBytes(storageRef, blob as Blob);
      console.log("Uploaded a blob or file!", snapshot);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  const handleTakePicture = async () => {
    try {
      if (images.length >= 6) {
        alert(
          "You have reached the maximum number of images allowed on a saleoffer (6). Click on an image to remove it."
        );
        setImageUploadModalVisible(false);
        return;
      }

      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1,
      });

      if (!result.canceled) {
        setLoading(true);
        await saveImage(result.assets[0].uri);
        setLoading(false);
        setImageUploadModalVisible(false);
      }
    } catch (error: any) {
      alert("An error occurred" + error.message);
      setImageUploadModalVisible(false);
    }
  };

  const handleAddFromGallery = async () => {
    try {
      if (images.length >= 6) {
        alert(
          "You have reached the maximum number of images allowed on a saleoffer (6). Click on an image to remove it."
        );
        setImageUploadModalVisible(false);
        return;
      }
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 0.4,
        selectionLimit: 6,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        setLoading(true);
        const imagesUrls = []; // Collect all image URLs first
        for (let i = 0; i < result.assets.length; i++) {
          const url = await saveImage(result.assets[i].uri);
          imagesUrls.push(url);
        }
        setImages([...images, ...imagesUrls]); // Update state after all uploads
        setLoading(false);
        setImageUploadModalVisible(false);
      }
    } catch (error: any) {
      alert("An error occurred" + error.message);
      setLoading(false);
      setImageUploadModalVisible(false);
    }
  };

  const handleClearFields = async () => {
    Alert.alert("Clear fields", "Are you sure you want to clear all fields?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          // remove images from storage
          // TODO
          for (let i = 0; i < images.length; i++) {
            deleteObject(ref(storage, images[i]))
              .then(() => {
                console.log("Image removed successfully");
              })
              .catch((error) => {
                console.log("error", error);
              });
          }
          // clear fields
          setTitle("");
          setOfferDescription("");
          setSelectedCategory("Select a category");
          setShipping(false);
          setCityInfo({ zipCode: 0, city: "", x: 0, y: 0 });
          setPrice("");
          setZipCode("");
          setImages([]);

          showMessage({
            message: `Cleared all fields successfully`,
            type: "info",
          });
        },
      },
    ]);
  };

  const handleRemoveImage = async (url: string) => {
    Alert.alert("Remove image", "Are you sure you want to remove this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteObject(ref(storage, url))
            .then(() => {
              //remove from state
              setImages(images.filter((image) => image !== url));
              showMessage({
                message: `Image removed successfully`,
                type: "info",
              });
            })
            .catch((error) => {
              console.log("error", error);
            });
        },
      },
    ]);
  };

  const handleSetZipCode = async (value: string) => {
    if (/^\d{4}$/.test(value)) {
      try {
        await axios.get(`https://api.dataforsyningen.dk/postnumre/${value}`).then((response) => {
          console.log("postnr", response.data.nr);
          console.log("by", response.data.navn);
          console.log("kommuner", response.data.kommuner);
          console.log("X", response.data.visueltcenter[1]);
          console.log("Y", response.data.visueltcenter[0]);
          setCityInfo({
            zipCode: response.data.nr,
            city: response.data.navn,
            x: response.data.visueltcenter[1],
            y: response.data.visueltcenter[0],
          });
        });
      } catch (error: any) {
        console.log("error", error.message);
      }
    }
  };

  return (
    <CustomKeyboardView>
      <View className="flex-1 bg-[#eee] gap-4 p-4 pb-[100px]">
        <View className="flex-row items-center justify-between bg-[#eee]">
          <Text className="text-2xl font-light">Create new sale offer</Text>
          <TouchableOpacity className="bg-[#eee]" onPress={handleClearFields}>
            <MaterialCommunityIcons name="broom" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* OFFER TITLE */}
        <View className="flex-row space-x-5 px-2 py-1 items-center rounded-xl">
          <TextInput
            onChangeText={(text) => setTitle(text)}
            className="bg-white p-2 rounded-md w-full flex-1 font-semibold text-neutral-700"
            placeholder="Title"
            autoCapitalize="none"
            value={title}
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
            value={offerDescription}
          />
          <Text
            className={`absolute bottom-2 right-2 font-light text-[12px] text-gray-400 ${
              offerDescription && offerDescription.length > MAX_DESCRIPTION_LENGTH && "text-red-500"
            }`}
          >
            {offerDescription && offerDescription.length}/{MAX_DESCRIPTION_LENGTH}
          </Text>
        </View>

        {/* OFFER CATEGORY */}
        <View className="rounded-xl px-4 py-1">
          <TouchableOpacity
            onPress={() => setCategoryModalVisible(true)}
            className="flex-row space-x-5 items-center h-9"
          >
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
              onValueChange={(itemValue) => setSelectedCategory(itemValue as string)}
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
          <Checkbox value={shipping} onValueChange={(value) => setShipping(value)} />
        </View>

        {/* OFFER ZIP */}
        <View className="flex-row items-center justify-between rounded-xl">
          <TextInput
            onChangeText={(value) => {
              handleSetZipCode(value);
              setZipCode(value);
            }}
            className="bg-white py-4 px-2 rounded-l-md w-full flex-1 font-semibold text-neutral-700"
            placeholder="Enter a zip code"
            autoCapitalize="none"
            keyboardType="number-pad"
            maxLength={4}
            value={zipCode}
          />
          <TextInput
            className="bg-[#D1D5DB] py-4 px-2 rounded-r-md w-full flex-1 font-semibold text-white"
            placeholder="Chosen city"
            autoCapitalize="none"
            editable={false}
            value={cityInfo.city}
          />
        </View>

        {/* OFFER PRICE */}
        <View className="flex-row items-center justify-between rounded-xl">
          <TextInput
            onChangeText={(value) => setPrice(value)}
            placeholder="Enter a price"
            className="bg-white py-4 px-2 flex-1 rounded-md font-semibold text-neutral-700"
            autoCapitalize="none"
            keyboardType="number-pad"
            value={price}
          />
          <Text className="font-light text-neutral-700 absolute right-2">,-</Text>
        </View>

        {/* OFFER IMAGES */}
        <View className="rounded-md">
          <View className="rounded-md flex-row items-center justify-between p-4">
            <TouchableOpacity onPress={() => setImageUploadModalVisible(true)}>
              <Text>Click to upload images</Text>
            </TouchableOpacity>
            <Text className={`text-xs font-light ${images.length == 6 && "text-red-500"}`}>
              {images && images.length}/6
            </Text>
          </View>
          {/* IMAGES UPLOADED GRID VIEW HERE */}
          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {images &&
                images.map((image, index) => (
                  <TouchableOpacity key={index} className="rounded-md m-2" onPress={() => handleRemoveImage(image)}>
                    <Image source={{ uri: image }} style={{ width: wp(20), height: hp(10), borderRadius: 10 }} />
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
        <Modal
          isVisible={imageUploadModalVisible}
          onBackdropPress={() => setImageUploadModalVisible(false)}
          animationIn={"fadeInUp"}
          animationOut={"fadeOutDown"}
          className="gap-4"
        >
          {loading ? (
            <>
              <View className="bg-[#EEE] rounded-lg  items-center py-8">
                <Loading size={hp(8)} />
              </View>
            </>
          ) : (
            <>
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
            </>
          )}
        </Modal>

        {/* OFFER SHARE BTN */}
        {loadingShare ? (
          <View className="flex-row justify-around rounded-lg bg-[#EEE] py-2">
            <Loading size={hp(8)} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleCreateOffer}
            style={{ height: hp(5) }}
            className="bg-indigo-500 rounded-xl justify-center items-center"
          >
            <Text style={{ fontSize: hp(2.2) }} className="text-white font-bold tracking-wider">
              Share offer
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </CustomKeyboardView>
  );
}
