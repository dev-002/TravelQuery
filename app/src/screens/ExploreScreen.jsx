import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import URL from "../../api";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Attractions,
  Hotels,
  Restaurants,
  Nature,
  Home_Stay,
  Other,
} from "../../assets/index";
import MenuContainer from "../components/MenuContainer";
import { TextInput } from "react-native-paper";

export default function ExploreScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [type, setType] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function fetchPlaces() {
        try {
          setLoading(true);
          const response = await axios.post(
            URL.Place.fetchPlace,
            { type },
            {
              headers: { token: await AsyncStorage.getItem("token") },
            }
          );
          if (response.status == 200) {
            setPlaces(response.data?.places);
            setInterval(() => setLoading(false), 2000);
          }
        } catch (err) {
          setLoading(false);
          console.log("Error in fetching place", err);
        }
      }

      fetchPlaces();

      return () => {
        // Add cleanup logic here if needed
      };
    }, [type])
  );

  function chunkedPlaces(data, index) {
    const result = [];
    for (let i = 0; i < data.length; i += index) {
      result.push(data.slice(i, i + index));
    }
    return result;
  }

  async function handleSearch(search) {
    try {
      setLoading(true);
      const response = await axios.post(
        URL.Place.searchPlace,
        { search },
        {
          headers: { token: await AsyncStorage.getItem("token") },
        }
      );
      console.log("Search: ", response.data);
      if (response.status == 200) {
        setPlaces(response.data?.places);
        setInterval(() => setLoading(false), 2000);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error in fetching place", err);
    }
  }
  return (
    <>
      <SafeAreaView className="flex-1 bg-white relative">
        <View className="px-5 flex-row items-center justify-start">
          {/* <View className="absolute flex-row inset-x-0 top-5 justify-between px-6"> */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-md bg-white"
          >
            <FontAwesome5 name="chevron-left" size={24} color="#06B2BE" />
          </TouchableOpacity>
          {/* </View> */}

          <Text className="ml-3 text-3xl font-bold">Explore</Text>
        </View>

        <View className="mx-5 flex-row items-center justify-center">
          <TextInput
            placeholder="Search bar"
            // value={search}
            onChangeText={(text) => handleSearch(text)}
            className="mx-auto w-[70%] my-3 px-2 text-base bg-white rounded-lg"
          />
          <FontAwesome5 name="search" size={24} color="#06B2BE" />
        </View>

        {loading ? (
          <View className=" flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0B646B" />
          </View>
        ) : (
          <ScrollView>
            <ScrollView horizontal={true}>
              <View className="px-4 mt-8 flex-row items-center justify-between">
                {/* List of Place Type */}

                <MenuContainer
                  Key={"attractions"}
                  title="Attractions"
                  imageSrc={Attractions}
                  type={type}
                  setType={setType}
                />

                <MenuContainer
                  Key={"hotel"}
                  title="Hotels"
                  imageSrc={Hotels}
                  type={type}
                  setType={setType}
                />
                <MenuContainer
                  Key={"restaurant"}
                  title="Restaurants"
                  imageSrc={Restaurants}
                  type={type}
                  setType={setType}
                />

                <MenuContainer
                  Key={"home_stay"}
                  title="Home Stay"
                  imageSrc={Home_Stay}
                  type={type}
                  setType={setType}
                />

                <MenuContainer
                  Key={"nature"}
                  title="Nature"
                  imageSrc={Nature}
                  type={type}
                  setType={setType}
                />

                <MenuContainer
                  Key={"other"}
                  title="Others"
                  imageSrc={Other}
                  type={type}
                  setType={setType}
                />
              </View>
            </ScrollView>

            {places?.length > 0 ? (
              chunkedPlaces(places, 2)?.map((p, i) => (
                <View
                  key={i}
                  className="m-1 flex-row items-center justify-evenly"
                >
                  {p?.map((pdash, idash) => (
                    <View key={idash} className="mx-auto bg-white shadow-lg">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ItemScreen", { param: data })
                        }
                        className="rounded-md border border-gray-300 space-y-2 px-3 py-2 shadow-md bg-white w-[182px] my-2"
                      >
                        <Image
                          source={{
                            uri:
                              pdash?.images?.length > 0
                                ? data?.images[0]
                                : "https://img.freepik.com/free-photo/reflection-lights-mountain-lake-captured-parco-ciani-lugano-switzerland_181624-24209.jpg?t=st=1715741152~exp=1715744752~hmac=75d09c631a9f9afd43382409981c71c0c2068ace223c2f523807ab999a1d1a88&w=1380",
                            // "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg",
                          }}
                          className="w-full h-28 rounded-md object-cover"
                        />

                        {pdash?.name ? (
                          <>
                            <Text className="text-[#428288] text-[18px] font-bold">
                              {pdash?.name?.length > 14
                                ? `${pdash?.name.slice(0, 14)}..`
                                : pdash?.name}
                            </Text>

                            <View className="flex-row items-center space-x-1">
                              <FontAwesome
                                name="map-marker"
                                size={20}
                                color="#8597A2"
                              />
                              <Text className="text-[#428288] text-[14px] font-bold">
                                {pdash?.address?.length > 18
                                  ? `${pdash?.name.slice(0, 18)}..`
                                  : pdash?.address}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <></>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text className="m-2 p-2 text-2xl text-center font-bold">
                No Result Found
              </Text>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}
