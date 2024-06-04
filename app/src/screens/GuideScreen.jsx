import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { GuideAvatar } from "../../assets";
import axios from "axios";
import URL from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GuideScreen({ route }) {
  const navigation = useNavigation();

  const data = route?.params?.param;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(2.5);
  const [comment, setComment] = useState("");
  const [guide, setGuide] = useState({ ...data });
  const [reviews, setReviews] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchReviews(id) {
        try {
          setLoading(true);
          const response = await axios.post(
            URL.Guide.fetchGuidesReview,
            { id },
            {
              headers: {
                token: await AsyncStorage.getItem("token"),
              },
            }
          );

          if (response.status == 200) {
            setLoading(false);
            setReviews(response.data?.reviews);
          }
        } catch (err) {
          console.log("Error while fetching reviews: ", err);
          Alert.alert("Error while fetching reviews");
          setLoading(false);
        }
      }

      fetchReviews(data._id);
    }, [])
  );

  async function postReview() {
    try {
      setLoading(true);
      const response = await axios.post(
        URL.Guide.postReview,
        { rating, comment, id: data._id },
        {
          headers: {
            token: await AsyncStorage.getItem("token"),
          },
        }
      );

      if (response.status == 201) {
        setLoading(false);
        setGuide(response.data?.guide);
      }
    } catch (err) {
      console.log("Error while posting review: ", err);
      Alert.alert("Error while posting review");
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView className="flex-1 px-4 py-6">
        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : (
          <View className="relative bg-white shadow-lg">
            <Image
              source={
                guide?.profile
                  ? {
                      uri: guide?.profile,
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
              {guide?.name}
            </Text>
          </View>
          <View className="px-2 py-1 my-auto rounded-md bg-teal-100 items-center">
            <Text>
              <Text className="font-bold">Reviews:</Text>{" "}
              {guide?.reviews?.length}
            </Text>
          </View>
        </View>

        {/* Mobile and area */}
        <View className="mt-6">
          <Text className="text-[#428288] text-[24px] font-bold">
            +91 {guide?.mobile}
          </Text>

          <View className=" flex-row items-center space-x-2">
            <View className="w-10 h-10 rounded-xl bg-[#a7dcdc] items-center justify-center shadow-md">
              <MaterialIcons name="attach-money" size={24} color="black" />
            </View>
            {guide?.price_level ? (
              <View>
                <Text className="text-black text-lg font-bold">
                  {" "}
                  {guide?.price_level}
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
          {guide?.rating && (
            <View className=" flex-row items-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <View className="w-10 h-10 rounded-xl bg-red-100 items-center justify-center shadow-md">
                  <FontAwesome
                    key={index}
                    name={
                      index < Math.floor(guide.rating)
                        ? "star"
                        : index === Math.floor(guide.rating) &&
                          guide.rating % 1 !== 0
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
                  {guide?.rating}
                </Text>
                <Text className="text-[#515151] font-bold tex-base">
                  Ratings
                </Text>
              </View>
            </View>
          )}
        </View>

        {guide?.description && (
          <Text className="mt-4 tracking-wide text-[16px] font-semibold text-[#97A6AF]">
            {guide?.description}
          </Text>
        )}

        <View className="flex-row items-center space-x-2 mt-2">
          <FontAwesome name="map-marker" size={25} color="#8C9EA6" />
          {guide?.area?.length > 0 ? (
            guide?.area?.map((a, i) => (
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

        {/* {guide?.services && (
          <View className="flex-row gap-2 items-center justify-start flex-wrap mt-4">
            {guide?.services.map((n, i) => (
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
              <Text key={guide?.mobile} className="text-lg">
                +91 {guide?.mobile}
              </Text>
            }
          </View>

          {guide?.area?.length > 0 && (
            <View className="items-center flex-row space-x-6">
              <FontAwesome name="map-pin" size={24} color="#428288" />
              <Text className="text-lg">{guide?.area[0]} (Primary)</Text>
            </View>
          )}

          <View className="my-4 p-3 rounded-lg bg-[#06B2BE] items-center justify-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("Plan_Tab", { guide: guide })}
            >
              <Text className="text-2xl font-semibold uppercase tracking-wider text-gray-100">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Review Section */}
        <View className="mb-10">
          <Text className="mb-2 font-bold text-lg">Reviews: </Text>
          {/* post review */}
          <View className="my-2 p-2 border rounded-lg">
            <View className="flex-row justify-around">
              <TextInput
                value={comment}
                placeholder="Comment ..."
                multiline={true}
                onChangeText={(text) => setComment(text)}
                className="w-2/3 h-10"
              />
              <View className="w-1/3 flex-row justify-evenly items-center">
                <TouchableOpacity
                  onPress={() => {
                    if (rating > 0.5) setRating((rating) => rating - 0.5);
                  }}
                >
                  <MaterialCommunityIcons name="minus" size={20} />
                </TouchableOpacity>

                <TextInput
                  value={rating.toString()}
                  onChangeText={(text) => setRating(Number(text))}
                  className="text-base text-center"
                />

                <TouchableOpacity
                  onPress={() => {
                    if (rating < 5.0) setRating((rating) => rating + 0.5);
                  }}
                >
                  <MaterialCommunityIcons name="plus" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => postReview()}
              className="w-full bg-blue-300 rounded-md"
            >
              <Text className="p-1 text-center text-base">Post</Text>
            </TouchableOpacity>
          </View>

          {/* fetchReviews */}
          {reviews?.length > 0 ? (
            <View className="my-2">
              {reviews?.map((review, index) => (
                <View
                  key={index}
                  className="my-1 p-1 flex-row items-center bg-blue-200 border rounded-xl"
                >
                  <Text className="w-2/3 p-1 text-base rounded-lg">
                    {review.comment}
                  </Text>
                  <Text className="w-1/3 p-1 text-lg text-center bg-blue-100 border rounded-lg">
                    {review.rating}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="my-2">No Reviews Yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
