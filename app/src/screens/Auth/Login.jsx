import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import URL from "../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OtpInput } from "react-native-otp-entry";

// Components
import Background from "./components/Background";
import Btn from "./components/Btn";

export default function Login({ navigation }) {
  // Form Details
  const [role, setRole] = useState(2);
  const [isGuideLogin, setIsGuideLogin] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgetPass, setForgetPass] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      const response = await axios.post(URL.Auth.login, {
        role,
        mobile: mobile.trim(),
        password: password.trim(),
      });
      console.log(response.data);
      if (response.status === 200) {
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

  useLayoutEffect(
    useCallback(() => {
      async function fetchInitials() {
        try {
          const role = await AsyncStorage.getItem("role");
          const token = await AsyncStorage.getItem("token");
          if (role && token) {
            if (role == 2) {
              navigation.navigate("Discover");
            } else navigation.navigate("Guide_Discover");
          }
        } catch (err) {
          console.log(err);
        }
      }

      fetchInitials();
    }, [])
  );

  return (
    <Background>
      <View className="w-full items-center">
        <Text className="text-white font-bold text-4xl my-8">Login</Text>
        <View className="w-full h-full mx-auto pt-10 bg-white rounded-tl-[100] rounded-tr-[100]">
          <View className="mx-auto">
            <Text className="text-darkGreen font-bold text-2xl">
              Welcome Back
            </Text>
            <Text className="mb-4 text-grey-500 text-lg font-bold">
              Login to your account
            </Text>
          </View>

          {forgetPass ? (
            <FogetPassword
              role={role}
              setRole={setRole}
              mobile={mobile}
              setMobile={setMobile}
              forgetPass={forgetPass}
              setForgetPass={setForgetPass}
            />
          ) : (
            <>
              {" "}
              <Text className="mx-auto w-[40%] text-xl text-center border-b-2 border-b-darkGreen">
                {isGuideLogin ? "Guide Login" : "User Login"}
              </Text>
              <View className="mx-auto my-2 w-[80%] rounded-full">
                <Text className="text-lg text-black/50">Mobile Number</Text>
                <View className="flex-row justify-center items-center">
                  <Text className="w-1/5 flex text-xl text-center text-black/50 justify-center items-center">
                    +91
                  </Text>
                  <TextInput
                    className="mx-auto w-[80%] my-2 px-4 text-lg bg-white text-darkGreen border-b rounded-full"
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
              </View>
              <KeyboardAvoidingView behavior={"height"} className="flex">
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                  className="mx-auto my-4 w-[80%] border-b text-lg bg-[rgb(220,220, 220)] text-darkGreen rounded-full"
                />
              </KeyboardAvoidingView>
              <TouchableOpacity
                onPress={() => setForgetPass(true)}
                className="w-[80%] mb-8 items-end"
              >
                <Text className="text-center text-darkGreen font-bold text-lg">
                  Forgot Password ?
                </Text>
              </TouchableOpacity>
              <Btn
                disabled={loading ? true : password && password.length > 0}
                bgColor={password && password.length > 0 ? "green" : ""}
                textColor={"white"}
                btnLabel={
                  loading ? (
                    <ActivityIndicator size={"large"} animating={loading} />
                  ) : (
                    "Login"
                  )
                }
                Press={() => {
                  handleLogin();
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (role === 2) setRole(3);
                  else if (role === 3) setRole(2);
                  setIsGuideLogin(!isGuideLogin);
                }}
                className="w-[50%] mx-auto my-4 bg-darkGreen rounded-lg"
              >
                <Text className="p-2 text-white text-center">
                  {isGuideLogin
                    ? "Switch to User Login"
                    : "Switch to Guide Login"}
                </Text>
              </TouchableOpacity>
              <View className="flex-row justify-center">
                <Text className="font-bold text-lg">
                  Don't have an account ?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                  <Text className="text-darkGreen font-bold text-lg">
                    Signup
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Background>
  );
}

const FogetPassword = ({
  role,
  setRole,
  mobile,
  setMobile,
  forgetPass,
  setForgetPass,
}) => {
  const [loading, setLoading] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [sendOTPCheck, setSendOTPCheck] = useState(false);

  const [newPass, setNewPass] = useState("");
  const [cnfPass, setCnfPass] = useState(false);

  async function handleSendOTP() {
    try {
      setLoading(true);
      const response = await axios.post(URL.Auth.sendOTP, { mobile });

      if (response.status == 200) {
        setSendOTPCheck(true);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  async function handleOTPVerify(otp) {
    try {
      setLoading(true);
      const response = await axios.post(URL.Auth.verifyOTP, { otp });

      if (response.status == 200) {
        setChangePass(true);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  async function changePassword() {
    try {
      setLoading(true);
      const response = await axios.post(URL.Auth.changePass, {});
      if (response.status === 200) {
        let role = response.data?.user?.role;
        setLoading(false);
        if (role == 2) {
          navigation.navigate("Discover");
        } else navigation.navigate("Guide_Discover");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <View className="my-2 px-4 items-center">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          className="w-[40%]"
          onPress={() => setForgetPass(false)}
        >
          <Text> Back to login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[40%]"
          onPress={() => setRole(role == 2 ? 3 : 2)}
        >
          <Text> {role == 2 ? "Switch to guide" : "Switch to user"}</Text>
        </TouchableOpacity>
      </View>

      <View className="my-2 px-2">
        <View className="flex-row justify-center items-center">
          <Text className="w-1/5 flex text-xl text-center text-black/50 justify-center items-center">
            +91
          </Text>
          <TextInput
            className="mx-auto w-[80%] my-2 px-4 text-lg bg-white text-darkGreen border-b rounded-full"
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

        <TouchableOpacity onPress={() => handleSendOTP()}>
          <Text className="my-2 p-1 text-cetner bg-blue-400 text-black">
            Send OTP
          </Text>
        </TouchableOpacity>
      </View>

      {sendOTPCheck ? (
        <ActivityIndicator size={"large"} animating={loading} />
      ) : (
        <OtpInput
          numberOfDigits={6}
          focusColor="green"
          focusStickBlinkingDuration={500}
          onFilled={(text) => handleOTPVerify(text)}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          // theme={{
          //   containerStyle: styles.container,
          //   pinCodeContainerStyle: styles.pinCodeContainer,
          //   pinCodeTextStyle: styles.pinCodeText,
          //   focusStickStyle: styles.focusStick,
          //   focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          // }}
        />
      )}

      {changePass && loading ? (
        <ActivityIndicator animating={loading} size={"large"} />
      ) : (
        <View>
          <TextInput
            value={newPass}
            onChangeText={(text) => setNewPass(text)}
            placeholder="New Password"
          />
          <TextInput
            onChangeText={(text) =>
              text == newPass ? setCnfPass(true) : setCnfPass(false)
            }
            placeholder="Confirm New Password"
          />

          <TouchableOpacity
            className=""
            disabled={!cnfPass}
            onPress={() => changePassword()}
          >
            <Text
              className={`my-2 p-1 text-cetner ${
                cnfPass ? "bg-gray-400 text-white" : "bg-blue-400 text-black"
              }`}
            >
              Change password
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
