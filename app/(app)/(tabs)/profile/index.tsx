import { Alert, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../../../../components/Themed";
import { useAuth } from "../../../../context/authContext";
import { useRouter } from "expo-router";
import Moment from "react-moment";
import { useState } from "react";
import Modal from "react-native-modal";
import { Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

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

  return (
    <>
      <View>
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
          <View className="flex-row justify-around rounded-lg py-8">
            {/* CAMERA */}
            <TouchableOpacity className="items-center p-3 bg-[#EEE] rounded-lg">
              <Feather name="camera" size={24} color="black" />
              <Text>Camera</Text>
            </TouchableOpacity>
            {/* Gallery */}
            <TouchableOpacity className="items-center p-3 bg-[#EEE] rounded-lg">
              <Feather name="image" size={24} color="black" />
              <Text>Gallery</Text>
            </TouchableOpacity>
            {/* Remove */}
            <TouchableOpacity className="items-center p-3 bg-[#EEE] rounded-lg">
              <Feather name="trash" size={24} color="black" />
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      <View className="flex-1 items-center bg-[#EEE] w-full">
        <View className="flex-row justify-evenly  w-full bg-[#EEE] items-center mt-10">
          <View className="bg-[#EEE] items-center gap-2">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={
                  user?.profileUrl != undefined
                    ? {
                        uri: user?.profileUrl,
                      }
                    : require("../../../../assets/images/default_profile_icon.jpg")
                }
                style={{ width: 100, height: 100, borderRadius: 60 }}
              />
            </TouchableOpacity>
            <View className="bg-[#EEE]">
              <Button title="Edit profile" onPress={() => router.push("/editprofile/")} />
            </View>
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
            <Text className="text-xs">{user?.createdAt}</Text>
          </View>
        </View>

        <Button title="Logout" onPress={handleLogout} />
      </View>
    </>
  );
}
