import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import S from '../theme/styles';
import C from '../theme/colors';

export default function SupportScreen() {
  const [message, setMessage] = useState('');
  const submit = () => { Alert.alert('Support', 'Thanks! We will contact you shortly (Demo).'); setMessage(''); };

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={{color:C.text, fontWeight:'700', fontSize:16}}>Help & Support</Text>
        <View style={S.divider} />
        <TextInput
          style={S.input}
          placeholder="Describe your issue..."
          placeholderTextColor={C.subtext}
          value={message} onChangeText={setMessage}
          multiline numberOfLines={6} />
        <TouchableOpacity style={S.button} onPress={submit}>
          <Text style={S.btnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
