import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, Platform, RefreshControl, SafeAreaView, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";

export default function NotificationsModalScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUnreadMessages();
    setRefreshing(false);
  }, []);

  const fetchUnreadMessages = async () => {
    if (user?.userId) {
      const messagesQuery = query(collection(db, "Messages"), where("senderId", "!=", user?.userId));
      const messagesSnapshot = await getDocs(messagesQuery);
      const messagesData = messagesSnapshot.docs.map((doc) => ({
        messageId: doc.id,
        ...doc.data(),
      }));

      setUnreadMessages(messagesData);
    }
  };

  useEffect(() => {
    fetchUnreadMessages();
  }, [user?.userId]);

  const navigateToThread = async (item: any) => {
    try {
      console.log(item.threadId);

      // Fetch thread data using threadId
      const threadDoc = doc(db, "Threads", item.threadId);
      const threadSnap = await getDoc(threadDoc);
      const threadData = threadSnap.data();

      if (threadData) {
        // Manually add the document ID to the thread data
        threadData.id = threadSnap.id;

        // Fetch sale offer data using saleOfferId from thread data
        const saleOfferQuery = query(collection(db, "saleoffers"), where("saleOfferId", "==", threadData.saleOfferId));
        const saleOfferSnapshot = await getDocs(saleOfferQuery);
        const saleOfferData = saleOfferSnapshot.docs[0]?.data();

        console.log(saleOfferData);

        if (saleOfferData) {
          const sellerId = saleOfferData.userId;
          console.log("Seller ID", sellerId);
          const senderId = threadData.participants.filter((id: string) => id !== user?.userId)[0];
          console.log("Sender ID", senderId);

          // Navigate to thread with proper sellerId and senderId
          router.back();
          router.push({
            pathname: `/thread/${threadData.saleOfferId}`,
            params: {
              sellerId: sellerId,
              senderId: senderId,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error navigating to thread:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#eee] pt-10">
      <View className="px-5 py-3 bg-[#eee]">
        <Text className="text-2xl font-semibold text-gray-800">Notifications</Text>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
      <FlatList
        data={unreadMessages}
        className="mt-2"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyExtractor={(item) => item.messageId}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white px-4 py-2 my-2 mx-5 rounded-lg shadow-sm"
            onPress={() => navigateToThread(item)}
          >
            <Text className="text-base font-medium text-gray-800">{item.text}</Text>
            <Text className="text-xs text-gray-600 mt-1">
              {"NAME"} {item.createdAt && new Date(item.createdAt.toDate()).toLocaleString("da-DK")}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20 bg-[#eee]">
            <Text className="text-base font-light text-gray-600">No new notifications at this time.</Text>
          </View>
        }
        contentContainerStyle={unreadMessages.length ? {} : { flexGrow: 1, justifyContent: "center" }}
      />
    </SafeAreaView>
  );
}
