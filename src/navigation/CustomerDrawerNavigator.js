import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { CustomerTabNavigator } from './CustomerTabNavigator';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomDrawerContent } from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export const CustomerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="DashboardTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        header: () => null,
        headerLeft: () => null,
        headerRight: () => null,
        drawerActiveBackgroundColor: colors.primaryLight,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginLeft: -10,
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginVertical: 3,
          paddingHorizontal: 8,
        },
      }}
    >
      <Drawer.Screen
        name="DashboardTabs"
        component={CustomerTabNavigator}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AnalysisDrawer"
        component={AnalysisScreen}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'Analysis',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pie-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TransactionsDrawer"
        component={TransactionsScreen}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'Transactions',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CategoriesDrawer"
        component={CategoriesScreen}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'Categories',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ReportsDrawer"
        component={ReportsScreen}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'Reports',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileDrawer"
        component={ProfileScreen}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default CustomerDrawerNavigator;
