import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateSavingsRate,
  generateDailyReport,
  generateWeeklyReport,
  generateMonthlyReport,
} from '../utils/calculations';
import { MainBalanceCard, MetricMiniCard } from '../components/SummaryCard';
import { TransactionCard } from '../components/TransactionCard';
import { getTodayString, parseDateParts } from '../utils/dateHelpers';

export const AdminDashboardScreen = ({ navigation }) => {
  const { currentUser, users, signOut } = useAuth();
  const { allTransactions, resetDemoData, confirmAndDelete } = useTransactions();

  const [activeReportTab, setActiveReportTab] = useState('monthly');

  // Overall system calculations
  const totalIncome = calculateTotalIncome(allTransactions);
  const totalExpenses = calculateTotalExpenses(allTransactions);
  const netBalance = calculateNetBalance(allTransactions);
  const savingsRate = calculateSavingsRate(allTransactions);

  // System statistics
  const customerUsers = users.filter((u) => u.role === 'customer');

  const today = getTodayString();
  const todayParts = parseDateParts(today);
  const report =
    activeReportTab === 'daily'
      ? generateDailyReport(allTransactions, today)
      : activeReportTab === 'weekly'
      ? generateWeeklyReport(allTransactions, today)
      : generateMonthlyReport(allTransactions, todayParts.year, todayParts.month);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Admin Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            if (navigation?.dispatch) {
              navigation.dispatch(DrawerActions.toggleDrawer());
            } else if (navigation?.toggleDrawer) {
              navigation.toggleDrawer();
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>
            <Text style={{ textTransform: 'lowercase', color: colors.primary, fontWeight: '800' }}>krixxeey</Text> FINANCE
          </Text>
          <Text style={styles.brandSubtitle}>Admin Console � Krixxeey</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={signOut}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Admin System Banner Card */}
        <MainBalanceCard
          balance={netBalance}
          income={totalIncome}
          expenses={totalExpenses}
          savingsRate={savingsRate}
          userName="Administrator"
        />

        {/* System KPI Cards */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="people" size={20} color={colors.primary} />
            </View>
            <Text style={styles.kpiValue}>{customerUsers.length}</Text>
            <Text style={styles.kpiLabel}>Active Customers</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.secondaryLight }]}>
              <Ionicons name="file-tray-full" size={20} color={colors.secondary} />
            </View>
            <Text style={styles.kpiValue}>{allTransactions.length}</Text>
            <Text style={styles.kpiLabel}>Total Records</Text>
          </View>
        </View>

        {/* Quick Admin Navigation Buttons */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Analysis')}
          >
            <Ionicons name="pie-chart-outline" size={22} color={colors.primary} />
            <Text style={styles.navCardText}>System Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Reports')}
          >
            <Ionicons name="document-text-outline" size={22} color={colors.teal} />
            <Text style={styles.navCardText}>Financial Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={resetDemoData}
          >
            <Ionicons name="refresh-outline" size={22} color={colors.warningDark} />
            <Text style={styles.navCardText}>Reset Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Reports Period Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Period Financial Audit</Text>
            <Text style={styles.sectionSubtitle}>Auditing all system transactions</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
            <Text style={styles.seeAllText}>Detailed View</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportTabsWrapper}>
          <TouchableOpacity
            style={[styles.reportTab, activeReportTab === 'daily' && styles.reportTabActive]}
            onPress={() => setActiveReportTab('daily')}
          >
            <Text style={[styles.reportTabText, activeReportTab === 'daily' && styles.reportTabTextActive]}>
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reportTab, activeReportTab === 'weekly' && styles.reportTabActive]}
            onPress={() => setActiveReportTab('weekly')}
          >
            <Text style={[styles.reportTabText, activeReportTab === 'weekly' && styles.reportTabTextActive]}>
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reportTab, activeReportTab === 'monthly' && styles.reportTabActive]}
            onPress={() => setActiveReportTab('monthly')}
          >
            <Text style={[styles.reportTabText, activeReportTab === 'monthly' && styles.reportTabTextActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricCardsRow}>
          <MetricMiniCard
            title="Audited Income"
            amount={report.totalIncome}
            type="income"
            subtitle={`${report.transactionCount} transactions`}
          />
          <View style={{ width: spacing.md }} />
          <MetricMiniCard
            title="Audited Expenses"
            amount={report.totalExpenses}
            type="expense"
            subtitle={`Net: ${report.netBalance >= 0 ? '+' : ''}${report.netBalance}`}
          />
        </View>

        {/* Customer Accounts Summary */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Registered Customers</Text>
            <Text style={styles.sectionSubtitle}>Demo users in storage</Text>
          </View>
        </View>

        <View style={styles.userListContainer}>
          {customerUsers.map((user) => {
            const userTx = allTransactions.filter((tx) => tx.userId === user.id);
            const userIncome = calculateTotalIncome(userTx);
            const userExpense = calculateTotalExpenses(userTx);
            return (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{user.avatar || 'U'}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userMeta}>{user.email} • {user.occupation}</Text>
                  <Text style={styles.userStats}>
                    {userTx.length} Txs • Inc: ₹{userIncome.toLocaleString('en-IN')} • Exp: ₹{userExpense.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* All System Transactions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>All System Transactions</Text>
            <Text style={styles.sectionSubtitle}>Latest {Math.min(5, allTransactions.length)} transactions</Text>
          </View>
        </View>

        <View style={styles.transactionsList}>
          {allTransactions.slice(0, 5).map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              onDelete={(item) => confirmAndDelete(item.id, item.title)}
              showActions={true}
            />
          ))}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '700',
  },
  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  kpiGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  kpiLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  navCard: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 4,
  },
  navCardText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  reportTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  reportTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 3,
    borderRadius: borderRadius.sm,
  },
  reportTabActive: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  reportTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  reportTabTextActive: {
    color: colors.primary,
  },
  metricCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  userListContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  userAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  userStats: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 3,
  },
  transactionsList: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
});

export default AdminDashboardScreen;

