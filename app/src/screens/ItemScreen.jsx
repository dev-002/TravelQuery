import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import URL from "../../api";

export default function ItemScreen({ route }) {
  const navigation = useNavigation();

  const [addressSplit, setAddressSplit] = useState("");
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);

  const data = route?.params?.param;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  async function handleWishlist() {
    try {
      setLoading(true);
      const response = await axios.post(
        URL.Profile.addWishlist,
        { place_id: data._id },
        {
          headers: {
            token: await AsyncStorage.getItem("token"),
          },
        }
      );
      if (response.status === 200) {
        setWishlist(!wishlist);
        setLoading(false);
      }
    } catch (err) {
      console.log("Error in wishlist", err);
      setLoading(false);
    }
  }

  async function checkWishlist() {
    try {
      setLoading(true);
      const response = await axios.post(
        URL.Profile.checkWishlist,
        { place_id: data._id },
        {
          headers: {
            token: await AsyncStorage.getItem("token"),
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setWishlist(response.data.status);
      }
    } catch (err) {
      console.log("Error in wishlist", err);
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      let split = data?.address.split(",");
      setAddressSplit(split[split?.length - 1]?.trim());
      checkWishlist();
    }, [])
  );
  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView className="flex-1 px-4 py-6">
        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : (
          <View className="relative bg-white shadow-lg">
            <Image
              source={{
                uri:
                  data?.images?.length > 0
                    ? data?.images[0]
                    : "https://img.freepik.com/free-photo/reflection-lights-mountain-lake-captured-parco-ciani-lugano-switzerland_181624-24209.jpg?t=st=1715741152~exp=1715744752~hmac=75d09c631a9f9afd43382409981c71c0c2068ace223c2f523807ab999a1d1a88&w=1380",
                // "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg",
              }}
              className="w-full h-72 object-cover rounded-2xl"
            />

            <View className="absolute flex-row inset-x-0 top-5 justify-between px-6">
              <TouchableOpacity
                onPress={() => navigation.navigate("Discover")}
                className="w-10 h-10 rounded-md items-center justify-center bg-white"
              >
                <FontAwesome5 name="chevron-left" size={24} color="#06B2BE" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-10 h-10 rounded-md items-center justify-center bg-[#06B2BE] border border-white"
                onPress={() => handleWishlist()}
              >
                <FontAwesome5
                  name="heartbeat"
                  size={24}
                  color={wishlist ? `#f66` : `#fff`}
                />
              </TouchableOpacity>
            </View>

            <View className="absolute flex-row inset-x-0 bottom-5 justify-between px-6">
              <View className="flex-row space-x-2 items-center">
                {/* <Text className="text-[12px] font-bold text-gray-100">
                {data?.price_level}
              </Text> */}
                <Text className="text-[32px] font-bold text-gray-100">
                  {data?.name}
                </Text>
              </View>
              <View className="px-2 py-1 my-auto rounded-md bg-teal-100 items-center">
                <Text>
                  <Text className="font-bold">Reviews:</Text>{" "}
                  {data?.reviews?.length}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View className="mt-6">
          <Text className="text-[#428288] text-[24px] font-bold">
            {data?.type.toUpperCase()}
          </Text>
          <View className="flex-row items-center space-x-2 mt-2">
            <FontAwesome name="map-marker" size={25} color="#8C9EA6" />
            <Text className="text-[#8C9EA6] text-[20px] font-bold">
              {addressSplit}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          {data?.rating && (
            <View className=" flex-row items-center space-x-2">
              <View className="w-10 h-10 rounded-xl bg-red-100 items-center justify-center shadow-md">
                <FontAwesome name="star" size={24} color="#D58574" />
              </View>
              <View>
                <Text className="text-[#515151]">{data?.rating}</Text>
                <Text className="text-[#515151]">Ratings</Text>
              </View>
            </View>
          )}

          {data?.price_level && (
            <View className=" flex-row items-center space-x-2">
              <View className="w-10 h-10 rounded-xl bg-red-100 items-center justify-center shadow-md">
                <MaterialCommunityIcons
                  name="currency-inr"
                  size={24}
                  color="black"
                />
              </View>
              <View>
                <Text className="text-[#515151]">{data?.price_level}</Text>
                <Text className="text-[#515151]">Approx. Price</Text>
              </View>
            </View>
          )}

          {data?.bearing && (
            <View className=" flex-row items-center space-x-2">
              <View className="w-10 h-10 rounded-xl bg-red-100 items-center justify-center shadow-md">
                <FontAwesome5 name="map-signs" size={24} color="black" />
              </View>
              <View>
                <Text className="text-[#515151] capitalize">
                  {data?.bearing}
                </Text>
                <Text className="text-[#515151]">Bearing</Text>
              </View>
            </View>
          )}
        </View>

        {data?.description && (
          <Text className="mt-4 tracking-wide text-[16px] font-semibold text-[#97A6AF]">
            {data?.description}
          </Text>
        )}

        {data?.services && (
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
            {data?.services.map((n, i) => (
              <TouchableOpacity
                key={i}
                className="px-2 py-1 rounded-md bg-emerald-100"
              >
                <Text>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className=" space-y-2 mt-4 bg-gray-100 rounded-2xl px-4 py-2">
          <View className="items-center flex-row space-x-5">
            <FontAwesome name="phone" size={24} color="#428288" />
            {data?.contact > 0 ? (
              data?.contact.map((c) => (
                <Text key={c} className="text-lg">
                  {c}
                </Text>
              ))
            ) : (
              <Text className="text-lg text-gray-500">No contact details</Text>
            )}
          </View>

          {data?.address && (
            <View className="items-center flex-row space-x-6">
              <FontAwesome name="map-pin" size={24} color="#428288" />
              <Text className="text-lg">{data?.address}</Text>
            </View>
          )}

          <View className="my-4 p-3 rounded-lg bg-[#06B2BE] items-center justify-center">
            <TouchableOpacity onPress={() => navigation.navigate("Plan_Tab")}>
              <Text className="text-2xl font-semibold uppercase tracking-wider text-gray-100">
                Travel Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
