// src/screens/ProfileScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import config from "../config/extra";
import { useAuth } from "../context/AuthContext";
import ScreenContainer from "../ScreenContainer";
import S from "../theme/styles";
import C from "../theme/colors";

export default function ProfileScreen() {
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
            setUser(res.data);
            Alert.alert("Success", "Profile updated successfully");
        } catch (e) {
            Alert.alert("Error", e?.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    const onLogout = async () => {
        await logoutUser();
        Alert.alert("Logged out", "You can login with another account now.");
    };

    return (
        <ScreenContainer centerContent>
            <View style={[S.card, styles.card]}>
                <Text style={styles.title}>My Profile</Text>
                <View style={styles.divider} />

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
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={S.input}
                    placeholder="Email"
                    placeholderTextColor={C.subtext}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity
                    style={[S.button, loading && { opacity: 0.7 }]}
                    onPress={onUpdate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={S.btnText}>Update Profile</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
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
    title: { fontSize: 20, fontWeight: "700", color: C.text, marginBottom: 8 },
    divider: { height: 1, backgroundColor: C.border, marginBottom: 16, marginTop: 4 },
    logoutBtn: {
        marginTop: 14,
        borderWidth: 1.5,
        borderColor: C.danger,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
    },
    logoutText: { color: C.danger, fontWeight: "700", fontSize: 15 },
});
