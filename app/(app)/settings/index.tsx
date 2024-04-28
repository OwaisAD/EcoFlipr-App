import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-white">Settings</Text>
      <Text className="text-white">Notifications</Text>
      <Text className="text-white">Valuta</Text>
      <Text className="text-white">Delete Account</Text>
      <Text className="text-white">Sign out</Text>
    </View>
  );
}
