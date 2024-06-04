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
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { Avatar } from "../../../../assets/index";
import { useFocusEffect } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile_Tab({ navigation }) {
  // states
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState(NaN);
  const [travelPlan, setTravelPlan] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  function NameSplit(name) {
    const splitName = name?.split(" ");
    const fName = splitName?.[0] || "";
    const lName = splitName?.[splitName.length - 1] || "";
    const mName = splitName?.slice(1, -1).join(" ") || "";
    return [fName, mName, lName];
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

          if (response.status == 200) {
            setLoading(false);
            const res = NameSplit(response?.data?.user?.name);
            setFirstName(res[0]);
            setMiddleName(res[1]);
            setLastName(res[2]);
            setMobile(response.data?.user.mobile?.toString());
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

  async function handleUpdate() {
    try {
      setLoading(true);
      const response = await axios.put(
        URL.Profile.updateProfile,
        {
          name: `${firstName}${middleName ? `${middleName} ` : " "}${lastName}`,
          mobile,
          gender,
        },
        { headers: { token: await AsyncStorage.getItem("token") } }
      );
      if (response.status === 200) {
        navigation.navigate("Profile_Tab");
        setLoading(false);
      }
    } catch (err) {
      console.log("Error while updating profile", err);
      Alert.alert("Error while updating profile");
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="mt-6 flex-row items-center justify-between px-8">
        <View className="w-[40%]">
          <Text className="text-4xl text-[#0B646B] font-bold">Profile</Text>
        </View>

        <View className="mt-6 w-[50%] h-32 flex justify-center rounded-md items-center justify-center shadow-lg">
          <Image
            source={Avatar}
            className="w-full h-full rounded-md object-cover"
          />
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
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                placeholder="First Name"
                className="py-2 px-4 text-md border rounded-lg"
              />
              <TextInput
                value={middleName}
                onChangeText={(text) => setMiddleName(text)}
                placeholder="Middle Name"
                className="py-2 px-4 text-md border rounded-lg"
              />
              <TextInput
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                placeholder="Last Name"
                className="py-2 px-4 text-md border rounded-lg"
              />
            </View>

            <View className="w-full my-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Mobile No :</Text>
              <TextInput
                value={mobile}
                placeholder="Mobile"
                className="w-2/3 py-2 px-4 border rounded-lg"
                keyboardType="numeric"
                onTextChange={(text) => setMobile(text)}
                // maxLength={10}
              />
            </View>

            <View className="mw-full y-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Gender :</Text>

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={[
                  { label: "Male", value: 1 },
                  { label: "Female", value: 2 },
                ]}
                className="w-2/3 m-1 p-1 py-2 px-4 bg-gray-500 text-black border-b rounded-lg"
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={getGender(gender)}
                value={gender}
                onChange={(item) => setGender(item?.value)}
              />
            </View>

            <View className="w-[80%] py-1 px-4 mx-4 rounded-xl shadow-lg">
              <TouchableOpacity
                className="mt-2 w-full rounded-md"
                onPress={() => handleUpdate()}
              >
                <Text className="p-2 bg-yellow-500 text-base text-center rounded-lg">
                  Update Profile
                </Text>
              </TouchableOpacity>
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
                <View className="my-2 mb-28">
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
                              {list.name?.length > 25
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

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "white",
  },
});
