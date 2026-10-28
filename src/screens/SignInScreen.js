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
import { validateSignIn } from '../utils/validation';

export const SignInScreen = ({ navigation }) => {
  const { signIn, quickSignIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const validation = validateSignIn({ email, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const res = await signIn(email, password);
    setLoading(false);

    if (!res.success) {
      Alert.alert('Authentication Failed', res.error);
    }
  };

  const handleQuickFillCustomer = () => {
    setEmail('balabj@gmail.com');
    setPassword('password');
    setErrors({});
  };

  const handleQuickFillAdmin = () => {
    setEmail('krixxeey@gmail.com');
    setPassword('password');
    setErrors({});
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
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to <Text style={{ color: colors.gold, fontWeight: '700' }}>krixxeey</Text> FINANCE
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <CustomInput
              label="Email Address"
              placeholder="e.g. customer@example.com"
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
              label="Password"
              placeholder="Enter your password"
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

            <CustomButton
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              variant="primary"
              size="large"
              iconName="log-in-outline"
              iconPosition="right"
              style={styles.submitButton}
            />

            {/* Quick Demo Credentials for Examiner */}
            <View style={styles.demoCredentialsBox}>
              <Text style={styles.demoTitle}>QUICK FILL DEMO CREDENTIALS</Text>
              <View style={styles.demoPillsRow}>
                <TouchableOpacity
                  style={styles.demoPill}
                  onPress={handleQuickFillCustomer}
                  activeOpacity={0.7}
                >
                  <Ionicons name="person-circle" size={16} color={colors.primary} />
                  <Text style={styles.demoPillText}>Fill Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoPill, { borderColor: '#FDE68A' }]}
                  onPress={handleQuickFillAdmin}
                  activeOpacity={0.7}
                >
                  <Ionicons name="shield-half" size={16} color="#B45309" />
                  <Text style={[styles.demoPillText, { color: '#B45309' }]}>Fill Admin</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.demoCredentialsNote}>
                Customer: balabj@gmail.com • Admin: krixxeey@gmail.com (Password: password)
              </Text>
            </View>
          </View>

          {/* Bottom Link to Sign Up */}
          <View style={styles.signUpLinkRow}>
            <Text style={styles.signUpPrompt}>Don't have an account yet? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
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
  submitButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    width: '100%',
  },
  demoCredentialsBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  demoPillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  demoPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    gap: 6,
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  demoCredentialsNote: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
  signUpLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signUpPrompt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default SignInScreen;

