import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";

export default function SignIn() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="dark" />
      <ImageBackground
        source={require("../../assets/images/auth-background.png")}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View className="flex-1 w-full">
          {/* TOP */}
          <View style={{ paddingTop: hp(8), paddingLeft: wp(5), paddingBottom: hp(10) }}>
            <Text className="text-4xl font-normal">Welcome to</Text>
            <Image
              source={require("../../assets/images/ecoflipr-logo-black.png")}
              style={{ width: wp("50%"), height: hp("10%"), resizeMode: "contain" }}
              height={100}
              width={100}
            />
          </View>

          {/* MIDDLE */}
          <View className="mx-8" style={{ paddingBottom: hp(10) }}>
            <Text className="text-center text-3xl font-semibold">
              Flipping the market in favor of the planet. Sign in and make eco-friendly choices.
            </Text>
          </View>

          {/* BOTTOM */}
          <View className="space-y-2">
            <View className="items-center justify-center mx-8 mt-8 space-y-4 bg-[#D1D5DB] p-4 rounded-xl">
              {/* sign in with email btn */}

              <Pressable className="bg-[#101827] p-4 rounded-xl w-full" onPress={() => router.push("/signin/signInWithEmail")}>
                <Text className="text-white text-center text-base font-medium">Sign in with email</Text>
              </Pressable>

              <Text className="font-medium text-sm">Or continue with</Text>

              <View className="flex-row w-full space-x-4">
                {/* sign in with google btn */}
                <View className="bg-[#6B7280] p-4 rounded-xl flex-1 flex-row items-center justify-center space-x-2">
                  <AntDesign name="google" size={24} color="white" />
                  <Text className="text-white text-center text-base font-medium">Google</Text>
                </View>

                {/* sign in with facebook btn */}
                <View className="bg-[#6B7280] p-4 rounded-xl flex-1 flex-row items-center justify-center space-x-2">
                  <AntDesign name="facebook-square" size={24} color="white" />
                  <Text className="text-white text-center text-base font-medium">Facebook</Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-center justify-center space-x-1">
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold">
                Don't have an account?
              </Text>
              <Pressable onPress={() => router.push("/signup/")}>
                <Text style={{ fontSize: hp(1.8) }} className="text-indigo-500 font-bold">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>

          {/* <View className="flex-1 items-center justify-center">
            <Text className="text-white text-center text-sm font-medium mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View> */}
        </View>
      </ImageBackground>
    </>
  );
}
