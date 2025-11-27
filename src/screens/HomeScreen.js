import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenContainer from "../ScreenContainer";
import S from "../theme/styles";
import C from "../theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
    const { user, logoutUser } = useAuth();

    //const { user, logout } = useContext(AuthContext);

    const onLogoutPress = async () => {
        await logoutUser();
        // No manual navigation needed:
        // RootNavigator will see user === null and show LoginScreen.
    };


    return (
        <ScreenContainer>
      <View style={[S.card, { alignItems: "center" }]}>
        <MaterialIcons name="support-agent" size={36} color={C.primary} />
        <Text style={[S.title, { marginTop: 8 }]}>Tech Support</Text>
        <Text style={[S.subtitle, { textAlign: "center" }]}>
          Reliable support for your apps & software. Explore plans and manage your subscription.
        </Text>
      </View>

      <View style={S.softCard}>
        <Text style={S.title}>Announcements</Text>
        <View style={S.divider} />
        <Text style={S.listItem}>✔ New AI-powered diagnostics</Text>
        <Text style={S.listItem}>✔ 24/7 support for all users</Text>
      </View>

      <View style={S.softCard}>
        <Text style={S.title}>Tips & Tricks</Text>
        <View style={S.divider} />
        <Text style={S.listItem}>• Optimize app performance</Text>
        <Text style={S.listItem}>• Security best practices</Text>
      </View>

      <View style={S.softCard}>
        <Text style={S.title}>Quick Links</Text>
        <View style={S.divider} />
        <Text style={S.listItem}>👉 Dashboard</Text>
        <Text style={S.listItem}>👉 Subscription</Text>
        <Text style={S.listItem}>👉 Support</Text>
      </View>
        </ScreenContainer>
  );
}
