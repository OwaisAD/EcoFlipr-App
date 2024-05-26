import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView, Keyboard } from "react-native";
import { Text } from "../../../components/Themed";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { getUserById } from "../../../helperMethods/user.methods";
import { useAuth } from "../../../context/authContext";

interface UserType {
  userId: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
}

const ios = Platform.OS === "ios";

export default function Thread() {
  const search = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [sellerData, setSellerData] = useState<UserType | null>(null);
  const [buyerData, setBuyerData] = useState<UserType | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (search.sellerId) {
        const sellerId = search.sellerId as string;
        const seller = await getUserById(sellerId);
        setSellerData(seller[0]);
      }
    };

    fetchSellerData();
  }, [search.sellerId]);

  useEffect(() => {
    const fetchBuyerData = async () => {
      if (search.senderId) {
        const buyerId = search.senderId as string;
        const buyer = await getUserById(buyerId);
        setBuyerData(buyer[0]);
      }
    };

    fetchBuyerData();
  }, [search.senderId]);

  useEffect(() => {
    const threadQuery = query(
      collection(db, "Threads"),
      where("saleOfferId", "==", search.id),
      where("participants", "array-contains", search.senderId)
    );

    const unsubscribeThread = onSnapshot(threadQuery, (snapshot) => {
      if (!snapshot.empty) {
        const threadDoc = snapshot.docs[0];
        setThreadId(threadDoc.id);

        const messagesQuery = query(
          collection(db, "Messages"),
          where("threadId", "==", threadDoc.id),
          orderBy("createdAt", "asc")
        );

        const unsubscribeMessages = onSnapshot(messagesQuery, (messageSnapshot) => {
          const fetchedMessages = messageSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(fetchedMessages);
        });

        return () => unsubscribeMessages();
      }
    });

    return () => unsubscribeThread();
  }, [search.id, search.senderId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      let threadIdToUse = threadId;

      if (!threadIdToUse) {
        const threadQuery = query(
          collection(db, "Threads"),
          where("saleOfferId", "==", search.id),
          where("participants", "array-contains", search.senderId)
        );
        const threadSnapshot = await getDocs(threadQuery);

        if (!threadSnapshot.empty) {
          const threadDoc = threadSnapshot.docs[0];
          threadIdToUse = threadDoc.id;
          setThreadId(threadIdToUse);
        } else {
          const newThreadRef = await addDoc(collection(db, "Threads"), {
            saleOfferId: search.id,
            participants: [search.senderId, search.sellerId],
          });
          threadIdToUse = newThreadRef.id;
          setThreadId(threadIdToUse);
        }
      }

      await addDoc(collection(db, "Messages"), {
        threadId: threadIdToUse,
        senderId: user?.userId,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        readBy: user?.userId === buyerData?.userId ? { seller: false, buyer: true } : { seller: true, buyer: false },
      });
      setNewMessage("");
    }
  };

  const markMessageAsRead = async (messageId: string, readBy: any) => {
    if (user?.userId) {
      const updatedReadBy = {
        ...readBy,
        [user.userId === buyerData?.userId ? "buyer" : "seller"]: true,
      };

      const messageRef = doc(db, "Messages", messageId);
      await updateDoc(messageRef, { readBy: updatedReadBy });
    }
  };

  useEffect(() => {
    messages.forEach((message) => {
      if (
        (user?.userId === buyerData?.userId && !message.readBy?.buyer) ||
        (user?.userId === sellerData?.userId && !message.readBy?.seller)
      ) {
        markMessageAsRead(message.id, message.readBy);
      }
    });
  }, [messages]);

  return (
    <KeyboardAvoidingView behavior={ios ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={80}>
      <View className="flex-1 bg-[#eee]">
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          {messages.map((message) => (
            <View key={message.id} className="mb-2">
              <View
                className={`mb-1 px-4 py-2 rounded-2xl max-w-[300px] ${
                  message.senderId === user?.userId ? "self-end bg-blue-500" : "self-start bg-gray-200"
                }`}
              >
                <Text
                  className={`text-base ${message.senderId === user?.userId ? "text-white" : "text-black"}`}
                  selectable
                >
                  {message.text}
                </Text>
              </View>
              <Text
                className={`text-[10px] font-light ${message.senderId === user?.userId ? "self-end" : "self-start"}`}
              >
                {message.senderId === user?.userId
                  ? "You"
                  : `${buyerData?.userId === user?.userId ? sellerData?.firstName : buyerData?.firstName}`}{" "}
                at {message.createdAt && new Date(message.createdAt.toDate()).toLocaleString("da-DK")}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View className="px-2 pt-4 pb-8 bg-[#eee]" style={{ borderTopWidth: 0.6, borderColor: "#ccc" }}>
          <View className="flex-row items-center space-x-2">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message"
              className="flex-1 p-2 border border-gray-300 rounded-2xl"
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity onPress={handleSendMessage} className="bg-blue-500 p-2 rounded">
              <Text className="text-white">Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
