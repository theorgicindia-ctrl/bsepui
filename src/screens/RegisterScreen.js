// src/screens/RegisterScreen.js
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
        <ScreenContainer centerContent>
            <View style={[S.card, styles.card]}>
                <Text style={styles.title}>Create account</Text>

                {loading && (
                    <ActivityIndicator size="small" color={C.accent} style={{ marginBottom: 8 }} />
                )}

                <TextInput
                    style={S.input}
                    placeholder="Name"
                    placeholderTextColor={C.subtext}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={S.input}
                    placeholder="Phone"
                    placeholderTextColor={C.subtext}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={S.input}
                    placeholder="Email"
                    placeholderTextColor={C.subtext}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={S.input}
                    placeholder="Password"
                    placeholderTextColor={C.subtext}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={S.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={S.btnText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginTop: 10, alignSelf: "center" }}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={{ color: C.accent, fontSize: 13 }}>
                        Already have an account? Login
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        paddingVertical: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: C.text,
        marginBottom: 12,
        textAlign: "center",
    },
});
