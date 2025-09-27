import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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

// ⚠️ Apple restore purchases (commented for now)
// import * as InAppPurchases from "expo-in-app-purchases";

export default function SubscriptionScreen() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState([]);
  const [reactivateBilling, setReactivateBilling] = useState("monthly"); // monthly | yearly

  const load = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${config.apiBaseUrl}/subscriptions/user/${user.id}`);
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
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text>Please login to view subscription.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const active = subs.find((s) => s.subscription?.isActive);
  const lastCancelled = subs.find((s) => !s.subscription?.isActive);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>My Subscription</Text>
        <View style={styles.divider} />

        <Text style={styles.row}>
          Email: <Text style={styles.value}>{user.email}</Text>
        </Text>
        <Text style={styles.row}>
          Status: <Text style={styles.value}>{active ? "Active" : "Not Active"}</Text>
        </Text>
        <Text style={styles.row}>
          Plan:{" "}
          <Text style={styles.value}>
            {active?.plan?.name ?? active?.subscription?.planName ?? "-"}
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
              ? `₹${active.subscription.price} ${
                  active.subscription.billingCycle === "monthly"
                    ? "/month"
                    : "/year"
                }`
              : "-"}
          </Text>
        </Text>
        <Text style={styles.row}>
          Expiry: <Text style={styles.value}>{active?.subscription?.endDate ?? "-"}</Text>
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
                await axios.patch(`${config.apiBaseUrl}/subscriptions/${user.id}/cancel`);
                Alert.alert("Success", "Subscription cancelled.");
                load();
              } catch (e) {
                Alert.alert("Error", e?.response?.data || e.message);
              }
            }}
          >
            <Text style={styles.cancelText}>Cancel Subscription</Text>
          </TouchableOpacity>
        )}

        {/* Reactivate */}
        {!active && lastCancelled && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.reactivateLabel}>Reactivate as:</Text>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  reactivateBilling === "monthly" && styles.tabActive,
                ]}
                onPress={() => setReactivateBilling("monthly")}
              >
                <Text
                  style={[
                    styles.tabText,
                    reactivateBilling === "monthly" && styles.tabTextActive,
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  reactivateBilling === "yearly" && styles.tabActive,
                ]}
                onPress={() => setReactivateBilling("yearly")}
              >
                <Text
                  style={[
                    styles.tabText,
                    reactivateBilling === "yearly" && styles.tabTextActive,
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
                  Alert.alert("Success", "Subscription reactivated.");
                  load();
                } catch (e) {
                  Alert.alert("Error", e?.response?.data || e.message);
                }
              }}
            >
              <Text style={styles.reactivateText}>Reactivate Subscription</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Apple restore purchases (commented for now) */}
        {/* <TouchableOpacity
          style={styles.restoreBtn}
          onPress={async () => {
            try {
              await InAppPurchases.restorePurchasesAsync();
              Alert.alert("Restored", "Purchases restored from App Store.");
              load();
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          }}
        >
          <Text style={styles.restoreText}>Restore Purchases (Apple)</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 10 },
  row: { fontSize: 14, color: "#0f172a", marginBottom: 6 },
  value: { fontWeight: "600", color: "#2563eb" },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  cancelBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { color: "#dc2626", fontWeight: "700", fontSize: 15 },

  reactivateLabel: { fontWeight: "600", marginBottom: 8, color: "#0f172a" },
  tabs: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  tab: { flex: 1, padding: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#2563eb" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#334155" },
  tabTextActive: { color: "#fff" },
  reactivateBtn: {
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  reactivateText: { color: "#16a34a", fontWeight: "700", fontSize: 15 },

  restoreBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  restoreText: { color: "#2563eb", fontWeight: "700", fontSize: 15 },
});


// Note: The above code is for SubscriptionScreen.js


