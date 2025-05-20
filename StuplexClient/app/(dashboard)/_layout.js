import {Tabs} from 'expo-router'
import {Ionicons} from '@expo/vector-icons'
import { Colors } from '../../constants/color.js';
import { useColorScheme , View} from 'react-native';
import React from 'react'

const Dashboardlayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.light;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          paddingBottom: 10,
          height: 70,
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: focused ? theme.tabBarActive : 'transparent',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            >
              <Ionicons
                name="home"
                size={focused ? 30 : 24}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
              />
            </View>
          ),
        }}
      />

      {/* 2. Offline Center */}
      <Tabs.Screen
        name="center"
        options={{
          title: 'Center',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: focused ? theme.tabBarActive : 'transparent',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            >
              <Ionicons
                name="location"
                size={focused ? 30 : 24}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
              />
            </View>
          ),
        }}
      />

      {/* 3. Batches */}
      <Tabs.Screen
        name="batches"
        options={{
          title: 'Batches',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: focused ? theme.tabBarActive : 'transparent',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            >
              <Ionicons
                name="albums"
                size={focused ? 30 : 24}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
              />
            </View>
          ),
        }}
      />

      {/* 4. Books */}
      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: focused ? theme.tabBarActive : 'transparent',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            >
              <Ionicons
                name="book"
                size={focused ? 30 : 24}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
              />
            </View>
          ),
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: focused ? theme.tabBarActive : 'transparent',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            >
              <Ionicons
                name="person"
                size={focused ? 30 : 24}
                color={focused ? theme.tabBarActive : theme.tabBarInactive}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  )
}

export default Dashboardlayout