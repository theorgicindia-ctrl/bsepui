import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import config from "../config/extra";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
export default function ProfileScreen() {
   /* const { user, logoutUser, setUser } = useContext(AuthContext);*/

    const navigation = useNavigation(); 
    const { user, logoutUser, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const onUpdate = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await axios.put(`${config.apiBaseUrl}/users/${user.id}`, {
        name,
        phone,
        email,
      });
      setUser(res.data); // update AuthContext user
      Alert.alert("Success", "Profile updated successfully");
    } catch (e) {
      Alert.alert("Error", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

    //const onLogout = async () => {
    //    await logoutUser(); // clears AsyncStorage + user in context

    //    navigation.navigate("Login");

    //    Alert.alert("Logged out", "You can login with another account now.");
    //};
    const onLogout = async () => {
        await logoutUser(); // this will set user = null
        Alert.alert("Logged out", "You can login with another account now.");
    };


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>My Profile</Text>
        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={onUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Update Profile</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#0f172a",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: "#dc2626",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: { color: "#dc2626", fontWeight: "700", fontSize: 15 },
});
