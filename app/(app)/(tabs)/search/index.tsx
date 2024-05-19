import { FlatList, RefreshControl, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "../../../../components/Themed";
import { useCallback, useRef, useState } from "react";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { searchForSaleOffers } from "../../../../helperMethods/saleoffer.methods";
import { SaleOfferType } from "../../../../stores/saleOfferStore";
import SaleOffer from "../../../../components/SaleOffer";
import { useAuth } from "../../../../context/authContext";
import Loading from "../../../../components/Loading";
import { useRouter } from "expo-router";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Asyncstorage: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function SearchScreen() {
  const inputRef = useRef<TextInput | null>();
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SaleOfferType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searcResulthMessage, setSearchResultMessage] = useState<string>("");
  const [isGrid, setIsGrid] = useState(false);

  setTimeout(() => {
    inputRef.current?.focus();
  }, 100);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleRefresh();
    setRefreshing(false);
  }, []);

  const handleSearch = async (text: string) => {
    try {
      setLoading(true);
      setSearch(text);
      const searchResults = await searchForSaleOffers(text, { limit: 10, startAfter: null });
      setSearchResults(searchResults);
      setSearchResultMessage(`Found ${searchResults.length} ${searchResults.length == 1 ? "result" : "results"}`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
      console.error("Error fetching search results:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const searchResults = await searchForSaleOffers(search, { limit: 10, startAfter: null });
      setSearchResults(searchResults);
      setSearchResultMessage(`Found ${searchResults.length} ${searchResults.length == 1 ? "result" : "results"}`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="bg-[#EEE] flex-1 px-4">
        <View className="flex-row space-x-5 px-2 py-1 items-center rounded-xl border-blue-100 border my-4">
          <TextInput
            className="bg-white p-2 rounded-lg w-full flex-1 font-semibold text-neutral-700"
            placeholder="Search on EcoFlipr"
            autoCapitalize="none"
            value={search}
            onChangeText={(text) => handleSearch(text)}
            keyboardAppearance="dark"
            ref={(ref) => {
              inputRef.current = ref;
            }}
          />
          <View className="px-1">
            <FontAwesome5 name="search" size={20} color="#1DAEFF" />
          </View>
        </View>

        {/* FILTER SECTION */}
        <View className="flex-row items-center justify-between bg-[#eee]">
          <View className="bg-[#eee]">
            <Text>{searcResulthMessage}</Text>
          </View>

          <View className="flex-row items-center bg-[#eee] gap-2">
            <TouchableOpacity className="bg-[#eee]" onPress={() => setIsGrid(true)}>
              <Entypo name="grid" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#eee]" onPress={() => setIsGrid(false)}>
              <FontAwesome5 name="list-ul" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#eee]" onPress={() => router.push("/searchFilterModalScreen")}>
              <Ionicons name="filter-circle" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* SEARCH RESULTS */}
        {loading ? (
          <View className={`bg-[#eee]`}>
            <Loading size={100} />
          </View>
        ) : (
          <FlatList
            className={`mt-4`}
            contentContainerStyle={isGrid ? { flexDirection: "row", flexWrap: "wrap" } : {}}
            data={searchResults}
            renderItem={({ item }) => (
              <View className={`mb-2 bg-[#eee] ${isGrid ? "w-1/2 p-2" : ""}`}>
                <SaleOffer saleOffer={item} user={user} refetch={handleRefresh} isGrid={isGrid} />
              </View>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View className="items-center bg-[#eee] mt-10">
                <Text className="text-lg">Search for offers on EcoFlipr</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
