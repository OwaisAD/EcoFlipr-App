import React, { useState } from "react";
import { TouchableOpacity, FlatList, Text, View } from "react-native";
import { StatusTypes } from "../constants/StatusTypes";

interface TabButtonProps {
  name: string;
  activeTab: StatusTypes;
  onHandleSearchType: () => void;
}

interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: StatusTypes) => void;
}

const TabButton = ({ name, activeTab, onHandleSearchType }: TabButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onHandleSearchType}
      className={`items-center justify-center px-[10px] py-[6px] rounded-lg bg-[#AFDBF3] ${
        activeTab === name ? "bg-[#1DAEFF]" : ""
      }`}
    >
      <Text className="text-sm font-medium">{name.charAt(0) + name.slice(1).toLowerCase()}</Text>
    </TouchableOpacity>
  );
};

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <View>
      <FlatList
        data={tabs}
        renderItem={({ item }) => (
          <TabButton
            name={item}
            activeTab={activeTab as StatusTypes}
            onHandleSearchType={() => setActiveTab(item as StatusTypes)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={{ columnGap: 16 / 2 }}
      />
    </View>
  );
};

export default Tabs;
