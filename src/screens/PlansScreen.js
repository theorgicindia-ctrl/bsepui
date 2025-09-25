import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import config from "../config/extra";
import { AuthContext } from "../context/AuthContext";

export default function PlansScreen() {
  const { user } = useContext(AuthContext);
  
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiBaseUrl}/plans`)
      .then(res => setPlans(res.data))
      .catch(err => console.error(err));
  }, []);

  const subscribe = async (planId) => {
    try {
      await axios.post(`${config.apiBaseUrl}/subscriptions/${user.id}/subscribe/${planId}`);
      alert("Subscribed successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <FlatList
      data={plans}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.name} - ${item.price}</Text>
          {item.features?.map((f) => (
            <Text key={f.id}>• {f.description}</Text>
          ))}
          <Button title="Subscribe" onPress={() => subscribe(item.id)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderWidth: 1, borderRadius: 5, margin: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
});
