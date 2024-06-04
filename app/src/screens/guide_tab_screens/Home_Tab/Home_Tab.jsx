import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar, NotFound } from "../../../../assets/index";

import { useFocusEffect } from "@react-navigation/native";

export default function Discover_Tab({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [travelPlans, setTravelPlans] = useState([]);
  const [quote, setQuote] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchTravels() {
        try {
          setLoading(true);

          const response = await axios.get(URL.Guide.fetchTravelPlans, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });

          if (response.status === 200) {
            setTravelPlans(response.data?.travelplans);
            setInterval(() => setLoading(false), 2000);
          }
        } catch (err) {
          console.log("Error while fetching plans", err);
          Alert.alert("Error fetching plans");
          setLoading(false);
        }
      }

      async function fetchQuotes() {
        try {
          setLoading(true);
          const response = await axios.get(URL.Guide.quoteGen, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });
          if (response.status === 200) {
            setLoading(false);
            setQuote(response.data.quote);
          }
        } catch (err) {
          console.log("Error while fetching quote", err);
          setLoading(false);
        }
      }

      fetchQuotes();
      fetchTravels();

      return () => {
        // cleanup logic if needed
      };
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-8">
        <View>
          <Text className="text-[40px] text-[#0B646B] font-bold">Explore</Text>
          <Text className="text-[#527283] text-[36px]">the travels</Text>
        </View>

        <View className="w-12 h-12 bg-gray-400 rounded-md items-center justify-center shadow-lg">
          <Image
            source={Avatar}
            className="w-full h-full rounded-md object-cover"
          />
        </View>
      </View>

      {/* Menu Container */}
      {loading ? (
        <View className=" flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0B646B" />
        </View>
      ) : (
        <ScrollView>
          <View>
            <View className="flex-row items-center justify-between px-4 mt-8">
              <Text className="text-[#2C7379] text-[28px] font-bold">
                Tips for Safety
              </Text>
            </View>

            <View className="px-4 mt-8 flex-row items-center justify-evenly flex-wrap">
              <Text className="text-base text-wrap">{quote && quote}</Text>
            </View>
          </View>

          <View>
            <View className="flex-row items-center justify-between px-4 mt-8">
              <Text className="text-[#2C7379] text-[28px] font-bold">
                Upcoming Travels
              </Text>
            </View>

            <View>
              <View className="px-4 mt-8 flex-wrap">
                {travelPlans?.length > 0 ? (
                  travelPlans?.map((data, i) => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Guide_PlanDetail", {
                          travelPlan: data,
                        });
                      }}
                      key={i}
                      className="w-full p-1 my-2 bg-blue-600/40 border rounded-lg"
                    >
                      <View className="py-1 px-2 bg-gray-100 border rounded-xl">
                        <View className="w-[70%] flex-row items-center">
                          <Text className="font-bold text-xl text-[#050C9C]">
                            {data?.name}
                          </Text>
                        </View>

                        <Text className="text-lg text-blue-800">
                          Plan Details{" "}
                        </Text>
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
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="mt-5 w-full items-center space-y-8 justify-center">
                    <Image
                      source={NotFound}
                      className=" w-24 h-24 object-cover"
                    />
                    <Text className="text-2xl text-[#428288] font-semibold">
                      Opps...Currently No Travel
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
