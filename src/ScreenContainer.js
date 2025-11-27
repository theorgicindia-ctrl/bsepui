// src/components/ScreenContainer.js
import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import S from "./theme/styles";
import C from "./theme/colors";

export default function ScreenContainer({ children, centerContent = false, style }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [opacity, translateY]);

    const animatedStyle = {
        opacity,
        transform: [{ translateY }],
    };

    return (
        <LinearGradient
            colors={[C.gradientStart, C.gradientMiddle, C.gradientEnd]}
            style={S.gradientBackground}
        >
            <SafeAreaView style={S.safeArea}>
                <Animated.View style={[S.animatedRoot, animatedStyle]}>
                    <View
                        style={[
                            S.screen,
                            centerContent && S.screenCenter,
                            style,
                        ]}
                    >
                        {children}
                    </View>
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
}
