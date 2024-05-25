import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Platform, ScrollView, Switch, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import { useRouter } from "expo-router";
import RangeSlider from "rn-range-slider";

import { Thumb, Rail, RailSelected, Label, Notch } from "../components/SliderComponents";
import { categories } from "../data/categories";
import MapView, { Marker, Circle } from "react-native-maps";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

export default function SearchFilterModalScreen() {
  const router = useRouter();

  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(100_000);
  const [shippable, setShippable] = useState(true);
  const [zipcode, setZipcode] = useState("");
  const [distance, setDistance] = useState(5); // Default distance is 5 km
  const [mapRegion, setMapRegion] = useState({
    latitude: 55.676098,
    longitude: 12.568337,
    latitudeDelta: 2,
    longitudeDelta: 0.0421,
  });

  const handleToggleShippable = () => {
    setShippable(!shippable);
  };

  const handleSetZipCode = async (value: string) => {
    if (/^\d{4}$/.test(value)) {
      try {
        await axios.get(`https://api.dataforsyningen.dk/postnumre/${value}`).then((response) => {
          setMapRegion({
            latitude: response.data.visueltcenter[1],
            longitude: response.data.visueltcenter[0],
            latitudeDelta: 2,
            longitudeDelta: 0.0421,
          });
        });
      } catch (error: any) {
        console.log("error", error.message);
        Alert.alert("Error", "Invalid zipcode");
      }
    }
  };

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: number) => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((low: number, high: number) => {
    setLow(low);
    setHigh(high);
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-[#eee] px-10 pt-10 pb-24"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}
    >
      <Text className="text-2xl font-light mb-4">Filters</Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      {/* PRICE FILTER */}
      <View className="bg-[#eee]">
        <Text className="text-lg font-light mb-2">Price Range</Text>

        <View className="flex-row justify-between items-center mb-4 bg-[#eee]">
          <View className="">
            <Text className="text-sm bg-[#eee] font-light">From</Text>
            <TextInput
              className="w-24 p-2 border border-gray-300 rounded text-center "
              keyboardType="numeric"
              value={String(low)}
              onChangeText={(text) => {
                const value = parseInt(text, 10);
                if (!isNaN(value)) {
                  setLow(value);
                  if (value > high) setHigh(value);
                }
              }}
            />
          </View>
          <View>
            <Text className="text-sm font-light bg-[#eee]">To</Text>
            <TextInput
              className="w-24 p-2 border border-gray-300 rounded text-center"
              keyboardType="numeric"
              value={String(high)}
              onChangeText={(text) => {
                const value = parseInt(text, 10);
                if (!isNaN(value)) {
                  setHigh(value);
                  if (value < low) setLow(value);
                }
              }}
            />
          </View>
        </View>

        <RangeSlider
          style={{ width: "100%", height: 40 }}
          min={0}
          max={100_000}
          step={100}
          floatingLabel
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
          onValueChanged={handleValueChange}
          low={low}
          high={high}
        />
      </View>

      {/* separator line */}
      <View className="border-b border-gray-300 mb-4" />

      {/* LOCATION FILTER */}
      <View className="bg-[#eee]">
        <Text className="text-lg font-light mb-2 ">Location</Text>

        <View className="justify-between space-y-4 bg-[#eee]">
          <View className="flex-row items-center justify-between bg-[#eee]">
            <Text className="text-sm font-light">Distance (km): {distance} from</Text>
            <TextInput
              className="w-28 h-10 border border-gray-300 rounded text-center bg-white p-2"
              keyboardType="numeric"
              placeholder="Zipcode"
              maxLength={4}
              value={zipcode}
              onChangeText={(text) => {
                setZipcode(text);
                if (text.length === 4) {
                  handleSetZipCode(text);
                }
              }}
            />
          </View>

          <RangeSlider
            style={{ width: "100%", height: 40 }}
            min={1}
            max={250}
            step={1}
            floatingLabel
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            renderNotch={renderNotch}
            onValueChanged={(value) => setDistance(value)}
            disableRange
          />
        </View>
        {/* MapView to display chosen location with radius */}
        <MapView
          style={{ width: "100%", height: 200, borderRadius: 10 }}
          region={mapRegion}
          onRegionChange={(region) => setMapRegion(region)}
          zoomEnabled
        >
          {/* Marker for the selected location */}
          <Marker
            coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
            title="Selected Location"
            description={`Zipcode: ${zipcode}`}
          />
          {/* Circle to show the radius */}
          <Circle
            center={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
            radius={distance * 1000} // Convert km to meters
            strokeColor="#1E40AF"
            fillColor="rgba(30, 64, 175, 0.2)"
          />
        </MapView>
      </View>

      {/* separator line */}
      <View className="border-b border-gray-300 my-4" />

      {/* LOCATION  */}

      {/* CATEGORY FILTER */}
      <View className="bg-[#eee]">
        <Text className="text-lg font-light mb-2">Category</Text>

        <View className="flex-row flex-wrap bg-[#eee]">
          {categories.map((category) => (
            <TouchableOpacity key={category.id} className="bg-[#1E40AF] py-2 px-4 rounded-lg m-1" onPress={() => {}}>
              <Text className="text-white">{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="border-b border-gray-300 my-4" />

      {/* SHIPPABLE SWITCH */}
      <View className="flex-row justify-between items-center bg-[#eee]">
        <Text className="text-lg font-light">Shippable</Text>
        <Switch
          value={shippable}
          onValueChange={handleToggleShippable}
          trackColor={{ false: "#767577", true: "#1E40AF" }}
          thumbColor={shippable ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>

      <View className="border-b border-gray-300 my-4" />

      {/* Apply button */}
      <View className="flex-row justify-center mt-4 bg-[#eee]">
        <TouchableOpacity
          className="bg-[#1E40AF] py-2 px-4 rounded-lg w-full justify-center items-center"
          onPress={() => {
            router.replace("/(app)/(tabs)/search");
          }}
        >
          <Text className="text-white text-xl font-semibold">Search</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
