// src/screens/DashboardScreen.js
import React from "react";
import { View, Text, ScrollView } from "react-native";

import ScreenContainer from "../ScreenContainer";
import S from "../theme/styles";
import C from "../theme/colors";

export default function DashboardScreen() {
    // --- Static demo data (replace with API later) ---

    // How many times users came to the site this week
    const weeklyVisits = [
        { label: "Mon", value: 50 },
        { label: "Tue", value: 95 },
        { label: "Wed", value: 135 },
        { label: "Thu", value: 180 },
        { label: "Fri", value: 160 },
        { label: "Sat", value: 210 },
        { label: "Sun", value: 250 },
    ];
    const maxVisits = Math.max(...weeklyVisits.map((d) => d.value));

    // Support load (IT / tech support)
    const supportLoad = [
        { label: "Active tickets", value: 32, max: 100 },
        { label: "On-going sessions", value: 18, max: 60 },
        { label: "Resolved today", value: 76, max: 100 },
        { label: "SLA breaches", value: 2, max: 20 },
    ];

    // Quick metrics
    const metrics = {
        loginsToday: 42, // how many times users logged in / came on site
        uniqueUsers: 28,
        concurrentSupport: 6, // continuously getting support right now
        avgHandleTime: "8m 32s",
        uptime: "99.98%",
        satisfaction: "4.8 / 5",
    };

    return (
        <ScreenContainer>
            <ScrollView
                style={S.scrollView}
                contentContainerStyle={S.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={S.dashboardHeader}>
                    <Text style={S.dashboardTitle}>Support Dashboard</Text>
                    <Text style={S.dashboardSubtitle}>
                        Live overview of your IT & technology support performance.
                    </Text>
                </View>

                {/* METRIC CARDS */}
                <View style={S.metricRow}>
                    <View style={S.metricCard}>
                        <Text style={S.metricLabel}>Logins today</Text>
                        <Text style={S.metricValue}>{metrics.loginsToday}</Text>
                        <Text style={S.metricTag}>Users came to portal</Text>
                    </View>

                    <View style={S.metricCard}>
                        <Text style={S.metricLabel}>Unique users</Text>
                        <Text style={S.metricValue}>{metrics.uniqueUsers}</Text>
                        <Text style={S.metricTag}>Different customers</Text>
                    </View>

                    <View style={S.metricCard}>
                        <Text style={S.metricLabel}>Active support sessions</Text>
                        <Text style={S.metricValue}>{metrics.concurrentSupport}</Text>
                        <Text style={S.metricTag}>Continuously getting support</Text>
                    </View>

                    <View style={S.metricCard}>
                        <Text style={S.metricLabel}>Avg handle time</Text>
                        <Text style={S.metricValue}>{metrics.avgHandleTime}</Text>
                        <Text style={S.metricTag}>Per ticket</Text>
                    </View>
                </View>

                {/* VISITS "CHART" */}
                <View style={S.card}>
                    <View style={S.chartTitleRow}>
                        <View>
                            <Text style={S.chartTitle}>User visits this week</Text>
                            <Text style={S.chartSubtitle}>
                                How often users opened your support portal
                            </Text>
                        </View>
                        <View style={S.chartBadge}>
                            <Text style={S.chartBadgeText}>Tech Traffic</Text>
                        </View>
                    </View>

                    <View style={S.chartBarRow}>
                        {weeklyVisits.map((item) => {
                            const ratio = item.value / maxVisits || 0;
                            const barHeight = 50 + 90 * ratio; // between 50 and 140

                            return (
                                <View key={item.label} style={S.chartBarWrapper}>
                                    <Text style={S.chartBarValue}>{item.value}</Text>
                                    <View
                                        style={[
                                            S.chartBar,
                                            { height: barHeight },
                                        ]}
                                    />
                                    <Text style={S.chartBarLabel}>{item.label}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* SUPPORT LOAD "HORIZONTAL CHART" */}
                <View style={S.card}>
                    <View style={S.chartTitleRow}>
                        <View>
                            <Text style={S.chartTitle}>Support load</Text>
                            <Text style={S.chartSubtitle}>
                                Real-time snapshot of your IT helpdesk
                            </Text>
                        </View>
                        <View style={S.chartBadge}>
                            <Text style={S.chartBadgeText}>IT Service Desk</Text>
                        </View>
                    </View>

                    <View style={S.chartHBarRow}>
                        {supportLoad.map((item) => {
                            const pct = Math.min(item.value / item.max, 1);
                            return (
                                <View key={item.label} style={S.chartHBarItem}>
                                    <View style={S.chartHBarHeader}>
                                        <Text style={S.chartHBarLabel}>{item.label}</Text>
                                        <Text style={S.chartHBarValue}>
                                            {item.value} / {item.max}
                                        </Text>
                                    </View>
                                    <View style={S.chartHBarTrack}>
                                        <View
                                            style={[
                                                S.chartHBarFill,
                                                { width: `${pct * 100}%` },
                                            ]}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* SYSTEM HEALTH & SLA */}
                <View style={S.softCard}>
                    <Text style={S.title}>System health</Text>
                    <View style={S.divider} />
                    <Text style={S.listItem}>
                        Uptime: <Text style={S.statusGood}>{metrics.uptime}</Text>
                    </Text>
                    <Text style={S.listItem}>
                        SLA compliance: <Text style={S.statusGood}>98%</Text>
                    </Text>
                    <Text style={S.listItem}>
                        Satisfaction:{" "}
                        <Text style={S.statusGood}>{metrics.satisfaction}</Text>
                    </Text>
                </View>

                <View style={S.softCard}>
                    <Text style={S.title}>Support insights</Text>
                    <View style={S.divider} />
                    <Text style={S.listItem}>
                        • Most common issues: app crashes, login failures, slow network.
                    </Text>
                    <Text style={S.listItem}>
                        • Peak support hours: 10:00–13:00 and 18:00–21:00.
                    </Text>
                    <Text style={S.listItem}>
                        • Devices: 60% Android, 40% iOS.
                    </Text>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
