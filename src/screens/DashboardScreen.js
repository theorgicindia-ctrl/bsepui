import React, { useContext } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import S from "../theme/styles";
import C from "../theme/colors";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { user } = useContext(AuthContext);
 const FEATURES = ['24/7 Tech Support', 'App Troubleshooting', 'Performance Optimization', 'Security & Updates'];
  return (
    <SafeAreaView style={{flex:1, backgroundColor:C.bg}}>
    <View style={S.screen}>
      <View style={S.card}>
        <Text style={S.title}>Usage Overview</Text>
        <Text style={S.subtitle}>Your activity in the past 6 months</Text>

        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
          }}
          width={Dimensions.get("window").width - 64}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          bezier
          style={{ marginTop: 20, borderRadius: 16 }}
        />
      </View>

      <View style={S.card}>
        <Text style={S.title}>Subscription Status</Text>
        <Text style={S.subtitle}>Email: {user?.email ?? "demo@example.com"}</Text>
        <Text style={S.subtitle}>Plan: {user?.plan ?? "Free"}</Text>
        <Text style={S.subtitle}>Expiry: {user?.subscriptionExpiry ?? "-"}</Text>
        <Text style={S.subtitle}>
          Status: {user?.isSubscribed ? "Active" : "Not Active"}
        </Text>
      </View>

       <View style={S.card}>
        <Text style={{color:C.text, fontWeight:'700', fontSize:16}}>App Features</Text>
        <View style={S.divider} />
        {FEATURES.map(f => <Text key={f} style={S.listItem}>• {f}</Text>)}
      </View>
    </View>


    
    </SafeAreaView>
  );
}
