import { Image, TouchableOpacity, View } from "react-native";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import MenuItem from "./MenuItem";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";

const SaleOfferMenu = ({ isOwner }: { isOwner: boolean }) => {
  const router = useRouter();

  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          triggerWrapper: {
            padding: 2,
          },
        }}
      >
        <View className="p-2 rounded-full bg-[#1DAEFF]">
          <Entypo name="dots-three-horizontal" size={14} color="white" />
        </View>
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
        {isOwner && (
          <>
            <MenuItem
              text="Change status"
              action={() => router.navigate("/(app)/(tabs)/profile")}
              value={null}
              icon={<Feather name="repeat" size={hp(2.5)} color={"#737373"} />}
            />
            <Divider />
            <MenuItem
              text="Edit offer"
              action={() => router.navigate("/(app)/(tabs)/profile")}
              value={null}
              icon={<Feather name="edit" size={hp(2.5)} color={"#737373"} />}
            />
            <Divider />
            <MenuItem
              text="Delete offer"
              action={() => console.log("deleting offer")}
              value={null}
              icon={<Feather name="trash" size={hp(2.5)} color={"#737373"} />}
            />
          </>
        )}
        {!isOwner && (
          <>
            <MenuItem
              text="Report offer"
              action={() => console.log("reporting offer")}
              value={null}
              icon={<MaterialIcons name="report" size={hp(2.5)} color={"#737373"} />}
            />
          </>
        )}
      </MenuOptions>
    </Menu>
  );
};

export default SaleOfferMenu;

const Divider = () => {
  return <View className="p-[0.6px] w-full bg-neutral-200" />;
};
