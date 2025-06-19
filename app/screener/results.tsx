import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Filter, Import as SortAsc, Download, Share, Bookmark } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StockCard } from '@/components/StockCard';
import { mockScreenerResults } from '@/data/mockData';
import { useTheme } from '@/contexts/ThemeContext';

export default function ScreenerResultsScreen() {
  const { theme } = useTheme();
  const { preset } = useLocalSearchParams();
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortOrder, setSortOrder] = useState('desc');

  const styles = createStyles(theme);

  const sortOptions = [
    { key: 'marketCap', name: 'Market Cap' },
    { key: 'price', name: 'Price' },
    { key: 'change', name: 'Change %' },
    { key: 'volume', name: 'Volume' },
    { key: 'pe', name: 'P/E Ratio' },
  ];

  const extendedResults = [
    ...mockScreenerResults,
    {
      symbol: 'INTC',
      name: 'Intel Corporation',
      price: 43.21,
      change: 1.23,
      changePercent: 2.93,
      volume: 52100000,
      marketCap: '$176B',
      pe: 12.4,
      dividend: 1.46,
    },
    {
      symbol: 'IBM',
      name: 'International Business Machines',
      price: 158.67,
      change: -2.45,
      changePercent: -1.52,
      volume: 18900000,
      marketCap: '$146B',
      pe: 15.8,
      dividend: 6.63,
    },
    {
      symbol: 'CSCO',
      name: 'Cisco Systems Inc.',
      price: 51.89,
      change: 0.87,
      changePercent: 1.70,
      volume: 31200000,
      marketCap: '$213B',
      pe: 14.2,
      dividend: 3.17,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{preset} Results</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            {extendedResults.length} stocks found
          </Text>
        </View>
        <TouchableOpacity style={[styles.headerButton, { backgroundColor: theme.colors.background }]}>
          <Share size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={[styles.filterBar, { backgroundColor: theme.colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: theme.colors.primary }]}>
            <Filter size={16} color="#FFFFFF" />
            <Text style={styles.filterChipTextActive}>Active Filters</Text>
          </TouchableOpacity>
          
          {sortOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterChip,
                { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                sortBy === option.key && { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }
              ]}
              onPress={() => setSortBy(option.key)}
            >
              <Text style={[
                styles.filterChipText,
                { color: theme.colors.textSecondary },
                sortBy === option.key && { color: theme.colors.primary }
              ]}>
                {option.name}
              </Text>
              {sortBy === option.key && (
                <SortAsc size={14} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Summary */}
      <LinearGradient
        colors={theme.colors.gradient.primary}
        style={styles.summaryCard}
      >
        <View style={styles.summaryContent}>
          <Text style={styles.summaryTitle}>Screening Complete</Text>
          <Text style={styles.summaryDescription}>
            Found {extendedResults.length} stocks matching your criteria
          </Text>
        </View>
        <TouchableOpacity style={styles.exportButton}>
          <Download size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Results List */}
      <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>Results</Text>
          <View style={styles.resultsActions}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
              <Bookmark size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {extendedResults.map((stock, index) => (
          <View key={index} style={styles.resultItem}>
            <StockCard stock={stock} showDetails />
            <View style={styles.resultActions}>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.success }]}>
                <Text style={styles.quickActionText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.quickActionTextSecondary, { color: theme.colors.textSecondary }]}>Watch</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Load More */}
        <TouchableOpacity style={[styles.loadMoreButton, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.loadMoreText, { color: theme.colors.primary }]}>Load More Results</Text>
        </TouchableOpacity>

        {/* Performance Metrics */}
        <View style={[styles.metricsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.metricsTitle, { color: theme.colors.text }]}>Portfolio Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.colors.success }]}>+12.4%</Text>
              <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Avg Return</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.colors.text }]}>1.24</Text>
              <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Avg Beta</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.colors.warning }]}>2.8%</Text>
              <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Avg Dividend</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: theme.colors.text }]}>23.6</Text>
              <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Avg P/E</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
  },
  headerSubtitle: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    paddingVertical: theme.spacing.sm,
  },
  filterContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  filterChipTextActive: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  summaryCard: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryDescription: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  resultsTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
  },
  resultsActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  resultItem: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  resultActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  quickAction: {
    flex: 1,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  quickActionTextSecondary: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  loadMoreButton: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
  },
  metricsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricsTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
    marginBottom: theme.spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  metricItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});