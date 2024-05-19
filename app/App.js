import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";

// Screens
import WelcomeScreen from "./src/screens/Welcome.jsx";
import Register from "./src/screens/Auth/Register.jsx";
import Login from "./src/screens/Auth/Login.jsx";
import Bottom_Tabs from "./src/BottomTabs.jsx";
import AddPlace from "./src/screens/tab_screens/Discover_Tab/AddPlaceScreen.jsx";
import ItemScreen from "./src/screens/ItemScreen.jsx";
import GuideScreen from "./src/screens/GuideScreen.jsx";
import Guide_Tabs from "./src/GuideTabs.jsx";
import TravelPlanDesctiption from "./src/screens/tab_screens/TravelPlanDesctiption.jsx";
import ExploreScreen from "./src/screens/ExploreScreen.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRoute={"Welcome"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Signup" component={Register} />
          <Stack.Screen name="Login" component={Login} />

          {/* User Screens */}
          <Stack.Screen name="Discover" component={Bottom_Tabs} />
          <Stack.Screen name="AddPlace_Screen" component={AddPlace} />

          <Stack.Screen name="ItemScreen" component={ItemScreen} />
          <Stack.Screen name="GuideScreen" component={GuideScreen} />
          <Stack.Screen
            name="PlanDesctiption"
            component={TravelPlanDesctiption}
          />
          <Stack.Screen name="ExploreScreen" component={ExploreScreen} />

          {/* Guide Screens */}
          <Stack.Screen name="Guide_Discover" component={Guide_Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
