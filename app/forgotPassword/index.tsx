import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Alert, Image, ImageBackground, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import Loading from "../../components/Loading";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import { openBrowserAsync } from "expo-web-browser";
import { ZodError } from "zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { z } from "zod";

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef("");

  const handlePassWordReset = async () => {
    try {
      if (!emailRef.current) {
        Alert.alert("Reset password", "Please enter a valid email");
        return;
      }

      setLoading(true);

      // validate with ZOD
      z.string().email("Please enter a valid email address").parse(emailRef.current);

      // login process
      const response = await sendPasswordResetEmail(auth, emailRef.current)
        .then(() => {
          router.push("/signin/");
          Alert.alert("Password reset", "Password reset email sent successfully 🚀");
        })
        .catch((error) => {
          Alert.alert("Password reset", error.message);
        });
      setLoading(false);

      //   if (!response.success) {
      //     Alert.alert("Sign in", response.msg);
      //   }
    } catch (error) {
      setLoading(false);
      if (error instanceof ZodError) {
        Alert.alert("Password reset", error.errors[0].message);
      }
    }
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
            <Text className="text-4xl font-normal">Forgot password</Text>
            <Image
              source={require("../../assets/images/ecoflipr-logo-black.png")}
              style={{ width: wp("50%"), height: hp("10%"), resizeMode: "contain" }}
              height={100}
              width={100}
            />
          </View>

          {/* BOTTOM */}
          <View className="space-y-2">
            <View className="items-center justify-center mx-8 mt-8 space-y-4 bg-[#D1D5DB] p-4 rounded-xl">
              <Text className="text-base font-light">
                No worries. We'll send you a link where you can reset your password.
              </Text>
              {/* email input */}
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
                    autoCapitalize="none"
                  />
                </View>

                {/* submit btn */}
                {loading ? (
                  <View className="flex-row justify-center">
                    <Loading size={hp(8)} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handlePassWordReset}
                    style={{ height: hp(6.5) }}
                    className="bg-indigo-500 rounded-xl justify-center items-center"
                  >
                    <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                      Send
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </CustomKeyboardView>
    </ImageBackground>
  );
}
