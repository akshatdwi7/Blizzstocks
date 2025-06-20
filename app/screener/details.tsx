import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, Search, Save, Play, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import {
  mockHoldings,
  mockWatchlist,
  mockScreenerResults,
} from '@/data/mockData';

export default function ScreenerDetailsScreen() {
  const { theme } = useTheme();
  const [filters, setFilters] = useState<{
    [key: string]: { min: number; max: number; enabled: boolean };
  }>({
    marketCap: { min: 1000, max: 50000, enabled: true },
    peRatio: { min: 5, max: 30, enabled: true },
    dividendYield: { min: 0, max: 10, enabled: false },
    revenue: { min: 100, max: 10000, enabled: true },
    debtToEquity: { min: 0, max: 1, enabled: false },
    roe: { min: 10, max: 50, enabled: true },
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const styles = createStyles(theme);

  const filterCategories = [
    {
      title: 'Valuation',
      filters: [
        {
          key: 'marketCap',
          name: 'Market Cap (M)',
          unit: 'M',
          range: [100, 100000],
        },
        { key: 'peRatio', name: 'P/E Ratio', unit: '', range: [1, 100] },
        { key: 'pbRatio', name: 'P/B Ratio', unit: '', range: [0.1, 10] },
      ],
    },
    {
      title: 'Financial Health',
      filters: [
        { key: 'revenue', name: 'Revenue (M)', unit: 'M', range: [10, 50000] },
        { key: 'debtToEquity', name: 'Debt/Equity', unit: '', range: [0, 5] },
        { key: 'roe', name: 'ROE (%)', unit: '%', range: [0, 100] },
      ],
    },
    {
      title: 'Dividends',
      filters: [
        {
          key: 'dividendYield',
          name: 'Dividend Yield (%)',
          unit: '%',
          range: [0, 15],
        },
        {
          key: 'payoutRatio',
          name: 'Payout Ratio (%)',
          unit: '%',
          range: [0, 100],
        },
      ],
    },
    {
      title: 'Technical',
      filters: [
        { key: 'rsi', name: 'RSI', unit: '', range: [0, 100] },
        { key: 'volume', name: 'Volume (M)', unit: 'M', range: [0.1, 1000] },
        { key: 'beta', name: 'Beta', unit: '', range: [0, 3] },
      ],
    },
  ];

  const toggleFilter = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key]?.enabled,
      },
    }));
  };

  const resetFilters = () => {
    setFilters({
      marketCap: { min: 1000, max: 50000, enabled: true },
      peRatio: { min: 5, max: 30, enabled: true },
      dividendYield: { min: 0, max: 10, enabled: false },
      revenue: { min: 100, max: 10000, enabled: true },
      debtToEquity: { min: 0, max: 1, enabled: false },
      roe: { min: 10, max: 50, enabled: true },
    });
  };

  const runScreener = () => {
    router.push({
      pathname: '/screener/results',
      params: { preset: 'Custom Filter' },
    });
  };

  // Combine all stocks for search
  const allStocks = [...mockHoldings, ...mockWatchlist, ...mockScreenerResults];

  // Search logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length === 0) {
      setSearchResults([]);
      return;
    }
    const results = allStocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectStock = (stock: any) => {
    setSearchQuery('');
    setSearchResults([]);
    router.push({
      pathname: '/screener/results',
      params: { symbol: stock.symbol, name: stock.name },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Search Bar */}
      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          marginTop: theme.spacing.lg,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Search size={20} color={theme.colors.textTertiary} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 8,
              color: theme.colors.text,
              fontSize: 16,
            }}
            placeholder="Search stocks..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        {searchResults.length > 0 && (
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.md,
              marginTop: 4,
              maxHeight: 200,
            }}
          >
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.symbol}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectStock(item)}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                  }}
                >
                  <Text style={{ color: theme.colors.text, fontSize: 16 }}>
                    {item.name}{' '}
                    <Text style={{ color: theme.colors.textSecondary }}>
                      ({item.symbol})
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Advanced Screener
        </Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <RotateCcw size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Presets */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Presets
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetsContainer}
          >
            {[
              { name: 'Growth', color: theme.colors.success },
              { name: 'Value', color: theme.colors.secondary },
              { name: 'Dividend', color: theme.colors.warning },
              { name: 'Small Cap', color: theme.colors.accent },
              { name: 'Large Cap', color: theme.colors.error },
            ].map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.presetChip, { borderColor: preset.color }]}
              >
                <Text style={[styles.presetText, { color: preset.color }]}>
                  {preset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Categories */}
        {filterCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {category.title}
            </Text>
            {category.filters.map((filter, filterIndex) => (
              <View
                key={filterIndex}
                style={[
                  styles.filterCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View style={styles.filterHeader}>
                  <Text
                    style={[styles.filterName, { color: theme.colors.text }]}
                  >
                    {filter.name}
                  </Text>
                  <Switch
                    value={filters[filter.key]?.enabled || false}
                    onValueChange={() => toggleFilter(filter.key)}
                    trackColor={{
                      false: theme.colors.surfaceSecondary,
                      true: theme.colors.primary,
                    }}
                    thumbColor={
                      filters[filter.key]?.enabled
                        ? '#FFFFFF'
                        : theme.colors.textTertiary
                    }
                  />
                </View>
                {filters[filter.key]?.enabled && (
                  <View style={styles.filterContent}>
                    <View style={styles.rangeInputs}>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.inputLabel,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          Min
                        </Text>
                        <Text
                          style={[
                            styles.inputValue,
                            { color: theme.colors.text },
                          ]}
                        >
                          {filters[filter.key]?.min || filter.range[0]}
                          {filter.unit}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.inputLabel,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          Max
                        </Text>
                        <Text
                          style={[
                            styles.inputValue,
                            { color: theme.colors.text },
                          ]}
                        >
                          {filters[filter.key]?.max || filter.range[1]}
                          {filter.unit}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.rangeSlider,
                        { backgroundColor: theme.colors.surfaceSecondary },
                      ]}
                    >
                      <View
                        style={[
                          styles.rangeTrack,
                          { backgroundColor: theme.colors.primary },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Results Preview */}
        <View style={styles.section}>
          <LinearGradient
            colors={[theme.colors.surface, theme.colors.surfaceSecondary]}
            style={[
              styles.resultsPreview,
              { borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
              Estimated Results
            </Text>
            <Text
              style={[styles.resultsCount, { color: theme.colors.primary }]}
            >
              ~247 stocks match your criteria
            </Text>
            <Text
              style={[
                styles.resultsDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              Based on current market data and your selected filters
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.bottomActions,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.surfaceSecondary },
          ]}
        >
          <Save size={20} color={theme.colors.textSecondary} />
          <Text
            style={[
              styles.saveButtonText,
              { color: theme.colors.textSecondary },
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.runButton, { backgroundColor: theme.colors.primary }]}
          onPress={runScreener}
        >
          <Play size={20} color="#FFFFFF" />
          <Text style={styles.runButtonText}>Run Screener</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
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
    headerTitle: {
      flex: 1,
      fontSize: theme.typography.h3.fontSize,
      fontFamily: theme.typography.h3.fontFamily,
    },
    resetButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontFamily: theme.typography.h3.fontFamily,
      marginBottom: theme.spacing.md,
    },
    presetsContainer: {
      gap: theme.spacing.sm,
      paddingRight: theme.spacing.lg,
    },
    presetChip: {
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    presetText: {
      fontSize: theme.typography.caption.fontSize,
      fontFamily: 'Inter-Medium',
    },
    filterCard: {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filterName: {
      fontSize: theme.typography.body.fontSize,
      fontFamily: 'Inter-Medium',
    },
    filterContent: {
      marginTop: theme.spacing.md,
    },
    rangeInputs: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    inputContainer: {
      flex: 1,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      padding: theme.spacing.sm,
    },
    inputLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      marginBottom: 2,
    },
    inputValue: {
      fontSize: theme.typography.body.fontSize,
      fontFamily: 'Inter-SemiBold',
    },
    rangeSlider: {
      height: 4,
      borderRadius: 2,
      position: 'relative',
    },
    rangeTrack: {
      height: 4,
      borderRadius: 2,
      width: '60%',
    },
    resultsPreview: {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      alignItems: 'center',
    },
    resultsTitle: {
      fontSize: theme.typography.body.fontSize,
      fontFamily: 'Inter-SemiBold',
      marginBottom: theme.spacing.xs,
    },
    resultsCount: {
      fontSize: theme.typography.h2.fontSize,
      fontFamily: 'Inter-Bold',
      marginBottom: theme.spacing.xs,
    },
    resultsDescription: {
      fontSize: theme.typography.caption.fontSize,
      fontFamily: 'Inter-Regular',
      textAlign: 'center',
    },
    bottomActions: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      gap: theme.spacing.sm,
    },
    saveButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    saveButtonText: {
      fontSize: theme.typography.body.fontSize,
      fontFamily: 'Inter-SemiBold',
    },
    runButton: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    runButtonText: {
      fontSize: theme.typography.body.fontSize,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });
