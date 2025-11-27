// src/styles.js
import { StyleSheet, Platform } from "react-native";
import C from "./colors";

export default StyleSheet.create({
    // ===== Root / layout =====
    gradientBackground: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    animatedRoot: {
        flex: 1,
    },

    screen: {
        flex: 1,
        padding: 16,
        backgroundColor: "transparent", // gradient behind it
    },
    screenCenter: {
        justifyContent: "center",
    },
    scrollContent: {
        paddingBottom: 24,
    },

    // ===== Cards =====
    card: {
        backgroundColor: C.cardBg,
        padding: 20,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 16,

        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },

    softCard: {
        backgroundColor: "rgba(15,23,42,0.7)",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(148,163,184,0.3)",
    },

    divider: {
        height: 1,
        backgroundColor: C.border,
        marginVertical: 8,
    },

    // ===== Text =====
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: C.text,
    },
    subtitle: {
        fontSize: 14,
        color: C.subtext,
        marginTop: 4,
    },
    listItem: {
        fontSize: 14,
        color: C.text,
        paddingVertical: 4,
    },

    // ===== Inputs & buttons =====
    input: {
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 12 : 10,
        fontSize: 14,
        marginVertical: 8,
        color: C.text,
        backgroundColor: "rgba(15,23,42,0.95)",
    },

    button: {
        backgroundColor: C.primary,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 14,

        shadowColor: C.primary,
        shadowOpacity: 0.5,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    // ===== Generic helpers =====
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    // ===== Login screen specific =====
    loginHeader: {
        alignItems: "center",
        marginBottom: 32,
    },
    loginLogo: {
        width: 120,
        height: 120,
        marginBottom: 8,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: C.text,
    },
    loginSubtitle: {
        fontSize: 13,
        color: C.subtext,
        marginTop: 6,
        textAlign: "center",
    },
    loginForm: {
        width: "100%",
    },
    chartContainer: {
        marginTop: 16,
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 18,
        backgroundColor: C.cardBg,
        borderWidth: 1,
        borderColor: C.border,

        // MOST IMPORTANT:
        minHeight: 260,        // prevents overlap
        overflow: "visible",   // charts need this!
    },

    // --- DASHBOARD / ANALYTICS ---

    dashboardHeader: {
        marginBottom: 12,
    },

    dashboardTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: C.text,
    },

    dashboardSubtitle: {
        fontSize: 14,
        color: C.subtext,
        marginTop: 4,
    },

    chartSection: {
        marginTop: 12,
        marginBottom: 16,
    },

    chartTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    chartTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: C.text,
    },

    chartSubtitle: {
        fontSize: 12,
        color: C.subtext,
    },

    chartBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "rgba(56,189,248,0.16)",
    },

    chartBadgeText: {
        fontSize: 11,
        color: C.accent,
        fontWeight: "600",
    },

    // vertical bar chart (visits)
    chartBarRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        paddingTop: 10,
    },

    chartBarWrapper: {
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
        marginHorizontal: 3,
    },

    chartBar: {
        width: 16,
        borderRadius: 999,
        backgroundColor: C.accent,
    },

    chartBarLabel: {
        fontSize: 10,
        color: C.subtext,
        marginTop: 4,
    },

    chartBarValue: {
        fontSize: 10,
        color: C.text,
        marginBottom: 4,
    },

    // horizontal bar chart (support load)
    chartHBarRow: {
        marginTop: 10,
    },

    chartHBarItem: {
        marginBottom: 8,
    },

    chartHBarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },

    chartHBarLabel: {
        fontSize: 12,
        color: C.text,
    },

    chartHBarValue: {
        fontSize: 12,
        color: C.subtext,
    },

    chartHBarTrack: {
        height: 8,
        borderRadius: 999,
        backgroundColor: "rgba(148,163,184,0.35)",
        overflow: "hidden",
    },

    chartHBarFill: {
        height: 8,
        borderRadius: 999,
        backgroundColor: C.primary,
    },

    // metric cards row
    metricRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 4,
    },

    metricCard: {
        flexBasis: "48%",
        backgroundColor: "rgba(15,23,42,0.85)",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "rgba(148,163,184,0.4)",
    },

    metricLabel: {
        fontSize: 12,
        color: C.subtext,
    },

    metricValue: {
        fontSize: 18,
        fontWeight: "700",
        color: C.text,
        marginTop: 4,
    },

    metricTag: {
        fontSize: 11,
        color: C.accent,
        marginTop: 2,
    },

    statusGood: {
        fontSize: 12,
        color: "#22C55E",
    },

    statusWarn: {
        fontSize: 12,
        color: "#FACC15",
    },

    statusBad: {
        fontSize: 12,
        color: "#F97316",
    },



    // ===== You can add screen-specific blocks here later =====
    // e.g. plansRow, planCard, profileAvatar, etc
});
