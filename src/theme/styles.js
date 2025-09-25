import { StyleSheet } from 'react-native';
import C from './colors';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, padding: 16 },
  center: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor: C.bg },
  title: { fontSize: 22, fontWeight:'700', color: C.text },
  subtitle: { color: C.subtext, marginTop: 6 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border },
  softCard: { backgroundColor: C.cardSoft, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: C.border },
  row: { flexDirection: 'row', alignItems: 'center' },
  button: { marginTop: 10, backgroundColor: C.primary, paddingVertical: 12, borderRadius: 12, alignItems:'center' },
  btnText: { color: 'white', fontWeight:'700' },
  input: { backgroundColor: C.cardSoft, borderRadius: 12, padding: 12, color: C.text, borderWidth: 1, borderColor: C.border },
  listItem: { color: C.text, marginVertical: 6, fontSize: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start', marginTop: 6 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 12 },
});
