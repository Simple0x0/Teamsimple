import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../utils/apiRequest';

const DashboardUserContext = createContext();

export const useDashboardUser = () => useContext(DashboardUserContext);

export const DashboardUserProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setMember(data.member);
      } catch (err) {
        setMember(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <DashboardUserContext.Provider value={{ member, loading }}>
      {children}
    </DashboardUserContext.Provider>
  );
};
