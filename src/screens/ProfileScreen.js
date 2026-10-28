import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { calculateTotalIncome, calculateTotalExpenses } from '../utils/calculations';
import { formatCurrency } from '../utils/currency';
import { HeaderBar } from '../components/HeaderBar';

export const ProfileScreen = ({ navigation }) => {
  const { currentUser, signOut } = useAuth();
  const { transactions } = useTransactions();

  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <HeaderBar
        title="My Profile"
        subtitle="Manage your personal details"
        navigation={navigation}
        showMenu={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card with Avatar */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {currentUser?.avatar || currentUser?.name?.substring(0, 2).toUpperCase() || 'BJ'}
              </Text>
            </View>
            <View style={styles.roleBadgeFloating}>
              <Ionicons
                name={currentUser?.role === 'admin' ? 'shield-checkmark' : 'person'}
                size={12}
                color={colors.surface}
              />
            </View>
          </View>

          <Text style={styles.profileName}>{currentUser?.name || 'Bala BJ'}</Text>
          <Text style={styles.profileEmail}>{currentUser?.email || 'balabj@gmail.com'}</Text>

          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>
              {currentUser?.role === 'admin' ? 'ADMINISTRATOR' : 'CUSTOMER ACCOUNT'}
            </Text>
          </View>

          {/* Quick Stats Banner inside Profile */}
          <View style={styles.statsBanner}>
            <View style={styles.statColumn}>
              <Text style={styles.statNumber}>{transactions.length}</Text>
              <Text style={styles.statTitle}>Transactions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <Text style={[styles.statNumber, { color: colors.secondaryDark }]}>
                {formatCurrency(totalIncome)}
              </Text>
              <Text style={styles.statTitle}>Total Inflow</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <Text style={[styles.statNumber, { color: colors.danger }]}>
                {formatCurrency(totalExpenses)}
              </Text>
              <Text style={styles.statTitle}>Total Outflow</Text>
            </View>
          </View>
        </View>

        {/* Detailed Information List */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrapper, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="person-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoField}>Full Name</Text>
                <Text style={styles.infoValue}>{currentUser?.name || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrapper, { backgroundColor: colors.tealLight }]}>
                <Ionicons name="mail-outline" size={18} color={colors.teal} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoField}>Email Address</Text>
                <Text style={styles.infoValue}>{currentUser?.email || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrapper, { backgroundColor: colors.secondaryLight }]}>
                <Ionicons name="call-outline" size={18} color={colors.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoField}>Phone Number</Text>
                <Text style={styles.infoValue}>{currentUser?.phone || '+91 98765 43210'}</Text>
              </View>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrapper, { backgroundColor: colors.purpleLight }]}>
                <Ionicons name="briefcase-outline" size={18} color={colors.purple} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoField}>Occupation</Text>
                <Text style={styles.infoValue}>{currentUser?.occupation || 'Software Engineer'}</Text>
              </View>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconWrapper, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="shield-outline" size={18} color="#D97706" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoField}>Assigned Role</Text>
                <Text style={styles.infoValue}>
                  {currentUser?.role === 'admin' ? 'Administrator' : 'Customer'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={20} color={colors.surface} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  avatarCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.surface,
  },
  roleBadgeFloating: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
    marginBottom: spacing.lg,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  statsBanner: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statTitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  infoSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 0.8,
    paddingHorizontal: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoField: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 2,
  },
  actionSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  editButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  signOutButton: {
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    gap: spacing.sm,
  },
  signOutButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProfileScreen;
