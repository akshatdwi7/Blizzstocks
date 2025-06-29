import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CheckCircle,
  Crown,
  Sparkles,
  ArrowRight,
  Gift,
  Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

export default function PaymentSuccessScreen() {
  const { theme } = useTheme();
  const { plan, paymentId } = useLocalSearchParams();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = createStyles(theme);

  useEffect(() => {
    // Animate success elements
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const premiumFeatures = [
    'AI-Powered Stock Analysis',
    'Real-time Market Alerts',
    'Advanced Screening Tools',
    'Professional Charts',
    'Priority Customer Support',
    'Exclusive Market Insights',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View 
          style={[
            styles.successContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.successCircle}
          >
            <CheckCircle size={64} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.sparklesContainer}>
            <Sparkles size={24} color={theme.colors.warning} style={styles.sparkle1} />
            <Sparkles size={16} color={theme.colors.accent} style={styles.sparkle2} />
            <Sparkles size={20} color={theme.colors.secondary} style={styles.sparkle3} />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.successTitle, { color: theme.colors.text }]}>
            Welcome to Premium!
          </Text>
          <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>
            Your payment was successful. You now have access to all premium features.
          </Text>
          
          {paymentId && (
            <View style={[styles.paymentInfo, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.paymentLabel, { color: theme.colors.textTertiary }]}>
                Payment ID
              </Text>
              <Text style={[styles.paymentId, { color: theme.colors.text }]}>
                {paymentId}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Premium Badge */}
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.premiumBadge}
        >
          <Crown size={24} color="#FFFFFF" />
          <Text style={styles.premiumBadgeText}>Premium Member</Text>
          <View style={styles.premiumStars}>
            {[...Array(3)].map((_, i) => (
              <Star key={i} size={12} color="#FFFFFF" fill="#FFFFFF" />
            ))}
          </View>
        </LinearGradient>

        {/* Features Unlocked */}
        <View style={styles.featuresSection}>
          <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>
            Features Unlocked
          </Text>
          <View style={styles.featuresList}>
            {premiumFeatures.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureItem,
                  { backgroundColor: theme.colors.surface },
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      })
                    }]
                  }
                ]}
              >
                <CheckCircle size={16} color={theme.colors.success} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>
                  {feature}
                </Text>
                <Gift size={16} color={theme.colors.accent} />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.success]}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryButtonText}>Start Exploring</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.textSecondary }]}>
              View Subscription Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Support Info */}
        <View style={[styles.supportInfo, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.supportTitle, { color: theme.colors.text }]}>
            Need Help?
          </Text>
          <Text style={[styles.supportText, { color: theme.colors.textSecondary }]}>
            Our premium support team is here to help you get the most out of your subscription.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={[styles.supportButtonText, { color: theme.colors.primary }]}>
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  successContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xl,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  sparklesContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
    top: -20,
    left: -20,
  },
  sparkle1: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 30,
    left: 10,
  },
  sparkle3: {
    position: 'absolute',
    top: 40,
    left: 0,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  paymentInfo: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    minWidth: 200,
  },
  paymentLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  paymentId: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  premiumBadgeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  premiumStars: {
    flexDirection: 'row',
    gap: 2,
  },
  featuresSection: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  featuresTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  featuresList: {
    gap: theme.spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  actionsContainer: {
    width: '100%',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  primaryButton: {
    width: '100%',
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  supportInfo: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: theme.spacing.sm,
  },
  supportText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  supportButton: {
    paddingVertical: theme.spacing.sm,
  },
  supportButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
});