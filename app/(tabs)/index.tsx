import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, DollarSign, ChartBar as BarChart3, Eye, Bell, Plus, Sparkles } from 'lucide-react-native';
import { PortfolioCard } from '@/components/PortfolioCard';
import { StockCard } from '@/components/StockCard';
import { mockPortfolio, mockHoldings } from '@/data/mockData';
import { useTheme } from '@/contexts/ThemeContext';

export default function PortfolioScreen() {
  const { theme } = useTheme();

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>Good morning, Alex</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Ready to make smart investments?</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: theme.colors.surface }]}>
              <Bell size={24} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.aiButton, { backgroundColor: theme.colors.accent }]}>
              <Sparkles size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio Overview */}
        <LinearGradient
          colors={theme.colors.gradient.primary}
          style={styles.portfolioCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioTitle}>Total Portfolio Value</Text>
            <TouchableOpacity style={styles.eyeButton}>
              <Eye size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.portfolioValue}>${mockPortfolio.totalValue.toLocaleString()}</Text>
          
          <View style={styles.portfolioStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFFFFF' }]}>
                <TrendingUp size={16} color={theme.colors.success} />
              </View>
              <View>
                <Text style={styles.statValue}>+${mockPortfolio.dayGain.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Today's Gain</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFFFFF' }]}>
                <BarChart3 size={16} color={theme.colors.secondary} />
              </View>
              <View>
                <Text style={styles.statValue}>+{mockPortfolio.totalGainPercent}%</Text>
                <Text style={styles.statLabel}>Total Return</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
            <LinearGradient
              colors={[theme.colors.success, theme.colors.primaryDark]}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Add Money</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
            <LinearGradient
              colors={theme.colors.gradient.secondary}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <DollarSign size={20} color="#FFFFFF" />
              <Text style={styles.actionText}>Buy Stocks</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Holdings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Holdings</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {mockHoldings.slice(0, 5).map((stock, index) => (
            <StockCard key={index} stock={stock} />
          ))}
        </View>

        {/* Market Movers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Market Movers</Text>
          <View style={styles.moversGrid}>
            {[
              { symbol: 'AAPL', change: '+2.4%', positive: true },
              { symbol: 'TSLA', change: '-1.8%', positive: false },
              { symbol: 'NVDA', change: '+3.2%', positive: true },
              { symbol: 'MSFT', change: '+1.1%', positive: true },
            ].map((mover, index) => (
              <View key={index} style={[styles.moverCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.moverSymbol, { color: theme.colors.text }]}>{mover.symbol}</Text>
                <Text style={[styles.moverChange, { color: mover.positive ? theme.colors.positive : theme.colors.negative }]}>
                  {mover.change}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Insights */}
        <LinearGradient
          colors={[theme.colors.accent, '#A855F7']}
          style={styles.aiInsights}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.aiHeader}>
            <Sparkles size={24} color="#FFFFFF" />
            <Text style={styles.aiTitle}>AI Market Insights</Text>
          </View>
          <Text style={styles.aiDescription}>
            Based on your portfolio, consider diversifying into healthcare sector. NVDA shows strong momentum for next quarter.
          </Text>
          <TouchableOpacity style={styles.aiCta}>
            <Text style={styles.aiCtaText}>Get Full Analysis</Text>
          </TouchableOpacity>
        </LinearGradient>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.h2.fontSize,
    fontFamily: theme.typography.h2.fontFamily,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  portfolioCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  portfolioTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.lg,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
  },
  seeAll: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Medium',
  },
  moversGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  moverCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  moverSymbol: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  moverChange: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
  },
  aiInsights: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  aiTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  aiDescription: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  aiCta: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  aiCtaText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});