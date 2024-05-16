import axios from "axios";
import URL from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function () {
  try {
    const response = await axios.get(URL.Profile.getProfile, {
      headers: {
        token: await AsyncStorage.getItem("token"),
      },
    });
    if (response.status === 200) return response.data?.user;
  } catch (err) {
    console.log("Error:", err);
  }
}
