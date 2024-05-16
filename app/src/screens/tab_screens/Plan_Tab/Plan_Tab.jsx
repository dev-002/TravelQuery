import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-native-date-picker";
import Btn from "../../Auth/components/Btn";

export default function Plan_Tab({ route, navigation }) {
  // states
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [members, setMembers] = useState([]);
  const [totalBudget, setTotalBudget] = useState(null);
  const [placesVisited, setPalcesVisited] = useState([]);
  const [totalTripDays, setTotalTripDays] = useState(null);
  const [guidesOpted, setGuidesOpted] = useState([]);

  const [dateOpen, setDateOpen] = useState(false);
  const [addedPlace, setAddedPlace] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="mt-6 flex-row items-center justify-between px-8">
        <Text className="pt-1 text-3xl text-[#0B646B] font-bold">
          Let's Plan
        </Text>
      </View>
      <ScrollView>
        {/* Plan Details */}
        <View className="">
          {/* PlanName */}
          <View className="my-3 px-2 flex-row items-center justify-center">
            <Text className="w-[30%] text-base">Plan Name:</Text>
            <TextInput
              value={name}
              className="w-[60%] border-b border-dotted text-base"
              onChangeText={(text) => setName(text)}
            />
          </View>

          {/* Description */}
          <View className="my-3 px-2 flex-row items-center justify-center">
            <Text className="w-[30%] text-base">Notes:</Text>
            <TextInput
              value={description}
              multiline={true}
              className="w-[60%] border-b border-dotted text-base"
              onChangeText={(text) => setDescription(text)}
            />
          </View>

          {/* Date */}
          <View className="my-3 px-2 flex-row items-center justify-center">
            <Text className="w-[30%] text-base">Date:</Text>
            <View className="w-[60%] flex-row items-center justify-between">
              <View className="m-1 p-2">
                <Button title="set Date" onPress={() => setDateOpen(true)} />
              </View>

              <DatePicker
                modal
                open={dateOpen}
                date={date}
                onConfirm={(date) => {
                  setDateOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setDateOpen(false);
                }}
              />
            </View>
            <Text className="text-center text-base">
              {`${date?.getDate()}-${date?.getMonth()}-${date?.getFullYear()}`}
            </Text>
          </View>

          {/* Total Budget and Total Trip Days */}
          <View className="px-4 flex-row items-center justify-between">
            <View className="w-1/2 my-3 px-2 flex-row items-center justify-between">
              <Text className="w-[30%] text-base">Total Budget</Text>
              <TextInput
                value={totalBudget}
                keyboardType="numeric"
                className="w-[50%] border-b border-dotted text-base"
                onChangeText={(text) => setTotalBudget(Number(text))}
              />
            </View>
            <View className="w-1/2 my-3 px-2 flex-row items-center justify-between">
              <Text className="w-[30%] text-base">Trip Days</Text>
              <TextInput
                value={totalTripDays}
                keyboardType="numeric"
                className="w-[50%] border-b border-dotted text-base"
                onChangeText={(text) => setTotalTripDays(Number(text))}
              />
            </View>
          </View>

          {/* Members */}
          <View className="my-3 px-2 flex-row items-center justify-center">
            <Text className="w-[30%] text-base">Members:</Text>
            <TextInput
              value={members?.length == 0 && "member"}
              className="w-[60%] border-b border-dotted text-base"
              onChangeText={(text) => setMembers((props) => [...props, text])}
            />
          </View>

          {/* Places */}
          <View className="my-3 px-2 flex-row items-center justify-center">
            <Text className="w-[30%] text-base">Places:</Text>
            <TextInput
              value={placesVisited?.length == 0 && "places"}
              className="w-[60%] border-b border-dotted text-base"
              onChangeText={(text) =>
                setPalcesVisited((props) => [...props, text])
              }
            />
          </View>
        </View>

        <View>
          <View className="w-full px-2 mt-8 flex-row justify-between">
            <Text className="text-[#2C7379] text-xl font-bold">
              Places Added
            </Text>
            <View className="flex-row items-center justify-center space-x-2">
              <FontAwesome name="long-arrow-right" size={40} color="#A0C4C7" />
            </View>
          </View>

          <View className="my-2 flex-row justify-evenly">
            {addedPlace && addedPlace.length > 0 ? (
              addedPlace.map((plan, index) => {
                return <Text>Plan {index + 1}</Text>;
              })
            ) : (
              <Text className="text-base">Where to go ?....</Text>
            )}

            {[].length > 0 &&
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
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
