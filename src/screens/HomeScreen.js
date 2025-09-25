import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import S from '../theme/styles';
import C from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={S.screen}>
      <View style={[S.card, {alignItems:'center'}]}>
        <MaterialIcons name="support-agent" size={36} color={C.primary} />
        <Text style={[S.title, {marginTop:8}]}>Tech Support</Text>
        <Text style={[S.subtitle, {textAlign:'center'}]}>
          Reliable support for your apps & software. Explore plans and manage your subscription.
        </Text>
      </View>
      <View style={{height:12}} />
      <View style={S.softCard}>
        <Text style={{color:C.text, fontWeight:'700'}}>What’s inside</Text>
        <View style={S.divider} />
        <Text style={S.listItem}>• Dashboard — current plan & renewal</Text>
        <Text style={S.listItem}>• Plans — subscribe (demo)</Text>
        <Text style={S.listItem}>• Subscription — manage status</Text>
        <Text style={S.listItem}>• Features, Support, Profile</Text>
      </View>
    </View>
  );
}
