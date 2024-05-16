import { Text, TouchableOpacity } from "react-native";
import React from "react";

export default function Btn({ disabled, bgColor, btnLabel, textColor, Press }) {
  return (
    <TouchableOpacity
      disabled={!disabled}
      onPress={Press}
      className={`mx-auto w-[80%] my-1 py-4 items-center rounded-full`}
      style={{
        backgroundColor: bgColor == "" ? "black" : bgColor,
        opacity: bgColor == "" ? 0.6 : 1,
      }}
    >
      <Text className={`text-${textColor} text-lg font-bold`}>{btnLabel}</Text>
    </TouchableOpacity>
  );
}
