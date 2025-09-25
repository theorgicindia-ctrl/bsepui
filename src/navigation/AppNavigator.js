// import React, { useEffect, useState } from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// import DrawerContent from './DrawerContent';
// import HomeScreen from '../screens/HomeScreen';
// import DashboardScreen from '../screens/DashboardScreen';
// import PlansScreen from '../screens/PlansScreen';
// import SubscriptionScreen from '../screens/SubscriptionScreen';
// import FeaturesScreen from '../screens/FeaturesScreen';
// import SupportScreen from '../screens/SupportScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import LoginScreen from '../screens/LoginScreen';
// import { View, ActivityIndicator } from 'react-native';
// import C from '../theme/colors';
import DrawerContent from '../navigation/DrawerContent'; 
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PlansScreen from '../screens/PlansScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import FeaturesScreen from '../screens/FeaturesScreen';
import SupportScreen from '../screens/SupportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
const Drawer = createDrawerNavigator();

function Splash() {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:C.bg}}>
      <ActivityIndicator size="large" color={C.primary} />
    </View>
  );
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000); // initial loading
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Splash />;

  const theme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: C.bg, text: C.text, primary: C.primary, card: C.card },
  };

  return (
    <NavigationContainer theme={theme}>
      <Drawer.Navigator
        screenOptions={{ headerStyle:{backgroundColor:C.card}, headerTintColor:C.text }}
        drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Dashboard" component={DashboardScreen} />
        <Drawer.Screen name="Plans" component={PlansScreen} />
        <Drawer.Screen name="Subscription" component={SubscriptionScreen} />
        <Drawer.Screen name="Features" component={FeaturesScreen} />
        <Drawer.Screen name="Support" component={SupportScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
