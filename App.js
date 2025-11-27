// App.js
import React from "react";
import { ActivityIndicator, View } from "react-native";
import {
    NavigationContainer,
    DefaultTheme,
} from "@react-navigation/native";
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
const PlansStack = createNativeStackNavigator();

/**
 * Custom dark theme so any “gaps” behind the tab bar are also dark,
 * not white.
 */
const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: C.background || "#020617",
        card: C.cardBg || "#020617",
        border: C.tabBorder || "#1f2937",
        text: C.text || "#E2E8F0",
        primary: C.primary || "#2563EB",
    },
};

/**
 * Stack only for Plans tab:
 * - PlansMain: plans & subscribed plan
 * - Subscription: details of current subscription
 *
 * Because this stack lives INSIDE the bottom tab, the tab bar
 * stays visible even on Subscription screen.
 */
function PlansStackNavigator() {
    return (
        <PlansStack.Navigator screenOptions={{ headerShown: false }}>
            <PlansStack.Screen
                name="PlansMain"
                component={PlansScreen}
            />
            <PlansStack.Screen
                name="Subscription"
                component={SubscriptionScreen}
            />
        </PlansStack.Navigator>
    );
}

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

                // Main background for all tab scenes (the area behind screens)
                sceneContainerStyle: {
                    backgroundColor: C.background,
                },

                // Tab bar styling: pulled in from the sides to avoid clipping labels
                tabBarStyle: {
                    backgroundColor: C.tabBg,
                    borderTopColor: C.tabBorder,
                    borderTopWidth: 1,
                    height: 64,

                    // Pull in from edges so "Home" / "Profile" text isn't cut off
                    marginHorizontal: 12,
                    marginBottom: 10,
                    borderRadius: 16,

                    // Inner padding so icons / labels have breathing room
                    paddingHorizontal: 16,
                    paddingBottom: 8,
                    paddingTop: 6,
                },

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                },

                tabBarItemStyle: {
                    paddingHorizontal: 4,
                },

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
                    if (route.name === "Support") {
                        return (
                            <MaterialIcons
                                name="support-agent"
                                size={size}
                                color={color}
                            />
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
            {/* Features is still imported; add as a tab if needed:
              <Tab.Screen name="Features" component={FeaturesScreen} />
            */}
            {/* 👇 Plans tab now renders a nested stack (Plans + Subscription) */}
            <Tab.Screen
                name="Plans"
                component={PlansStackNavigator}
                options={{ headerShown: false }}
            />
            {/* Subscription tab removed as requested */}
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
                    backgroundColor: C.background,
                }}
            >
                <ActivityIndicator size="large" color={C.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    {/* ✅ Logged in → show Main (bottom tabs) */}
                    <Stack.Screen name="Main" component={MainTabs} />
                    {/* ❌ NO extra "Subscription" screen here anymore
                        so it only exists as a child under the Plans tab. */}
                </>
            ) : (
                <>
                    {/* ✅ Not logged in → show auth screens */}
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
 * - Wrap navigation in NavigationContainer with dark theme
 */
export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer theme={AppTheme}>
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
    