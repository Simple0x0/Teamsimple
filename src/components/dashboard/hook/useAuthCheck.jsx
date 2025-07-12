import { useEffect, useState } from 'react';
import { authVerify } from '../utils/apiRequest';

export const useAuthCheck = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await authVerify();
        if (res.status === 200 && res.data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return { isAuthenticated, loading };
};
