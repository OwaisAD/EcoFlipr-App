import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import Loading from "../../components/Loading";
import CustomKeyboardView from "../../components/CustomKeyboardView";

export default function SignIn() {
  const router = useRouter();
  const [signInWithEmail, setSignInWithEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign in", "Please fill in all fields");
      return;
    }

    // validate with ZOD

    // login process
  };

  return (
    <ImageBackground
      source={require("../../assets/images/auth-background.png")}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <CustomKeyboardView>
        <StatusBar style="dark" />
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
          <View className="mx-8" style={{ paddingBottom: signInWithEmail ? 0 : hp(8) }}>
            <Text style={{ fontSize: hp(2.7) }} className="text-center text-3xl font-semibold">
              Flipping the market in favor of the planet. Sign in and make eco-friendly choices.
            </Text>
          </View>

          {/* BOTTOM */}
          <View className="space-y-2">
            <View className="items-center justify-center mx-8 mt-8 space-y-4 bg-[#D1D5DB] p-4 rounded-xl">
              {/* sign in with email btn */}

              {signInWithEmail ? (
                <>
                  {/* sign in with email form */}
                  <View className="w-full space-y-4">
                    {/* inputs */}
                    <View
                      style={{ height: hp(7) }}
                      className="flex-row space-x-5 px-4 bg-neutral-100 items-center rounded-2xl"
                    >
                      <Octicons name="mail" size={hp(2.7)} color="gray" />
                      <TextInput
                        onChangeText={(text) => (emailRef.current = text)}
                        style={{ fontSize: hp(2) }}
                        className="flex-1 font-semibold text-neutral-700"
                        placeholder="Email address"
                        placeholderTextColor={"gray"}
                      />
                    </View>
                    <View className="space-y-2">
                      <View
                        style={{ height: hp(7) }}
                        className="flex-row space-x-5 px-4 bg-neutral-100 items-center rounded-2xl"
                      >
                        <Octicons name="lock" size={hp(2.7)} color="gray" />
                        <TextInput
                          onChangeText={(text) => (passwordRef.current = text)}
                          secureTextEntry
                          style={{ fontSize: hp(2) }}
                          className="flex-1 font-semibold text-neutral-700"
                          placeholder="Password"
                          placeholderTextColor={"gray"}
                        />
                      </View>
                      <TouchableOpacity>
                        <Text style={{ fontSize: hp(1.6) }} className="font-semibold text-right text-neutral-500">
                          Forgot password?
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* submit btn */}
                    {loading ? (
                      <View className="flex-row justify-center">
                        <Loading size={hp(8)} />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={handleLogin}
                        style={{ height: hp(6.5) }}
                        className="bg-indigo-500 rounded-xl justify-center items-center"
                      >
                        <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                          Sign In
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              ) : (
                <Pressable className="bg-[#101827] p-4 rounded-xl w-full" onPress={() => setSignInWithEmail(true)}>
                  <Text className="text-white text-center text-base font-medium">Sign in with email</Text>
                </Pressable>
              )}

              <Text className="font-medium text-sm">Or continue with</Text>

              <View className="flex-row w-full space-x-4">
                {/* sign in with google btn */}
                <TouchableOpacity className="bg-[#6B7280] p-4 rounded-xl flex-1 flex-row items-center justify-center space-x-2">
                  <AntDesign name="google" size={24} color="white" />
                  <Text className="text-white text-center text-base font-medium">Google</Text>
                </TouchableOpacity>

                {/* sign in with facebook btn */}
                <TouchableOpacity className="bg-[#6B7280] p-4 rounded-xl flex-1 flex-row items-center justify-center space-x-2">
                  <AntDesign name="facebook-square" size={24} color="white" />
                  <Text className="text-white text-center text-base font-medium">Facebook</Text>
                </TouchableOpacity>
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
      </CustomKeyboardView>
    </ImageBackground>
  );
}
