import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Filter, SlidersHorizontal, TrendingUp, TrendingDown, DollarSign, ChartBar as BarChart3, Globe, Building2, Zap, ArrowRight, Search, X, Play, Save, Crown, Sparkles, Target, Activity, TriangleAlert as AlertTriangle, RefreshCw, Wifi, WifiOff, Database, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StockCard } from '@/components/StockCard';
import { RealTimeChart } from '@/components/RealTimeChart';
import { useTheme } from '@/contexts/ThemeContext';

interface ScreenerCriteria {
  marketCap: { min: number; max: number; enabled: boolean };
  peRatio: { min: number; max: number; enabled: boolean };
  pbRatio: { min: number; max: number; enabled: boolean };
  dividendYield: { min: number; max: number; enabled: boolean };
  revenue: { min: number; max: number; enabled: boolean };
  debtToEquity: { min: number; max: number; enabled: boolean };
  roe: { min: number; max: number; enabled: boolean };
  rsi: { min: number; max: number; enabled: boolean };
  volume: { min: number; max: number; enabled: boolean };
  beta: { min: number; max: number; enabled: boolean };
}

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  pe: number;
  pb: number;
  dividendYield: number;
  roe: number;
  rsi: number;
  beta: number;
  sector: string;
  lastUpdated: string;
  exchange: string;
  high52w: number;
  low52w: number;
}

export default function ScreenerScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [savedScreens, setSavedScreens] = useState<string[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [screenName, setScreenName] = useState('');

  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    marketCap: { min: 0, max: 100000, enabled: false },
    peRatio: { min: 0, max: 50, enabled: false },
    pbRatio: { min: 0, max: 10, enabled: false },
    dividendYield: { min: 0, max: 15, enabled: false },
    revenue: { min: 0, max: 50000, enabled: false },
    debtToEquity: { min: 0, max: 2, enabled: false },
    roe: { min: 0, max: 50, enabled: false },
    rsi: { min: 0, max: 100, enabled: false },
    volume: { min: 0, max: 10000000, enabled: false },
    beta: { min: 0, max: 3, enabled: false },
  });

  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);

  const styles = createStyles(theme);

  // Mock data for demonstration
  const mockStocks: Stock[] = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      price: 2456.75,
      change: 45.20,
      changePercent: 1.87,
      volume: 2456789,
      marketCap: '16.6L Cr',
      pe: 24.5,
      pb: 2.1,
      dividendYield: 0.35,
      roe: 13.2,
      rsi: 65.4,
      beta: 1.2,
      sector: 'Oil & Gas',
      lastUpdated: '2024-01-15 15:30:00',
      exchange: 'NSE',
      high52w: 2856.15,
      low52w: 2220.30,
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3567.80,
      change: -23.45,
      changePercent: -0.65,
      volume: 1234567,
      marketCap: '13.0L Cr',
      pe: 28.3,
      pb: 12.4,
      dividendYield: 1.2,
      roe: 44.8,
      rsi: 45.2,
      beta: 0.8,
      sector: 'IT Services',
      lastUpdated: '2024-01-15 15:30:00',
      exchange: 'NSE',
      high52w: 4259.75,
      low52w: 3056.65,
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      price: 1678.90,
      change: 12.35,
      changePercent: 0.74,
      volume: 3456789,
      marketCap: '12.8L Cr',
      pe: 19.2,
      pb: 2.8,
      dividendYield: 1.1,
      roe: 17.5,
      rsi: 58.7,
      beta: 1.1,
      sector: 'Banking',
      lastUpdated: '2024-01-15 15:30:00',
      exchange: 'NSE',
      high52w: 1794.55,
      low52w: 1363.55,
    },
    {
      symbol: 'INFY',
      name: 'Infosys Ltd',
      price: 1456.25,
      change: -8.75,
      changePercent: -0.60,
      volume: 2345678,
      marketCap: '6.1L Cr',
      pe: 25.1,
      pb: 7.2,
      dividendYield: 2.8,
      roe: 29.3,
      rsi: 42.1,
      beta: 0.9,
      sector: 'IT Services',
      lastUpdated: '2024-01-15 15:30:00',
      exchange: 'NSE',
      high52w: 1763.05,
      low52w: 1351.65,
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Ltd',
      price: 987.45,
      change: 18.90,
      changePercent: 1.95,
      volume: 4567890,
      marketCap: '6.9L Cr',
      pe: 16.8,
      pb: 2.3,
      dividendYield: 0.8,
      roe: 15.2,
      rsi: 72.3,
      beta: 1.3,
      sector: 'Banking',
      lastUpdated: '2024-01-15 15:30:00',
      exchange: 'NSE',
      high52w: 1257.35,
      low52w: 863.75,
    },
    {
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel Ltd',
      price: 1234.60,
      change: 25.40,
      changePercent: 2.10,
      volume: 1876543,
      marketCap: '6.8L Cr',
      pe: 22.4,
      pb: 3.1,
      dividendYield: 0.7,
      roe: 14.8,
      rsi: 68.9,
      beta: 0.7,
      sector: 'Telecom',
      lastUpdated: '2024-01-15 15:30:00',
      exchange: 'NSE',
      high52w: 1349.90,
      low52w: 895.25,
    },
  ];

  const presetScreens = [
    {
      id: 'value_stocks',
      name: 'Value Stocks',
      description: 'Low P/E, High Dividend Yield',
      icon: DollarSign,
      color: theme.colors.success,
      criteria: {
        peRatio: { min: 0, max: 15, enabled: true },
        dividendYield: { min: 2, max: 15, enabled: true },
        pbRatio: { min: 0, max: 2, enabled: true },
      },
    },
    {
      id: 'growth_stocks',
      name: 'Growth Stocks',
      description: 'High ROE, Low Debt',
      icon: TrendingUp,
      color: theme.colors.primary,
      criteria: {
        roe: { min: 20, max: 50, enabled: true },
        debtToEquity: { min: 0, max: 0.5, enabled: true },
        peRatio: { min: 15, max: 50, enabled: true },
      },
    },
    {
      id: 'momentum_stocks',
      name: 'Momentum Stocks',
      description: 'Strong Price Movement',
      icon: Zap,
      color: theme.colors.warning,
      criteria: {
        rsi: { min: 60, max: 80, enabled: true },
        volume: { min: 1000000, max: 10000000, enabled: true },
        beta: { min: 1.2, max: 3, enabled: true },
      },
    },
    {
      id: 'dividend_stocks',
      name: 'Dividend Stocks',
      description: 'High Dividend Yield',
      icon: Target,
      color: theme.colors.secondary,
      criteria: {
        dividendYield: { min: 3, max: 15, enabled: true },
        peRatio: { min: 0, max: 25, enabled: true },
        roe: { min: 10, max: 50, enabled: true },
      },
    },
    {
      id: 'oversold_stocks',
      name: 'Oversold Stocks',
      description: 'Potential Bounce Back',
      icon: Activity,
      color: theme.colors.error,
      criteria: {
        rsi: { min: 0, max: 30, enabled: true },
        peRatio: { min: 0, max: 20, enabled: true },
        pbRatio: { min: 0, max: 1.5, enabled: true },
      },
    },
    {
      id: 'large_cap',
      name: 'Large Cap Stocks',
      description: 'Market Cap &gt; 20,000 Cr',
      icon: Building2,
      color: theme.colors.accent,
      criteria: {
        marketCap: { min: 20000, max: 100000, enabled: true },
        volume: { min: 500000, max: 10000000, enabled: true },
      },
    },
  ];

  const marketOverview = {
    totalStocks: 4567,
    gainers: 2134,
    losers: 1876,
    unchanged: 557,
    highVolume: 234,
    oversold: 156,
  };

  useEffect(() => {
    applyFilters();
  }, [criteria, searchQuery]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate real-time updates
      if (Math.random() > 0.7) {
        setIsConnected(prev => !prev);
        setTimeout(() => setIsConnected(true), 2000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const applyFilters = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = mockStocks;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(stock =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply criteria filters
      Object.entries(criteria).forEach(([key, filter]) => {
        if (filter.enabled) {
          filtered = filtered.filter(stock => {
            const value = getStockValue(stock, key);
            return value >= filter.min && value <= filter.max;
          });
        }
      });

      setFilteredStocks(filtered);
      setIsLoading(false);
    }, 500);
  };

  const getStockValue = (stock: Stock, key: string): number => {
    switch (key) {
      case 'marketCap':
        return parseFloat(stock.marketCap.replace(/[^\d.]/g, '')) * 1000; // Convert to crores
      case 'peRatio':
        return stock.pe;
      case 'pbRatio':
        return stock.pb;
      case 'dividendYield':
        return stock.dividendYield;
      case 'revenue':
        return 1000; // Mock value
      case 'debtToEquity':
        return 0.5; // Mock value
      case 'roe':
        return stock.roe;
      case 'rsi':
        return stock.rsi;
      case 'volume':
        return stock.volume;
      case 'beta':
        return stock.beta;
      default:
        return 0;
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = presetScreens.find(p => p.id === presetId);
    if (preset) {
      const newCriteria = { ...criteria };
      
      // Reset all criteria
      Object.keys(newCriteria).forEach(key => {
        newCriteria[key as keyof ScreenerCriteria].enabled = false;
      });

      // Apply preset criteria
      Object.entries(preset.criteria).forEach(([key, value]) => {
        if (newCriteria[key as keyof ScreenerCriteria]) {
          newCriteria[key as keyof ScreenerCriteria] = { ...value };
        }
      });

      setCriteria(newCriteria);
      setSelectedPreset(presetId);
      setShowFilters(false);
    }
  };

  const resetFilters = () => {
    const resetCriteria = { ...criteria };
    Object.keys(resetCriteria).forEach(key => {
      resetCriteria[key as keyof ScreenerCriteria].enabled = false;
    });
    setCriteria(resetCriteria);
    setSelectedPreset(null);
    setSearchQuery('');
  };

  const saveScreen = () => {
    if (screenName.trim()) {
      setSavedScreens([...savedScreens, screenName.trim()]);
      setScreenName('');
      setShowSaveModal(false);
      Alert.alert('Success', 'Screen saved successfully!');
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(criteria).filter(filter => filter.enabled).length;
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const navigateToPremium = () => {
    router.push('/premium');
  };

  const renderCriteriaInput = (key: keyof ScreenerCriteria, label: string, unit: string = '') => {
    const filter = criteria[key];
    
    return (
      <View style={styles.criteriaRow}>
        <View style={styles.criteriaHeader}>
          <Text style={[styles.criteriaLabel, { color: theme.colors.text }]}>{label}</Text>
          <Switch
            value={filter.enabled}
            onValueChange={(value) => {
              setCriteria(prev => ({
                ...prev,
                [key]: { ...prev[key], enabled: value }
              }));
            }}
            trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.primary }}
            thumbColor={filter.enabled ? '#FFFFFF' : theme.colors.textTertiary}
          />
        </View>
        
        {filter.enabled && (
          <View style={styles.rangeInputs}>
            <View style={styles.rangeInput}>
              <Text style={[styles.rangeLabel, { color: theme.colors.textSecondary }]}>Min</Text>
              <TextInput
                style={[styles.rangeTextInput, { 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }]}
                value={filter.min.toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text) || 0;
                  setCriteria(prev => ({
                    ...prev,
                    [key]: { ...prev[key], min: value }
                  }));
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.colors.textTertiary}
              />
              {unit && <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>{unit}</Text>}
            </View>
            
            <View style={styles.rangeInput}>
              <Text style={[styles.rangeLabel, { color: theme.colors.textSecondary }]}>Max</Text>
              <TextInput
                style={[styles.rangeTextInput, { 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }]}
                value={filter.max.toString()}
                onChangeText={(text) => {
                  const value = parseFloat(text) || 0;
                  setCriteria(prev => ({
                    ...prev,
                    [key]: { ...prev[key], max: value }
                  }));
                }}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor={theme.colors.textTertiary}
              />
              {unit && <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>{unit}</Text>}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Stock Screener</Text>
            <View style={styles.connectionStatus}>
              {isConnected ? (
                <Wifi size={12} color={theme.colors.success} />
              ) : (
                <WifiOff size={12} color={theme.colors.error} />
              )}
              <Text style={[styles.connectionText, { 
                color: isConnected ? theme.colors.success : theme.colors.error 
              }]}>
                {isConnected ? 'Live' : 'Disconnected'}
              </Text>
              <Text style={[styles.lastUpdatedText, { color: theme.colors.textTertiary }]}>
                • Updated {formatLastUpdated(lastUpdated)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setIsLoading(true);
              setTimeout(() => {
                setLastUpdated(new Date());
                setIsLoading(false);
              }, 1000);
            }}
          >
            <RefreshCw size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search stocks by symbol or name..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Controls */}
        <View style={styles.filterControls}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: theme.colors.background },
              getActiveFiltersCount() > 0 && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={16} color={getActiveFiltersCount() > 0 ? '#FFFFFF' : theme.colors.textSecondary} />
            <Text style={[
              styles.filterButtonText,
              { color: getActiveFiltersCount() > 0 ? '#FFFFFF' : theme.colors.textSecondary }
            ]}>
              Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: theme.colors.background }]}
            onPress={() => setShowSaveModal(true)}
          >
            <Save size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.filterButtonText, { color: theme.colors.textSecondary }]}>
              Save
            </Text>
          </TouchableOpacity>

          {getActiveFiltersCount() > 0 && (
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: theme.colors.error }]}
              onPress={resetFilters}
            >
              <X size={14} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Market Overview */}
      <View style={[styles.overviewSection, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.overviewHeader}>
          <Database size={20} color={theme.colors.primary} />
          <Text style={[styles.overviewTitle, { color: theme.colors.text }]}>Market Overview</Text>
          <Text style={[styles.overviewSubtitle, { color: theme.colors.textSecondary }]}>
            NSE • {new Date().toLocaleDateString()}
          </Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.overviewScroll}>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewNumber, { color: theme.colors.text }]}>{marketOverview.totalStocks.toLocaleString()}</Text>
              <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>Total Stocks</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewNumber, { color: theme.colors.success }]}>{marketOverview.gainers}</Text>
              <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>Gainers</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewNumber, { color: theme.colors.error }]}>{marketOverview.losers}</Text>
              <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>Losers</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewNumber, { color: theme.colors.warning }]}>{marketOverview.highVolume}</Text>
              <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>High Volume</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewNumber}>12%</Text>
              <Text style={styles.overviewLabel}>Oversold (RSI &lt; 30)</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Preset Screens */}
      <View style={styles.presetsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Screens</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
          <View style={styles.presetsList}>
            {presetScreens.map((preset) => {
              const IconComponent = preset.icon;
              const isSelected = selectedPreset === preset.id;
              
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.presetCard,
                    { backgroundColor: theme.colors.surface },
                    isSelected && { 
                      borderColor: preset.color, 
                      borderWidth: 2,
                      backgroundColor: `${preset.color}10`,
                    }
                  ]}
                  onPress={() => applyPreset(preset.id)}
                >
                  <View style={[styles.presetIcon, { backgroundColor: `${preset.color}20` }]}>
                    <IconComponent size={20} color={preset.color} />
                  </View>
                  <Text style={[styles.presetName, { color: theme.colors.text }]}>
                    {preset.name}
                  </Text>
                  <Text style={[styles.presetDescription, { color: theme.colors.textSecondary }]}>
                    {preset.description}
                  </Text>
                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: preset.color }]}>
                      <Text style={styles.selectedText}>Active</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Results */}
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
            Results ({filteredStocks.length})
          </Text>
          
          {filteredStocks.length > 0 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/screener/results')}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
              <ArrowRight size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <RefreshCw size={24} color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Screening stocks...
            </Text>
          </View>
        ) : filteredStocks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AlertTriangle size={48} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No stocks found</Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
              Try adjusting your filters or search criteria
            </Text>
            <TouchableOpacity
              style={[styles.resetFiltersButton, { backgroundColor: theme.colors.primary }]}
              onPress={resetFilters}
            >
              <Text style={styles.resetFiltersText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.stocksList} showsVerticalScrollIndicator={false}>
            {filteredStocks.slice(0, 10).map((stock, index) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onPress={() => router.push(`/stock/${stock.symbol}`)}
                style={[
                  styles.stockCard,
                  index === filteredStocks.length - 1 && { marginBottom: theme.spacing.xl }
                ]}
              />
            ))}
            
            {filteredStocks.length > 10 && (
              <TouchableOpacity
                style={[styles.loadMoreButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => router.push('/screener/results')}
              >
                <Text style={[styles.loadMoreText, { color: theme.colors.primary }]}>
                  View {filteredStocks.length - 10} more stocks
                </Text>
                <ArrowRight size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>

      {/* Premium CTA */}
      <TouchableOpacity
        style={[styles.premiumCTA, { backgroundColor: theme.colors.surface }]}
        onPress={navigateToPremium}
      >
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.premiumGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.premiumContent}>
            <View style={styles.premiumIcon}>
              <Crown size={20} color="#FFFFFF" />
              <Sparkles size={12} color="#FFFFFF" style={styles.sparkle} />
            </View>
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Unlock Advanced Screening</Text>
              <Text style={styles.premiumSubtitle}>50+ criteria • Backtesting • Real-time alerts</Text>
            </View>
            <ArrowRight size={20} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Advanced Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.criteriaSection}>
              <Text style={[styles.criteriaSectionTitle, { color: theme.colors.text }]}>
                Valuation Metrics
              </Text>
              {renderCriteriaInput('peRatio', 'P/E Ratio', 'x')}
              {renderCriteriaInput('pbRatio', 'P/B Ratio', 'x')}
              {renderCriteriaInput('marketCap', 'Market Cap', 'Cr')}
            </View>

            <View style={styles.criteriaSection}>
              <Text style={[styles.criteriaSectionTitle, { color: theme.colors.text }]}>
                Financial Health
              </Text>
              {renderCriteriaInput('roe', 'Return on Equity', '%')}
              {renderCriteriaInput('debtToEquity', 'Debt to Equity', 'x')}
              {renderCriteriaInput('dividendYield', 'Dividend Yield', '%')}
            </View>

            <View style={styles.criteriaSection}>
              <Text style={[styles.criteriaSectionTitle, { color: theme.colors.text }]}>
                Technical Indicators
              </Text>
              {renderCriteriaInput('rsi', 'RSI', '')}
              {renderCriteriaInput('beta', 'Beta', 'x')}
              {renderCriteriaInput('volume', 'Volume', '')}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.surfaceSecondary }]}
                onPress={resetFilters}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>
                  Reset All
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setShowFilters(false);
                  applyFilters();
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Save Screen Modal */}
      <Modal
        visible={showSaveModal}
        animationType="fade"
        transparent
      >
        <View style={styles.saveModalOverlay}>
          <View style={[styles.saveModalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.saveModalTitle, { color: theme.colors.text }]}>
              Save Screen
            </Text>
            <Text style={[styles.saveModalDescription, { color: theme.colors.textSecondary }]}>
              Give your screen a name to save it for later use
            </Text>
            
            <TextInput
              style={[styles.saveModalInput, { 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }]}
              placeholder="Enter screen name..."
              placeholderTextColor={theme.colors.textTertiary}
              value={screenName}
              onChangeText={setScreenName}
              autoFocus
            />
            
            <View style={styles.saveModalActions}>
              <TouchableOpacity
                style={[styles.saveModalButton, { backgroundColor: theme.colors.surfaceSecondary }]}
                onPress={() => {
                  setShowSaveModal(false);
                  setScreenName('');
                }}
              >
                <Text style={[styles.saveModalButtonText, { color: theme.colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveModalButton, { backgroundColor: theme.colors.primary }]}
                onPress={saveScreen}
                disabled={!screenName.trim()}
              >
                <Text style={[styles.saveModalButtonText, { color: '#FFFFFF' }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  lastUpdatedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterControls: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  resetButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewSection: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  overviewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  overviewSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  overviewScroll: {
    marginHorizontal: -theme.spacing.lg,
  },
  overviewStats: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  overviewStat: {
    alignItems: 'center',
    minWidth: 80,
  },
  overviewNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  presetsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  presetsScroll: {
    marginHorizontal: -theme.spacing.lg,
  },
  presetsList: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  presetCard: {
    width: 140,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    position: 'relative',
  },
  presetIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  presetName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  selectedBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  resultsSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  resetFiltersButton: {
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  resetFiltersText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  stocksList: {
    flex: 1,
  },
  stockCard: {
    marginBottom: theme.spacing.md,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  loadMoreText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  premiumCTA: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: theme.spacing.lg,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  premiumIcon: {
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  criteriaSection: {
    marginBottom: theme.spacing.xl,
  },
  criteriaSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: theme.spacing.lg,
  },
  criteriaRow: {
    marginBottom: theme.spacing.lg,
  },
  criteriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  criteriaLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  rangeInputs: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  rangeInput: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: theme.spacing.xs,
  },
  rangeTextInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  unitText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  modalButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  saveModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  saveModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
  },
  saveModalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  saveModalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: 20,
  },
  saveModalInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: theme.spacing.lg,
  },
  saveModalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  saveModalButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  saveModalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});