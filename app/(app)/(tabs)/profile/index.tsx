import { Alert, Button, Image, TouchableOpacity } from "react-native";
import { Text, View } from "../../../../components/Themed";
import { useAuth } from "../../../../context/authContext";
import { useRouter } from "expo-router";
import Moment from "react-moment";
import { useState } from "react";
import Modal from "react-native-modal";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage, userRef } from "../../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Loading from "../../../../components/Loading";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(user?.profileUrl ? user?.profileUrl : null);

  console.log("here", user);

  const handleLogout = async () => {
    try {
      Alert.alert("Logout", "Are you sure you want to logout?", [
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

  const getBlobFroUri = async (uri: any) => {
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
      const blob = await getBlobFroUri(image);
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
        >
          {loading ? (
            <View className="flex-row justify-around rounded-lg bg-[#EEE] py-8">
              <Loading size={hp(8)} />
            </View>
          ) : (
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
          )}
        </Modal>
      </View>
      <View className="flex-1 items-center bg-[#EEE] w-full">
        <View className="flex-row justify-evenly  w-full bg-[#EEE] items-center mt-10">
          <View className="bg-[#EEE] items-center gap-2">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={
                  imageUrl
                    ? {
                        uri: imageUrl,
                      }
                    : require("../../../../assets/images/default_profile_icon.jpg")
                }
                style={{ width: 100, height: 100, borderRadius: 60 }}
              />
            </TouchableOpacity>
            
          </View>

          <View className="bg-[#eee]">
            <Text className="font-semibold text-base">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-base font-light">{user?.email}</Text>
            <Text className="text-base font-light">{user?.phoneNumber}</Text>
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
          <TouchableOpacity className="bg-[#D9D9D9] p-4 rounded-lg">
            <Text className="text-base font-medium">My sale offers</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#D9D9D9] p-4 rounded-lg">
            <Text className="text-base font-medium">Sale offers I have interacted with</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#D9D9D9] p-4 rounded-lg">
            <Text className="text-base font-medium">Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#D9D9D9] p-4 rounded-lg">
            <Text className="text-base font-medium">Settings</Text>
          </TouchableOpacity>
         
        </View>

        <Button title="Logout" onPress={handleLogout} />
      </View>
    </>
  );
}
