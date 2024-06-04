import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import URL from "../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlacesModal from "./Plan_Tab/components/PlacesModal";
import MembersModal from "./Plan_Tab/components/MemberModal";
import GuidesModal from "./Plan_Tab/components/GuidesModal";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function TravelPlanDesctiption({ route, navigation }) {
  const dataId = route?.params?.id;

  // states
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // date
  const [beginDate, setBeginDate] = useState(new Date());
  const [beginDateText, setBeginDateText] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [endDateText, setEndDateText] = useState("");

  const [totalBudget, setTotalBudget] = useState(null);
  const [totalTripDays, setTotalTripDays] = useState(null);
  // members
  const [members, setMembers] = useState([]);
  const [membersModal, setMembersModal] = useState(false);
  // places
  const [placesVisited, setPalcesVisited] = useState([]);
  const [placesModal, setPlacesModal] = useState(false);
  // guide
  const [guidesOpted, setGuidesOpted] = useState([]);
  const [guidesModal, setGuidesModal] = useState(false);

  function handleBeginDateChange() {
    const [year, month, day] = beginDateText.split("/").map(Number);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(Date.UTC(year, month + 1, day));
      setBeginDate(date);
    } else {
      setBeginDate(null);
    }
  }

  function handleEndDateChange() {
    const [year, month, day] = endDateText.split("/").map(Number);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(Date.UTC(year, month + 1, day));
      setEndDate(date);
    } else {
      setEndDate(null);
    }
  }

  async function updatePlan() {
    try {
      setLoading(true);
      const response = await axios.put(
        URL.TravelPlan.updateTravelPlan,
        {
          _id: dataId,
          name,
          description,
          date: { start: beginDate, end: endDate },
          members,
          totalBudget,
          placesVisited,
          totalTripDays,
          guidesOpted,
        },
        { headers: { token: await AsyncStorage.getItem("token") } }
      );
      if (response.status === 200) {
        navigation.navigate("Discover_Tab");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error planning a trip", err);
      Alert.alert("Error planning a trip");
    }
  }

  async function handleDelete() {
    try {
      setLoading(true);
      const response = await axios.delete(URL.TravelPlan.removeTravelPlan, {
        headers: { token: await AsyncStorage.getItem("token"), _id: dataId },
      });
      if (response.status === 200) {
        navigation.navigate("Discover_Tab");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error planning a trip", err);
      Alert.alert("Error planning a trip");
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchPlan() {
        try {
          const response = await axios.post(
            URL.TravelPlan.getSpecificTravelPlan,
            { id: dataId },
            {
              headers: {
                token: await AsyncStorage.getItem("token"),
              },
            }
          );

          if (response.status === 200) {
            setName(response.data?.travelPlan?.name);
            setDescription(response.data?.travelPlan?.description);
            setBeginDate(response.data?.travelPlan?.date?.start);
            setEndDate(response.data?.travelPlan?.date?.end);
            setTotalBudget(response.data?.travelPlan?.totalBudget);
            setTotalTripDays(response.data?.travelPlan?.totalTripDays);
            setGuidesOpted(response.data?.travelPlan?.guidesOpted);
            setMembers(response.data?.travelPlan?.members);
            setPalcesVisited(response.data?.travelPlan?.placesVisited);
          }
        } catch (err) {
          console.log("Error while fetching", err);
        }
      }
      fetchPlan();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <StatusBar style="dark" />
      <View className="mt-6 flex-row items-center justify-start px-8">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-md bg-white"
        >
          <FontAwesome5 name="chevron-left" size={24} color="#06B2BE" />
        </TouchableOpacity>

        <Text className="mx-5 pt-1 text-3xl text-[#0B646B] font-bold">
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
          <View className="my-3 px-2">
            {/* begin date */}
            <View className="flex-row items-center justify-center">
              <Text className="w-[30%] text-base">Beign Date:</Text>

              <View className="w-[60%] flex-row items-center justify-between">
                <TextInput
                  placeholder="enter date (yyyy/mm/dd)"
                  value={beginDateText}
                  className="w-[70%] border-b border-dotted text-base text-center"
                  onChangeText={(text) => setBeginDateText(text)}
                />

                <TouchableOpacity
                  className="w-[40%] m-1 p-2"
                  onPress={() => {
                    handleBeginDateChange();
                  }}
                >
                  <Text className="py-1 px-2 text-center text-white bg-black/70 rounded-2xl">
                    change date
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* end date */}
            <View className="flex-row items-center justify-center">
              <Text className="w-[30%] text-base">End Date:</Text>

              <View className="w-[60%] flex-row items-center justify-between">
                <TextInput
                  placeholder="enter date (yyyy/mm/dd)"
                  value={endDateText}
                  className="w-[70%] border-b border-dotted text-base text-center"
                  onChangeText={(text) => setEndDateText(text)}
                />

                <TouchableOpacity
                  className="w-[40%] m-1 p-2"
                  onPress={() => {
                    handleEndDateChange();
                  }}
                >
                  <Text className="py-1 px-2 text-center text-white bg-black/70 rounded-2xl">
                    change date
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text className="m-auto mx-5 text-center text-base border-b border-dashed">
              Trip Date :{" "}
              {beginDate?.getDate
                ? `${beginDate?.getDate()}-${beginDate?.getMonth()}-${beginDate?.getFullYear()}`
                : `${new Date()?.getDate()}-${new Date()?.getMonth()}-${new Date()?.getFullYear()}`}
              {" TO "}
              {endDate?.getDate
                ? `${endDate?.getDate()}-${endDate?.getMonth()}-${endDate?.getFullYear()}`
                : `${new Date()?.getDate()}-${new Date()?.getMonth()}-${new Date()?.getFullYear()}`}
            </Text>
          </View>

          {/* Total Budget and Total Trip Days */}
          <View className="px-4 flex-row items-center justify-between">
            <View className="w-1/2 my-3 px-2 flex-row items-center justify-between">
              <Text className="w-[30%] text-base">Total Budget</Text>
              <TextInput
                value={totalBudget?.toString()}
                keyboardType="numeric"
                className="w-[50%] border-b border-dotted text-base"
                onChangeText={(text) => setTotalBudget(Number(text))}
              />
            </View>
            <View className="w-1/2 my-3 px-2 flex-row items-center justify-between">
              <Text className="w-[30%] text-base">Trip Days</Text>
              <TextInput
                value={totalTripDays?.toString()}
                keyboardType="numeric"
                className="w-[50%] border-b border-dotted text-base"
                onChangeText={(text) => setTotalTripDays(Number(text))}
              />
            </View>
          </View>

          {/* Members */}
          <View className="my-3 px-2 flex-row items-center justify-center">
            <Text className="w-[30%] text-base">Members:</Text>

            <View className="w-[60%]">
              <TouchableOpacity
                onPress={() => setMembersModal(true)}
                className="w-full bg-gray-500 rounded-lg"
              >
                <Text className="p-1 m-2 text-center text-white font-bold">
                  Select Members
                </Text>
              </TouchableOpacity>

              <MembersModal
                members={members}
                setMembers={setMembers}
                membersModal={membersModal}
                setMembersModal={setMembersModal}
              />

              {members?.length > 0 && (
                <View className="flex-row items-center">
                  {members?.map((member, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        let memb = members.filter((m) => m !== member);
                        setMembers(memb);
                      }}
                    >
                      <Text key={i} className="m-1 p-1 bg-blue-300 rounded-lg">
                        {member?.name?.split(" ")[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Places */}
          <View className="my-3 px-2 flex-row items-center justify-center">
            <Text className="w-[30%] text-base">Places:</Text>

            <View className="w-[60%]">
              <TouchableOpacity
                onPress={() => setPlacesModal(true)}
                className="w-full bg-gray-500 rounded-lg"
              >
                <Text className="p-1 m-2 text-center text-white font-bold">
                  Select Places
                </Text>
              </TouchableOpacity>

              <PlacesModal
                placesVisited={placesVisited}
                setPalcesVisited={setPalcesVisited}
                placesModal={placesModal}
                setPlacesModal={setPlacesModal}
              />

              {placesVisited?.length > 0 && (
                <View className="flex-row items-center">
                  {placesVisited?.map((place, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        let memb = placesVisited.filter((m) => m !== place);
                        setPalcesVisited(memb);
                      }}
                    >
                      <Text key={i} className="m-1 p-1 bg-blue-300 rounded-lg">
                        {place?.name?.split(" ")[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Guides */}
          <View className="my-3 px-2 flex-row items-center justify-center">
            <Text className="w-[30%] text-base">Guides:</Text>

            <View className="w-[60%]">
              <TouchableOpacity
                onPress={() => setGuidesModal(true)}
                className="w-full bg-gray-500 rounded-lg"
              >
                <Text className="p-1 m-2 text-center text-white font-bold">
                  Select Guides
                </Text>
              </TouchableOpacity>

              <GuidesModal
                guidesOpted={guidesOpted}
                setGuidesOpted={setGuidesOpted}
                guidesModal={guidesModal}
                setGuidesModal={setGuidesModal}
              />

              {guidesOpted?.length > 0 && (
                <View className="flex-row items-center">
                  {guidesOpted?.map((guide, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        let memb = guidesOpted.filter((m) => m !== guide);
                        setGuidesOpted(memb);
                      }}
                    >
                      <Text key={i} className="m-1 p-1 bg-blue-300 rounded-lg">
                        {guide?.name?.split(" ")[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="w-full flex-row items-center justify-center">
          <TouchableOpacity
            onPress={() => handleDelete()}
            className="mx-1 w-[40%] bg-red-600 rounded-lg"
          >
            {loading ? (
              <ActivityIndicator animating={loading} size={"large"} />
            ) : (
              <Text className="p-2 font-bold text-white text-base text-center">
                Delete Trip
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updatePlan()}
            className="mx-1 w-[40%] bg-yellow-400 rounded-lg"
          >
            {loading ? (
              <ActivityIndicator animating={loading} size={"large"} />
            ) : (
              <Text className="p-2 font-bold text-base text-center">
                Update Trip
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
