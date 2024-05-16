import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import URL from "../../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Btn from "./Btn";

export default function Guide_Register({ role, setRole }) {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  async function handleSubmit() {
    try {
      setLoading(true);
      const response = await axios.post(URL.Auth.register, {
        role,
        name: name.trim(),
        gender,
        mobile: mobile.trim(),
        password: password.trim(),
      });
      console.log(response.data);
      if (response.status === 201) {
        setLoading(false);
        await AsyncStorage.setItem(
          "role",
          response.data?.result?.role?.toString()
        );
        await AsyncStorage.setItem("token", response.data?.token);
        if (response.data?.result?.role == 2) {
          navigation.navigate("Discover");
        } else navigation.navigate("Guide_Discover");
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Error registering the user");
      console.log(err);
    }
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={"height"}
        className="mx-auto w-[80%] flex-row justify-between items-center"
      >
        <Text className="text-lg text-black/50">Name: </Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          className="mx-auto my-4 w-[80%] text-center border-b text-lg bg-[rgb(220,220, 220)] text-darkGreen rounded-full"
        />
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={"height"}
        className="mx-auto w-[80%] flex-row justify-between items-center"
      >
        <Text className="text-lg text-black/50">Age: </Text>
        <TextInput
          placeholder="Age"
          value={age === NaN ? "" : age?.toString()}
          onChangeText={(text) => setAge(Number(text))}
          keyboardType="numeric"
          className="mx-auto text-center my-4 w-[80%] border-b text-lg bg-[rgb(220,220, 220)] text-darkGreen rounded-full"
        />
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={"height"}
        className="mx-auto w-[80%] flex-row justify-between items-center"
      >
        <Text className="text-lg text-black/50">Gender</Text>

        <RadioButton.Group
          onValueChange={(newValue) => setGender(newValue)}
          value={gender}
          className="flex-row items-center justify-between"
        >
          <RadioButton.Item
            label="Male"
            labelStyle={{ color: "green" }}
            value={1}
            className="w-[70%]"
          />
          <RadioButton.Item
            label="Female"
            labelStyle={{ color: "green" }}
            value={2}
            className="w-[70%]"
          />
        </RadioButton.Group>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={"height"}
        className="mx-auto w-[80%] flex-row justify-between items-center"
      >
        <View>
          <Text className="text-lg text-black/50">Mobile</Text>
          <Text className="text-lg text-black/50">Number:</Text>
        </View>

        <View className="flex-row justify-center items-center">
          <Text className="w-1/5 flex text-xl text-center text-black/50 items-center">
            +91
          </Text>
          <TextInput
            className="mx-auto w-[70%] my-2 px-2 text-center text-lg bg-white text-darkGreen border-b rounded-full"
            placeholder="your mobile number"
            maxLength={10}
            value={mobile}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              // Limit to 10 digits
              const formattedValue = numericValue.slice(0, 10);
              setMobile(formattedValue);
            }}
            keyboardType={"numeric"}
          />
        </View>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={"height"}
        className="mx-auto w-[80%] flex-row justify-between items-center"
      >
        <Text className="text-lg text-black/50">Password: </Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          className="mx-auto my-4 w-[80%] text-center border-b text-lg bg-[rgb(220,220, 220)] text-darkGreen rounded-full"
        />
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={"height"}
        className="mx-auto w-[80%] flex-row justify-between items-center"
      >
        <View>
          <Text className="text-lg text-black/50">Repeat</Text>
          <Text className="text-lg text-black/50">Password:</Text>
        </View>
        <TextInput
          placeholder="Confirm Password"
          value={repeatPassword}
          onChangeText={(text) => setRepeatPassword(text)}
          secureTextEntry={true}
          className="mx-auto my-4 w-[80%] text-center border-b text-lg bg-[rgb(220,220, 220)] text-darkGreen rounded-full"
        />
      </KeyboardAvoidingView>

      <View className="w-[70%] mx-auto">
        <Text className="text-gray-500 text-base">
          By signing in, you agree to our
        </Text>
        <View className="flex-row">
          <Text className="text-darkGreen font-bold">Terms & Conditions</Text>
          <Text className="text-gray-500"> and </Text>
          <Text className="text-darkGreen font-bold">Privacy Policy</Text>
        </View>
      </View>
      <View className="my-4 px-4 flex-row justify-center">
        <Btn
          disabled={
            loading ? true : repeatPassword === password && password.length > 0
          }
          bgColor={
            repeatPassword === password && password.length > 0 ? "green" : ""
          }
          textColor={"white"}
          btnLabel={
            loading ? (
              <ActivityIndicator size={"large"} animating={loading} />
            ) : (
              "Signup"
            )
          }
          Press={() => {
            handleSubmit();
          }}
        />
      </View>
    </>
  );
}
