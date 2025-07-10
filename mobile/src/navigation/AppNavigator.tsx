import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import JobsScreen from '../screens/JobsScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import ElementDetailScreen from '../screens/ElementDetailScreen';
import QRScannerScreen from '../screens/QRScannerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Documents') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#dc2626', // LTE red
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#dc2626',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can add a loading screen component here
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth screens
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // App screens
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen 
            name="JobDetail" 
            component={JobDetailScreen}
            options={{ 
              headerShown: true,
              title: 'Job Details',
              headerStyle: { backgroundColor: '#dc2626' },
              headerTintColor: '#fff'
            }}
          />
          <Stack.Screen 
            name="ElementDetail" 
            component={ElementDetailScreen}
            options={{ 
              headerShown: true,
              title: 'Element Details',
              headerStyle: { backgroundColor: '#dc2626' },
              headerTintColor: '#fff'
            }}
          />
          <Stack.Screen 
            name="QRScanner" 
            component={QRScannerScreen}
            options={{ 
              headerShown: true,
              title: 'Scan QR Code',
              headerStyle: { backgroundColor: '#dc2626' },
              headerTintColor: '#fff'
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}