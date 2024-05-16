import React from "react";
import { View, ImageBackground } from "react-native";
import { Leaves } from "../../../../assets";
import { StatusBar } from "expo-status-bar";

const Background = ({ children }) => {
  return (
    <View>
      <StatusBar style="light" />
      <ImageBackground source={Leaves} className="h-full" />
      <View className="w-full absolute">{children}</View>
    </View>
  );
};

export default Background;
