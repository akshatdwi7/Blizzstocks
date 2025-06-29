import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Crown, Sparkles, TrendingUp, Shield, Zap, ChartBar as BarChart3, Bell, Target, CircleCheck as CheckCircle, Star, ArrowRight, Users, Award, Brain, Lock, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  RazorpayPayment, 
  formatINR, 
  SubscriptionPlan, 
  PaymentResponse,
  RAZORPAY_CONFIG,
  createPaymentHandler 
} from '@/components/RazorpayPayment';

interface PremiumFeature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

export default function PremiumScreen() {
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>('quarterly');
  const [isLoading, setIsLoading] = useState(false);

  const styles = createStyles(theme);

  const premiumFeatures: PremiumFeature[] = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get personalized stock recommendations and market insights powered by advanced AI algorithms',
      color: theme.colors.accent,
    },
    {
      icon: TrendingUp,
      title: 'Advanced Screeners',
      description: 'Access 50+ screening criteria with backtesting, custom alerts, and real-time filtering',
      color: theme.colors.success,
    },
    {
      icon: Bell,
      title: 'Real-time Alerts',
      description: 'Instant notifications for price movements, news, technical indicators, and market events',
      color: theme.colors.warning,
    },
    {
      icon: BarChart3,
      title: 'Professional Charts',
      description: 'Advanced charting tools with 100+ technical indicators, drawing tools, and pattern recognition',
      color: theme.colors.secondary,
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Portfolio risk analysis, position sizing calculator, and automated stop-loss recommendations',
      color: theme.colors.error,
    },
    {
      icon: Target,
      title: 'Options Trading',
      description: 'Options chain analysis, Greeks calculator, strategy builder, and profit/loss visualization',
      color: theme.colors.accent,
    },
  ];

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 999,
      period: 'month',
      features: [
        'All premium features',
        'Real-time market data',
        'Advanced stock screeners',
        'AI-powered recommendations',
        'Email support',
      ],
      razorpayPlanId: 'plan_monthly_999',
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: 2499,
      originalPrice: 2997,
      period: '3 months',
      popular: true,
      savings: 17,
      features: [
        'Everything in Monthly',
        '17% savings (₹498 off)',
        'Exclusive market webinars',
        'Portfolio health reports',
        'Custom alert templates',
        'Priority support',
      ],
      razorpayPlanId: 'plan_quarterly_2499',
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 7999,
      originalPrice: 11988,
      period: 'year',
      savings: 33,
      features: [
        'Everything in Quarterly',
        '33% savings (₹3,989 off)',
        '1-on-1 strategy consultation',
        'Early access to new features',
        'Tax optimization reports',
        'Dedicated account manager',
      ],
      razorpayPlanId: 'plan_yearly_7999',
    },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Day Trader',
      content: 'The AI recommendations helped me increase my portfolio by 45% in 6 months. The real-time alerts saved me from major losses during market volatility.',
      rating: 5,
      location: 'Mumbai',
    },
    {
      name: 'Priya Sharma',
      role: 'Investment Advisor',
      content: 'Best screening tools I\'ve used in 10 years. The backtesting feature is incredibly accurate and helps me make data-driven decisions.',
      rating: 5,
      location: 'Delhi',
    },
    {
      name: 'Amit Patel',
      role: 'Swing Trader',
      content: 'The options analysis tools are game-changing. I can now execute complex strategies with confidence and better risk management.',
      rating: 5,
      location: 'Bangalore',
    },
  ];

  const handleSubscribe = async (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return;

    setIsLoading(true);

    try {
      const paymentOptions = {
        key: RAZORPAY_CONFIG.key,
        amount: plan.price * 100, // Convert to paise
        currency: 'INR',
        name: RAZORPAY_CONFIG.company.name,
        description: `${plan.name} Subscription - Premium Stock Trading`,
        image: RAZORPAY_CONFIG.company.logo,
        prefill: {
          name: 'Akshat Dwivedi',
          email: 'akshatdwivedi755@gmail.com',
          contact: '+919999999999',
        },
        theme: RAZORPAY_CONFIG.theme,
      };

      const { onSuccess, onError } = createPaymentHandler(
        (response: PaymentResponse) => {
          console.log('Payment successful:', response);
          
          // Navigate to success page with payment details
          router.push({
            pathname: '/premium/success',
            params: {
              plan: plan.name,
              paymentId: response.razorpay_payment_id,
              amount: plan.price.toString(),
            },
          });
        },
        (error: any) => {
          console.error('Payment failed:', error);
          Alert.alert(
            'Payment Failed',
            error.message || 'Something went wrong. Please try again.',
            [{ text: 'OK' }]
          );
        }
      );

      const success = await RazorpayPayment.initializePayment(
        paymentOptions,
        onSuccess,
        onError
      );

      if (!success) {
        Alert.alert(
          'Payment Error',
          'Unable to initialize payment. Please check your internet connection and try again.'
        );
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      Alert.alert(
        'Error',
        'Failed to initialize payment. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeTrial = () => {
    Alert.alert(
      'Start Free Trial',
      'Your 7-day free trial will begin immediately. You can cancel anytime before the trial ends.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Trial', 
          onPress: () => handleSubscribe(selectedPlan),
          style: 'default'
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#8B5CF6', '#A855F7', '#C084FC']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View style={styles.crownContainer}>
              <Crown size={48} color="#FFFFFF" />
              <Sparkles size={24} color="#FFFFFF" style={styles.sparkle1} />
              <Sparkles size={16} color="#FFFFFF" style={styles.sparkle2} />
              <Activity size={20} color="#FFFFFF" style={styles.sparkle3} />
            </View>
            <Text style={styles.heroTitle}>Unlock Premium Trading</Text>
            <Text style={styles.heroSubtitle}>
              Join 50,000+ traders who've upgraded their investment game with AI-powered insights and professional tools
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>45%</Text>
                <Text style={styles.statLabel}>Avg. Returns</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50K+</Text>
                <Text style={styles.statLabel}>Active Users</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.9★</Text>
                <Text style={styles.statLabel}>App Rating</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Premium Features
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Everything you need to make smarter investment decisions
          </Text>
          <View style={styles.featuresGrid}>
            {premiumFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <View
                  key={index}
                  style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}
                >
                  <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                    <IconComponent size={24} color={feature.color} />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Subscription Plans */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Choose Your Plan
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Start your 7-day free trial. Cancel anytime with no questions asked.
          </Text>
          
          <View style={styles.plansContainer}>
            {subscriptionPlans.map((plan, index) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  { backgroundColor: theme.colors.surface },
                  selectedPlan === plan.id && { 
                    borderColor: theme.colors.primary, 
                    borderWidth: 2,
                    shadowColor: theme.colors.primary,
                    shadowOpacity: 0.2,
                  },
                  plan.popular && styles.popularPlan,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <LinearGradient
                    colors={['#8B5CF6', '#A855F7']}
                    style={styles.popularBadge}
                  >
                    <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.popularText}>Most Popular</Text>
                  </LinearGradient>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, { color: theme.colors.text }]}>
                    {plan.name}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.price, { color: theme.colors.text }]}>
                      {formatINR(plan.price)}
                    </Text>
                    {plan.originalPrice && (
                      <Text style={[styles.originalPrice, { color: theme.colors.textTertiary }]}>
                        {formatINR(plan.originalPrice)}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.period, { color: theme.colors.textSecondary }]}>
                    per {plan.period}
                  </Text>
                  {plan.savings && (
                    <View style={[styles.savingsBadge, { backgroundColor: theme.colors.success }]}>
                      <Text style={styles.savingsText}>Save {plan.savings}%</Text>
                    </View>
                  )}
                </View>

                <View style={styles.featuresContainer}>
                  {plan.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureRow}>
                      <CheckCircle size={16} color={theme.colors.success} />
                      <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={[
                  styles.selectButton,
                  { backgroundColor: selectedPlan === plan.id ? theme.colors.primary : theme.colors.surfaceSecondary },
                  selectedPlan === plan.id && {
                    shadowColor: theme.colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }
                ]}>
                  <Text style={[
                    styles.selectButtonText,
                    { color: selectedPlan === plan.id ? '#FFFFFF' : theme.colors.textSecondary }
                  ]}>
                    {selectedPlan === plan.id ? 'Selected Plan' : 'Select Plan'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            What Our Users Say
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsContainer}
          >
            {testimonials.map((testimonial, index) => (
              <View
                key={index}
                style={[styles.testimonialCard, { backgroundColor: theme.colors.surface }]}
              >
                <View style={styles.testimonialHeader}>
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.success]}
                    style={styles.avatar}
                  >
                    <Users size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.testimonialInfo}>
                    <Text style={[styles.testimonialName, { color: theme.colors.text }]}>
                      {testimonial.name}
                    </Text>
                    <Text style={[styles.testimonialRole, { color: theme.colors.textSecondary }]}>
                      {testimonial.role} • {testimonial.location}
                    </Text>
                  </View>
                  <View style={styles.rating}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={12} color={theme.colors.warning} fill={theme.colors.warning} />
                    ))}
                  </View>
                </View>
                <Text style={[styles.testimonialContent, { color: theme.colors.textSecondary }]}>
                  "{testimonial.content}"
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Security & Trust */}
        <View style={[styles.trustSection, { backgroundColor: theme.colors.surface }]}>
          <Shield size={32} color={theme.colors.success} />
          <Text style={[styles.trustTitle, { color: theme.colors.text }]}>
            Bank-Grade Security
          </Text>
          <Text style={[styles.trustDescription, { color: theme.colors.textSecondary }]}>
            Your data is protected with 256-bit SSL encryption. We never store your trading passwords or sensitive financial information.
          </Text>
          <View style={styles.trustBadges}>
            <View style={[styles.trustBadge, { backgroundColor: theme.colors.background }]}>
              <Lock size={16} color={theme.colors.success} />
              <Text style={[styles.trustBadgeText, { color: theme.colors.textSecondary }]}>
                SSL Secured
              </Text>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: theme.colors.background }]}>
              <Award size={16} color={theme.colors.warning} />
              <Text style={[styles.trustBadgeText, { color: theme.colors.textSecondary }]}>
                ISO Certified
              </Text>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: theme.colors.background }]}>
              <Shield size={16} color={theme.colors.secondary} />
              <Text style={[styles.trustBadgeText, { color: theme.colors.textSecondary }]}>
                RBI Compliant
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              isLoading && styles.subscribeButtonDisabled,
            ]}
            onPress={handleFreeTrial}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.subscribeGradient}
            >
              {isLoading ? (
                <Text style={styles.subscribeButtonText}>Processing...</Text>
              ) : (
                <>
                  <Text style={styles.subscribeButtonText}>
                    Start 7-Day Free Trial
                  </Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={[styles.trialText, { color: theme.colors.textTertiary }]}>
            Free for 7 days • Then {formatINR(subscriptionPlans.find(p => p.id === selectedPlan)?.price || 999)}/{subscriptionPlans.find(p => p.id === selectedPlan)?.period} • Cancel anytime
          </Text>
          
          <TouchableOpacity style={styles.termsButton}>
            <Text style={[styles.termsText, { color: theme.colors.textTertiary }]}>
              By continuing, you agree to our Terms & Conditions and Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  heroContent: {
    alignItems: 'center',
  },
  crownContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -4,
    left: -12,
  },
  sparkle3: {
    position: 'absolute',
    top: 10,
    left: -16,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  featureCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: theme.spacing.sm,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  plansContainer: {
    gap: theme.spacing.md,
  },
  planCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    position: 'relative',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  popularPlan: {
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    gap: 4,
  },
  popularText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  planName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: theme.spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  originalPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'line-through',
  },
  period: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: theme.spacing.sm,
  },
  savingsBadge: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
  },
  savingsText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  featuresContainer: {
    marginBottom: theme.spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  selectButton: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  testimonialsContainer: {
    paddingRight: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  testimonialCard: {
    width: 300,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  trustSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  trustDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  trustBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  trustBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  ctaSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  subscribeButton: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  subscribeButtonDisabled: {
    opacity: 0.7,
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  trialText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  termsButton: {
    paddingVertical: theme.spacing.sm,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
});