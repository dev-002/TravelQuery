import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Guide_Tab({ navigation }) {
  // states
  const [loading, setLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function dataFetch() {
        try {
          setLoading(true);
          const response = await axios.get(URL.Guide.fetchTravelPlans, {
            headers: {
              all: true,
              token: await AsyncStorage.getItem("token"),
            },
          });
          if (response.status == 200) {
            setTravelPlan(response.data?.travelplans);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          Alert.alert("Error fetching guide");
          console.log("Error fetching guide", err);
        }
      }

      dataFetch();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="my-6 flex items-start justify-between px-8">
        <Text className="text-4xl text-[#0B646B] font-bold">Every</Text>
        <Text className="text-2xl text-[#0B646B]">
          Travel Plan <FontAwesome name="globe" size={30} />
        </Text>
      </View>

      <ScrollView>
        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : (
          travelPlan?.map((data, i) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Guide_PlanDetail", {
                  travelPlan: travelPlan[i],
                });
              }}
              key={i}
              className="w-[90%] py-1 px-2 m-2 mx-auto border rounded-xl"
            >
              <View className="w-[70%] flex-row items-center">
                <Text className="font-bold text-xl text-[#050C9C]">
                  {data?.name}
                </Text>
              </View>
              <Text className="text-lg text-blue-800">Plan Details </Text>
              <View className="flex-row items-center">
                <Text className="text-base font-bold text-[#074173]">
                  Plan Description:{"   "}
                </Text>
                <Text className="text-base text-[#3C5B6F]">
                  {data?.description}
                </Text>
              </View>
              <View className="w-[70%] flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-base font-bold text-[#074173]">
                    Plan Budget:{"   "}
                  </Text>
                  <Text className="text-base text-[#3C5B6F]">
                    {data?.totalBudget}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base font-bold text-[#074173]">
                    Trip Days:{"   "}
                  </Text>
                  <Text className="text-base text-[#3C5B6F]">
                    {data?.totalTripDays}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
