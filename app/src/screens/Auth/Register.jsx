import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

// components
import Background from "./components/Background";
import User_Register from "./components/User_Register";
import Guide_Register from "./components/Guide_Register";

export default function Register({ navigation }) {
  // User Data
  const [isGuideLogin, setIsGuideLogin] = useState(false);
  const [role, setRole] = useState(2);

  return (
    <Background>
      <ScrollView class="w-full flex-1">
        <View className="flex-1 w-full items-center">
          <TouchableOpacity
            onPress={() => {
              if (role === 2) setRole(3);
              else if (role === 3) setRole(2);
              setIsGuideLogin(!isGuideLogin);
            }}
          >
            <Text className="my-8 font-bold text-4xl text-white">
              {isGuideLogin ? "Guide Register" : "User Register"}
            </Text>
          </TouchableOpacity>

          <View className="mx-auto pt-6 w-full h-full bg-white items-center rounded-tl-[100] rounded-tr-[100]">
            <Text className="text-darkGreen font-bold text-xl">
              Create a new account
            </Text>

            {isGuideLogin ? (
              <Guide_Register role={role} setRole={setRole} />
            ) : (
              <User_Register role={role} setRole={setRole} />
            )}

            <View className="mb-6 flex-row justify-center items-center">
              <Text className="font-bold text-lg">
                Already have an account?{"  "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                className=""
              >
                <Text className="text-darkGreen font-bold text-lg">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Background>
  );
}
