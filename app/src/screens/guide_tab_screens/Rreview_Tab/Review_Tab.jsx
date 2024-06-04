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

export default function Review_Tab({ navigation }) {
  // states
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(NaN);

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
          const response = await axios.get(URL.Guide.fetchReviews, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });

          if (response.status == 200) {
            setLoading(false);
            setReviews(response.data?.reviews);
            setRating(response.data?.rating);
          }
        } catch (err) {
          setLoading(false);
          Alert.alert("Error fetching reviews");
          console.log("Error fetching reviews", err);
        }
      }

      dataFetch();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="mt-6 flex-row items-center justify-between px-8">
        <View className="w-[70%]">
          <Text className="text-3xl text-[#0B646B] font-bold">
            Let's Review
          </Text>
        </View>
      </View>

      {/* Profile Container */}
      {loading ? (
        <View className=" flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0B646B" />
        </View>
      ) : (
        <ScrollView>
          <View className="w-full px-4 mt-8 flex justify-center flex-wrap">
            <View className="w-full my-2 flex-row justify-evenly items-center">
              <Text className="text-xl font-bold text-blue-500">
                Overall Rating:
              </Text>
              <Text className="text-base text-2xl">{rating}</Text>
            </View>

            <View className="flex">
              <Text className="text-2xl text-center font-bold text-[#0B646B]">
                Reviews
              </Text>
              <View className="my-2 flex justify-start border rounded-xl">
                {reviews && reviews.length > 0 ? (
                  reviews.map((plan, index) => (
                    <View
                      key={index}
                      className="my-2 py-1 px-2 flex-row items-start"
                    >
                      <Text className="mx-4 text-base align-start">
                        {index + 1}
                        {" )"}
                      </Text>
                      <View>
                        <Text className="text-lg">
                          Rating: {plan.rating?.toString()}
                        </Text>
                        <Text className="text-base py-2">{plan.comment}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text className="text-xl font-bold">
                    No Reviews Yet.... 🤔
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
