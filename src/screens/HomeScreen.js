// src/screens/HomeScreen.js
import React from "react";
import { View, Text, ScrollView } from "react-native";

import ScreenContainer from "../ScreenContainer";
import S from "../theme/styles";
import C from "../theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
    const { user } = useAuth();

    const displayName =
        (user?.name && user.name.split(" ")[0]) ||
        (user?.email && user.email.split("@")[0]) ||
        "there";

    return (
        <ScreenContainer>
            <ScrollView
                style={S.scrollView}
                contentContainerStyle={S.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HERO / WELCOME */}
                <View style={[S.card, { marginBottom: 20 }]}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <MaterialIcons name="support-agent" size={32} color={C.accent} />
                        <View style={{ marginLeft: 10 }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: C.subtext,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.8,
                                }}
                            >
                                Welcome, {displayName}
                            </Text>
                            <Text style={[S.title, { marginTop: 2 }]}>Tech Support Hub</Text>
                        </View>
                    </View>

                    <Text style={[S.subtitle, { textAlign: "left" }]}>
                        Track issues, manage your protection plan and give your users fast,
                        reliable tech support for all devices.
                    </Text>
                </View>

                {/* STATUS SNAPSHOT */}
                <View style={S.softCard}>
                    <Text style={S.title}>Today&apos;s snapshot</Text>
                    <View style={S.divider} />
                    <Text style={S.listItem}>• Active support sessions: 6</Text>
                    <Text style={S.listItem}>• New tickets today: 14</Text>
                    <Text style={S.listItem}>• Resolved in last 24h: 38</Text>
                    <Text style={S.listItem}>• Uptime: 99.98%</Text>
                </View>

                {/* GUIDED ACTIONS */}
                <View style={S.softCard}>
                    <Text style={S.title}>What would you like to do?</Text>
                    <View style={S.divider} />
                    <Text style={S.listItem}>• View live dashboard analytics</Text>
                    <Text style={S.listItem}>• Check or upgrade my plan</Text>
                    <Text style={S.listItem}>• Open a new support ticket</Text>
                    <Text style={S.listItem}>• Review device health & alerts</Text>
                </View>

                {/* TIPS */}
                <View style={S.softCard}>
                    <Text style={S.title}>Best practices</Text>
                    <View style={S.divider} />
                    <Text style={S.listItem}>• Keep your apps updated</Text>
                    <Text style={S.listItem}>• Use strong passwords + 2FA</Text>
                    <Text style={S.listItem}>• Schedule weekly health checks</Text>
                    <Text style={S.listItem}>• Monitor peak support timings</Text>
                </View>

                {/* QUICK LINKS – these should map to your tab/navigation routes */}
                <View style={S.softCard}>
                    <Text style={S.title}>Quick links</Text>
                    <View style={S.divider} />
                    <Text style={S.listItem}>👉 Dashboard</Text>
                    <Text style={S.listItem}>👉 Plan & billing</Text>
                    <Text style={S.listItem}>👉 Support / Tickets</Text>
                    <Text style={S.listItem}>👉 Profile & Settings</Text>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
