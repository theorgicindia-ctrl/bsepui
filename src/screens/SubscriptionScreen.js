// src/screens/SubscriptionScreen.js
import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import axios from "axios";
import config from "../config/extra";
import { AuthContext } from "../context/AuthContext";
import ScreenContainer from "../ScreenContainer";
import C from "../theme/colors";

export default function SubscriptionScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [subs, setSubs] = useState([]);
    const [reactivateBilling, setReactivateBilling] = useState("monthly");

    const load = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const res = await axios.get(
                `${config.apiBaseUrl}/subscriptions/user/${user.id}`
            );
            setSubs(res.data?.subscriptions || []);
        } catch (e) {
            Alert.alert("Error", e?.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    if (!user) {
        return (
            <ScreenContainer centerContent>
                <Text style={{ color: C.text }}>
                    Please login to view subscription.
                </Text>
            </ScreenContainer>
        );
    }

    const active = subs.find((s) => s.subscription?.isActive);
    const lastCancelled = subs.find((s) => !s.subscription?.isActive);

    const goHome = () => {
        const parent = navigation.getParent();
        if (parent) {
            parent.navigate("Home");
        } else {
            navigation.navigate("Home");
        }
    };

    const goPlans = () => {
        // Ensure we are on the Plans tab and main Plans screen
        const parent = navigation.getParent();
        if (parent) {
            parent.navigate("Plans");
        }
        // Inside the Plans stack, go to the main screen
        navigation.navigate("PlansMain");
    };

    return (
        <ScreenContainer>
            {/* Breadcrumbs for child menu */}
            <View style={styles.breadcrumbRow}>
                <TouchableOpacity onPress={goHome}>
                    <Text style={styles.breadcrumbLink}>Home</Text>
                </TouchableOpacity>
                <Text style={styles.breadcrumbSeparator}>›</Text>
                <TouchableOpacity onPress={goPlans}>
                    <Text style={styles.breadcrumbLink}>Plans</Text>
                </TouchableOpacity>
                <Text style={styles.breadcrumbSeparator}>›</Text>
                <Text style={styles.breadcrumbCurrent}>Subscription</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>My Subscription</Text>
                <View style={styles.divider} />

                <Text style={styles.row}>
                    Email: <Text style={styles.value}>{user.email}</Text>
                </Text>
                <Text style={styles.row}>
                    Status:{" "}
                    <Text style={styles.value}>
                        {active ? "Active" : "Not Active"}
                    </Text>
                </Text>
                <Text style={styles.row}>
                    Plan:{" "}
                    <Text style={styles.value}>
                        {active?.plan?.name ??
                            active?.subscription?.planName ??
                            "-"}
                    </Text>
                </Text>
                <Text style={styles.row}>
                    Billing Cycle:{" "}
                    <Text style={styles.value}>
                        {active?.subscription?.billingCycle === "yearly"
                            ? "Yearly (-20%)"
                            : active?.subscription?.billingCycle === "monthly"
                                ? "Monthly"
                                : "-"}
                    </Text>
                </Text>
                <Text style={styles.row}>
                    Price Paid:{" "}
                    <Text style={styles.value}>
                        {active?.subscription?.price
                            ? `₹${active.subscription.price} ${active.subscription.billingCycle === "monthly"
                                ? "/month"
                                : "/year"
                            }`
                            : "-"}
                    </Text>
                </Text>
                <Text style={styles.row}>
                    Expiry:{" "}
                    <Text style={styles.value}>
                        {active?.subscription?.endDate ?? "-"}
                    </Text>
                </Text>

                {/* Refresh */}
                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={load}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>Refresh</Text>
                    )}
                </TouchableOpacity>

                {/* Cancel */}
                {active && (
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={async () => {
                            try {
                                await axios.patch(
                                    `${config.apiBaseUrl}/subscriptions/${user.id}/cancel`
                                );
                                Alert.alert(
                                    "Success",
                                    "Subscription cancelled."
                                );
                                load();
                            } catch (e) {
                                Alert.alert(
                                    "Error",
                                    e?.response?.data || e.message
                                );
                            }
                        }}
                    >
                        <Text style={styles.cancelText}>
                            Cancel Subscription
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Reactivate */}
                {!active && lastCancelled && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.reactivateLabel}>
                            Reactivate as:
                        </Text>
                        <View style={styles.tabs}>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    reactivateBilling === "monthly" &&
                                    styles.tabActive,
                                ]}
                                onPress={() =>
                                    setReactivateBilling("monthly")
                                }
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        reactivateBilling === "monthly" &&
                                        styles.tabTextActive,
                                    ]}
                                >
                                    Monthly
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    reactivateBilling === "yearly" &&
                                    styles.tabActive,
                                ]}
                                onPress={() => setReactivateBilling("yearly")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        reactivateBilling === "yearly" &&
                                        styles.tabTextActive,
                                    ]}
                                >
                                    Yearly (-20%)
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.reactivateBtn}
                            onPress={async () => {
                                try {
                                    await axios.patch(
                                        `${config.apiBaseUrl}/subscriptions/${user.id}/reactivate/${lastCancelled.subscription.planId}?billing=${reactivateBilling}`
                                    );
                                    Alert.alert(
                                        "Success",
                                        "Subscription reactivated."
                                    );
                                    load();
                                } catch (e) {
                                    Alert.alert(
                                        "Error",
                                        e?.response?.data || e.message
                                    );
                                }
                            }}
                        >
                            <Text style={styles.reactivateText}>
                                Reactivate Subscription
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Back home button */}
                <TouchableOpacity
                    style={[styles.button, { marginTop: 20 }]}
                    onPress={goHome}
                >
                    <Text style={styles.btnText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    // Breadcrumbs
    breadcrumbRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    breadcrumbLink: {
        color: C.accent,
        fontSize: 12,
        fontWeight: "600",
    },
    breadcrumbSeparator: {
        marginHorizontal: 4,
        color: C.subtext,
        fontSize: 12,
    },
    breadcrumbCurrent: {
        color: C.text,
        fontSize: 12,
        fontWeight: "700",
    },

    card: {
        backgroundColor: C.cardBg,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: C.border,
    },
    title: { fontSize: 18, fontWeight: "700", color: C.text },
    divider: { height: 1, backgroundColor: C.border, marginVertical: 10 },
    row: { fontSize: 14, color: C.text, marginBottom: 6 },
    value: { fontWeight: "600", color: C.accent },
    button: {
        backgroundColor: C.primary,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 14,
    },
    btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

    cancelBtn: {
        marginTop: 12,
        borderWidth: 1.5,
        borderColor: C.danger,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
    },
    cancelText: { color: C.danger, fontWeight: "700", fontSize: 15 },

    reactivateLabel: { fontWeight: "600", marginBottom: 8, color: C.text },
    tabs: {
        flexDirection: "row",
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: "rgba(15,23,42,0.8)",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: C.border,
    },
    tab: { flex: 1, padding: 10, alignItems: "center" },
    tabActive: { backgroundColor: C.primary },
    tabText: { fontSize: 14, fontWeight: "600", color: C.subtext },
    tabTextActive: { color: "#fff" },
    reactivateBtn: {
        marginTop: 4,
        borderWidth: 1.5,
        borderColor: C.success,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
    },
    reactivateText: { color: C.success, fontWeight: "700", fontSize: 15 },
});
