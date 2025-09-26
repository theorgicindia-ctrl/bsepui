import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import S from '../theme/styles';
import C from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';


export default function SubscriptionScreen() {

  const { user } = useContext(AuthContext);
  const { subscribeMonthly, loading } = useSubscription();

  if (!user) return <View style={S.center}><Text style={{color:C.text}}>Please login to view subscription.</Text></View>;

  const cancel = () => Alert.alert('Cancel Subscription', 'Demo only. Implement cancel on backend when ready.');

  return (
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={{color:C.text, fontSize:18, fontWeight:'700'}}>Subscription</Text>
        <View style={S.divider} />
        <Text style={{color:C.text}}>Email: {user.email}</Text>
        <Text style={{color:C.text}}>Status: {user.isSubscribed ? 'Active' : 'Not Active'}</Text>
        <Text style={{color:C.text}}>Expiry: {user.subscriptionExpiry ?? '-'}</Text>
        <View style={{height:10}} />
        {!user.isSubscribed ? (
          <TouchableOpacity style={S.button} onPress={subscribeMonthly} disabled={loading}>
            <Text style={S.btnText}>{loading ? 'Please wait...' : 'Start Monthly (Demo)'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[S.button, {backgroundColor:C.warning}]} onPress={cancel}>
            <Text style={S.btnText}>Cancel (Demo)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
