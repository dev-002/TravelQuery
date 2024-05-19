import React, { useLayoutEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { HeroImage } from "../../assets/index";

export default function Welcome({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="px-6 bg-white flex-1 relative">
      <StatusBar />

      {/* Top Section */}
      <View className="mt-2 flex-row items-center space-x-2">
        <View className="w-16 h-16 bg-black rounded-full items-center justify-center">
          <Text className="text-[#00BCC9] text-xl font-semibold">Travel</Text>
        </View>
        <Text className="text-[#2A2B4B] text-3xl font-semibold">Query</Text>
      </View>

      {/* Intro Section */}
      <View className="z-10 mt-2 space-y-1">
        <Text className="text-[#3C6072] text-[42px]">Enjoy your trip with</Text>
        <Text className="text-[#00BCC9] text-[38px] font-bold">
          Travel Query
        </Text>

        <Text className="text-[#3C6072] text-base">
          Discover your adventure with detailed information, stunning images,
          and amazing places.
        </Text>
        <Text className="text-base">
          Embark on your next adventure with confidence, with TravelQuery!
        </Text>
      </View>

      {/* Action Section */}
      <View className="z-0 w-80 h-80 bg-[#00BCC9] absolute rounded-full bottom-36 -right-36" />
      <View className="z-0 w-80 h-80 bg-[#E99265] absolute rounded-full -bottom-28 -left-36" />

      {/* Image */}
      <View className="flex-1 relative items-center justify-center">
        <Image
          // entering={FadeIn.duration(2000)}
          // style={animatedStyle.opacity}
          source={HeroImage}
          className="w-full h-full object-cover mt-16"
        />

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="w-24 h-24 absolute bottom-20 border-l-2 border-r-2 border-t-4 border-[#00BCC9] rounded-full items-center justify-center"
        >
          <View
            // entering={FadeOut.duration(2000)}
            // style={animatedStyle.circle}
            className="w-20 h-20 items-center justify-center rounded-full bg-[#00BCC9]"
          >
            <Text className="text-gray-200 text-4xl font-semibold">Go</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
