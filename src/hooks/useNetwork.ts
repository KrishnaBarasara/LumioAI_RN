import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const state = await Network.getNetworkStateAsync();
      if (mounted) setIsConnected(state.isConnected ?? true);
    };
    check();
    const interval = setInterval(check, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isConnected };
}
