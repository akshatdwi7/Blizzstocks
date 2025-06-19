import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Heart, Plus, Bell, TrendingUp, TrendingDown, MoveVertical as MoreVertical, Star, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StockCard } from '@/components/StockCard';
import { mockWatchlist } from '@/data/mockData';
import { useTheme } from '@/contexts/ThemeContext';

export default function WatchlistScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('all');

  const styles = createStyles(theme);

  const tabs = [
    { id: 'all', name: 'All Stocks', count: mockWatchlist.length },
    { id: 'gainers', name: 'Gainers', count: 12 },
    { id: 'losers', name: 'Losers', count: 8 },
    { id: 'alerts', name: 'Alerts', count: 3 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>Watchlist</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Keep track of your favorite stocks</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}>
              <Bell size={24} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]}>
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={theme.colors.gradient.success}
              style={styles.statCard}
            >
              <View style={styles.statIcon}>
                <TrendingUp size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.statValue}>+$2,340</Text>
                <Text style={styles.statLabel}>Total Gains</Text>
              </View>
            </LinearGradient>
            
            <LinearGradient
              colors={theme.colors.gradient.error}
              style={styles.statCard}
            >
              <View style={styles.statIcon}>
                <TrendingDown size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.statValue}>-$890</Text>
                <Text style={styles.statLabel}>Total Losses</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={[styles.alertsCard, { backgroundColor: `${theme.colors.warning}20`, borderColor: theme.colors.warning }]}>
            <AlertTriangle size={20} color={theme.colors.warning} />
            <Text style={[styles.alertsText, { color: theme.colors.warning }]}>3 price alerts triggered</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                { backgroundColor: theme.colors.surface },
                selectedTab === tab.id && { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                { color: theme.colors.textTertiary },
                selectedTab === tab.id && { color: '#FFFFFF' }
              ]}>
                {tab.name}
              </Text>
              <View style={[
                styles.tabBadge,
                { backgroundColor: theme.colors.surfaceSecondary },
                selectedTab === tab.id && { backgroundColor: 'rgba(255,255,255,0.2)' }
              ]}>
                <Text style={[
                  styles.tabBadgeText,
                  { color: theme.colors.textSecondary },
                  selectedTab === tab.id && { color: '#FFFFFF' }
                ]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Watchlist Items */}
        <View style={styles.section}>
          {mockWatchlist.map((stock, index) => (
            <View key={index} style={styles.watchlistItem}>
              <View style={styles.stockCardContainer}>
                <StockCard stock={stock} />
              </View>
              <View style={styles.watchlistActions}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
                  <Heart size={16} color={theme.colors.error} fill={theme.colors.error} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
                  <Bell size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
                  <MoreVertical size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Add Suggestions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Suggested Stocks</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContent}
          >
            {['AAPL', 'GOOGL', 'AMZN', 'TSLA', 'MSFT', 'NVDA'].map((symbol, index) => (
              <TouchableOpacity key={index} style={[styles.suggestionCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.suggestionSymbol, { color: theme.colors.text }]}>{symbol}</Text>
                <Plus size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Premium Features */}
        <LinearGradient
          colors={[theme.colors.surface, theme.colors.surfaceSecondary]}
          style={[styles.premiumCard, { borderColor: theme.colors.border }]}
        >
          <View style={styles.premiumHeader}>
            <Star size={24} color={theme.colors.warning} />
            <Text style={[styles.premiumTitle, { color: theme.colors.text }]}>Premium Watchlist</Text>
          </View>
          <Text style={[styles.premiumDescription, { color: theme.colors.textSecondary }]}>
            Unlimited stocks, advanced alerts, and real-time notifications
          </Text>
          <TouchableOpacity style={[styles.premiumButton, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.premiumButtonText}>Upgrade Now</Text>
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
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontFamily: theme.typography.h1.fontFamily,
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
  headerButton: {
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'rgba(255,255,255,0.8)',
  },
  alertsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
  },
  alertsText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
  },
  tabs: {
    marginBottom: theme.spacing.lg,
  },
  tabsContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
  },
  tabBadge: {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  tabBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
    marginBottom: theme.spacing.md,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  stockCardContainer: {
    flex: 1,
  },
  watchlistActions: {
    flexDirection: 'row',
    marginLeft: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionsContent: {
    paddingRight: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionSymbol: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-SemiBold',
  },
  premiumCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  premiumTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
  },
  premiumDescription: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  premiumButton: {
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  premiumButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});