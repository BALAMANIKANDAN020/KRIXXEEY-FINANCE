import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AdminTabNavigator } from './AdminTabNavigator';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { CustomDrawerContent } from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="AdminTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        header: () => null,
        headerLeft: () => null,
        headerRight: () => null,
        drawerActiveBackgroundColor: colors.goldLight,
        drawerActiveTintColor: colors.goldDark,
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
        name="AdminTabs"
        component={AdminTabNavigator}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'Admin Console',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AnalysisDrawer"
        component={AnalysisScreen}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'System Analytics',
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
          drawerLabel: 'All Transactions',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ReportsDrawer"
        component={ReportsScreen}
        options={{
          headerShown: false,
          header: () => null,
          drawerLabel: 'Financial Reports',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminDrawerNavigator;
