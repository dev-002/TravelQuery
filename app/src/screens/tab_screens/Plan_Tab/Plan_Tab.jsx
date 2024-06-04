import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlacesModal from "./components/PlacesModal";
import MembersModal from "./components/MemberModal";
import GuidesModal from "./components/GuidesModal";

export default function Plan_Tab({ route, navigation }) {
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
      const date = new Date(Date.UTC(year, month - 1, day));
      setBeginDate(date);
    } else {
      setBeginDate(null);
    }
  }

  function handleEndDateChange() {
    const [year, month, day] = endDateText.split("/").map(Number);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const date = new Date(Date.UTC(year, month - 1, day));
      setEndDate(date);
    } else {
      setEndDate(null);
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const response = await axios.post(
        URL.TravelPlan.addTravelPlan,
        {
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

      if (response.status === 201) {
        navigation.navigate("Discover_Tab");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error planning a trip", err);
      Alert.alert("Error planning a trip");
    }
  }

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
          <View className="my-3 px-2">
            {/* Beign date */}
            <View className="flex-row items-center justify-center">
              <Text className="w-[30%] text-base">Begin Date:</Text>

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
            {/* End date */}
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
              <Text className="text-blue-500">
                {beginDate
                  ? `${beginDate?.getDate()}-${
                      beginDate?.getMonth() - 1
                    }-${beginDate?.getFullYear()}`
                  : "select date"}{" "}
              </Text>
              TO{" "}
              <Text className="text-blue-500">
                {endDate
                  ? `${endDate?.getDate()}-${
                      endDate?.getMonth() - 1
                    }-${endDate?.getFullYear()}`
                  : "select date"}
              </Text>
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

        <View className="w-full">
          <TouchableOpacity
            onPress={() => handleSubmit()}
            className="mx-1 bg-yellow-400 rounded-lg"
          >
            <Text className="p-2 font-bold text-base text-center">
              Plan Trip
            </Text>
          </TouchableOpacity>
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

          <View className="my-2 mb-28 flex-row justify-evenly">
            {placesVisited?.length > 0 ? (
              placesVisited?.map((list, i) => (
                <View className="m-1" key={i}>
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
                </View>
              ))
            ) : (
              <Text className="text-base">Where to go ?....</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
