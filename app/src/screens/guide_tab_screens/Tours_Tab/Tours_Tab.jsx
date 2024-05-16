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
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-paper";
import { GuideAvatar } from "../../../../assets";

export default function Guide_Tab({ navigation }) {
  // states
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState([]);
  const [search, setSearch] = useState("");

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
          const response = await axios.get(URL.Guide.getAllTourGuide, {
            headers: {
              token: await AsyncStorage.getItem("token"),
            },
          });
          if (response.status == 200) {
            setGuide(response.data?.guides);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          Alert.alert("Error fetching guide");
          console.log("Error fetching guide", err);
        }
      }

      dataFetch();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="mt-6 flex items-start justify-between px-8">
        <Text className="text-4xl text-[#0B646B] font-bold">Select Guide</Text>
        <Text className="text-2xl text-[#0B646B]">
          Choose someone with your style
        </Text>
      </View>
      <ScrollView>
        {/* Search Bar */}
        <TouchableOpacity
          onPress={() => handleSearch()}
          className="mx-4 my-2 p-1 text-base border rounded-lg"
        >
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : guide?.length > 0 ? (
          guide.map((g, i) => (
            <View
              key={i}
              className="mx-4 py-1 px-4 flex-row items-center bg-white rounded-xl shadow-lg mt-4 border-x"
            >
              {/* Profile Image */}
              <TouchableOpacity
                className="mt-2 w-full flex-row items-center justify-between rounded-md"
                onPress={() => navigation.navigate("GuideScreen", { param: g })}
              >
                <Image
                  source={g?.profile ? { uri: g.profile } : GuideAvatar}
                  className="w-[30%] h-12 mr-4 rounded-md object-cover"
                />

                {/* Details */}
                {/* Name and Mobile */}
                <View className="w-[70%]">
                  {g?.name && g?.mobile && (
                    <View className="flex-row items-center">
                      <Text className="text-[#428288] text-[18px] font-bold">
                        {g.name && g.name}
                      </Text>

                      <View className="ml-8 flex-row items-center space-x-1">
                        <FontAwesome name="phone" size={20} color="#8597A2" />
                        <Text className="text-[#428288] text-base font-bold">
                          +91 {g.mobile}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Rating */}
                  {g?.rating && (
                    <Text className="text-[#428288] text-[18px] font-bold">
                      {[...Array(5)].map((_, index) => (
                        <FontAwesome
                          key={index}
                          name={
                            index < Math.floor(g.rating)
                              ? "star"
                              : index === Math.floor(g.rating) &&
                                g.rating % 1 !== 0
                              ? "star-half-o"
                              : "star-o"
                          }
                          size={16}
                          color="#D58574"
                        />
                      ))}
                      <Text className="ml-2">{g.rating}</Text>
                    </Text>
                  )}

                  {/* Areas */}
                  {g?.area && (
                    <View className="flex-row items-center space-x-1">
                      <FontAwesome
                        name="map-marker"
                        size={24}
                        color="#04af84"
                      />

                      {g?.area?.length > 0 ? (
                        g?.area?.map((a, i) =>
                          i < 3 ? (
                            <React.Fragment key={i}>
                              <Text className="m-0.5 px-1 bg-[#428288] text-white text-base rounded-lg">
                                {a}
                              </Text>
                            </React.Fragment>
                          ) : (
                            i == 3 && <Text>...</Text>
                          )
                        )
                      ) : (
                        <Text className="my-1 p-1 text-[#428288] text-xl font-bold">
                          No Areas Specified
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="flex items-center bg-white mx-4 rounded-xl py-1 px-4 shadow-lg mt-4 border-x">
            <Text className="font-bold text-2xl text-center">
              No Guides Added
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
