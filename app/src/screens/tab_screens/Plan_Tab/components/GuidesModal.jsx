import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import URL from "../../../../../api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";

export default function GuidesModal({
  guidesOpted,
  setGuidesOpted,
  guidesModal,
  setGuidesModal,
}) {
  const [guideSearch, setGuideSearch] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  function handleAddGuide(guide) {
    setGuidesOpted((props) => [...props, guide]);
  }

  function handleRemoveMember(guide) {
    let temparr = guidesOpted?.filter((m) => m._id != guide._id);
    setGuidesOpted(temparr);
  }

  function handleModalClose() {
    setSearchText("");
    setGuideSearch([]);
    setGuidesModal(false);
  }

  function checkAdded(_id) {
    let v = false;
    guidesOpted.map((m) => {
      if (m._id == _id) v = true;
    });
    return v;
  }

  useFocusEffect(
    useCallback(() => {
      async function handleSearch() {
        try {
          setLoading(true);
          const response = await axios.post(URL.TravelPlan.serachGuide, {
            search: searchText,
          });
          if (response.status == 200) {
            setGuideSearch(response.data?.guides);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          console.log("Error: ", err);
        }
      }

      if (guidesModal) {
        handleSearch();
      }
    }, [searchText])
  );

  return (
    <Modal
      onRequestClose={() => handleModalClose()}
      animationType="slide"
      transparent={false}
      visible={guidesModal}
    >
      <View className="h-full py-6 px-8 flex-1 justify-center items-center">
        <TextInput
          placeholder="Search Members"
          value={searchText}
          className="mx-auto w-[90%] text-center text-base border-b border-dotted"
          onChangeText={(text) => setSearchText(text)}
        />

        <Text className="m-5 text-lg">
          Total Guides Count: {guidesOpted?.length}
        </Text>

        {/* Members list */}
        <Text className="my-5 text-center font-bold text-2xl">Guides</Text>
        {loading ? (
          <ActivityIndicator animating={loading} size={"large"} />
        ) : (
          <ScrollView>
            {guideSearch?.length > 0 &&
              guideSearch?.map((guide, i) => (
                <View
                  key={i}
                  className="my-2 w-full bg-blue-200 flex-row items-center justify-evenly rounded-lg"
                >
                  <Icon
                    className="ml-2 w-[10%]"
                    color={"black"}
                    name="account"
                    size={40}
                  />
                  <View className="p-4">
                    <Text className="text-base">Name: {guide?.name}</Text>
                    <Text className="text-base">Mobile: {guide?.mobile}</Text>
                  </View>

                  {checkAdded(guide._id) ? (
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(guide)}
                      className="w-[30%] h-full bg-red-800 rounded-r-lg"
                    >
                      <Text className="m-auto font-bold text-white text-lg">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAddGuide(guide)}
                      className="w-[30%] h-full bg-blue-900 rounded-r-lg"
                    >
                      <Text className="m-auto font-bold text-white text-lg">
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
