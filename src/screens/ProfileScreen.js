import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import S from '../theme/styles';
import C from '../theme/colors';
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || 'demo@example.com');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try { await login(email); }
    catch (e) { Alert.alert('Error', e?.response?.data || e.message); }
    finally { setLoading(false); }
  };

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={{color:C.text, fontWeight:'700', fontSize:16}}>Profile</Text>
        <View style={S.divider} />
        <TextInput
          style={S.input}
          placeholder="Email"
          placeholderTextColor={C.subtext}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={[S.button,{opacity:loading?0.7:1}]} onPress={onLogin} disabled={loading}>
          <Text style={S.btnText}>{loading ? 'Please wait...' : 'Login / Register'}</Text>
        </TouchableOpacity>

        {user && (
          <View style={[S.softCard,{marginTop:12}]}>
            <Text style={{color:C.text}}>Email: {user.email}</Text>
            <Text style={{color:C.text}}>Subscribed: {user.isSubscribed ? 'Yes' : 'No'}</Text>
            <Text style={{color:C.text}}>Expiry: {user.subscriptionExpiry ?? '-'}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
