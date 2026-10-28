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
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useTransactions } from '../context/TransactionContext';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
} from '../utils/calculations';
import { formatCurrency } from '../utils/currency';
import {
  formatMonthYear,
  getMonthKey,
  getTodayString,
  MONTH_NAMES,
} from '../utils/dateHelpers';
import { TransactionCard } from '../components/TransactionCard';
import { EmptyState } from '../components/EmptyState';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { HeaderBar } from '../components/HeaderBar';
import { CATEGORIES } from '../data/demoData';
import { validateTransaction } from '../utils/validation';

export const TransactionsScreen = ({ navigation }) => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    confirmAndDelete,
  } = useTransactions();

  // Selected Month state (default to October 2026)
  const [selectedMonthKey, setSelectedMonthKey] = useState('2026-10');

  // Month selector modal
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);

  // Available months (extracted from data plus standard list)
  const availableMonths = [
    '2026-10',
    '2026-09',
    '2026-08',
    '2026-07',
    '2026-06',
    '2026-05',
    '2026-04',
    '2026-03',
    '2026-02',
    '2026-01',
  ];

  // Filter transactions belonging to selected month
  const monthlyTransactions = transactions.filter(
    (tx) => getMonthKey(tx.date) === selectedMonthKey
  );

  // Monthly Financial Calculations
  const monthlyIncome = calculateTotalIncome(monthlyTransactions);
  const monthlyExpenses = calculateTotalExpenses(monthlyTransactions);
  const monthlyNet = calculateNetBalance(monthlyTransactions);

  // Add / Edit Transaction Form Modal state
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingTxId, setEditingTxId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('expense');
  const [formCategory, setFormCategory] = useState('Food');
  const [formDate, setFormDate] = useState(getTodayString());
  const [formDescription, setFormDescription] = useState('');
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingTxId(null);
    setFormTitle('');
    setFormAmount('');
    setFormType('expense');
    setFormCategory('Food');
    setFormDate(getTodayString());
    setFormDescription('');
    setErrors({});
    setIsFormModalVisible(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTxId(tx.id);
    setFormTitle(tx.title);
    setFormAmount(String(tx.amount));
    setFormType(tx.type);
    setFormCategory(tx.category);
    setFormDate(tx.date);
    setFormDescription(tx.description || '');
    setErrors({});
    setIsFormModalVisible(true);
  };

  const handleSaveForm = async () => {
    const validation = validateTransaction({
      title: formTitle,
      amount: formAmount,
      type: formType,
      category: formCategory,
      date: formDate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    if (editingTxId) {
      const res = await updateTransaction(editingTxId, {
        title: formTitle,
        amount: formAmount,
        type: formType,
        category: formCategory,
        date: formDate,
        description: formDescription,
      });
      if (res.success) {
        setIsFormModalVisible(false);
      }
    } else {
      const res = await addTransaction({
        title: formTitle,
        amount: formAmount,
        type: formType,
        category: formCategory,
        date: formDate,
        description: formDescription,
      });
      if (res.success) {
        // Also auto-switch to that month if different
        const txMonth = getMonthKey(formDate);
        setSelectedMonthKey(txMonth);
        setIsFormModalVisible(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <HeaderBar
        title="Transactions"
        subtitle="Month-wise ledger"
        navigation={navigation}
        showMenu={true}
        rightAction={
          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={handleOpenAdd}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
            <Text style={styles.headerAddBtnText}>Add</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Selector Bar */}
        <View style={styles.monthSelectorBar}>
          <TouchableOpacity
            style={styles.monthPickerButton}
            onPress={() => setIsMonthPickerVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.selectedMonthText}>{formatMonthYear(selectedMonthKey)}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.txCountBadge}>
            {monthlyTransactions.length} {monthlyTransactions.length === 1 ? 'record' : 'records'}
          </Text>
        </View>

        {/* Monthly Summary Strip Card */}
        <View style={styles.summaryStripCard}>
          <View style={styles.stripCol}>
            <Text style={styles.stripLabel}>Monthly Income</Text>
            <Text style={styles.incomeVal}>{formatCurrency(monthlyIncome)}</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripCol}>
            <Text style={styles.stripLabel}>Monthly Expenses</Text>
            <Text style={styles.expenseVal}>{formatCurrency(monthlyExpenses)}</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripCol}>
            <Text style={styles.stripLabel}>Net Balance</Text>
            <Text
              style={[
                styles.netVal,
                monthlyNet >= 0 ? styles.netValPositive : styles.netValNegative,
              ]}
            >
              {formatCurrency(monthlyNet)}
            </Text>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>Month's Activity</Text>
            <TouchableOpacity onPress={handleOpenAdd}>
              <Text style={styles.addInlineText}>+ Add Transaction</Text>
            </TouchableOpacity>
          </View>

          {monthlyTransactions.length === 0 ? (
            <EmptyState
              title={`No Transactions in ${formatMonthYear(selectedMonthKey)}`}
              message="No records have been recorded for this month. Tap below to log one."
              actionTitle="Add Transaction"
              onAction={handleOpenAdd}
            />
          ) : (
            monthlyTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onEdit={handleOpenEdit}
                onDelete={(item) => confirmAndDelete(item.id, item.title)}
                showActions={true}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Month Picker Modal */}
      <Modal
        visible={isMonthPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMonthPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMonthPickerVisible(false)}
        >
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle}>Select Month & Year</Text>
            <View style={styles.monthsGrid}>
              {availableMonths.map((mKey) => (
                <TouchableOpacity
                  key={mKey}
                  style={[
                    styles.monthItemBtn,
                    selectedMonthKey === mKey && styles.monthItemActive,
                  ]}
                  onPress={() => {
                    setSelectedMonthKey(mKey);
                    setIsMonthPickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthItemText,
                      selectedMonthKey === mKey && styles.monthItemTextActive,
                    ]}
                  >
                    {formatMonthYear(mKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add / Edit Transaction Modal */}
      <Modal
        visible={isFormModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFormModalVisible(false)}
      >
        <View style={styles.modalOverlayBottom}>
          <View style={styles.formModalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingTxId ? 'Edit Transaction' : 'Add Transaction'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingTxId ? 'Update details of your record' : 'Fill in transaction details'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setIsFormModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Income / Expense Switch */}
              <View style={styles.typeSelectorRow}>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    formType === 'expense' && styles.typeExpenseActive,
                  ]}
                  onPress={() => {
                    setFormType('expense');
                    setFormCategory('Food');
                  }}
                >
                  <Ionicons
                    name="arrow-down-circle"
                    size={18}
                    color={formType === 'expense' ? colors.danger : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.typeText,
                      formType === 'expense' && styles.typeExpenseText,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    formType === 'income' && styles.typeIncomeActive,
                  ]}
                  onPress={() => {
                    setFormType('income');
                    setFormCategory('Salary');
                  }}
                >
                  <Ionicons
                    name="arrow-up-circle"
                    size={18}
                    color={formType === 'income' ? colors.secondary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.typeText,
                      formType === 'income' && styles.typeIncomeText,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>

              <CustomInput
                label="Transaction Title"
                placeholder="e.g. Electricity Bill"
                iconName="receipt-outline"
                value={formTitle}
                onChangeText={(text) => {
                  setFormTitle(text);
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
                error={errors.title}
                required
              />

              <CustomInput
                label="Amount (₹)"
                placeholder="e.g. 2400"
                iconName="cash-outline"
                value={formAmount}
                onChangeText={(text) => {
                  setFormAmount(text);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                keyboardType="numeric"
                error={errors.amount}
                required
              />

              {/* Category Chips */}
              <View style={styles.categoryPickerSection}>
                <Text style={styles.pickerLabel}>
                  Category <Text style={{ color: colors.danger }}>*</Text>
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                  {CATEGORIES.filter((c) => (formType === 'income' ? c.type === 'income' : c.type === 'expense')).map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        formCategory === cat.name && {
                          backgroundColor: `${cat.color}20`,
                          borderColor: cat.color,
                        },
                      ]}
                      onPress={() => setFormCategory(cat.name)}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={16}
                        color={formCategory === cat.name ? cat.color : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          formCategory === cat.name && { color: cat.color, fontWeight: '700' },
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
                value={formDate}
                onChangeText={(text) => {
                  setFormDate(text);
                  if (errors.date) setErrors({ ...errors, date: null });
                }}
                error={errors.date}
                required
              />

              <CustomInput
                label="Description (Optional)"
                placeholder="Notes about this transaction..."
                iconName="document-text-outline"
                value={formDescription}
                onChangeText={setFormDescription}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtonsRow}>
                <CustomButton
                  title="Cancel"
                  onPress={() => setIsFormModalVisible(false)}
                  variant="outline"
                  size="medium"
                  style={{ flex: 1 }}
                />
                <View style={{ width: spacing.md }} />
                <CustomButton
                  title={editingTxId ? 'Update' : 'Save'}
                  onPress={handleSaveForm}
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
  headerAddBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.round,
    gap: 4,
  },
  headerAddBtnText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  monthSelectorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  monthPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
    elevation: 1,
  },
  selectedMonthText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  txCountBadge: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    fontWeight: '600',
  },
  summaryStripCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stripCol: {
    alignItems: 'center',
    flex: 1,
  },
  stripLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  incomeVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondaryDark,
  },
  expenseVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  netVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  netValPositive: {
    color: colors.primary,
  },
  netValNegative: {
    color: colors.danger,
  },
  stripDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderLight,
  },
  listSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addInlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  pickerModalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
    elevation: 5,
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  monthsGrid: {
    gap: spacing.xs + 2,
  },
  monthItemBtn: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
  },
  monthItemActive: {
    backgroundColor: colors.primary,
  },
  monthItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  monthItemTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  formModalSheet: {
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
  typeBtn: {
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
  typeExpenseActive: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  typeIncomeActive: {
    borderColor: colors.secondary,
    backgroundColor: '#ECFDF5',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeExpenseText: {
    color: colors.danger,
  },
  typeIncomeText: {
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

export default TransactionsScreen;
