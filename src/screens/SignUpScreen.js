import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { KrishnanRadheyLogo } from '../components/KrishnanRadheyLogo';
import { validateRegistration } from '../utils/validation';

export const SignUpScreen = ({ navigation }) => {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Run validation
    const validation = validateRegistration({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const res = await signUp({
      name,
      email,
      password,
      role,
      phone,
      occupation,
    });

    setLoading(false);

    if (!res.success) {
      Alert.alert('Registration Failed', res.error);
    } else {
      Alert.alert(
        'Registration Successful',
        `Hi ${res.user.name}, your ${role === 'admin' ? 'Administrator' : 'Customer'} account has been created successfully!`,
        [{ text: 'Get Started' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              <KrishnanRadheyLogo size={48} showText={false} />
            </View>
            <View style={styles.headerTexts}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Register on <Text style={{ color: colors.gold, fontWeight: '700' }}>krixxeey</Text> FINANCE
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Role Selection Tabs */}
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Select Your Role <Text style={styles.required}>*</Text></Text>
              <View style={styles.roleTabGroup}>
                <TouchableOpacity
                  style={[styles.roleTab, role === 'customer' && styles.roleTabActive]}
                  onPress={() => setRole('customer')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="person"
                    size={16}
                    color={role === 'customer' ? colors.primary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.roleTabText,
                      role === 'customer' && styles.roleTabTextActive,
                    ]}
                  >
                    Customer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleTab, role === 'admin' && styles.roleTabActive]}
                  onPress={() => setRole('admin')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={role === 'admin' ? colors.primary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.roleTabText,
                      role === 'admin' && styles.roleTabTextActive,
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
            </View>

            <CustomInput
              label="Full Name"
              placeholder="e.g. Bala BJ"
              iconName="person-outline"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              error={errors.name}
              required
            />

            <CustomInput
              label="Email Address"
              placeholder="e.g. balabj@gmail.com"
              iconName="mail-outline"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              error={errors.email}
              required
            />

            <CustomInput
              label="Phone Number"
              placeholder="e.g. +91 98765 43210 (Optional)"
              iconName="call-outline"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <CustomInput
              label="Occupation"
              placeholder={role === 'admin' ? 'e.g. Finance Controller' : 'e.g. Software Engineer'}
              iconName="briefcase-outline"
              value={occupation}
              onChangeText={setOccupation}
            />

            <CustomInput
              label="Password"
              placeholder="Minimum 6 characters"
              iconName="lock-closed-outline"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              error={errors.password}
              required
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              iconName="lock-closed-outline"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              secureTextEntry
              error={errors.confirmPassword}
              required
            />

            <CustomButton
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              variant="primary"
              size="large"
              iconName="arrow-forward"
              iconPosition="right"
              style={styles.submitButton}
            />
          </View>

          {/* Bottom Link to Sign In */}
          <View style={styles.signInLinkRow}>
            <Text style={styles.signInPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTexts: {
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  roleContainer: {
    marginBottom: spacing.md,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.danger,
  },
  roleTabGroup: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: 3,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  roleTabActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  roleTabTextActive: {
    color: colors.primary,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.sm,
    width: '100%',
  },
  signInLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signInPrompt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default SignUpScreen;
