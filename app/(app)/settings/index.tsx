import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../../context/authContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

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
    <View className="flex-1 bg-[#eee] p-4">
      <Text className="text-3xl font-semibold mb-6 text-gray-800">Settings</Text>

      <TouchableOpacity className="flex-row items-center py-4 px-6 bg-white rounded-lg mb-4 shadow-md">
        <MaterialIcons name="notifications-active" size={24} color="#4A5568" className="mr-4" />
        <Text className="text-lg text-gray-700 ml-4">Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center py-4 px-6 bg-white rounded-lg mb-4 shadow-md">
        <Ionicons name="cash-outline" size={24} color="#4A5568" className="mr-4" />
        <Text className="text-lg text-gray-700 ml-4">Valuta</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center py-4 px-6 bg-white rounded-lg mb-4 shadow-md">
        <AntDesign name="deleteuser" size={24} color="#E53E3E" className="mr-4" />
        <Text className="text-lg text-red-500 ml-4">Delete Account</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        className="flex-row items-center py-4 px-6 bg-white rounded-lg mb-4 shadow-md"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#4299E1" className="mr-4" />
        <Text className="text-lg text-blue-500 ml-4">Log out</Text>
      </TouchableOpacity> */}
    </View>
  );
}
