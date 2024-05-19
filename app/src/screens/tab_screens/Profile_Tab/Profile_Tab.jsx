import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { Avatar } from "../../../../assets/index";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile_Tab({ navigation }) {
  // states
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState(NaN);
  const [gender, setGender] = useState(NaN);
  const [travelPlan, setTravelPlan] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  function NameSplit(name) {
    const splitName = name?.split(" ");
    const firstName = splitName?.[0] || "";
    const lastName = splitName?.[splitName.length - 1] || "";
    const middleName = splitName?.slice(1, -1).join(" ") || "";
    return [firstName, middleName, lastName];
  }

  function getGender(gender) {
    switch (gender) {
      case 1:
        return "Male";
      case 2:
        return "Female";
      case 3:
        return "Other";
      default:
        return "Other";
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function dataFetch() {
        try {
          setLoading(true);
          const response = await axios.get(URL.Profile.getProfile, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });

          console.log(response.data);
          if (response.status == 200) {
            setLoading(false);
            setName(response.data?.user.name);
            setMobile(response.data?.user.mobile);
            setGender(response.data?.user.gender);
            setTravelPlan(response.data?.user.travelPlan);
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

          console.log(response.data);
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

  async function handleLogout() {
    await AsyncStorage.multiRemove(["token", "role"]);
    navigation.replace("Login");
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="mt-6 flex-row items-center justify-between px-8">
        <View className="w-[40%]">
          <Text className="text-4xl text-[#0B646B] font-bold">Profile</Text>
        </View>

        <View className="mt-6 w-[50%] h-24 bg-gray-400 flex justify-center rounded-md items-center justify-center shadow-lg">
          <Image
            source={Avatar}
            className="w-full h-full rounded-md object-cover"
          />
          <TouchableOpacity
            className="w-full rounded-md"
            onPress={() => console.log("avatar updated")}
          >
            <Text className="p-2 bg-blue-500 text-white text-center rounded-b-lg">
              Update Avatar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center bg-white mx-4 rounded-xl py-1 px-4 shadow-lg mt-4">
        <TouchableOpacity
          className="mt-2 w-full rounded-md"
          onPress={() => handleLogout()}
        >
          <Text className="p-2 bg-red-500 text-white text-center rounded-b-lg">
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Container */}
      {loading ? (
        <View className=" flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0B646B" />
        </View>
      ) : (
        <ScrollView>
          <View className="w-full px-4 mt-8 flex items-center justify-center flex-wrap">
            <View className="w-full my-2 flex-row items-center justify-evenly">
              <TextInput
                value={NameSplit(name)[0]}
                placeholder="First Name"
                className="py-2 px-4 text-md border rounded-lg"
              />
              <TextInput
                value={NameSplit(name)[1]}
                placeholder="Middle Name"
                className="py-2 px-4 text-md border rounded-lg"
              />
              <TextInput
                value={NameSplit(name)[2]}
                placeholder="Last Name"
                className="py-2 px-4 text-md border rounded-lg"
              />
            </View>

            <View className="w-full my-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Mobile No :</Text>
              <TextInput
                value={mobile.toString()}
                placeholder="Mobile"
                className="w-2/3 py-2 px-4 border rounded-lg"
                keyboardType="numeric"
                onTextChange={(text) => setMobile(text)}
                maxLength={10}
              />
            </View>

            <View className="mw-full y-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Gender :</Text>
              <TextInput
                value={getGender(gender)}
                placeholder="Gender"
                className="w-2/3 py-2 px-4 border rounded-lg"
                onTextChange={(text) => {
                  text = text?.toLowerCase();
                  switch (text) {
                    case "male": {
                      setGender(1);
                      break;
                    }
                    case "female": {
                      setGender(2);
                      break;
                    }
                    default:
                      setGender(3);
                  }
                }}
              />
            </View>

            <View>
              <View className="w-full px-2 mt-8 flex-row justify-between">
                <Text className="text-[#2C7379] text-xl font-bold">
                  Previous Travels
                </Text>
                <TouchableOpacity className="flex-row items-center justify-center space-x-2">
                  <FontAwesome
                    name="long-arrow-right"
                    size={40}
                    color="#A0C4C7"
                  />
                </TouchableOpacity>
              </View>

              <View className="my-2 flex-row justify-evenly">
                <View className="my-2 mb-28 flex-row justify-evenly">
                  {travelPlan && travelPlan.length > 0 ? (
                    travelPlan.map((list, i) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("PlanDesctiption", {
                            id: list._id,
                          })
                        }
                        className="m-1 p-2 flex-row items-center justify-between bg-[#ded] rounded-lg"
                        key={i}
                      >
                        <Text className="w-[20%] text-base">{i + 1}</Text>

                        {list.name && (
                          <View className="w-[80%]">
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
                                {list?.placesVisited?.map((p) =>
                                  p?.name?.length > 18
                                    ? `${p?.name.slice(0, 18)}..`
                                    : p?.name
                                )}
                              </Text>
                            </View>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text className="text-base">No Travel Plans Yet....</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
