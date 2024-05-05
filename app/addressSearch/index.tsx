import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import axios from "axios";
import { Address, useAddressStore } from "../../stores/addressStore";

export default function AddressSearch() {
  const addressStore = useAddressStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const addressRef = useRef("");

  const handleAddressSearch = async (text: string) => {
    try {
      setLoading(true);
      addressRef.current = text.trim();

      axios
        .get("https://dawa.aws.dk/adresser/autocomplete", {
          params: {
            q: text,
            per_side: 100,
          },
          headers: {
            "Accept-Encoding": "gzip, deflate",
          },
        })
        .then((response) => {
          console.log(response.data);
          setSuggestions(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("parsing failed", error);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const renderSuggestionItem = ({ item }: { item: Address }) => (
    <TouchableOpacity onPress={() => handleAddressSelection(item)} className="w-full bg-[#76CFD5] mb-4 rounded-lg">
      <Text style={{ fontSize: 16, padding: 10 }}>{item.tekst}</Text>
    </TouchableOpacity>
  );

  const handleAddressSelection = (address: Address) => {
    setSelectedAddress(address);
    addressStore.setAddress(address);
    router.back();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/auth-background.png")}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <CustomKeyboardView>
        <StatusBar style="dark" />
        <View style={{ flex: 1 }}>
          {/* TOP */}
          <View style={{ paddingTop: hp(8), paddingLeft: wp(5) }}>
            <Text style={{ fontSize: 24, fontWeight: "normal" }}>Address search</Text>
            <Image
              source={require("../../assets/images/ecoflipr-logo-black.png")}
              style={{ width: wp("50%"), height: hp("10%"), resizeMode: "contain" }}
            />
          </View>

          {/* BOTTOM */}
          <View style={{ flex: 1, paddingHorizontal: wp(5) }}>
            <View style={{ backgroundColor: "#D1D5DB", borderRadius: 10, padding: 10, flex: 1 }} className="shadow-md">
              {/* address input */}
              <View style={{ flex: 1 }}>
                {/* inputs */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F3F4F6",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  <Feather name="search" size={24} color="black" />
                  <TextInput
                    onChangeText={(text) => handleAddressSearch(text)}
                    style={{ flex: 1, fontSize: 16 }}
                    placeholder="Search for your address"
                    placeholderTextColor={"gray"}
                    autoCapitalize="none"
                    className="h-10"
                  />
                </View>
              </View>

              {/* Suggestions */}
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                suggestions.length > 0 && (
                  <FlatList
                    data={suggestions}
                    renderItem={renderSuggestionItem}
                    keyExtractor={(item) => item.id}
                    style={{ marginTop: 10 }}
                  />
                )
              )}
            </View>
          </View>
        </View>
      </CustomKeyboardView>
    </ImageBackground>
  );
}
