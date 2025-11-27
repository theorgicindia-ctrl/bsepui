import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import config from "../config/extra";
import { AuthContext } from "../context/AuthContext";
import ScreenContainer from "../ScreenContainer";
import S from "../theme/styles";
import C from "../theme/colors";

export default function RegisterScreen({ navigation }) {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${config.apiBaseUrl}/users/register`, {
        email,
        password,
        name,
        phone,
      });

      console.log("Register response:", res.data);

      if (!res.data?.email) {
        throw new Error("Unexpected server response");
      }

      setUser(res.data);
  /*    navigation.replace("Main");*/
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Registration failed";
      Alert.alert("Register Failed", String(msg));
    } finally {
      setLoading(false);
    }
  };

    return (

        <ScreenContainer>
  {/*  <LinearGradient colors={["#2563eb", "#14b8a6"]} style={styles.bg}>*/}
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        {loading && <ActivityIndicator size="large" color="#fff" />}

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#2563eb" }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={[styles.btnText, { color: "#fff" }]}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={{ color: "#fff" }}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
            {/*  </LinearGradient>*/}
        </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", marginBottom: 20 },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: { fontSize: 16, fontWeight: "600" },
});
