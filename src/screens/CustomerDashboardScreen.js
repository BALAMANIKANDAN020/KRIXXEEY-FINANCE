import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
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
import { EmptyState } from '../components/EmptyState';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { CATEGORIES } from '../data/demoData';
import { getTodayString, parseDateParts } from '../utils/dateHelpers';
import { validateTransaction } from '../utils/validation';

export const CustomerDashboardScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { transactions, addTransaction, confirmAndDelete } = useTransactions();

  // Active period for dashboard quick report
  const [activeReportTab, setActiveReportTab] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  // Add Transaction Modal state
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense'); // 'income' | 'expense'
  const [txCategory, setTxCategory] = useState('Food');
  const [txDate, setTxDate] = useState(getTodayString());
  const [txDescription, setTxDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Financial totals
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netBalance = calculateNetBalance(transactions);
  const savingsRate = calculateSavingsRate(transactions);

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  // Generate Report based on selected tab
  const today = getTodayString();
  const todayParts = parseDateParts(today);
  const currentReport =
    activeReportTab === 'daily'
      ? generateDailyReport(transactions, today)
      : activeReportTab === 'weekly'
      ? generateWeeklyReport(transactions, today)
      : generateMonthlyReport(transactions, todayParts.year, todayParts.month);

  const handleOpenAddModal = () => {
    setTxTitle('');
    setTxAmount('');
    setTxType('expense');
    setTxCategory('Food');
    setTxDate(getTodayString());
    setTxDescription('');
    setFormErrors({});
    setIsAddModalVisible(true);
  };

  const handleSaveTransaction = async () => {
    const validation = validateTransaction({
      title: txTitle,
      amount: txAmount,
      type: txType,
      category: txCategory,
      date: txDate,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    const res = await addTransaction({
      title: txTitle,
      amount: txAmount,
      type: txType,
      category: txCategory,
      date: txDate,
      description: txDescription,
    });

    if (res.success) {
      setIsAddModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* App Top Bar */}
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
          <Text style={styles.brandSubtitle}>Customer Dashboard • Bala BJ</Text>
        </View>

        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.avatarText}>{currentUser?.avatar || 'BJ'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Hero Balance Card */}
        <MainBalanceCard
          balance={netBalance}
          income={totalIncome}
          expenses={totalExpenses}
          savingsRate={savingsRate}
          userName={currentUser?.name || 'Customer'}
        />

        {/* Quick Action Navigation Grid */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleOpenAddModal}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Add Tx</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Transactions')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.tealLight }]}>
              <Ionicons name="swap-horizontal" size={22} color={colors.teal} />
            </View>
            <Text style={styles.actionLabel}>Transactions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Categories')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.purpleLight }]}>
              <Ionicons name="grid-outline" size={20} color={colors.purple} />
            </View>
            <Text style={styles.actionLabel}>Categories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Analysis')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.secondaryLight }]}>
              <Ionicons name="stats-chart" size={20} color={colors.secondary} />
            </View>
            <Text style={styles.actionLabel}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Period Reports Summary Section (Daily / Weekly / Monthly requirement on Home Screen) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Financial Period Reports</Text>
            <Text style={styles.sectionSubtitle}>
              {activeReportTab === 'daily'
                ? `Today (${today})`
                : activeReportTab === 'weekly'
                ? 'Last 7 Days Rolling'
                : 'Current Calendar Month'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
            <Text style={styles.seeAllText}>Full Report</Text>
          </TouchableOpacity>
        </View>

        {/* Period Filter Tabs */}
        <View style={styles.reportTabsWrapper}>
          <TouchableOpacity
            style={[styles.reportTab, activeReportTab === 'daily' && styles.reportTabActive]}
            onPress={() => setActiveReportTab('daily')}
          >
            <Ionicons
              name="today-outline"
              size={14}
              color={activeReportTab === 'daily' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.reportTabText,
                activeReportTab === 'daily' && styles.reportTabTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reportTab, activeReportTab === 'weekly' && styles.reportTabActive]}
            onPress={() => setActiveReportTab('weekly')}
          >
            <Ionicons
              name="calendar-outline"
              size={14}
              color={activeReportTab === 'weekly' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.reportTabText,
                activeReportTab === 'weekly' && styles.reportTabTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reportTab, activeReportTab === 'monthly' && styles.reportTabActive]}
            onPress={() => setActiveReportTab('monthly')}
          >
            <Ionicons
              name="calendar"
              size={14}
              color={activeReportTab === 'monthly' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.reportTabText,
                activeReportTab === 'monthly' && styles.reportTabTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mini Cards for Active Report Period */}
        <View style={styles.metricCardsRow}>
          <MetricMiniCard
            title="Period Income"
            amount={currentReport.totalIncome}
            type="income"
            subtitle={`${currentReport.transactionCount} transactions`}
          />
          <View style={{ width: spacing.md }} />
          <MetricMiniCard
            title="Period Expenses"
            amount={currentReport.totalExpenses}
            type="expense"
            subtitle={`Net: ${currentReport.netBalance >= 0 ? '+' : ''}${currentReport.netBalance}`}
          />
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Text style={styles.sectionSubtitle}>Your latest financial movements</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAllText}>View All ({transactions.length})</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <EmptyState
            title="No Transactions Yet"
            message="Add your first income or expense to see it here."
            actionTitle="Add Transaction"
            onAction={handleOpenAddModal}
          />
        ) : (
          <View style={styles.transactionsList}>
            {recentTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onDelete={(item) => confirmAndDelete(item.id, item.title)}
                showActions={true}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingAddBtn}
        onPress={handleOpenAddModal}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={colors.surface} />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Transaction</Text>
                <Text style={styles.modalSubtitle}>Record a new income or expense</Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Type Selector (Income / Expense) */}
              <View style={styles.typeSelectorRow}>
                <TouchableOpacity
                  style={[
                    styles.typeSelectorBtn,
                    txType === 'expense' && styles.typeSelectorExpenseActive,
                  ]}
                  onPress={() => {
                    setTxType('expense');
                    setTxCategory('Food');
                  }}
                >
                  <Ionicons
                    name="arrow-down-circle"
                    size={18}
                    color={txType === 'expense' ? colors.danger : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.typeSelectorText,
                      txType === 'expense' && styles.typeExpenseActiveText,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeSelectorBtn,
                    txType === 'income' && styles.typeSelectorIncomeActive,
                  ]}
                  onPress={() => {
                    setTxType('income');
                    setTxCategory('Salary');
                  }}
                >
                  <Ionicons
                    name="arrow-up-circle"
                    size={18}
                    color={txType === 'income' ? colors.secondary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.typeSelectorText,
                      txType === 'income' && styles.typeIncomeActiveText,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>

              <CustomInput
                label="Transaction Title"
                placeholder="e.g. Supermarket Grocery"
                iconName="receipt-outline"
                value={txTitle}
                onChangeText={(text) => {
                  setTxTitle(text);
                  if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                }}
                error={formErrors.title}
                required
              />

              <CustomInput
                label="Amount (â‚¹)"
                placeholder="e.g. 1500"
                iconName="cash-outline"
                value={txAmount}
                onChangeText={(text) => {
                  setTxAmount(text);
                  if (formErrors.amount) setFormErrors({ ...formErrors, amount: null });
                }}
                keyboardType="numeric"
                error={formErrors.amount}
                required
              />

              {/* Category Picker Chips */}
              <View style={styles.categoryPickerSection}>
                <Text style={styles.pickerLabel}>Category <Text style={{ color: colors.danger }}>*</Text></Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                  {CATEGORIES.filter((c) => (txType === 'income' ? c.type === 'income' : c.type === 'expense')).map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        txCategory === cat.name && {
                          backgroundColor: `${cat.color}20`,
                          borderColor: cat.color,
                        },
                      ]}
                      onPress={() => setTxCategory(cat.name)}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={16}
                        color={txCategory === cat.name ? cat.color : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          txCategory === cat.name && { color: cat.color, fontWeight: '700' },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <CustomInput
                label="Date (YYYY-MM-DD)"
                placeholder="YYYY-MM-DD"
                iconName="calendar-outline"
                value={txDate}
                onChangeText={(text) => {
                  setTxDate(text);
                  if (formErrors.date) setFormErrors({ ...formErrors, date: null });
                }}
                error={formErrors.date}
                required
              />

              <CustomInput
                label="Description (Optional)"
                placeholder="Add extra details..."
                iconName="document-text-outline"
                value={txDescription}
                onChangeText={setTxDescription}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtonsRow}>
                <CustomButton
                  title="Cancel"
                  onPress={() => setIsAddModalVisible(false)}
                  variant="outline"
                  size="medium"
                  style={{ flex: 1 }}
                />
                <View style={{ width: spacing.md }} />
                <CustomButton
                  title="Save Transaction"
                  onPress={handleSaveTransaction}
                  variant="primary"
                  size="medium"
                  iconName="checkmark"
                  style={{ flex: 1.5 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    color: colors.primary,
    fontWeight: '600',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  actionItem: {
    alignItems: 'center',
    gap: 4,
  },
  actionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 3,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  reportTabActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
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
  transactionsList: {
    paddingHorizontal: spacing.lg,
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeSelectorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    gap: spacing.xs,
  },
  typeSelectorExpenseActive: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  typeSelectorIncomeActive: {
    borderColor: colors.secondary,
    backgroundColor: '#ECFDF5',
  },
  typeSelectorText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeExpenseActiveText: {
    color: colors.danger,
  },
  typeIncomeActiveText: {
    color: colors.secondaryDark,
  },
  categoryPickerSection: {
    marginBottom: spacing.md,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.xs + 2,
    gap: 4,
  },
  categoryChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default CustomerDashboardScreen;

