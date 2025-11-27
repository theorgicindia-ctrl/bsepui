// App.js
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { AuthProvider, useAuth } from "./src/context/AuthContext";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SignupScreen from "./src/screens/SignupScreen";

import HomeScreen from "./src/screens/HomeScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import FeaturesScreen from "./src/screens/FeaturesScreen";
import PlansScreen from "./src/screens/PlansScreen";
import SubscriptionScreen from "./src/screens/SubscriptionScreen";
import SupportScreen from "./src/screens/SupportScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import C from "./src/theme/colors"; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom tab navigator: this is where your bottom menus live.
 * This whole thing will be mounted as the "Main" screen in the stack.
 */
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: C.primarySoft,
                tabBarInactiveTintColor: C.textMuted,
                tabBarStyle: {
                    backgroundColor: C.tabBg,
                    borderTopColor: C.tabBorder,
                    borderTopWidth: 1,
                    height: 64,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                },
                // simple example icons; you can customize per route
                tabBarIcon: ({ color, size }) => {
                    if (route.name === "Home") {
                        return <Ionicons name="home" size={size} color={color} />;
                    }
                    if (route.name === "Dashboard") {
                        return (
                            <MaterialIcons name="dashboard" size={size} color={color} />
                        );
                    }
                  
                    if (route.name === "Plans") {
                        return (
                            <MaterialIcons name="payment" size={size} color={color} />
                        );
                    }
                    if (route.name === "Subscription") {
                        return (
                            <MaterialIcons
                                name="subscriptions"
                                size={size}
                                color={color}
                            />
                        );
                    }
                    if (route.name === "Support") {
                        return (
                            <MaterialIcons name="support-agent" size={size} color={color} />
                        );
                    }
                    if (route.name === "Profile") {
                        return <Ionicons name="person" size={size} color={color} />;
                    }
                    return null;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Dashboard" component={DashboardScreen} />         
            <Tab.Screen name="Plans" component={PlansScreen} />
            <Tab.Screen name="Subscription" component={SubscriptionScreen} />
            <Tab.Screen name="Support" component={SupportScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

/**
 * Root navigator:
 * - while loading: show a spinner
 * - if user is logged in: show Main (tab navigator with bottom menus)
 * - if not logged in: show auth stack (Login / Register / Signup)
 */
function RootNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                // ✅ Logged in → show Main (bottom tabs)
                <Stack.Screen name="Main" component={MainTabs} />
            ) : (
                // ✅ Not logged in → show auth screens
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

/**
 * App entrypoint:
 * - Wrap everything in AuthProvider so useAuth works
 * - Wrap navigation in NavigationContainer
 */
export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
