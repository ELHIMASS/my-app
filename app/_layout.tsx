import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '../components/HapticTab';
import { IconSymbol } from '../components/ui/IconSymbol';
import TabBarBackground from '../components/ui/TabBarBackground';
import { Colors } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = false; // Remplace ceci par la vraie logique d'authentification

  useEffect(() => {
    if (!isAuthenticated && pathname === '/explore') {
      router.replace('/'); // Redirige vers Home si l'utilisateur n'est pas connecté
    }
  }, [isAuthenticated, pathname]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: { display: 'none' }, // Cache complètement la barre de navigation
      }}>
    </Tabs>
  );
}
