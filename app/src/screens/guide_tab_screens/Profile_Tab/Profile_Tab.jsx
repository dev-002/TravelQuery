import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
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
import { Avatar } from "../../../../assets/index";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";

export default function Profile_Tab({ navigation }) {
  // states
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState(NaN);
  const [gender, setGender] = useState(NaN);
  const [isFocus, setIsFocus] = useState(false);
  const [age, setAge] = useState("");
  const [price_level, setPrice_Level] = useState("");
  const [area, setArea] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      function NameSplit(name) {
        const splitName = name?.split(" ");
        const firstName = splitName?.[0] || "";
        const lastName = splitName?.[splitName.length - 1] || "";
        const middleName = splitName?.slice(1, -1).join(" ") || "";
        return [firstName, middleName, lastName];
      }

      async function dataFetch() {
        try {
          setLoading(true);
          const response = await axios.get(URL.Profile.getProfile, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });

          if (response.status == 200) {
            const [f, m, l] = NameSplit(response.data?.user.name);
            setFirstName(f);
            setMiddleName(m);
            setLastName(l);
            setDescription(response.data?.user.description);
            setAge(response.data?.user.age?.toString());
            setPrice_Level(response.data?.user.price_level?.toString());
            let areaArr = response.data?.user.area;
            let areaText = "";
            if (areaArr.length > 0) {
              areaArr.forEach((data, i) => {
                data = data?.trim();
                if (i != 0) {
                  areaText += ", " + data;
                } else {
                  areaText += data;
                }
              });
            }
            setArea(areaText);
            setMobile(response.data?.user.mobile?.toString());
            setGender(response.data?.user.gender);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          Alert.alert("Error fetching profile");
          console.log("Error fetching profile", err);
        }
      }

      dataFetch();
    }, [])
  );

  async function handleUpdate() {
    try {
      setLoading(true);
      const response = await axios.put(
        URL.Profile.updateProfile,
        {
          name: `${firstName}${middleName ? `${middleName} ` : " "}${lastName}`,
          mobile,
          gender,
          area: area.length > 0 ? area.split(",") : [],
          description,
          price_level: Number(price_level),
          age: Number(age),
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

        <View className="mt-6 w-[50%] h-32 flex justify-center rounded-md items-center shadow-lg">
          <Image
            source={Avatar}
            className="w-full h-full rounded-md object-cover"
          />
        </View>
      </View>

      <View className="flex-row items-center justify-between bg-white mx-4 rounded-xl py-1 px-4 shadow-lg mt-4">
        <TouchableOpacity
          className="mt-2 w-[43%] rounded-md"
          onPress={() => handleUpdate()}
        >
          <Text className="p-2 bg-yellow-500 text-center rounded-lg">
            Update
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2 w-[43%] rounded-md"
          onPress={() => handleLogout()}
        >
          <Text className="p-2 bg-red-500 text-white text-center rounded-lg">
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Container */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0B646B" />
        </View>
      ) : (
        <ScrollView>
          <View className="w-full px-4 mb-20 flex items-center justify-center flex-wrap">
            <View className="w-full my-2 flex-row items-center justify-evenly">
              <TextInput
                value={firstName}
                placeholder="First Name"
                className="py-2 px-4 text-md border rounded-lg"
                onChangeText={(text) => setFirstName(text)}
              />
              <TextInput
                value={middleName}
                placeholder="Middle Name"
                className="py-2 px-4 text-md border rounded-lg"
                onChangeText={(text) => setMiddleName(text)}
              />
              <TextInput
                value={lastName}
                placeholder="Last Name"
                className="py-2 px-4 text-md border rounded-lg"
                onChangeText={(text) => setLastName(text)}
              />
            </View>

            <View className="w-full my-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Mobile No :</Text>
              <TextInput
                value={mobile.toString()}
                placeholder="Mobile"
                className="w-2/3 py-2 px-4 border rounded-lg"
                keyboardType="numeric"
                onChangeText={(text) => setMobile(Number(text))}
                maxLength={10}
              />
            </View>

            <View className="w-full my-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Description :</Text>
              <TextInput
                value={description}
                placeholder="Description"
                className="w-2/3 py-2 px-4 border rounded-lg"
                onChangeText={(text) => setDescription(text)}
                multiline
              />
            </View>

            <View className="mw-full y-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Gender :</Text>
              <Dropdown
                className="w-2/3 py-2 px-4 border rounded-lg"
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={[
                  { label: "Male", value: 1 },
                  { label: "Female", value: 2 },
                ]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select item" : "..."}
                value={gender}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setGender(item.value);
                  setIsFocus(false);
                }}
              />
            </View>

            <View className="w-full my-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Area:</Text>
              <TextInput
                value={area}
                placeholder="ABC, XYZ ...."
                className="w-2/3 py-2 px-4 border rounded-lg"
                onChangeText={(text) => setArea(text)}
              />
            </View>
            <Text className="text-sm">Separate area with ","</Text>

            <View className="w-full my-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Age :</Text>
              <TextInput
                value={age}
                placeholder="Age"
                className="w-2/3 py-2 px-4 border rounded-lg"
                keyboardType="numeric"
                onChangeText={(text) => setAge(text)}
                maxLength={2}
              />
            </View>

            <View className="w-full my-2 flex-row justify-evenly items-center">
              <Text className="w-1/3 text-xl"> Price Level :</Text>
              <TextInput
                value={price_level}
                placeholder="Price level"
                className="w-2/3 py-2 px-4 border rounded-lg"
                keyboardType="numeric"
                onChangeText={(text) => setPrice_Level(text)}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
