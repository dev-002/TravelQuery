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

export default function Plan_Tab({ navigation }) {
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
        <Text className="text-4xl text-[#0B646B] font-bold">
          Bookings <FontAwesome name="users" size={30} />
        </Text>
      </View>

      <ScrollView>
        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : (
          travelPlan?.map((data, i) => (
            <View
              key={i}
              className="w-[90%] py-1 px-2 m-2 mx-auto border rounded-xl"
            >
              <View className="w-[70%] flex-row items-center">
                <Text className="font-bold text-xl text-blue-500">
                  Plan Name: {data?.name}
                </Text>
              </View>
              <Text className="text-lg text-blue-800">
                Member Details: {data.members.length}
              </Text>

              {data?.members &&
                data.members.map((m, index) => (
                  <View key={index} className="my-2 flex border-y">
                    <Text className="text-xl">Member No-{index + 1}</Text>
                    <Text className="text-base font-bold text-[#074173]">
                      Member name: <Text className="font-normal">{m.name}</Text>
                    </Text>
                    <Text className="text-base font-bold text-[#3C5B6F]">
                      Member Gender:{" "}
                      <Text className="font-normal">
                        {m.gender == 1 ? "Male" : "Female"}
                      </Text>
                    </Text>
                    <Text className="text-base font-bold text-[#074173]">
                      Mobile No: <Text className="font-normal">{m.mobile}</Text>
                    </Text>
                  </View>
                ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
