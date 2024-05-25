import React from "react";
import { View, Text } from "react-native";

export const Thumb = () => (
  <View
    style={{
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#1E40AF",
      borderColor: "#ffffff",
      borderWidth: 2,
    }}
  />
);

export const Rail = () => (
  <View
    style={{
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: "#d3d3d3",
    }}
  />
);

export const RailSelected = () => (
  <View
    style={{
      height: 4,
      backgroundColor: "#1E40AF",
      borderRadius: 2,
    }}
  />
);

export const Label = ({ text }: { text: any }) => (
  <View
    style={{
      alignItems: "center",
      padding: 4,
      backgroundColor: "#1E40AF",
      borderRadius: 4,
    }}
  >
    <Text style={{ color: "#fff" }}>{text}</Text>
  </View>
);

export const Notch = () => (
  <View
    style={{
      width: 8,
      height: 8,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: "#1E40AF",
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderBottomWidth: 8,
    }}
  />
);
