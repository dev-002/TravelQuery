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
import { GuideAvatar } from "../../assets";

export default function GuideScreen({ route }) {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const data = route?.params?.param;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(useCallback(() => {}, []));

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView className="flex-1 px-4 py-6">
        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : (
          <View className="relative bg-white shadow-lg">
            <Image
              source={
                data?.profile
                  ? {
                      uri: data?.profile,
                    }
                  : GuideAvatar
              }
              className="w-full h-60 object-cover rounded-2xl"
            />
            <View className="mb-2 w-full border-b-2" />

            <View className="absolute flex-row inset-x-0 top-5 justify-between px-6">
              <TouchableOpacity
                onPress={() => navigation.navigate("Discover")}
                className="w-10 h-10 rounded-md items-center justify-center bg-white"
              >
                <FontAwesome5 name="chevron-left" size={24} color="#06B2BE" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Name and reviews */}
        <View className="flex-row inset-x-0 justify-between px-6">
          <View className="flex-row space-x-2 items-center">
            <Text className="text-3xl font-bold text-[#067559]">
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

        {/* Mobile and area */}
        <View className="mt-6">
          <Text className="text-[#428288] text-[24px] font-bold">
            +91 {data?.mobile}
          </Text>

          <View className=" flex-row items-center space-x-2">
            <View className="w-10 h-10 rounded-xl bg-[#a7dcdc] items-center justify-center shadow-md">
              <MaterialIcons name="attach-money" size={24} color="black" />
            </View>
            {data?.price_level ? (
              <View>
                <Text className="text-black text-lg font-bold">
                  {" "}
                  {data?.price_level}
                </Text>
                <Text className="text-[#515151] text-base">Approx. Price</Text>
              </View>
            ) : (
              <Text className="text-base text-gray-500">
                Price Not Specified{" "}
                <Text className="text-black font-bold">(On Spot Bargin)</Text>
              </Text>
            )}
          </View>
        </View>

        {/* Rating */}
        <View className="mt-4 flex-row items-center justify-between">
          {data?.rating && (
            <View className=" flex-row items-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <View className="w-10 h-10 rounded-xl bg-red-100 items-center justify-center shadow-md">
                  <FontAwesome
                    key={index}
                    name={
                      index < Math.floor(data.rating)
                        ? "star"
                        : index === Math.floor(data.rating) &&
                          data.rating % 1 !== 0
                        ? "star-half-o"
                        : "star-o"
                    }
                    size={24}
                    color="#D58574"
                  />
                </View>
              ))}
              <View>
                <Text className="text-[#515151] font-bold text-xl">
                  {data?.rating}
                </Text>
                <Text className="text-[#515151] font-bold tex-base">
                  Ratings
                </Text>
              </View>
            </View>
          )}
        </View>

        {data?.description && (
          <Text className="mt-4 tracking-wide text-[16px] font-semibold text-[#97A6AF]">
            {data?.description}
          </Text>
        )}

        <View className="flex-row items-center space-x-2 mt-2">
          <FontAwesome name="map-marker" size={25} color="#8C9EA6" />
          {data?.area?.length > 0 ? (
            data?.area?.map((a, i) => (
              <Text
                key={i}
                className="mx-1 p-1 bg-[#23c2bd] text-white text-base rounded-lg"
              >
                {a}{" "}
              </Text>
            ))
          ) : (
            <Text>No area Specified </Text>
          )}
        </View>

        {/* {data?.services && (
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
        )} */}

        <View className=" space-y-2 mt-4 bg-gray-100 rounded-2xl px-4 py-2">
          <View className="items-center flex-row space-x-5">
            <FontAwesome name="phone" size={24} color="#428288" />
            {
              <Text key={data?.mobile} className="text-lg">
                +91 {data?.mobile}
              </Text>
            }
          </View>

          {data?.area?.length > 0 && (
            <View className="items-center flex-row space-x-6">
              <FontAwesome name="map-pin" size={24} color="#428288" />
              <Text className="text-lg">{data?.area[0]} (Primary)</Text>
            </View>
          )}

          <View className="my-4 p-3 rounded-lg bg-[#06B2BE] items-center justify-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("Plan_Tab", { guide: data })}
            >
              <Text className="text-2xl font-semibold uppercase tracking-wider text-gray-100">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
