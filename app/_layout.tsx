import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Appearance } from 'react-native';

import { HapticTab } from '../components/HapticTab';
import TabBarBackground from '../components/ui/TabBarBackground';
import { Colors } from '../constants/Colors';

export default function TabLayout() {
  const colorScheme = Appearance.getColorScheme() || 'light';
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      setIsAuthenticated(!!storedUser);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && pathname === '/explore') {
      router.replace('/');
    }
  }, [isAuthenticated, pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // 🔹 Cache la barre de navigation
      }}
    >
    </Tabs>
  );
}
