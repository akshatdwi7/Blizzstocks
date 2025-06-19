import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Filter, SlidersHorizontal, TrendingUp, TrendingDown, DollarSign, ChartBar as BarChart3, Globe, Building2, Zap, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StockCard } from '@/components/StockCard';
import { mockScreenerResults } from '@/data/mockData';
import { useTheme } from '@/contexts/ThemeContext';

export default function ScreenerScreen() {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const styles = createStyles(theme);

  const filters = [
    { id: 'all', name: 'All Stocks', icon: Globe },
    { id: 'gainers', name: 'Top Gainers', icon: TrendingUp },
    { id: 'losers', name: 'Top Losers', icon: TrendingDown },
    { id: 'volume', name: 'High Volume', icon: BarChart3 },
    { id: 'dividend', name: 'Dividend', icon: DollarSign },
  ];

  const screenerPresets = [
    {
      title: 'Growth Stocks',
      description: 'High growth potential companies',
      criteria: 'P/E < 30, Revenue Growth > 20%',
      color: theme.colors.success,
      icon: TrendingUp,
      count: 127,
    },
    {
      title: 'Value Picks',
      description: 'Undervalued quality companies',
      criteria: 'P/E < 15, P/B < 2, Debt/Equity < 0.5',
      color: theme.colors.secondary,
      icon: Building2,
      count: 89,
    },
    {
      title: 'Momentum Plays',
      description: 'Strong price momentum stocks',
      criteria: 'RSI > 50, MACD > 0, Volume > Avg',
      color: theme.colors.warning,
      icon: Zap,
      count: 156,
    },
    {
      title: 'Dividend Champions',
      description: 'Consistent dividend payers',
      criteria: 'Dividend Yield > 3%, 5Y Growth > 10%',
      color: theme.colors.accent,
      icon: DollarSign,
      count: 73,
    },
  ];

  const handlePresetPress = (preset: any) => {
    router.push({
      pathname: '/screener/results',
      params: { preset: preset.title }
    });
  };

  const handleDetailsPress = () => {
    router.push('/screener/details');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>Stock Screener</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Find stocks that match your criteria</Text>
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleDetailsPress}
          >
            <SlidersHorizontal size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterTabs}
          contentContainerStyle={styles.filterTabsContent}
        >
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  { backgroundColor: theme.colors.surface },
                  selectedFilter === filter.id && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <IconComponent 
                  size={16} 
                  color={selectedFilter === filter.id ? '#FFFFFF' : theme.colors.textTertiary} 
                />
                <Text style={[
                  styles.filterTabText,
                  { color: theme.colors.textTertiary },
                  selectedFilter === filter.id && { color: '#FFFFFF' }
                ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Screener Presets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Popular Screeners</Text>
            <TouchableOpacity onPress={handleDetailsPress}>
              <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.presetsGrid}>
            {screenerPresets.map((preset, index) => {
              const IconComponent = preset.icon;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.presetCard, { backgroundColor: theme.colors.surface }]}
                  onPress={() => handlePresetPress(preset)}
                >
                  <View style={styles.presetHeader}>
                    <View style={[styles.presetIcon, { backgroundColor: `${preset.color}20` }]}>
                      <IconComponent size={24} color={preset.color} />
                    </View>
                    <View style={[styles.countBadge, { backgroundColor: `${preset.color}20` }]}>
                      <Text style={[styles.countText, { color: preset.color }]}>{preset.count}</Text>
                    </View>
                  </View>
                  <Text style={[styles.presetTitle, { color: theme.colors.text }]}>{preset.title}</Text>
                  <Text style={[styles.presetDescription, { color: theme.colors.textSecondary }]}>{preset.description}</Text>
                  <Text style={[styles.presetCriteria, { color: theme.colors.textTertiary }]}>{preset.criteria}</Text>
                  <View style={styles.presetFooter}>
                    <ArrowRight size={16} color={preset.color} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Market Stats */}
        <View style={styles.marketStats}>
          <LinearGradient
            colors={theme.colors.gradient.primary}
            style={styles.statCard}
          >
            <Text style={styles.statNumber}>2,847</Text>
            <Text style={styles.statLabel}>Stocks Screened</Text>
          </LinearGradient>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statNumber, { color: theme.colors.success }]}>64%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Above 200 MA</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statNumber, { color: theme.colors.error }]}>12%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Oversold</Text>
          </View>
        </View>

        {/* Results Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top Results</Text>
            <TouchableOpacity onPress={() => handlePresetPress({ title: 'All Results' })}>
              <View style={styles.seeAllButton}>
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
                <ArrowRight size={16} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          
          {mockScreenerResults.slice(0, 3).map((stock, index) => (
            <StockCard key={index} stock={stock} showDetails />
          ))}
        </View>

        {/* Premium CTA */}
        <LinearGradient
          colors={[theme.colors.surface, theme.colors.surfaceSecondary]}
          style={[styles.premiumCta, { borderColor: theme.colors.border }]}
        >
          <View style={styles.premiumHeader}>
            <LinearGradient
              colors={theme.colors.gradient.warning}
              style={styles.premiumIcon}
            >
              <Filter size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.premiumTitle, { color: theme.colors.text }]}>Unlock Advanced Screening</Text>
          </View>
          <Text style={[styles.premiumSubtitle, { color: theme.colors.textSecondary }]}>
            Access 50+ criteria, backtesting, and custom alerts
          </Text>
          <TouchableOpacity style={[styles.premiumButton, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
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
  filterButton: {
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
  filterTabs: {
    marginBottom: theme.spacing.lg,
  },
  filterTabsContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterTab: {
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
  filterTabText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
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
  viewAll: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  presetCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  presetIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadge: {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  presetTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
    marginBottom: theme.spacing.sm,
  },
  presetCriteria: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: theme.spacing.sm,
  },
  presetFooter: {
    alignItems: 'flex-end',
  },
  marketStats: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  premiumCta: {
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
  premiumIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
  },
  premiumSubtitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  premiumButton: {
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    alignSelf: 'center',
  },
  premiumButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});