// src/screens/PlansScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from "react-native";
import axios from "axios";
import config from "../config/extra";
import { AuthContext } from "../context/AuthContext";

import ScreenContainer from "../ScreenContainer";
import S from "../theme/styles";
import C from "../theme/colors";

export default function PlansScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [plans, setPlans] = useState([]);
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingPlanId, setSubmittingPlanId] = useState(null);
    const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | yearly
    const [showPlansList, setShowPlansList] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const resPlans = await axios.get(`${config.apiBaseUrl}/plans`);
                setPlans(resPlans.data?.plans || []);

                if (user?.id) {
                    const resSubs = await axios.get(
                        `${config.apiBaseUrl}/subscriptions/user/${user.id}`
                    );
                    const subsData = resSubs.data?.subscriptions || [];
                    setSubs(subsData);

                    const active = subsData.find((s) => s.subscription?.isActive);
                    // If user already has a plan, initially we show just summary
                    setShowPlansList(!active);
                }
            } catch (e) {
                console.error("Plans/Subs load error:", e);
                Alert.alert("Error", "Failed to load plans or subscriptions.");
            } finally {
                setLoading(false);
            }
        })();
    }, [user?.id]);

    const buyDemo = async (planId) => {
        if (!user?.id) {
            Alert.alert("Login required", "Please login first.");
            return;
        }
        try {
            setSubmittingPlanId(planId);
            const url = `${config.apiBaseUrl}/subscriptions/${user.id}/subscribe/${planId}?minutes=1&demo=true&billing=${billingCycle}`;
            await axios.post(url);
            Alert.alert("Success", "Successfully enrolled in the plan (Demo).");

            // 👉 Go to Subscription child screen inside Plans tab
            navigation.navigate("Subscription");
        } catch (e) {
            Alert.alert("Subscription Error", e?.response?.data || e.message);
        } finally {
            setSubmittingPlanId(null);
        }
    };

    const reactivatePlan = async (planId) => {
        if (!user?.id) return;
        try {
            setSubmittingPlanId(planId);
            await axios.patch(
                `${config.apiBaseUrl}/subscriptions/${user.id}/reactivate/${planId}?billing=${billingCycle}`
            );
            Alert.alert("Success", "Subscription reactivated.");
            navigation.navigate("Subscription");
        } catch (e) {
            Alert.alert("Error", e?.response?.data || e.message);
        } finally {
            setSubmittingPlanId(null);
        }
    };

    const calculatePrice = (price) => {
        if (billingCycle === "monthly") return price;
        const yearlyPrice = price * 12 * 0.7; // 30% off yearly
        return Number(yearlyPrice.toFixed(2));
    };

    const formatPrice = (amount, currency) => {
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency || "USD",
                minimumFractionDigits: 0,
            }).format(amount);
        } catch {
            return `${currency || "USD"} ${amount}`;
        }
    };

    const renderPlan = ({ item, index }) => {
        const price = calculatePrice(item.price);
        const cycleLabel = billingCycle === "monthly" ? "/month" : "/year";

        const userSub = subs.find((s) => s.subscription?.planId === item.id);
        const isCancelled = userSub && !userSub.subscription?.isActive;
        const isActive = userSub && userSub.subscription?.isActive;
        const isPopular = index === 1;

        return (
            <View
                style={[
                    styles.card,
                    isPopular && styles.cardPopularBorder,
                    isActive && styles.cardActive,
                ]}
            >
                <View style={styles.cardHeaderRow}>
                    <Text style={styles.planName}>{item.name}</Text>
                    {isPopular && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Most popular</Text>
                        </View>
                    )}
                    {isActive && !isCancelled && (
                        <View style={styles.badgeActive}>
                            <Text style={styles.badgeActiveText}>Current plan</Text>
                        </View>
                    )}
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.planPrice}>
                        {formatPrice(price, item.currency)}
                    </Text>
                    <Text style={styles.cycle}>{cycleLabel}</Text>
                </View>

                <Text style={styles.planDescription}>
                    {billingCycle === "yearly"
                        ? "Save up to 30% with annual billing and keep your devices covered all year."
                        : "Flexible monthly billing, ideal if you’re starting small or testing the service."}
                </Text>

                {(item.features || []).map((f, i) => (
                    <Text key={`${item.id}-f-${i}`} style={styles.feature}>
                        • {f.description}
                    </Text>
                ))}

                <Text style={styles.microCopy}>
                    Demo access starts immediately. You can upgrade or downgrade anytime.
                </Text>

                {isCancelled ? (
                    <TouchableOpacity
                        style={[
                            styles.buttonOutline,
                            submittingPlanId === item.id && { opacity: 0.7 },
                        ]}
                        disabled={submittingPlanId === item.id}
                        onPress={() => reactivatePlan(item.id)}
                    >
                        <Text style={styles.btnTextOutline}>
                            {submittingPlanId === item.id
                                ? "Processing..."
                                : `Reactivate ${item.name}`}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.button,
                            submittingPlanId === item.id && { opacity: 0.7 },
                        ]}
                        disabled={submittingPlanId === item.id}
                        onPress={() => buyDemo(item.id)}
                    >
                        <Text style={styles.btnText}>
                            {submittingPlanId === item.id
                                ? "Please wait..."
                                : isActive
                                    ? "Start demo session"
                                    : `Choose ${item.name}`}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <ScreenContainer centerContent>
                <ActivityIndicator size="large" color={C.accent} />
            </ScreenContainer>
        );
    }

    const active = subs.find((s) => s.subscription?.isActive);
    const lastCancelled = subs.find((s) => !s.subscription?.isActive);

    return (
        <ScreenContainer>
            {/* Header / context */}
            <View style={styles.headerCard}>
                <Text style={styles.headerTitle}>Plan & Billing</Text>
                <Text style={styles.headerSubtitle}>
                    Manage your tech support subscription, review your current coverage,
                    and upgrade when your team grows.
                </Text>
            </View>

            {/* SUBSCRIBED PLAN SUMMARY */}
            <View style={styles.currentCard}>
                <Text style={styles.currentTitle}>Subscribed plan</Text>
                <View style={styles.currentDivider} />

                {active ? (
                    <>
                        <Text style={styles.currentRow}>
                            Plan:{" "}
                            <Text style={styles.currentValue}>
                                {active.plan?.name ?? active.subscription?.planName ?? "-"}
                            </Text>
                        </Text>
                        <Text style={styles.currentRow}>
                            Billing:{" "}
                            <Text style={styles.currentValue}>
                                {active.subscription?.billingCycle === "yearly"
                                    ? "Yearly (-20%)"
                                    : active.subscription?.billingCycle === "monthly"
                                        ? "Monthly"
                                        : "-"}
                            </Text>
                        </Text>
                        <Text style={styles.currentRow}>
                            Price:{" "}
                            <Text style={styles.currentValue}>
                                {active.subscription?.price
                                    ? `₹${active.subscription.price} ${active.subscription.billingCycle === "monthly"
                                        ? "/month"
                                        : "/year"
                                    }`
                                    : "-"}
                            </Text>
                        </Text>
                        <Text style={styles.currentRow}>
                            Expiry:{" "}
                            <Text style={styles.currentValue}>
                                {active.subscription?.endDate ?? "-"}
                            </Text>
                        </Text>

                        <TouchableOpacity
                            style={styles.upgradeBtn}
                            onPress={() => setShowPlansList(true)}
                        >
                            <Text style={styles.upgradeText}>Upgrade / Change plan</Text>
                        </TouchableOpacity>

                        {/* Quick link to full subscription details */}
                        <TouchableOpacity
                            style={styles.reactivateBtn}
                            onPress={() => navigation.navigate("Subscription")}
                        >
                            <Text style={styles.reactivateText}>
                                View subscription details
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.currentRow}>
                            You don&apos;t have an active plan yet.
                        </Text>
                        <TouchableOpacity
                            style={styles.upgradeBtn}
                            onPress={() => setShowPlansList(true)}
                        >
                            <Text style={styles.upgradeText}>View available plans</Text>
                        </TouchableOpacity>
                        {lastCancelled && (
                            <TouchableOpacity
                                style={styles.reactivateBtn}
                                onPress={async () => {
                                    try {
                                        await axios.patch(
                                            `${config.apiBaseUrl}/subscriptions/${user.id}/reactivate/${lastCancelled.subscription.planId}?billing=${billingCycle}`
                                        );
                                        Alert.alert("Success", "Subscription reactivated.");
                                        navigation.navigate("Subscription");
                                    } catch (e) {
                                        Alert.alert(
                                            "Error",
                                            e?.response?.data || e.message
                                        );
                                    }
                                }}
                            >
                                <Text style={styles.reactivateText}>
                                    Reactivate last subscription
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>

            {/* Billing toggle */}
            {showPlansList && (
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            billingCycle === "monthly" && styles.tabActive,
                        ]}
                        onPress={() => setBillingCycle("monthly")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                billingCycle === "monthly" && styles.tabTextActive,
                            ]}
                        >
                            Monthly
                        </Text>
                        <Text
                            style={[
                                styles.tabHint,
                                billingCycle === "monthly" && styles.tabTextActive,
                            ]}
                        >
                            Pay as you go
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            billingCycle === "yearly" && styles.tabActive,
                        ]}
                        onPress={() => setBillingCycle("yearly")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                billingCycle === "yearly" && styles.tabTextActive,
                            ]}
                        >
                            Yearly
                        </Text>
                        <Text
                            style={[
                                styles.tabHint,
                                billingCycle === "yearly" && styles.tabTextActive,
                            ]}
                        >
                            Save up to 30%
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* PLAN LIST */}
            {showPlansList && (
                <FlatList
                    data={plans}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.listPad}
                    renderItem={renderPlan}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    listPad: { paddingBottom: 40 },

    // Header
    headerCard: {
        marginHorizontal: 4,
        marginTop: 4,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: C.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        color: C.subtext,
    },

    // Current plan card
    currentCard: {
        marginHorizontal: 4,
        marginBottom: 14,
        padding: 16,
        borderRadius: 16,
        backgroundColor: C.cardBg,
        borderWidth: 1,
        borderColor: C.border,
    },
    currentTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: C.text,
    },
    currentDivider: {
        height: 1,
        backgroundColor: C.border,
        marginVertical: 8,
    },
    currentRow: {
        fontSize: 13,
        color: C.subtext,
        marginBottom: 4,
    },
    currentValue: {
        color: C.text,
        fontWeight: "600",
    },
    upgradeBtn: {
        marginTop: 12,
        backgroundColor: C.primary,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    upgradeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    reactivateBtn: {
        marginTop: 10,
        borderWidth: 1.5,
        borderColor: C.success,
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
    },
    reactivateText: {
        color: C.success,
        fontWeight: "700",
        fontSize: 14,
    },

    // Tabs
    tabs: {
        flexDirection: "row",
        marginHorizontal: 4,
        marginTop: 8,
        borderRadius: 14,
        backgroundColor: "rgba(15,23,42,0.8)",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: C.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: "center",
    },
    tabActive: {
        backgroundColor: C.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "700",
        color: C.text,
    },
    tabHint: {
        fontSize: 11,
        marginTop: 2,
        color: C.subtext,
    },
    tabTextActive: {
        color: "#fff",
    },

    // Plan cards
    card: {
        backgroundColor: C.cardBg,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 4,
        marginTop: 16,
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: C.border,
    },
    cardPopularBorder: {
        borderColor: C.accent,
        shadowColor: C.accent,
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    cardActive: {
        borderColor: C.primary,
    },
    cardHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 10,
    },
    planName: {
        fontSize: 20,
        fontWeight: "700",
        color: C.text,
        flexShrink: 1,
        marginRight: 8,
    },

    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: "rgba(56,189,248,0.16)",
        marginRight: 6,
    },
    badgeText: {
        fontSize: 11,
        color: C.accent,
        fontWeight: "600",
    },
    badgeActive: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: "rgba(37,99,235,0.28)",
    },
    badgeActiveText: {
        fontSize: 11,
        color: "#fff",
        fontWeight: "600",
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 8,
        marginTop: 2,
    },
    planPrice: {
        fontSize: 24,
        fontWeight: "800",
        color: C.primary,
    },
    cycle: { fontSize: 13, color: C.subtext, marginLeft: 4 },

    planDescription: {
        fontSize: 13,
        color: C.subtext,
        marginBottom: 10,
    },

    feature: {
        color: C.text,
        marginBottom: 4,
        fontSize: 13,
    },

    microCopy: {
        fontSize: 11,
        color: C.subtext,
        marginTop: 6,
    },

    button: {
        backgroundColor: C.primary,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 16,
    },
    btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    buttonOutline: {
        borderWidth: 1.5,
        borderColor: C.primary,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "transparent",
    },
    btnTextOutline: { color: C.primary, fontSize: 16, fontWeight: "700" },
});
