import React, { useState } from "react";
import { TouchableOpacity, FlatList, Text, View } from "react-native";

interface TabButtonProps {
  name: string;
  activeTab: string;
  onHandleSearchType: () => void;
}

interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabButton = ({ name, activeTab, onHandleSearchType }: TabButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onHandleSearchType}
      className={`items-center justify-center px-[10px] py-[6px] rounded-lg bg-[#AFDBF3] ${
        activeTab === name ? "bg-[#1DAEFF]" : ""
      }`}
    >
      <Text className="text-sm font-medium">{name}</Text>
    </TouchableOpacity>
  );
};

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <View>
      <FlatList
        data={tabs}
        renderItem={({ item }) => (
          <TabButton name={item} activeTab={activeTab} onHandleSearchType={() => setActiveTab(item)} />
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
