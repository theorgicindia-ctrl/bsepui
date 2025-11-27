import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import config from "../config/extra";
import { AuthContext } from "../context/AuthContext";
import ScreenContainer from "../ScreenContainer";
import S from "../theme/styles";
import C from "../theme/colors";

export default function SupportScreen() {
  const { user } = useContext(AuthContext);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const openEmail = () => Linking.openURL("mailto:support@example.com");
  const openPhone = () => Linking.openURL("tel:+1234567890");
  const openFAQ = () => Alert.alert("FAQs", "Redirecting to FAQs...");

  const submitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Validation", "Please enter both subject and message.");
      return;
    }
    if (!user?.id) {
      Alert.alert("Login required", "Please login first to submit a ticket.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${config.apiBaseUrl}/support/${user.id}`, {
        subject,
        message,
      });
      Alert.alert("Success", "Your support ticket has been submitted!");
      setSubject("");
      setMessage("");
    } catch (err) {
      Alert.alert("Error", err?.response?.data || "Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Support Center</Text>
        <Text style={styles.subtext}>
          Need help? Our team is here 24/7. Choose a support option below or
          submit a ticket.
        </Text>

        {/* Quick Contact Options */}
        <TouchableOpacity style={styles.card} onPress={openEmail}>
          <Ionicons name="mail-outline" size={32} color="#2563eb" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Email Support</Text>
            <Text style={styles.cardDesc}>support@example.com</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={openPhone}>
          <Ionicons name="call-outline" size={32} color="#16a34a" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Call Us</Text>
            <Text style={styles.cardDesc}>+1 234 567 890</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={openFAQ}>
          <MaterialIcons name="help-outline" size={32} color="#f59e0b" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>FAQs</Text>
            <Text style={styles.cardDesc}>
              Quick answers to common questions
            </Text>
          </View>
        </TouchableOpacity>

        {/* Submit Ticket Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Submit a Ticket</Text>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={submitTicket}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Our team will respond within 24 hours. For urgent issues, please
            call us directly.
          </Text>
        </View>

        
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: "700", marginBottom: 10, color: "#0f172a" },
  subtext: { fontSize: 14, color: "#475569", marginBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardText: { marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  cardDesc: { fontSize: 14, color: "#64748b" },
  form: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  formTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#0f172a" },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footer: { marginTop: 20, padding: 10 },
  footerText: { fontSize: 12, textAlign: "center", color: "#475569" },
});
