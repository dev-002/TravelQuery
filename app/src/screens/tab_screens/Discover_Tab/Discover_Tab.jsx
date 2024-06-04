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
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Attractions,
  Avatar,
  Hotels,
  NotFound,
  Restaurants,
  Add,
  Nature,
  Home_Stay,
  Other,
} from "../../../../assets/index";

import MenuContainer from "../../../components/MenuContainer";
import ItemCarDontainer from "./components/ItemCarDontainer";
import { useFocusEffect } from "@react-navigation/native";

export default function Discover_Tab({ navigation }) {
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchPlaces() {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("token");
          const response = await axios.post(
            URL.Place.fetchPlace,
            { type },
            {
              headers: {
                token,
              },
            }
          );
          if (response.status === 200) {
            setPlaces(response.data?.places);
            setInterval(() => setLoading(false), 2000);
          }
        } catch (err) {
          console.log("Error while fetching Places", err);
          Alert.alert("Error fetching places");
          setLoading(false);
        }
      }
      fetchPlaces();

      return () => {
        // Add cleanup logic here if needed
      };
    }, [type])
  );

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-8">
        <View>
          <Text className="text-[40px] text-[#0B646B] font-bold">Discover</Text>
          <Text className="text-[#527283] text-[36px]">the beauty today</Text>
        </View>

        <View className="w-12 h-12 rounded-md items-center justify-center shadow-lg">
          <Image
            source={Avatar}
            className="w-full h-full rounded-md object-cover"
          />
        </View>
      </View>

      {/* Menu Container */}
      {loading ? (
        <View className=" flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0B646B" />
        </View>
      ) : (
        <ScrollView>
          <ScrollView horizontal={true}>
            <View className="px-4 mt-8 flex-row items-center justify-between">
              {/* Add Button */}
              <TouchableOpacity
                className="items-center justify-center space-y-2"
                onPress={() => navigation.navigate("AddPlace_Screen")}
              >
                <View
                  className={`w-24 h-24 p-2 shadow-sm rounded-full items-center justify-center`}
                >
                  <Image
                    source={Add}
                    className="w-full h-full object-contain"
                  />
                </View>
                <Text className="text-[#00BCC9] text-xl font-semibold">
                  Add
                </Text>
              </TouchableOpacity>

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

          <View>
            <View className="flex-row items-center justify-between px-4 mt-8">
              <Text className="text-[#2C7379] text-[28px] font-bold">
                Top Tips
              </Text>

              <TouchableOpacity
                className="flex-row items-center justify-center space-x-2"
                onPress={() => navigation.navigate("ExploreScreen")}
              >
                <Text className="text-[#A0C4C7] text-[20px] font-bold">
                  Explore
                </Text>
                <FontAwesome
                  name="long-arrow-right"
                  size={24}
                  color="#A0C4C7"
                />
              </TouchableOpacity>
            </View>

            <View className="px-4 mt-8 flex-row items-center justify-evenly flex-wrap">
              {places?.length > 0 ? (
                <>
                  {places?.map((data, i) => (
                    <ItemCarDontainer
                      key={i}
                      imageSrc={
                        data.images?.length > 0
                          ? data.images[0]
                          : "https://img.freepik.com/free-photo/reflection-lights-mountain-lake-captured-parco-ciani-lugano-switzerland_181624-24209.jpg?t=st=1715741152~exp=1715744752~hmac=75d09c631a9f9afd43382409981c71c0c2068ace223c2f523807ab999a1d1a88&w=1380"
                        // "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"
                      }
                      title={data?.name}
                      location={data?.address}
                      data={data}
                    />
                  ))}
                </>
              ) : (
                <>
                  <View className="w-full h-[400px] items-center space-y-8 justify-center">
                    <Image
                      source={NotFound}
                      className=" w-32 h-32 object-cover"
                    />
                    <Text className="text-2xl text-[#428288] font-semibold">
                      Opps...No Data Found
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
