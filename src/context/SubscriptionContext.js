import { createContext, useContext, useMemo, useState } from 'react';
import { subscribeUser } from '../services/api';
import { useAuth } from './AuthContext';

const SubContext = createContext();
export const useSubscription = () => useContext(SubContext);

export function SubscriptionProvider({ children }) {
const { login, logout, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const subscribeMonthly = async () => {
    if (!user?.email) return;
    setLoading(true);
    try { setUser(await subscribeUser(user.email)); }
    finally { setLoading(false); }
  };

  const value = useMemo(() => ({ loading, subscribeMonthly }), [loading]);
  return <SubContext.Provider value={value}>{children}</SubContext.Provider>;
}
