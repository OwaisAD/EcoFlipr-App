import { Alert, Image, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "../../../../components/Themed";
import { useAuth } from "../../../../context/authContext";
import { useRouter } from "expo-router";
import Moment from "react-moment";
import { useCallback, useEffect, useState } from "react";
import Modal from "react-native-modal";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Loading from "../../../../components/Loading";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(user?.profileUrl ? user?.profileUrl : null);
  const [cachedImage, setCachedImage] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // await fetchOffers();
    setRefreshing(false);
  }, []);


  useEffect(() => {
    // Preload image when the tab is mounted
    if (user?.profileUrl) {
      const preloadImage = async () => {
        try {
          const response = await fetch(user.profileUrl as string);
          if (response.ok) {
            const blob = await response.blob();
          }
        } catch (error) {
          console.error("Error preloading image:", error);
        }
      };
      preloadImage();
    }
  }, [user?.profileUrl]);

  console.log("here", user);

  const handleLogout = async () => {
    try {
      Alert.alert("Logout", "Are you sure you want to sign out?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: async () => await logout() },
      ]);
    } catch (error) {
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
      setLoading(true);
      // save to firebase
      const blob = await getBlobFromUri(image);
      const storageRef = ref(storage, `${user?.userId}/profilepic/${user?.userId}`);
      const snapshot = await uploadBytes(storageRef, blob as Blob);
      console.log("Uploaded a blob or file!", snapshot);
      const url = await getDownloadURL(storageRef);

      // store on the user
      const userRefDoc = doc(db, "users", user!.userId);
      await setDoc(userRefDoc, { profileUrl: url }, { merge: true });

      //update displayed image
      setImageUrl(url);
      setModalVisible(false);
      setLoading(false);
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
      setModalVisible(false);
    }
  };

  const handleAddFromGallery = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1,
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error: any) {
      alert("An error occurred" + error.message);
      setModalVisible(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      if (!imageUrl) {
        setLoading(false);
        Alert.alert("No Image", "There is no profile picture to remove.");
        return;
      }

      Alert.alert("Remove Profile Picture", "Are you sure you want to remove your profile picture?", [
        {
          text: "Cancel",
          onPress: () => {
            setLoading(false);
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            setLoading(true);
            // remove from firebase database and storage
            const userRefDoc = doc(db, "users", user!.userId);
            await setDoc(userRefDoc, { profileUrl: "" }, { merge: true });
            setImage(null);
            const storageRef = ref(storage, `${user?.userId}/profilepic/${user?.userId}`);
            await deleteObject(storageRef);
            setImageUrl(null);
            setLoading(false);
            setModalVisible(false);
          },
        },
      ]);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  return (
    <>
      <View>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          animationIn={"fadeInUp"}
          animationOut={"fadeOutDown"}
          className="space-y-4"
        >
          {loading ? (
            <View className="flex-row justify-around rounded-lg bg-[#EEE] py-8">
              <Loading size={hp(8)} />
            </View>
          ) : (
            <>
              <View className="bg-[#EEE] rounded-lg  items-center py-2">
                <Text className="text-xl">Profile Picture</Text>
              </View>
              <View className="flex-row justify-around rounded-lg bg-[#EEE] py-8">
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
                {/* Remove */}
                <TouchableOpacity
                  className="items-center p-3 bg-[#e1dcdc] rounded-lg"
                  onPress={handleRemoveProfilePicture}
                >
                  <Feather name="trash" size={24} color="black" />
                  <Text>Remove</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Modal>
      </View>
      <ScrollView
        className="flex-1 bg-[#EEE] w-full"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-row justify-evenly w-full bg-[#EEE] items-center mt-10">
          <View className="bg-[#EEE] items-center gap-2">
            <TouchableOpacity onPress={() => setModalVisible(true)} className="shadow-xl">
              <Image
                source={
                  imageUrl
                    ? {
                        uri: cachedImage || imageUrl,
                      }
                    : require("../../../../assets/images/default_profile_icon.jpg")
                }
                style={{ width: 100, height: 100, borderRadius: 60, borderWidth: 0.3, borderColor: "#1DAEFF" }}
              />
            </TouchableOpacity>
          </View>

          <View className="bg-[#eee] w-[200px]">
            <Text className="font-semibold text-base">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-base font-light">{user?.email}</Text>
            <Text className="text-base font-light">{user?.phoneNumber}</Text>
            <Text className="text-sm font-light">{user?.address ? user.address.tekst : ""}</Text>
            <Text className="text-sm font-light">
              Member since{" "}
              <Moment element={Text} fromNow>
                {user?.createdAt}
              </Moment>
            </Text>
            <Text className="text-[10px]">{user?.createdAt}</Text>
          </View>
        </View>

        <View className="bg-[#EEE] w-full px-6 flex-col gap-2 mt-10">
          <TouchableOpacity
            className="bg-[#D9D9D9] p-4 rounded-lg"
            onPress={() => router.push("/(app)/offersinteractedwith")}
          >
            <Text className="text-base font-medium">Sale offers interacted with</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#D9D9D9] p-4 rounded-lg" onPress={() => router.push("/(app)/myoffers")}>
            <Text className="text-base font-medium">My sale offers</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#D9D9D9] p-4 rounded-lg" onPress={() => router.push("/(app)/editprofile")}>
            <Text className="text-base font-medium">Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#D9D9D9] p-4 rounded-lg" onPress={() => router.push("/(app)/settings")}>
            <Text className="text-base font-medium">Settings</Text>
          </TouchableOpacity>
        </View>

        <View className="flex items-center justify-center mt-10 bg-[#eee]">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center bg-gray-300 rounded-full py-2 px-4 shadow-md space-x-1"
          >
            <Ionicons name="log-out-outline" size={24} color="black" className="mr-2" />
            <Text className="text-base font-medium">Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
