import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useAuth } from "../../../context/authContext";

export default function Profile() {
  const { user } = useAuth();
  const search = useLocalSearchParams();

  return (
    <View>
      <Text>Profile</Text>
      <Text>id of user: {search.id}</Text>
      <Text>currently logged in user id: {user?.userId}</Text>
    </View>
  );
}
