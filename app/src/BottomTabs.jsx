import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomBottomTab from "./components/Bottom_Tabs/CustomBottomTab.jsx";

// Tabs
import Discover_Tab from "./screens/tab_screens/Discover_Tab/Discover_Tab.jsx";
import Guide_Tab from "./screens/tab_screens/Guide_Tab/Guide_Tab.jsx";
import Plan_Tab from "./screens/tab_screens/Plan_Tab/Plan_Tab.jsx";
import Profile_Tab from "./screens/tab_screens/Profile_Tab/Profile_Tab.jsx";
import Wishlist_Tab from "./screens/tab_screens/Wishlist_Tab/Wishlist_Tab.jsx";

const Tab = createBottomTabNavigator();

export default function Bottom_Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTab {...props} />}
      initialRouteName="Discover_Tab"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Group>
        <Tab.Screen
          name="Discover_Tab"
          component={Discover_Tab}
          options={{
            tabbarlabel: "Discover",
          }}
        />

        <Tab.Screen
          name="Guide_Tab"
          component={Guide_Tab}
          options={{
            tabbarlabel: "Guide",
          }}
        />

        <Tab.Screen
          name="Plan_Tab"
          component={Plan_Tab}
          options={{
            tabbarlabel: "Plan",
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
          name="Wishlist_Tab"
          component={Wishlist_Tab}
          options={{
            tabbarlabel: "Wishlist",
          }}
        />
      </Tab.Group>
    </Tab.Navigator>
  );
}
