import { StyleSheet } from "react-native";
import C from "./colors";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: C.background,
        padding: 16,
    },
    card: {
        backgroundColor: C.cardBg,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 16,
    },
    softCard: {
        backgroundColor: "#f1f5f9",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: C.border,
        marginVertical: 8,
    },
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
    input: {
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        marginVertical: 8,
        color: C.text,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: C.primary,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
