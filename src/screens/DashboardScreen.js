import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import config from "../config/extra"; // <-- central API base url
import { AuthContext } from "../context/AuthContext";

export default function DashboardScreen() {
  const { user } = useContext(AuthContext); // ✅ no useAuth()
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    alert("user: " + JSON.stringify(user));
    
    alert("config.apiBaseUrl: " + config.apiBaseUrl);
    if (user?.id) {
      axios
        .get(`${config.apiBaseUrl}/subscriptions/${user.id}`)
        .then((res) => setSubs(res.data))
        .catch((err) => console.error("Error fetching subscriptions:", err));
    }
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Not logged in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Phone: {user.phone}</Text>

      <Text style={styles.subtitle}>Your Active Subscriptions:</Text>
      {subs.length === 0 ? (
        <Text>No subscriptions yet</Text>
      ) : (
        subs.map((s) => (
          <Text key={s.id}>
            {s.plan.name} (Active until{" "}
            {new Date(s.endDate).toDateString()})
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { marginTop: 20, fontSize: 18, fontWeight: "600" },
});
