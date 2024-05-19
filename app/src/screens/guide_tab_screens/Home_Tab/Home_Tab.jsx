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
  const [areas, setAreas] = useState([]);
  const [travelPlans, setTravelPlans] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchGuideArea() {
        try {
          setLoading(true);

          const response = await axios.get(URL.Guide.fetchGuideArea, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });

          if (response.status === 200) {
            setAreas(response.data?.areas);
            setInterval(() => setLoading(false), 2000);
          }
        } catch (err) {
          console.log("Error while fetching Places", err);
          Alert.alert("Error fetching places");
          setLoading(false);
        }
      }

      async function fetchTravels() {
        try {
          setLoading(true);

          const response = await axios.get(URL.Guide.fetchTravelPlans, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });

          console.log(response.data);
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

      fetchGuideArea();
      fetchTravels();

      return () => {
        // Add cleanup logic here if needed
      };
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-8">
        <View>
          <Text className="text-[40px] text-[#0B646B] font-bold">Discover</Text>
          <Text className="text-[#527283] text-[36px]">the beauty today</Text>
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
                Top Tips
              </Text>
              <TouchableOpacity className="flex-row items-center justify-center space-x-2">
                <Text className="text-[#A0C4C7] text-[20px] font-bold">
                  Explore
                </Text>
                <FontAwesome
                  name="long-arrow-right"
                  size={24}
                  color="#A0C4C7"
                />
              </TouchableOpacity>
            </View>

            <View className="px-4 mt-8 flex-row items-center justify-evenly flex-wrap">
              {areas?.length > 0 ? (
                areas?.map((data, i) => (
                  <View key={i}>
                    <Text>{data}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-lg text-center"> No area specified</Text>
              )}
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
                    <View key={i} className="w-full">
                      <Text className="font-bold text-lg">{data?.name}</Text>
                      <Text className="text-base">{data?.description}</Text>
                      <Text className="text-base">{data?.totalBudget}</Text>
                      <Text className="text-base">{data?.totalTripDays}</Text>
                    </View>
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
