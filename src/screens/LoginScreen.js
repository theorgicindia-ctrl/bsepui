import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import axios from "axios";
import config from "../config/extra";

WebBrowser.maybeCompleteAuthSession();

// 👉 Only require Apple auth on iOS
let AppleAuthentication;
if (Platform.OS === "ios") {
  AppleAuthentication = require("expo-apple-authentication");
}

export default function LoginScreen({ navigation }) {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // 🔹 Custom login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Redirect URI (forces Expo proxy instead of exp://)
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  // 🔹 Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "971801086775-4hd135e232ovpifasi2tpq0fdpu0e3ts.apps.googleusercontent.com", // Web client ID from Google Cloud
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleLogin(response.authentication);
    }
  }, [response]);

  // 🔹 Handle custom login
  const handleCustomLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${config.apiBaseUrl}/users/login`, {
        email,
        password,
      });

      console.log("Login response:", res.data); // 👈 Debug log

      if (!res.data?.email) {
        throw new Error("Unexpected server response");
      }

      setUser(res.data);
      // 👇 Make sure this matches your navigator
      navigation.replace("Main");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Invalid credentials";
      Alert.alert("Login Failed", String(msg));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Google login
  const handleGoogleLogin = async (auth) => {
    try {
      setLoading(true);
      const userInfoRes = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        }
      );
      const profile = await userInfoRes.json();

      const res = await axios.post(`${config.apiBaseUrl}/users/social-login`, {
        email: profile.email,
        name: profile.name,
        provider: "google",
        providerId: profile.id,
      });

      setUser(res.data);
      navigation.replace("Main");
    } catch (err) {
      Alert.alert("Google Login Failed", err?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Apple login
  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      const appleUser = {
        email: credential.email || "",
        name: credential.fullName?.givenName || "Apple User",
        provider: "apple",
        providerId: credential.user,
      };

      const res = await axios.post(
        `${config.apiBaseUrl}/users/social-login`,
        appleUser
      );
      setUser(res.data);
      navigation.replace("Main");
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        Alert.alert("Apple login cancelled");
      } else {
        Alert.alert("Apple login error", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#2563eb", "#14b8a6"]} style={styles.bg}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/iconold.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {loading && (
          <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 15 }} />
        )}

        {/* 🔹 Custom Login Form */}
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
          onPress={handleCustomLogin}
          disabled={loading}
        >
          <Text style={[styles.btnText, { color: "#fff" }]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ color: "#fff" }}>Create an account</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* 🔹 Google Button */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#fff" }]}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <Text style={[styles.btnText, { color: "#000" }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* 🔹 Apple Button (only on iOS) */}
        {Platform.OS === "ios" && AppleAuthentication && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={{ width: "100%", height: 50, marginTop: 15 }}
            onPress={handleAppleLogin}
          />
        )}
      </View>
    </LinearGradient>
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
  image: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff" },
  subtitle: { fontSize: 16, color: "#e0e0e0", marginBottom: 20 },
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
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  orText: { marginHorizontal: 10, color: "#fff" },
});
