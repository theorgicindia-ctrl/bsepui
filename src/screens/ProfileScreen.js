import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import S from '../theme/styles';
import C from '../theme/colors';
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileScreen() {
  const { user, loginUser, registerUser } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || 'demo@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      await loginUser(email, password);
      Alert.alert('Success', 'Logged in successfully');
    } catch (e) {
      Alert.alert('Error', e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <SafeAreaView style={{flex:1, backgroundColor:C.bg}}>
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={{color:C.text, fontWeight:'700', fontSize:18}}>Profile</Text>
        <View style={S.divider} />

        {/* Input fields */}
        <TextInput
          style={S.input}
          placeholder="Email"
          placeholderTextColor={C.subtext}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={S.input}
          placeholder="Password"
          placeholderTextColor={C.subtext}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity
          style={[S.button, {opacity: loading ? 0.7 : 1}]}
          onPress={onLogin}
          disabled={loading}
        >
          <Text style={S.btnText}>{loading ? 'Please wait...' : 'Login'}</Text>
        </TouchableOpacity>

        {/* Show user details if logged in */}
        {user && (
          <View style={[S.softCard,{marginTop:12}]}>
            <Text style={{color:C.text}}>Email: {user.email}</Text>
            <Text style={{color:C.text}}>Subscribed: {user.isSubscribed ? 'Yes' : 'No'}</Text>
            <Text style={{color:C.text}}>Expiry: {user.subscriptionExpiry ?? '-'}</Text>
          </View>
        )}
      </View>
    </View>
    </SafeAreaView>
  );
}
