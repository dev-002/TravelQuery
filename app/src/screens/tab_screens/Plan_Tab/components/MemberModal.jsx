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

export default function MemberSearch({
  members,
  setMembers,
  membersModal,
  setMembersModal,
}) {
  const [membersSearch, setMembersSearch] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  function handleAddMember(member) {
    setMembers((props) => [...props, member]);
  }

  function handleRemoveMember(member) {
    let temparr = members?.filter((m) => m._id != member._id);
    setMembers(temparr);
  }

  function handleModalClose() {
    setSearchText("");
    setMembersSearch([]);
    setMembersModal(false);
  }

  function checkAdded(_id) {
    let v = false;
    members.map((m) => {
      if (m._id == _id) v = true;
    });
    return v;
  }

  useFocusEffect(
    useCallback(() => {
      async function handleSearch() {
        try {
          setLoading(true);
          const response = await axios.post(URL.TravelPlan.serachMember, {
            search: searchText,
          });
          if (response.status == 200) {
            setMembersSearch(response.data?.members);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          console.log("Error: ", err);
        }
      }

      if (membersModal) {
        handleSearch();
      }
    }, [searchText])
  );

  return (
    <Modal
      onRequestClose={() => handleModalClose()}
      animationType="slide"
      transparent={false}
      visible={membersModal}
    >
      <View className="h-full py-6 px-8 flex-1 justify-center items-center">
        <TextInput
          placeholder="Search Members"
          value={searchText}
          className="mx-auto w-[90%] text-center text-base border-b border-dotted"
          onChangeText={(text) => setSearchText(text)}
        />

        <Text className="m-5 text-lg">
          Total Members Count: {members?.length}
        </Text>

        {/* Members list */}
        <Text className="my-5 text-center font-bold text-2xl">Members</Text>
        {loading ? (
          <ActivityIndicator animating={loading} size={"large"} />
        ) : (
          <ScrollView>
            {membersSearch?.length > 0 &&
              membersSearch?.map((member, i) => (
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
                    <Text className="text-base">Name: {member?.name}</Text>
                    <Text className="text-base">Mobile: {member?.mobile}</Text>
                  </View>

                  {checkAdded(member._id) ? (
                    <TouchableOpacity
                      onPress={() => handleRemoveMember(member)}
                      className="w-[30%] h-full bg-red-800 rounded-r-lg"
                    >
                      <Text className="m-auto font-bold text-white text-lg">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAddMember(member)}
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
