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
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import config from "../config/extra";
import { AuthContext } from "../context/AuthContext";

export default function PlansScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingPlanId, setSubmittingPlanId] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | yearly

  useEffect(() => {


    (async () => {
      try {
        // ✅ Fix: backend now returns { plans: [...] }
        const resPlans = await axios.get(`${config.apiBaseUrl}/plans`);
        setPlans(resPlans.data?.plans || []);     

        if (user?.id) {
          const resSubs = await axios.get(
            `${config.apiBaseUrl}/subscriptions/user/${user.id}`
          );
          setSubs(resSubs.data?.subscriptions || []);
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
    const yearlyPrice = price * 12 * 0.7; // 20% discount
    return yearlyPrice.toFixed(2);
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

  const renderPlan = ({ item }) => {
    const price = calculatePrice(item.price);
    const cycleLabel = billingCycle === "monthly" ? "/month" : "/year";

    const userSub = subs.find((s) => s.subscription?.planId === item.id);
    const isCancelled = userSub && !userSub.subscription?.isActive;

    return (
      <View style={styles.card}>
        <Text style={styles.planName}>{item.name}</Text>
        <Text style={styles.planPrice}>
          {formatPrice(price, item.currency)}{" "}
          <Text style={styles.cycle}>{cycleLabel}</Text>
        </Text>

        {(item.features || []).map((f, i) => (
          <Text key={`${item.id}-f-${i}`} style={styles.feature}>
            • {f.description}
          </Text>
        ))}

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
                : `Choose ${item.name}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, billingCycle === "monthly" && styles.tabActive]}
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
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, billingCycle === "yearly" && styles.tabActive]}
          onPress={() => setBillingCycle("yearly")}
        >
          <Text
            style={[
              styles.tabText,
              billingCycle === "yearly" && styles.tabTextActive,
            ]}
          >
            Yearly (-30%)
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={plans}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listPad}
        renderItem={renderPlan}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  listPad: { padding: 16, paddingTop: 10, paddingBottom: 40 },

  // Tabs
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  tab: { flex: 1, padding: 12, alignItems: "center" },
  tabActive: { backgroundColor: "#2563eb" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#334155" },
  tabTextActive: { color: "#fff" },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0f172a",
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 12,
  },
  cycle: { fontSize: 14, color: "#64748b" },
  feature: { color: "#0f172a", marginBottom: 6, fontSize: 14 },

  // Buttons
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnTextOutline: { color: "#2563eb", fontSize: 16, fontWeight: "700" },
});
