import React from 'react';
import { View, Text } from 'react-native';
import S from '../theme/styles';
import C from '../theme/colors';

export default function FeaturesScreen() {
  const FEATURES = ['24/7 Tech Support', 'App Troubleshooting', 'Performance Optimization', 'Security & Updates'];
  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={{color:C.text, fontWeight:'700', fontSize:16}}>App Features</Text>
        <View style={S.divider} />
        {FEATURES.map(f => <Text key={f} style={S.listItem}>• {f}</Text>)}
      </View>
    </View>
  );
}
