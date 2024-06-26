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
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Wishlist_Tab({ navigation }) {
  // states
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
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
          const response = await axios.get(URL.Profile.fetchWishlist, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });
          if (response.status == 200) {
            setWishlist(response.data?.wishlist);
            // setTravelPlan(response.data?.user.travelPlan);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          Alert.alert("Error fetching profile");
          console.log("Error fetching profile", err);
        }
      }

      async function fetchPlans() {
        try {
          const response = await axios.get(URL.TravelPlan.getAllTravelPlan, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });

          if (response.status === 200) {
            setTravelPlan(response.data?.travelPlans);
          }
        } catch (err) {
          console.log("Error while fetching", err);
        }
      }

      fetchPlans();
      dataFetch();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="mt-6 flex-row items-center justify-between px-8">
        <View className="w-[40%]">
          <Text className="text-4xl text-[#0B646B] font-bold">Wishlist</Text>
        </View>
      </View>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : wishlist.length > 0 ? (
          wishlist.map((list, i) => (
            <View
              key={i}
              className="flex-row items-center bg-white mx-4 rounded-xl py-1 px-4 shadow-lg mt-4 border-x"
            >
              <TouchableOpacity
                className="mt-2 w-full rounded-md"
                onPress={() =>
                  navigation.navigate("ItemScreen", { param: list })
                }
              >
                <Image
                  source={{
                    uri:
                      list.images?.length > 0
                        ? list.images[0]
                        : "https://img.freepik.com/free-photo/reflection-lights-mountain-lake-captured-parco-ciani-lugano-switzerland_181624-24209.jpg?t=st=1715741152~exp=1715744752~hmac=75d09c631a9f9afd43382409981c71c0c2068ace223c2f523807ab999a1d1a88&w=1380",
                  }}
                  className="w-full h-28 rounded-md object-cover"
                />

                {list.name ? (
                  <>
                    <Text className="text-[#428288] text-[18px] font-bold">
                      {list.name?.length > 14
                        ? `${list.name.slice(0, 14)}..`
                        : list.name}
                    </Text>

                    <View className="flex-row items-center space-x-1">
                      <FontAwesome
                        name="map-marker"
                        size={20}
                        color="#8597A2"
                      />
                      <Text className="text-[#428288] text-[14px] font-bold">
                        {list.address?.length > 18
                          ? `${list.name.slice(0, 18)}..`
                          : list.address}
                      </Text>
                    </View>
                  </>
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="mx-auto w-2/3 text-lg text-center my-2 pb-3 border-b border-dashed">
            Empty wishlist{" "}
            <MaterialCommunityIcons name="bucket-outline" size={20} />
          </Text>
        )}

        <View>
          <View className="w-full px-2 mt-8 flex-row justify-between">
            <Text className="text-[#2C7379] text-xl font-bold">Travels</Text>
            <TouchableOpacity className="flex-row items-center justify-center space-x-2">
              <FontAwesome name="long-arrow-right" size={40} color="#A0C4C7" />
            </TouchableOpacity>
          </View>

          <View className="my-2 mb-24">
            {travelPlan && travelPlan.length > 0 ? (
              travelPlan.map((list, index) => (
                <View className="m-1 p-5 border-1" key={index}>
                  <Image
                    source={{
                      uri:
                        list.images?.length > 0
                          ? list.images[0]
                          : "https://img.freepik.com/free-photo/reflection-lights-mountain-lake-captured-parco-ciani-lugano-switzerland_181624-24209.jpg?t=st=1715741152~exp=1715744752~hmac=75d09c631a9f9afd43382409981c71c0c2068ace223c2f523807ab999a1d1a88&w=1380",
                    }}
                    className="w-full h-24 rounded-md object-cover"
                  />
                  <View className="flex-row items-center justify-between">
                    {list.name ? (
                      <View>
                        <Text className="text-[#428288] text-lg font-bold">
                          {list.name?.length > 14
                            ? `${list.name.slice(0, 14)}..`
                            : list.name}
                        </Text>

                        <View className="flex-row items-center space-x-1">
                          <FontAwesome
                            name="map-marker"
                            size={20}
                            color="#8597A2"
                          />
                          <Text className="text-[#428288] text-base font-bold">
                            {list?.placesVisited?.map((p) =>
                              p?.name?.length > 18
                                ? `${p?.name.slice(0, 18)}..`
                                : p?.name
                            )}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <></>
                    )}

                    <View>
                      <Text className="text-[#8597A2]">
                        {" "}
                        Total Budget: {list.totalBudget}
                      </Text>
                      <Text className="text-[#8597A2]">
                        {" "}
                        Trip Days: {list.totalTripDays}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text>No Travel Plans Yet....</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
