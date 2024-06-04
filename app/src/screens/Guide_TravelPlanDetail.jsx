import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";

export default function Guide_TravelPlanDetail({ navigation, route }) {
  const [travelPlan, setTravelPlan] = useState();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setTravelPlan(route.params.travelPlan);
      setInterval(() => setLoading(false), 2000);
    })
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  function getDate(date) {
    const new_date = new Date(date);
    return `${new_date.getDate()}/${new_date.getMonth()}/${new_date.getFullYear()}`;
  }

  return (
    <SafeAreaView className="mt-5 flex-1 bg-white relative">
      <StatusBar style="dark" />

      <View className="absolute left-[5%] top-[3%]">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <FontAwesome5 name="angle-left" size={40} />
        </TouchableOpacity>
      </View>

      <View className="mt-6 flex items-start justify-between px-8">
        <Text className="ml-5 text-2xl font-bold text-[#0B646B]">
          Review the Plan
        </Text>
      </View>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : (
          travelPlan && (
            <View className="mt-5 my-2 mx-4 py-1 px-4 flex bg-white">
              {/* Name */}
              {travelPlan.name && (
                <View className="w-[70%]">
                  <Text className="text-[#40A578] text-3xl font-bold">
                    {travelPlan.name}
                  </Text>
                </View>
              )}

              {/* Description */}
              {travelPlan.description && (
                <>
                  <Text className="text-blue-500 text-lg">Description</Text>
                  <View className="w-[70%]">
                    <Text className="text-xl">{travelPlan.description}</Text>
                  </View>
                </>
              )}

              {/* Date */}
              {travelPlan.date && (
                <View className="my-3 w-[95%] flex-row justify-between items-center">
                  <View className="">
                    <Text className="text-lg text-[#006769]">Start Date:</Text>
                    <Text className="text-[#61B390] text-xl font-bold">
                      {getDate(travelPlan.date.start)}
                    </Text>
                  </View>
                  <View className="">
                    <Text className="text-lg text-[#006769]">End Date:</Text>
                    <Text className="text-[#61B390] text-xl font-bold">
                      {getDate(travelPlan.date.end)}
                    </Text>
                  </View>
                </View>
              )}

              {/* TripDays and Budget */}
              {travelPlan && (
                <View className="my-3 w-[95%] flex-row justify-between items-center">
                  <View className="">
                    <Text className="text-lg text-[#006769]">
                      Total Budget:
                    </Text>
                    <Text className="text-[#61B390] text-center text-xl font-bold">
                      {travelPlan.totalBudget}
                    </Text>
                  </View>
                  <View className="">
                    <Text className="text-lg text-[#006769]">
                      Total TripDays:
                    </Text>
                    <Text className="text-[#61B390] text-center text-xl font-bold">
                      {travelPlan.totalTripDays}
                    </Text>
                  </View>
                </View>
              )}

              {/* Members and Guides */}
              {travelPlan && (
                <View className="my-3 w-[95%] flex-row justify-between items-center">
                  <View className="">
                    <Text className="text-lg text-[#006769]">
                      Total Members:
                    </Text>
                    <Text className="text-[#61B390] text-center text-xl font-bold">
                      {travelPlan.members?.length}
                    </Text>
                  </View>
                  <View className="">
                    <Text className="text-lg text-[#006769]">
                      Total Guides Opted:
                    </Text>
                    <Text className="text-[#61B390] text-center text-xl font-bold">
                      {travelPlan.guidesOpted?.length}
                    </Text>
                  </View>
                </View>
              )}

              {/* Places */}
              <Text className="text-xl text-blue-500">Places Added </Text>
              {travelPlan?.placesVisited &&
                travelPlan?.placesVisited?.map((data, i) => (
                  <View
                    key={i}
                    className="my-3 p-1 w-[95%] flex items-center border-x rounded-md"
                  >
                    <Text className="text-base text-[#006769]">
                      Name:{" "}
                      <Text className="text-[#61B390] text-center text-lg font-bold">
                        {data?.name}
                      </Text>
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <Text className="text-base text-[#006769]">
                        Type:{" "}
                        <Text className="text-[#61B390] text-center text-lg">
                          {data?.type}
                          {"       "}
                        </Text>
                      </Text>

                      <Text className="text-base text-[#006769]">
                        Rating:{" "}
                        <Text className="text-[#61B390] text-center text-lg">
                          {data?.rating}
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))}

              {/* Members */}
              <Text className="text-xl text-blue-500">Members Added </Text>
              {travelPlan?.members &&
                travelPlan?.members?.map((data, i) => (
                  <View
                    key={i}
                    className="my-3 p-1 w-[95%] flex items-center border-x rounded-md"
                  >
                    <Text className="text-base text-[#006769]">
                      Name:{" "}
                      <Text className="text-[#61B390] text-center text-lg font-bold">
                        {data?.name}
                      </Text>
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <Text className="text-base text-[#006769]">
                        Gender:{" "}
                        <Text className="text-[#61B390] text-center text-lg">
                          {data?.gender}
                          {"       "}
                        </Text>
                      </Text>

                      <Text className="text-base text-[#006769]">
                        Mobile:{" "}
                        <Text className="text-[#61B390] text-center text-lg">
                          {data?.mobile}
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))}

              {/* End */}
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
