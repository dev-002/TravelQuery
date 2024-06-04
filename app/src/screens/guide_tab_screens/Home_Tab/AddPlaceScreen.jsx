import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import URL from "../../../../api";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import GeoLocationModal from "./components/GeoLocationModal";

export default function AddModal({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // services
  const [services, setServices] = useState([]);
  const [tempService, setTempService] = useState("");
  // type
  const [type, setType] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  // location
  const [address, setAddress] = useState("");
  // contact
  const [tempContact, setTempContact] = useState("");
  const [contact, setContact] = useState([]);
  // imgaes
  const [images, setImgaes] = useState([]);
  const [addedBy, setAddedBy] = useState({});
  // GeoLocation Map
  const [geoLocationModal, setGeoLocationModal] = useState(false);
  const [marker, setMarker] = useState({
    latitude: "",
    longitude: "",
  });

  async function handleSubmit() {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        URL.Place.addPlace,
        {
          name,
          description,
          services,
          type: type.value,
          geoLocation: marker,
          address,
          contact,
          addedBy: addedBy._id,
          images,
        },
        { headers: { token } }
      );
      if (response.status == 201) {
        setLoading(false);
        navigation.goBack();
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("error adding place");
      console.log("Error adding Place");
    }
  }

  async function fetchUser() {
    try {
      const response = await axios.get(URL.Profile.getProfile, {
        headers: {
          token: await AsyncStorage.getItem("token"),
        },
      });
      if (response.status === 200) setAddedBy(response.data?.user);
      else setAddedBy("");
    } catch (err) {
      console.log("Error:", err);
    }
  }

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetchUser(source.token);

    // Cleanup function
    return () => {
      // Cancel the request if it's still pending
      source.cancel("Request cancelled by cleanup");
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />

      <View className="w-[90%] h-full p-8  mx-auto flex-1 justify-center items-center bg-gray-700 rounded-2xl">
        <Text className="my-1 p-1 text-xl font-bold text-gray-300 text-center">
          Add Place
        </Text>

        {/* Name */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">Name: </Text>
          <TextInput
            value={name.trim()}
            className="w-2/3 m-1 p-1 bg-gray-500 text-white border-b rounded-lg"
            onChangeText={(text) => setName(text)}
          />
        </View>

        {/* Description */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">
            Description:
          </Text>
          <TextInput
            value={description.trim()}
            className="w-2/3 m-1 p-1 bg-gray-500 text-white border-b rounded-lg"
            onChangeText={(text) => setDescription(text)}
          />
        </View>

        {/* Services */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">
            Services:
          </Text>
          <View className="w-2/3 m-1 p-1 flex-row items-center bg-gray-500  border-b rounded-lg">
            <TextInput
              className="w-[90%] text-white"
              value={tempService.trim()}
              onChangeText={(text) => setTempService(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setServices((prev) => [...prev, tempService]);
                setTempService("");
              }}
            >
              <Icon name="add" size={15} color={"white"} className="w-[10%]" />
            </TouchableOpacity>
          </View>
        </View>

        {services.length > 0 && (
          <View className="my-2 flex-row items-center">
            {services.map((s, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  let temp = services.filter((t) => t != s);
                  setServices(temp);
                }}
              >
                <Text className="mr-1 p-1 bg-black text-white rounded-lg">
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Type */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">Type:</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={[
              { label: "Home Stay", value: "home_stay" },
              { label: "Hotel", value: "hotel" },
              { label: "Restaurant", value: "restaurant" },
              { label: "Tourist Attractions", value: "attractions" },
              { label: "Nature", value: "nature" },
              { label: "Other", value: "other" },
            ]}
            className="w-2/3 m-1 p-1 bg-gray-500 text-white border-b rounded-lg"
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select item" : "..."}
            value={type}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setType(item);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <Icon
                className="mr-5"
                color={isFocus ? "skyblue" : "black"}
                name="place"
                size={20}
              />
            )}
          />
        </View>

        {/* GeoLocation */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">
            GeoLocation:
          </Text>

          <TouchableOpacity
            onPress={() => {
              setGeoLocationModal(!geoLocationModal);
            }}
            className="w-2/3"
          >
            <Text className="mx-1 p-1 bg-blue-300 text-center rounded-lg">
              Locate
              <Icon name="place" size={15} className="w-[10%]" />
            </Text>
          </TouchableOpacity>
        </View>

        {geoLocationModal && (
          <GeoLocationModal
            geoLocationModal={geoLocationModal}
            setGeoLocationModal={setGeoLocationModal}
            marker={marker}
            setMarker={setMarker}
          />
        )}
        {marker.latitude != "" && marker.longitude != "" && (
          <View className="my-2 flex-row items-center">
            <Text className="p-1 bg-black text-white rounded-lg">
              Lng: {marker.longitude}{" "}
            </Text>
            <Text className="p-1 bg-black text-white rounded-lg">
              Lat: {marker.latitude}{" "}
            </Text>
          </View>
        )}

        {/* Address */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">Address:</Text>
          <TextInput
            value={address.trim()}
            className="w-2/3 m-1 p-1 bg-gray-500 text-white border-b rounded-lg"
            onChangeText={(text) => setAddress(text)}
          />
        </View>

        {/* Contact */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">Contact:</Text>

          <View className="w-2/3 m-1 p-1 flex-row items-center bg-gray-500  border-b rounded-lg">
            <TextInput
              className="w-[90%] text-white"
              value={tempContact.trim()}
              onChangeText={(text) => {
                if (text.length > 10) text = text.slice(0, 10);
                setTempContact(text);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setContact((prev) => [...prev, Number(tempContact)]);
                setTempContact("");
              }}
            >
              <Icon
                name="add-call"
                size={15}
                color={"white"}
                className="w-[10%]"
              />
            </TouchableOpacity>
          </View>
        </View>

        {contact.length > 0 && (
          <View className="my-2 flex-row items-center">
            {contact.map((d, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  let temp = contact.filter((t) => t != d);
                  setContact(temp);
                }}
              >
                <Text className="mr-1 p-1 bg-black text-white rounded-lg">
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* AddedBy */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">
            Added By:
          </Text>
          <Text className="w-2/3 m-1 p-1 bg-gray-500 text-white border-b rounded-lg">
            {addedBy?.name}
          </Text>
        </View>

        {/* Images */}
        <View className="my-1 px-2 flex-row justify-between items-center">
          <Text className="w-1/3 text-white text-base font-bold">
            Upload Images:
          </Text>
          <TouchableOpacity
            className="w-2/3"
            onPress={() => console.log("Upload")}
          >
            <Text className="m-1 p-1 text-center text-base bg-blue-200 rounded-lg">
              Upload
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        {loading ? (
          <ActivityIndicator animating={loading} size={"large"} />
        ) : (
          <View className="w-full mt-2 flex-row justify-evenly items-center">
            <TouchableOpacity className="w-1/2" onPress={() => handleSubmit()}>
              <Text className="w-[80%] mx-auto p-4 text-center text-base text-white bg-blue-300 rounded-b-xl">
                Add
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2"
              onPress={() => navigation.goBack()}
            >
              <Text className="w-[80%] mx-auto p-4 text-center text-base text-white bg-red-500 rounded-b-xl">
                cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
