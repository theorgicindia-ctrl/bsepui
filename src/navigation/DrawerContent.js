import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import C from '../theme/colors';
import S from '../theme/styles';
import { useAuth } from '../context/AuthContext';

export default function DrawerContent(props) {
  const { navigation } = props;
  const { user, logout } = useAuth();

  return (
    <View style={{flex:1, backgroundColor: C.bg}}>
      <DrawerContentScrollView {...props} contentContainerStyle={{paddingTop: 0}}>
        <View style={{ padding:16, backgroundColor:C.card }}>
          <Text style={[S.title]}>Tech Support</Text>
          <Text style={S.subtitle}>{user ? user.email : 'Guest'}</Text>
        </View>

        <DrawerItem label="Home" onPress={() => navigation.navigate('Home')}
          icon={({size,color}) => <MaterialIcons name="home" size={size} color={C.text} />}
          labelStyle={{color:C.text}} />
        <DrawerItem label="Dashboard" onPress={() => navigation.navigate('Dashboard')}
          icon={({size}) => <MaterialIcons name="dashboard" size={size} color={C.text} />}
          labelStyle={{color:C.text}} />
        <DrawerItem label="Plans" onPress={() => navigation.navigate('Plans')}
          icon={({size}) => <Ionicons name="pricetags" size={size} color={C.text} />}
          labelStyle={{color:C.text}} />
        <DrawerItem label="Subscription" onPress={() => navigation.navigate('Subscription')}
          icon={({size}) => <MaterialIcons name="subscriptions" size={size} color={C.text} />}
          labelStyle={{color:C.text}} />
        <DrawerItem label="Features" onPress={() => navigation.navigate('Features')}
          icon={({size}) => <Ionicons name="sparkles-outline" size={size} color={C.text} />}
          labelStyle={{color:C.text}} />
        <DrawerItem label="Support" onPress={() => navigation.navigate('Support')}
          icon={({size}) => <MaterialIcons name="support-agent" size={size} color={C.text} />}
          labelStyle={{color:C.text}} />
        <DrawerItem label="Profile" onPress={() => navigation.navigate('Profile')}
          icon={({size}) => <MaterialIcons name="person" size={size} color={C.text} />}
          labelStyle={{color:C.text}} />
        {!user ? (
          <DrawerItem label="Login" onPress={() => navigation.navigate('Login')}
            icon={({size}) => <MaterialIcons name="login" size={size} color={C.text} />}
            labelStyle={{color:C.text}} />
        ) : (
          <DrawerItem label="Logout" onPress={logout}
            icon={({size}) => <MaterialIcons name="logout" size={size} color={C.text} />}
            labelStyle={{color:C.text}} />
        )}
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={16} color={C.subtext} />
        <Text style={{color:C.subtext, marginLeft:6}}>
          v{Application.nativeApplicationVersion ?? '1.0.0'} ({Application.nativeBuildVersion ?? '1'})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1, borderColor: C.border, padding: 12,
    flexDirection:'row', alignItems:'center', backgroundColor:C.card
  }
});
