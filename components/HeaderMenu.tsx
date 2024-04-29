import { Alert, Image, View } from "react-native";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { useAuth } from "../context/authContext";
import MenuItem from "./MenuItem";
import { AntDesign, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";

const HeaderMenu = ({ imageUrl }: { imageUrl?: String }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      Alert.alert("Sign out", "Are you sure you want to sign out?", [
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
    <Menu>
      <MenuTrigger
        customStyles={{
          triggerWrapper: {
            padding: 5,
          },
        }}
      >
        <Image
          source={
            imageUrl
              ? {
                  uri: imageUrl,
                }
              : require("../assets/images/default_profile_icon.jpg")
          }
          style={{ width: 33, height: 33, borderRadius: 60, borderWidth: 0.3, borderColor: "#1DAEFF" }}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 10,
            borderCurve: "continuous",
            marginTop: 35,
            marginLeft: -10,
            backgroundColor: "white",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 0 },
            width: 250,
          },
        }}
      >
        <MenuItem
          text="Profile"
          action={() => router.navigate("/(app)/(tabs)/profile")}
          value={null}
          icon={<MaterialCommunityIcons name="account-circle-outline" size={hp(2.5)} color={"#737373"} />}
        />
        <Divider />
        <MenuItem
          text="Offer engagements"
          action={() => router.push("/(app)/offersinteractedwith")}
          value={null}
          icon={<FontAwesome name="comments-o" size={hp(2.5)} color={"#737373"} />}
        />
        <Divider />
        <MenuItem
          text="My sale offers"
          action={() => router.push("/(app)/myoffers")}
          value={null}
          icon={<MaterialCommunityIcons name="offer" size={hp(2.5)} color={"#737373"} />}
        />
        <Divider />
        <MenuItem
          text="Sign out"
          action={handleLogout}
          value={null}
          icon={<AntDesign name="logout" size={hp(2.3)} color={"#737373"} />}
        />
      </MenuOptions>
    </Menu>
  );
};

export default HeaderMenu;

const Divider = () => {
  return <View className="p-[0.6px] w-full bg-neutral-200" />;
};
