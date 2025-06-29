import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { 
  Filter, 
  SlidersHorizontal, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ChartBar as BarChart3, 
  Globe, 
  Building2, 
  Zap, 
  ArrowRight,
  Search,
  X,
  Play,
  Save,
  Crown,
  Sparkles,
  Target,
  Activity,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  Database,
  Clock
} from 'lucide-react-native';
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
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [totalStocks, setTotalStocks] = useState(3247);
  const [lastScanTime, setLastScanTime] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    marketCap: { min: 1000, max: 500000, enabled: true },
    peRatio: { min: 5, max: 50, enabled: true },
    pbRatio: { min: 0.5, max: 10, enabled: false },
    dividendYield: { min: 0, max: 15, enabled: false },
    revenue: { min: 100, max: 100000, enabled: true },
    debtToEquity: { min: 0, max: 2, enabled: false },
    roe: { min: 10, max: 50, enabled: true },
    rsi: { min: 30, max: 70, enabled: false },
    volume: { min: 100000, max: 10000000, enabled: false },
    beta: { min: 0.5, max: 2, enabled: false },
  });

  const styles = createStyles(theme);

  // Enhanced mock real-time stock data with more Indian stocks
  const mockStocks: Stock[] = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      price: 2850.25,
      change: 45.10,
      changePercent: 1.61,
      volume: 3200000,
      marketCap: '₹19.3T',
      pe: 25.2,
      pb: 2.1,
      dividendYield: 0.28,
      roe: 13.5,
      rsi: 65.2,
      beta: 1.05,
      sector: 'Energy',
      lastUpdated: '2 mins ago',
      exchange: 'NSE',
      high52w: 2999.62,
      low52w: 2100.08,
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3950.10,
      change: -30.25,
      changePercent: -0.76,
      volume: 1800000,
      marketCap: '₹14.5T',
      pe: 29.1,
      pb: 12.8,
      dividendYield: 1.14,
      roe: 44.2,
      rsi: 42.8,
      beta: 0.85,
      sector: 'Technology',
      lastUpdated: '1 min ago',
      exchange: 'NSE',
      high52w: 4259.00,
      low52w: 3200.50,
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank',
      price: 1550.75,
      change: 20.50,
      changePercent: 1.34,
      volume: 2500000,
      marketCap: '₹11.7T',
      pe: 21.8,
      pb: 2.9,
      dividendYield: 1.23,
      roe: 17.1,
      rsi: 58.4,
      beta: 1.12,
      sector: 'Banking',
      lastUpdated: '3 mins ago',
      exchange: 'NSE',
      high52w: 1725.00,
      low52w: 1363.55,
    },
    {
      symbol: 'INFY',
      name: 'Infosys',
      price: 1450.60,
      change: -12.80,
      changePercent: -0.88,
      volume: 2100000,
      marketCap: '₹6.0T',
      pe: 24.5,
      pb: 8.2,
      dividendYield: 1.21,
      roe: 31.8,
      rsi: 38.9,
      beta: 0.92,
      sector: 'Technology',
      lastUpdated: '2 mins ago',
      exchange: 'NSE',
      high52w: 1953.90,
      low52w: 1351.65,
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank',
      price: 1050.30,
      change: 15.20,
      changePercent: 1.47,
      volume: 2300000,
      marketCap: '₹7.3T',
      pe: 20.7,
      pb: 2.4,
      dividendYield: 0.76,
      roe: 15.9,
      rsi: 62.1,
      beta: 1.18,
      sector: 'Banking',
      lastUpdated: '1 min ago',
      exchange: 'NSE',
      high52w: 1257.65,
      low52w: 911.20,
    },
    {
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel',
      price: 1200.30,
      change: -8.50,
      changePercent: -0.70,
      volume: 1200000,
      marketCap: '₹6.7T',
      pe: 28.3,
      pb: 3.1,
      dividendYield: 0.67,
      roe: 12.4,
      rsi: 45.6,
      beta: 0.98,
      sector: 'Telecom',
      lastUpdated: '4 mins ago',
      exchange: 'NSE',
      high52w: 1349.00,
      low52w: 900.25,
    },
    {
      symbol: 'ITC',
      name: 'ITC Limited',
      price: 450.25,
      change: 5.10,
      changePercent: 1.15,
      volume: 2000000,
      marketCap: '₹5.6T',
      pe: 29.7,
      pb: 4.8,
      dividendYield: 2.78,
      roe: 16.2,
      rsi: 55.3,
      beta: 0.76,
      sector: 'FMCG',
      lastUpdated: '2 mins ago',
      exchange: 'NSE',
      high52w: 502.75,
      low52w: 398.40,
    },
  ];

  const filters = [
    { id: 'all', name: 'All Stocks', icon: Globe, count: totalStocks },
    { id: 'gainers', name: 'Top Gainers', icon: TrendingUp, count: 847 },
    { id: 'losers', name: 'Top Losers', icon: TrendingDown, count: 623 },
    { id: 'volume', name: 'High Volume', icon: BarChart3, count: 1205 },
    { id: 'dividend', name: 'Dividend', icon: DollarSign, count: 456 },
  ];

  const screenerPresets = [
    {
      title: 'Growth Stocks',
      description: 'High growth potential companies',
      criteria: 'P/E < 30, Revenue Growth > 20%, ROE > 15%',
      color: theme.colors.success,
      icon: TrendingUp,
      count: 127,
      premium: false,
    },
    {
      title: 'Value Picks',
      description: 'Undervalued quality companies',
      criteria: 'P/E < 15, P/B < 2, Debt/Equity < 0.5',
      color: theme.colors.secondary,
      icon: Building2,
      count: 89,
      premium: false,
    },
    {
      title: 'Momentum Plays',
      description: 'Strong price momentum stocks',
      criteria: 'RSI > 50, MACD > 0, Volume > Avg',
      color: theme.colors.warning,
      icon: Zap,
      count: 156,
      premium: true,
    },
    {
      title: 'Dividend Champions',
      description: 'Consistent dividend payers',
      criteria: 'Dividend Yield > 3%, 5Y Growth > 10%',
      color: theme.colors.accent,
      icon: DollarSign,
      count: 73,
      premium: true,
    },
    {
      title: 'AI Recommendations',
      description: 'AI-powered stock picks',
      criteria: 'Machine learning analysis',
      color: '#8B5CF6',
      icon: Sparkles,
      count: 45,
      premium: true,
    },
    {
      title: 'Breakout Stocks',
      description: 'Technical breakout patterns',
      criteria: '52W High, Volume Surge, RSI > 60',
      color: theme.colors.error,
      icon: Target,
      count: 67,
      premium: true,
    },
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setResults(prevResults => 
        prevResults.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 10,
          change: (Math.random() - 0.5) * 50,
          changePercent: (Math.random() - 0.5) * 5,
          lastUpdated: 'Just now',
        }))
      );
      setLastScanTime(new Date());
      
      // Simulate connection status
      setIsConnected(Math.random() > 0.1); // 90% uptime
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const runScreener = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate progressive scanning
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Filter stocks based on criteria
    const filteredStocks = mockStocks.filter(stock => {
      if (criteria.marketCap.enabled) {
        const marketCapValue = parseFloat(stock.marketCap.replace(/[₹T]/g, '')) * 1000000;
        if (marketCapValue < criteria.marketCap.min || marketCapValue > criteria.marketCap.max) {
          return false;
        }
      }
      
      if (criteria.peRatio.enabled) {
        if (stock.pe < criteria.peRatio.min || stock.pe > criteria.peRatio.max) {
          return false;
        }
      }
      
      if (criteria.roe.enabled) {
        if (stock.roe < criteria.roe.min || stock.roe > criteria.roe.max) {
          return false;
        }
      }
      
      return true;
    });
    
    setResults(filteredStocks);
    setIsScanning(false);
    setScanProgress(0);
    setShowAdvancedModal(false);

    // Show results alert
    Alert.alert(
      'Screening Complete',
      `Found ${filteredStocks.length} stocks matching your criteria`,
      [{ text: 'View Results', style: 'default' }]
    );
  };

  const handlePresetPress = (preset: any) => {
    if (preset.premium) {
      Alert.alert(
        'Premium Feature',
        `${preset.title} is a premium feature. Upgrade to access advanced screening capabilities.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/(tabs)/premium') },
        ]
      );
    } else {
      // Apply preset criteria and run screener
      runScreener();
    }
  };

  const updateCriteria = (key: keyof ScreenerCriteria, field: 'min' | 'max' | 'enabled', value: number | boolean) => {
    setCriteria(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const resetCriteria = () => {
    setCriteria({
      marketCap: { min: 1000, max: 500000, enabled: true },
      peRatio: { min: 5, max: 50, enabled: true },
      pbRatio: { min: 0.5, max: 10, enabled: false },
      dividendYield: { min: 0, max: 15, enabled: false },
      revenue: { min: 100, max: 100000, enabled: true },
      debtToEquity: { min: 0, max: 2, enabled: false },
      roe: { min: 10, max: 50, enabled: true },
      rsi: { min: 30, max: 70, enabled: false },
      volume: { min: 100000, max: 10000000, enabled: false },
      beta: { min: 0.5, max: 2, enabled: false },
    });
  };

  const criteriaLabels = {
    marketCap: 'Market Cap (Cr)',
    peRatio: 'P/E Ratio',
    pbRatio: 'P/B Ratio',
    dividendYield: 'Dividend Yield (%)',
    revenue: 'Revenue (Cr)',
    debtToEquity: 'Debt/Equity',
    roe: 'ROE (%)',
    rsi: 'RSI',
    volume: 'Volume',
    beta: 'Beta',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>Stock Screener</Text>
            <View style={styles.subtitleContainer}>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Real-time screening • {totalStocks.toLocaleString()} stocks
              </Text>
              <View style={styles.connectionStatus}>
                {isConnected ? (
                  <Wifi size={12} color={theme.colors.success} />
                ) : (
                  <WifiOff size={12} color={theme.colors.error} />
                )}
                <Text style={[
                  styles.connectionText, 
                  { color: isConnected ? theme.colors.success : theme.colors.error }
                ]}>
                  {isConnected ? 'Live' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => setLastScanTime(new Date())}
            >
              <RefreshCw size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setShowAdvancedModal(true)}
            >
              <SlidersHorizontal size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Real-time Status Bar */}
        <View style={[styles.statusBar, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statusLeft}>
            <View style={[styles.liveIndicator, { backgroundColor: theme.colors.success }]} />
            <Database size={14} color={theme.colors.success} />
            <Text style={[styles.statusText, { color: theme.colors.text }]}>Real-time Data</Text>
          </View>
          <View style={styles.statusRight}>
            <Clock size={12} color={theme.colors.textSecondary} />
            <Text style={[styles.lastUpdate, { color: theme.colors.textSecondary }]}>
              {lastScanTime.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        {/* Market Overview Chart */}
        <View style={styles.chartSection}>
          <RealTimeChart 
            symbol="NIFTY 50" 
            height={180}
            showGrid={true}
            animated={true}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
            <Search size={20} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search stocks by name, symbol, or sector..."
              placeholderTextColor={theme.colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
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
                <View style={[
                  styles.filterCount,
                  { backgroundColor: selectedFilter === filter.id ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceSecondary }
                ]}>
                  <Text style={[
                    styles.filterCountText,
                    { color: selectedFilter === filter.id ? '#FFFFFF' : theme.colors.textSecondary }
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Market Overview Stats */}
        <View style={styles.marketOverview}>
          <LinearGradient
            colors={theme.colors.gradient.primary}
            style={styles.overviewCard}
          >
            <View style={styles.overviewContent}>
              <Text style={styles.overviewTitle}>Market Overview</Text>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewNumber}>2,847</Text>
                  <Text style={styles.overviewLabel}>Stocks Screened</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewNumber}>64%</Text>
                  <Text style={styles.overviewLabel}>Above 200 MA</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewNumber}>12%</Text>
                  <Text style={styles.overviewLabel}>Oversold (RSI < 30)</Text>
                </View>
              </View>
            </View>
            <Activity size={48} color="rgba(255,255,255,0.3)" />
          </LinearGradient>
        </View>

        {/* Screener Presets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Popular Screeners</Text>
            <TouchableOpacity onPress={() => setShowAdvancedModal(true)}>
              <Text style={[styles.viewAll, { color: theme.colors.primary }]}>Custom</Text>
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
                  {preset.premium && (
                    <View style={[styles.premiumBadge, { backgroundColor: theme.colors.warning }]}>
                      <Crown size={12} color="#FFFFFF" />
                    </View>
                  )}
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

        {/* Results Section */}
        {results.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Screener Results ({results.length})
              </Text>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.surface }]}>
                <Save size={16} color={theme.colors.primary} />
                <Text style={[styles.saveText, { color: theme.colors.primary }]}>Save</Text>
              </TouchableOpacity>
            </View>
            
            {results.map((stock, index) => (
              <View key={index} style={styles.resultItem}>
                <StockCard stock={stock} showDetails />
                <View style={styles.additionalInfo}>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.colors.textTertiary }]}>Sector:</Text>
                    <Text style={[styles.infoValue, { color: theme.colors.text }]}>{stock.sector}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.colors.textTertiary }]}>RSI:</Text>
                    <Text style={[styles.infoValue, { color: theme.colors.text }]}>{stock.rsi.toFixed(1)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.colors.textTertiary }]}>Exchange:</Text>
                    <Text style={[styles.infoValue, { color: theme.colors.success }]}>{stock.exchange}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Premium CTA */}
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.premiumCta}
        >
          <View style={styles.premiumContent}>
            <Crown size={32} color="#FFFFFF" />
            <Text style={styles.premiumTitle}>Unlock Advanced Screening</Text>
            <Text style={styles.premiumSubtitle}>
              Access 50+ criteria, AI recommendations, backtesting, real-time alerts, and professional tools
            </Text>
            <TouchableOpacity 
              style={styles.premiumButton}
              onPress={() => router.push('/(tabs)/premium')}
            >
              <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
              <Sparkles size={16} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Advanced Screener Modal */}
      <Modal
        visible={showAdvancedModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity onPress={() => setShowAdvancedModal(false)}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Advanced Screener</Text>
            <TouchableOpacity onPress={resetCriteria}>
              <Text style={[styles.resetText, { color: theme.colors.primary }]}>Reset</Text>
            </TouchableOpacity>
          </View>

          {isScanning && (
            <View style={[styles.scanningOverlay, { backgroundColor: theme.colors.surface }]}>
              <Activity size={24} color={theme.colors.primary} />
              <Text style={[styles.scanningText, { color: theme.colors.text }]}>
                Scanning {Math.round(scanProgress)}% complete...
              </Text>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceSecondary }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { backgroundColor: theme.colors.primary, width: `${scanProgress}%` }
                  ]} 
                />
              </View>
            </View>
          )}

          <ScrollView style={styles.modalContent}>
            {Object.entries(criteria).map(([key, value]) => (
              <View key={key} style={[styles.criteriaCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.criteriaHeader}>
                  <Text style={[styles.criteriaLabel, { color: theme.colors.text }]}>
                    {criteriaLabels[key as keyof typeof criteriaLabels]}
                  </Text>
                  <Switch
                    value={value.enabled}
                    onValueChange={(enabled) => updateCriteria(key as keyof ScreenerCriteria, 'enabled', enabled)}
                    trackColor={{
                      false: theme.colors.surfaceSecondary,
                      true: theme.colors.primary,
                    }}
                    thumbColor={value.enabled ? '#FFFFFF' : theme.colors.textTertiary}
                  />
                </View>
                
                {value.enabled && (
                  <View style={styles.rangeInputs}>
                    <View style={[styles.inputContainer, { backgroundColor: theme.colors.background }]}>
                      <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Min</Text>
                      <TextInput
                        style={[styles.rangeInput, { color: theme.colors.text }]}
                        value={value.min.toString()}
                        onChangeText={(text) => updateCriteria(key as keyof ScreenerCriteria, 'min', parseFloat(text) || 0)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={theme.colors.textTertiary}
                      />
                    </View>
                    <View style={[styles.inputContainer, { backgroundColor: theme.colors.background }]}>
                      <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Max</Text>
                      <TextInput
                        style={[styles.rangeInput, { color: theme.colors.text }]}
                        value={value.max.toString()}
                        onChangeText={(text) => updateCriteria(key as keyof ScreenerCriteria, 'max', parseFloat(text) || 0)}
                        keyboardType="numeric"
                        placeholder="100"
                        placeholderTextColor={theme.colors.textTertiary}
                      />
                    </View>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.modalFooter, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity
              style={[styles.runButton, { backgroundColor: theme.colors.primary }]}
              onPress={runScreener}
              disabled={isScanning}
            >
              {isScanning ? (
                <Text style={styles.runButtonText}>Scanning...</Text>
              ) : (
                <>
                  <Play size={20} color="#FFFFFF" />
                  <Text style={styles.runButtonText}>Run Screener</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontFamily: theme.typography.h1.fontFamily,
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: theme.typography.caption.fontFamily,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectionText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  refreshButton: {
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
  filterButton: {
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  lastUpdate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  chartSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
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
  filterCount: {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  filterCountText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  marketOverview: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  overviewContent: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  overviewStats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  saveText: {
    fontSize: 14,
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
    position: 'relative',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  resultItem: {
    marginBottom: theme.spacing.md,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  infoRow: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  premiumCta: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  premiumContent: {
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  premiumSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  premiumButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  resetText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  scanningOverlay: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  scanningText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginVertical: theme.spacing.md,
  },
  progressBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  criteriaCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  criteriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  criteriaLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  rangeInputs: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  inputContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  rangeInput: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalFooter: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  runButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});