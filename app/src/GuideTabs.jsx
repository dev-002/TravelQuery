import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomBottomTab from "./components/Bottom_Tabs/Guide_CustomBottomTab.jsx";

// Tabs
import Home_Tab from "./screens/guide_tab_screens/Home_Tab/Home_Tab.jsx";
import Tour_Tab from "./screens/guide_tab_screens/Tours_Tab/Tours_Tab.jsx";
import Bookings_Tab from "./screens/guide_tab_screens/Bookings_Tab/Bookings_Tab.jsx";
import Profile_Tab from "./screens/guide_tab_screens/Profile_Tab/Profile_Tab.jsx";
import Review_Tab from "./screens/guide_tab_screens/Rreview_Tab/Review_Tab.jsx";

const Tab = createBottomTabNavigator();

export default function Bottom_Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTab {...props} />}
      initialRouteName="Home_Tab"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Group>
        <Tab.Screen
          name="Home_Tab"
          component={Home_Tab}
          options={{
            tabbarlabel: "Home",
          }}
        />

        <Tab.Screen
          name="Tours_Tab"
          component={Tour_Tab}
          options={{
            tabbarlabel: "Tour",
          }}
        />

        <Tab.Screen
          name="Bookings_Tab"
          component={Bookings_Tab}
          options={{
            tabbarlabel: "Bookings",
          }}
        />

        <Tab.Screen
          name="Profile_Tab"
          component={Profile_Tab}
          options={{
            tabbarlabel: "Profile",
          }}
        />

        <Tab.Screen
          name="Reviews_Tab"
          component={Review_Tab}
          options={{
            tabbarlabel: "Reviews",
          }}
        />
      </Tab.Group>
    </Tab.Navigator>
  );
}
