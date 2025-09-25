import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { user, loginUser, registerUser  } = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
    
  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await registerUser(email, password, name, phone);
        alert("Registration successful! Please login.");
        setIsRegister(false);
      } else {
        await loginUser(email, password);
        navigation.replace("DrawerRoot");
      }
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>

      {isRegister && (
        <>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
        </>
      )}

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />

      <Button title={isRegister ? "Register" : "Login"} onPress={handleSubmit} />

      <Text style={styles.toggle} onPress={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Don’t have an account? Register"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
  toggle: { marginTop: 15, color: "blue", textAlign: "center" },
});
