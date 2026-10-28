import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { KrishnanRadheyLogo } from '../components/KrishnanRadheyLogo';

export const HomeScreen = ({ navigation }) => {
  const { quickSignIn } = useAuth();

  const handleQuickCustomer = async () => {
    await quickSignIn('customer');
  };

  const handleQuickAdmin = async () => {
    await quickSignIn('admin');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Divine Hero Card */}
        <View style={styles.heroCard}>
          {/* Subtle Background Glow Elements */}
          <View style={styles.peacockGlow} />

          {/* Krishna-Radhey Sacred BJ Monogram Emblem */}
          <View style={styles.logoBadgeContainer}>
            <KrishnanRadheyLogo size={112} showText={true} />
          </View>

          {/* Brand Name: krixxeey in lowercase */}
          <View style={styles.titleWrapper}>
            <Text style={styles.krixxeeyText}>krixxeey</Text>
            <Text style={styles.financeText}>FINANCE</Text>
          </View>

          <Text style={styles.tagline}>
            Smart Personal & Business Budget Tracker
          </Text>

          <Text style={styles.welcomeDescription}>
            Master your daily expenses, monitor category budgets, and analyze financial reports with ease and clarity.
          </Text>

          {/* Mini Trust Highlights Strip */}
          <View style={styles.trustPillRow}>
            <View style={styles.trustPill}>
              <Ionicons name="shield-checkmark" size={14} color={colors.secondary} />
              <Text style={styles.trustPillText}>100% Offline</Text>
            </View>
            <View style={styles.trustPill}>
              <Ionicons name="flash" size={14} color={colors.gold} />
              <Text style={styles.trustPillText}>Real-Time</Text>
            </View>
            <View style={styles.trustPill}>
              <Ionicons name="pie-chart" size={14} color={colors.info} />
              <Text style={styles.trustPillText}>Full Analytics</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionSection}>
          <CustomButton
            title="Sign In to Your Account"
            onPress={() => navigation.navigate('SignIn')}
            variant="primary"
            size="large"
            iconName="log-in-outline"
            style={styles.mainButton}
          />

          <CustomButton
            title="Create New Account"
            onPress={() => navigation.navigate('SignUp')}
            variant="outline"
            size="large"
            iconName="person-add-outline"
            style={styles.secondaryButton}
          />

          {/* Quick Demo Access Section */}
          <View style={styles.evaluatorSection}>
            <View style={styles.evaluatorHeader}>
              <View style={styles.evaluatorLine} />
              <View style={styles.evaluatorBadge}>
                <Ionicons name="key-outline" size={13} color={colors.gold} />
                <Text style={styles.evaluatorLabel}>DEMO ACCESS</Text>
              </View>
              <View style={styles.evaluatorLine} />
            </View>

            <View style={styles.quickButtonsRow}>
              {/* Customer Quick Login: Bala BJ */}
              <TouchableOpacity
                style={[styles.quickRoleBtn, styles.customerBtn]}
                onPress={handleQuickCustomer}
                activeOpacity={0.8}
              >
                <View style={styles.quickCardTop}>
                  <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarLetter}>BJ</Text>
                  </View>
                  <View style={styles.roleTagCustomer}>
                    <Text style={styles.roleTagText}>CUSTOMER</Text>
                  </View>
                </View>

                <Text style={styles.quickRoleName}>Bala BJ</Text>
                <Text style={styles.quickRoleEmail}>balabj@gmail.com</Text>

                <View style={styles.tapToLoginBadge}>
                  <Text style={styles.tapToLoginText}>One-Tap Login</Text>
                  <Ionicons name="arrow-forward" size={12} color={colors.primary} />
                </View>
              </TouchableOpacity>

              {/* Admin Quick Login: Krixxeey */}
              <TouchableOpacity
                style={[styles.quickRoleBtn, styles.adminBtn]}
                onPress={handleQuickAdmin}
                activeOpacity={0.8}
              >
                <View style={styles.quickCardTop}>
                  <View style={[styles.avatarCircle, { backgroundColor: colors.gold }]}>
                    <Text style={styles.avatarLetter}>K</Text>
                  </View>
                  <View style={styles.roleTagAdmin}>
                    <Text style={styles.roleTagText}>ADMIN</Text>
                  </View>
                </View>

                <Text style={styles.quickRoleName}>Krixxeey</Text>
                <Text style={styles.quickRoleEmail}>krixxeey@gmail.com</Text>

                <View style={[styles.tapToLoginBadge, { backgroundColor: colors.goldLight }]}>
                  <Text style={[styles.tapToLoginText, { color: colors.goldDark }]}>One-Tap Login</Text>
                  <Ionicons name="arrow-forward" size={12} color={colors.goldDark} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer Credit */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerNote}>
            MCA Semester III React Native Assessment • Designed for Excellence
          </Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  peacockGlow: {
    position: 'absolute',
    top: -60,
    width: 240,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
    opacity: 0.6,
  },
  logoBadgeContainer: {
    marginBottom: spacing.md,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  krixxeeyText: {
    fontSize: 27,
    textTransform: 'lowercase',
    color: colors.gold,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  financeText: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  trustPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.lg,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  trustPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionSection: {
    width: '100%',
  },
  mainButton: {
    marginBottom: spacing.md,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButton: {
    marginBottom: spacing.xl,
    borderColor: colors.gold,
    borderWidth: 1.5,
  },
  evaluatorSection: {
    marginTop: spacing.xs,
  },
  evaluatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  evaluatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  evaluatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.goldLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  evaluatorLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.goldDark,
    letterSpacing: 0.8,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickRoleBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  customerBtn: {
    borderColor: colors.primaryLight,
  },
  adminBtn: {
    borderColor: colors.goldLight,
  },
  quickCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '800',
  },
  roleTagCustomer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleTagAdmin: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  quickRoleName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  quickRoleEmail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  tapToLoginBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  tapToLoginText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  footerContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default HomeScreen;
