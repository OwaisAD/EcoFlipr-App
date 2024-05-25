import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, View, Text, Image, ScrollView } from "react-native";
import useGetSaleOfferById from "../../../hooks/useGetSaleOfferId";
import { formatCurrencyDA } from "../../../utils/currencyFormat";
import { formatFirebaseDate } from "../../../utils/formatDate";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useAuth } from "../../../context/authContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getUserById } from "../../../helperMethods/user.methods";

export default function Messages() {
  const { user } = useAuth();
  const router = useRouter();
  const search = useLocalSearchParams();
  const saleOffer = useGetSaleOfferById(search.id as string);
  const [threads, setThreads] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [latestMessages, setLatestMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      const threadQuery = query(
        collection(db, "Threads"),
        where("saleOfferId", "==", search.id),
        where("participants", "array-contains", user?.userId)
      );
      const threadsSnapshot = await getDocs(threadQuery);
      const threadsData = threadsSnapshot.docs.map((doc) => ({
        threadId: doc.id,
        ...doc.data(),
      }));

      setThreads(threadsData);
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    const fetchBuyersAndMessages = async () => {
      const buyers = await Promise.all(
        threads.map(async (thread) => {
          const buyerId = thread.participants.filter((v: string) => v !== user?.userId)[0];
          const buyer = await getUserById(buyerId);
          return buyer[0];
        })
      );

      setBuyers(buyers);

      const latestMessages = await Promise.all(
        threads.map(async (thread) => {
          const messagesQuery = query(
            collection(db, "Messages"),
            where("threadId", "==", thread.threadId),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          const latestMessage = messagesSnapshot.docs[0]?.data() || {};
          return {
            ...latestMessage,
            threadId: thread.threadId,
            isRead: latestMessage.readBy?.seller || false,
          };
        })
      );

      setLatestMessages(latestMessages);
    };

    if (threads.length) {
      fetchBuyersAndMessages();
    }
  }, [threads]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="bg-[#EEE] flex-1 px-4">
        <Text className="text-2xl font-bold my-4">Messages</Text>
        {saleOffer && (
          <TouchableOpacity className="bg-[#D1D5DB] h-16 rounded-lg flex-row space-x-2" onPress={() => router.back()}>
            {/* IMAGE */}
            <Image
              source={
                saleOffer.images && saleOffer.images.length > 0
                  ? { uri: saleOffer.images[0] }
                  : require("../../../assets/images/No-Image.png")
              }
              className="w-16 h-16 rounded-tl-lg rounded-bl-lg rounded-br-[17px]"
            />
            <View className="flex-row justify-between flex-1 px-2 items-center">
              <View className="">
                <Text className="text-base font-medium">{saleOffer.title}</Text>
                <Text className="text-sm font-light">
                  {saleOffer.cityInfo?.zipCode} {saleOffer.cityInfo?.city}
                </Text>
              </View>
              <View>
                <Text className="text-sm font-medium">{formatCurrencyDA(saleOffer.price)}</Text>
                <Text className="text-sm font-light">
                  {saleOffer.createdAt && new Date(formatFirebaseDate(saleOffer.createdAt)).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* hr */}
        <View className="border-b-[0.8px] border-gray-400 my-4"></View>

        <ScrollView className="flex-1">
          {!threads.length ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-xl font-medium">No messages yet</Text>
            </View>
          ) : (
            <View className="flex-1">
              <Text className="text-lg font-light mb-2">
                You have {threads.length} {threads.length > 1 ? "threads" : "thread"}
              </Text>
              {threads.map((thread, index) => (
                <TouchableOpacity
                  key={thread.threadId}
                  className="bg-[#dcdfe4] h-16 rounded-lg flex-row space-x-2 items-center px-4 mb-2"
                  onPress={() =>
                    router.push({
                      pathname: `/thread/${thread.saleOfferId}`,
                      params: {
                        sellerId: user?.userId,
                        senderId: thread.participants.filter((v: string) => v != user?.userId)[0],
                      },
                    })
                  }
                >
                  <View className="flex-row space-x-2 items-center">
                    <Image
                      source={
                        buyers[index]?.profileUrl
                          ? { uri: buyers[index]?.profileUrl }
                          : require("../../../assets/images/No-Image.png")
                      }
                      className="w-12 h-12 rounded-full"
                    />
                    <View className="space-y-1 flex-1">
                      <Text className="font-medium">
                        {buyers[index]?.firstName} {buyers[index]?.lastName}
                      </Text>
                      <Text className="text-sm text-gray-600">Latest message: {latestMessages[index]?.text || ""}</Text>
                    </View>
                    {!latestMessages[index]?.isRead && <View className="w-3 h-3 bg-red-500 rounded-full"></View>}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
