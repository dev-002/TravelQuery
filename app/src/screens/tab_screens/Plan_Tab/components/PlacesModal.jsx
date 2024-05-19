import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import URL from "../../../../../api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

export default function PlacesSerach({
  placesVisited,
  setPalcesVisited,
  placesModal,
  setPlacesModal,
}) {
  const [placesSearch, setPlacesSearch] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  function handleAddPlaces(place) {
    setPalcesVisited((props) => [...props, place]);
  }

  function handleRemovePlaces(place) {
    let temparr = placesVisited?.filter((p) => p._id != place._id);
    setPalcesVisited(temparr);
  }

  function handleModalClose() {
    setSearchText("");
    setPlacesSearch([]);
    setPlacesModal(false);
  }

  function checkVisited(_id) {
    let v = false;
    placesVisited.map((place) => (v = place._id == _id));
    return v;
  }

  useFocusEffect(
    useCallback(() => {
      async function handleSearch() {
        try {
          setLoading(true);
          const response = await axios.post(URL.TravelPlan.serachPlaces, {
            search: searchText,
          });
          if (response.status == 200) {
            setPlacesSearch(response.data?.places);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          console.log("Error: ", err);
        }
      }

      if (placesModal) {
        handleSearch();
      }
    }, [searchText])
  );

  return (
    <Modal
      onRequestClose={() => handleModalClose()}
      animationType="slide"
      transparent={false}
      visible={placesModal}
    >
      <View className="h-full py-6 px-8 flex-1 justify-center items-center">
        <TextInput
          placeholder="Search Places"
          value={searchText}
          className="mx-auto w-[90%] text-center text-base border-b border-dotted"
          onChangeText={(text) => setSearchText(text)}
        />

        <Text className="m-5 text-lg">
          Total Places Count: {placesVisited?.length}
        </Text>

        {/* Members list */}
        <Text className="my-5 text-center font-bold text-2xl">Places</Text>
        {loading ? (
          <ActivityIndicator animating={loading} size={"large"} />
        ) : (
          <ScrollView className="w-full flex-1">
            {placesSearch?.length > 0 &&
              placesSearch?.map((place, i) => (
                <View key={i} className="my-2 w-full border rounded-lg">
                  <Image
                    className="w-full h-28 object-cover rounded-t-lg"
                    source={{
                      uri:
                        place?.images?.length > 0
                          ? data.images[0]
                          : "https://img.freepik.com/free-photo/reflection-lights-mountain-lake-captured-parco-ciani-lugano-switzerland_181624-24209.jpg?t=st=1715741152~exp=1715744752~hmac=75d09c631a9f9afd43382409981c71c0c2068ace223c2f523807ab999a1d1a88&w=1380",
                    }}
                  />
                  <View className="p-4 flex-row items-center justify-between">
                    <View>
                      <Text className="text-base">{place?.name}</Text>
                      <Text className="text-base">{place?.address}</Text>
                    </View>
                    <Text className="p-1 text-base bg-gray-300 rounded-xl">
                      {place?.type?.toUpperCase()}
                    </Text>
                  </View>

                  {checkVisited(place._id) ? (
                    <TouchableOpacity
                      onPress={() => handleRemovePlaces(place)}
                      className="w-full bg-red-800 rounded-b-lg"
                    >
                      <Text className="m-auto py-1 font-bold text-white text-lg">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAddPlaces(place)}
                      className="w-full bg-blue-900 rounded-b-md"
                    >
                      <Text className="m-auto py-1 font-bold text-white text-lg">
                        Add
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
          </ScrollView>
        )}

        <TouchableOpacity onPress={() => handleModalClose()} className="m-5">
          <Text className=" p-2 px-5 w-full text-center bg-red-500 text-white text-xl rounded-lg">
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
