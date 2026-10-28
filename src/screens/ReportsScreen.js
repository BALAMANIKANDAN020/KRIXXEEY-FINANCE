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
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import {
  generateDailyReport,
  generateWeeklyReport,
  generateMonthlyReport,
} from '../utils/calculations';
import { formatCurrency } from '../utils/currency';
import {
  getTodayString,
  formatDisplayDate,
  formatMonthYear,
  MONTH_NAMES,
} from '../utils/dateHelpers';
import { TransactionCard } from '../components/TransactionCard';
import { EmptyState } from '../components/EmptyState';
import { HeaderBar } from '../components/HeaderBar';
import { CATEGORIES } from '../data/demoData';

export const ReportsScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { transactions } = useTransactions();

  // Tab: 'daily' | 'weekly' | 'monthly'
  const [activeTab, setActiveTab] = useState('monthly');

  // Daily target date (default today)
  const [dailyDate, setDailyDate] = useState(getTodayString());

  // Monthly target (year, month)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(10); // October

  // Weekly reference date
  const [weeklyRefDate, setWeeklyRefDate] = useState(getTodayString());

  // Generate Report
  const report =
    activeTab === 'daily'
      ? generateDailyReport(transactions, dailyDate)
      : activeTab === 'weekly'
      ? generateWeeklyReport(transactions, weeklyRefDate)
      : generateMonthlyReport(transactions, selectedYear, selectedMonth);

  const reportTransactions = report.transactions || [];
  const categoryBreakdown = report.categoryBreakdown || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <HeaderBar
        title="Financial Reports"
        subtitle={currentUser?.role === 'admin' ? 'System-Wide Ledger Audit' : 'Personal Balance Statements'}
        navigation={navigation}
        showMenu={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Tab Buttons (Daily, Weekly, Monthly) */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'daily' && styles.tabButtonActive]}
            onPress={() => setActiveTab('daily')}
          >
            <Ionicons
              name="today-outline"
              size={15}
              color={activeTab === 'daily' ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'daily' && styles.tabButtonTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'weekly' && styles.tabButtonActive]}
            onPress={() => setActiveTab('weekly')}
          >
            <Ionicons
              name="calendar-outline"
              size={15}
              color={activeTab === 'weekly' ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'weekly' && styles.tabButtonTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'monthly' && styles.tabButtonActive]}
            onPress={() => setActiveTab('monthly')}
          >
            <Ionicons
              name="pie-chart-outline"
              size={15}
              color={activeTab === 'monthly' ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'monthly' && styles.tabButtonTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Period Selector Controls */}
        <View style={styles.selectorCard}>
          {activeTab === 'daily' && (
            <View style={styles.dateSelectorRow}>
              <Text style={styles.selectorLabel}>Calendar Day:</Text>
              <View style={styles.dateDisplayPill}>
                <Ionicons name="calendar" size={16} color={colors.primary} />
                <Text style={styles.dateDisplayText}>{formatDisplayDate(dailyDate)}</Text>
              </View>
            </View>
          )}

          {activeTab === 'weekly' && (
            <View style={styles.dateSelectorRow}>
              <Text style={styles.selectorLabel}>7-Day Window Ending:</Text>
              <View style={styles.dateDisplayPill}>
                <Ionicons name="calendar" size={16} color={colors.primary} />
                <Text style={styles.dateDisplayText}>{formatDisplayDate(weeklyRefDate)}</Text>
              </View>
            </View>
          )}

          {activeTab === 'monthly' && (
            <View style={styles.monthSelectorRow}>
              <Text style={styles.selectorLabel}>Target Month:</Text>
              <View style={styles.monthPillRow}>
                <TouchableOpacity
                  style={[styles.monthPill, selectedMonth === 10 && styles.monthPillActive]}
                  onPress={() => setSelectedMonth(10)}
                >
                  <Text
                    style={[
                      styles.monthPillText,
                      selectedMonth === 10 && styles.monthPillTextActive,
                    ]}
                  >
                    Oct 2026
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.monthPill, selectedMonth === 9 && styles.monthPillActive]}
                  onPress={() => setSelectedMonth(9)}
                >
                  <Text
                    style={[
                      styles.monthPillText,
                      selectedMonth === 9 && styles.monthPillTextActive,
                    ]}
                  >
                    Sep 2026
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.monthPill, selectedMonth === 8 && styles.monthPillActive]}
                  onPress={() => setSelectedMonth(8)}
                >
                  <Text
                    style={[
                      styles.monthPillText,
                      selectedMonth === 8 && styles.monthPillTextActive,
                    ]}
                  >
                    Aug 2026
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Report Summary Card */}
        <View style={styles.reportSummaryCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.reportTitle}>
                {activeTab.toUpperCase()} STATEMENT
              </Text>
              <Text style={styles.reportPeriodText}>
                {activeTab === 'daily'
                  ? formatDisplayDate(dailyDate)
                  : activeTab === 'weekly'
                  ? `7 Days up to ${formatDisplayDate(weeklyRefDate)}`
                  : `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
              </Text>
            </View>
            <View style={styles.txCountBadge}>
              <Text style={styles.txCountBadgeText}>
                {report.transactionCount} {report.transactionCount === 1 ? 'tx' : 'txs'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 3 Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Total Income</Text>
              <Text style={styles.incomeAmount}>{formatCurrency(report.totalIncome)}</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Total Expenses</Text>
              <Text style={styles.expenseAmount}>{formatCurrency(report.totalExpenses)}</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Net Balance</Text>
              <Text
                style={[
                  styles.netAmount,
                  report.netBalance >= 0 ? styles.netPositive : styles.netNegative,
                ]}
              >
                {formatCurrency(report.netBalance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown for Report Period */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category-Wise Summary</Text>

          {categoryBreakdown.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>No expense category records in this statement.</Text>
            </View>
          ) : (
            categoryBreakdown.map((cat) => {
              const catObj = CATEGORIES.find(
                (c) => c.name.toLowerCase() === cat.category.toLowerCase()
              ) || { color: colors.primary, icon: 'folder' };

              return (
                <View key={cat.category} style={styles.catItemCard}>
                  <View
                    style={[
                      styles.catIconWrapper,
                      { backgroundColor: `${catObj.color || colors.primary}18` },
                    ]}
                  >
                    <Ionicons
                      name={catObj.icon || 'folder'}
                      size={18}
                      color={catObj.color || colors.primary}
                    />
                  </View>

                  <View style={styles.catDetailsCol}>
                    <View style={styles.catRowTop}>
                      <Text style={styles.catTitle}>{cat.category}</Text>
                      <Text style={styles.catAmount}>{formatCurrency(cat.totalAmount)}</Text>
                    </View>

                    <View style={styles.catProgressContainer}>
                      <View style={styles.catProgressBg}>
                        <View
                          style={[
                            styles.catProgressFill,
                            {
                              width: `${Math.min(100, Math.max(0, cat.percentage))}%`,
                              backgroundColor: catObj.color || colors.primary,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.catPercent}>{cat.percentage}%</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Transactions Included in Statement */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Transactions in Statement</Text>
            <Text style={styles.badgeText}>{reportTransactions.length} records</Text>
          </View>

          {reportTransactions.length === 0 ? (
            <EmptyState
              title="No Transactions in Selected Period"
              message="No records match this report window. Exclude non-matching dates."
              actionTitle="Add Transaction"
              onAction={() => navigation.navigate('Transactions')}
            />
          ) : (
            reportTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                showActions={false}
              />
            ))
          )}
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabButtonTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  selectorCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dateDisplayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.round,
    gap: 6,
  },
  dateDisplayText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  monthPillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  monthPill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  monthPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthPillTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  reportSummaryCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  reportPeriodText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  txCountBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
  },
  txCountBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondaryDark,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger,
  },
  netAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  netPositive: {
    color: colors.primary,
  },
  netNegative: {
    color: colors.danger,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderLight,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  emptyCardText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  catItemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  catIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  catDetailsCol: {
    flex: 1,
  },
  catRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catProgressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSubtle,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  catPercent: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
});

export default ReportsScreen;
