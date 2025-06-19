import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, Share, TrendingUp, TrendingDown, DollarSign, ChartBar as BarChart3, Calendar, Building2, Globe, Users, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams();
  
  // Mock data for the stock
  const stockData = {
    symbol: symbol as string,
    name: 'Apple Inc.',
    price: 192.53,
    change: 4.67,
    changePercent: 2.48,
    volume: 45230000,
    marketCap: '$2.95T',
    pe: 28.3,
    high52w: 199.62,
    low52w: 164.08,
    dividend: 0.24,
    dividendYield: 0.50,
    beta: 1.29,
    eps: 6.81,
    revenue: '$394.3B',
    employees: 161000,
  };

  const isPositive = stockData.change >= 0;

  const fundamentals = [
    { label: 'Market Cap', value: stockData.marketCap, icon: Building2 },
    { label: 'P/E Ratio', value: stockData.pe.toString(), icon: BarChart3 },
    { label: 'EPS', value: `$${stockData.eps}`, icon: DollarSign },
    { label: 'Beta', value: stockData.beta.toString(), icon: Activity },
    { label: 'Dividend Yield', value: `${stockData.dividendYield}%`, icon: TrendingUp },
    { label: '52W High', value: `$${stockData.high52w}`, icon: TrendingUp },
    { label: '52W Low', value: `$${stockData.low52w}`, icon: TrendingDown },
    { label: 'Volume', value: stockData.volume.toLocaleString(), icon: BarChart3 },
  ];

  const keyMetrics = [
    { label: 'Revenue', value: stockData.revenue },
    { label: 'Employees', value: stockData.employees.toLocaleString() },
    { label: 'Founded', value: '1976' },
    { label: 'Sector', value: 'Technology' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={24} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stock Info */}
        <View style={styles.stockInfo}>
          <Text style={styles.stockSymbol}>{stockData.symbol}</Text>
          <Text style={styles.stockName}>{stockData.name}</Text>
          
          <View style={styles.priceSection}>
            <Text style={styles.price}>${stockData.price.toFixed(2)}</Text>
            <View style={[styles.changeContainer, { backgroundColor: isPositive ? '#10B98120' : '#EF444420' }]}>
              {isPositive ? (
                <TrendingUp size={16} color="#10B981" />
              ) : (
                <TrendingDown size={16} color="#EF4444" />
              )}
              <Text style={[styles.change, { color: isPositive ? '#10B981' : '#EF4444' }]}>
                {isPositive ? '+' : ''}${Math.abs(stockData.change).toFixed(2)} ({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Placeholder */}
        <LinearGradient
          colors={['#1E293B', '#334155']}
          style={styles.chartContainer}
        >
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Price Chart</Text>
            <View style={styles.timeframe}>
              {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((period) => (
                <TouchableOpacity key={period} style={styles.timeframeButton}>
                  <Text style={styles.timeframeText}>{period}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.chartPlaceholder}>
            <Activity size={48} color="#64748B" />
            <Text style={styles.chartPlaceholderText}>Interactive chart coming soon</Text>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionBtn, styles.buyButton]}>
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.sellButton]}>
            <Text style={styles.sellButtonText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.watchButton]}>
            <Heart size={20} color="#64748B" />
            <Text style={styles.watchButtonText}>Watch</Text>
          </TouchableOpacity>
        </View>

        {/* Fundamentals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Fundamentals</Text>
          <View style={styles.fundamentalsGrid}>
            {fundamentals.map((fundamental, index) => {
              const IconComponent = fundamental.icon;
              return (
                <View key={index} style={styles.fundamentalCard}>
                  <IconComponent size={20} color="#64748B" />
                  <Text style={styles.fundamentalValue}>{fundamental.value}</Text>
                  <Text style={styles.fundamentalLabel}>{fundamental.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Company Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Overview</Text>
          <View style={styles.overviewGrid}>
            {keyMetrics.map((metric, index) => (
              <View key={index} style={styles.overviewItem}>
                <Text style={styles.overviewLabel}>{metric.label}</Text>
                <Text style={styles.overviewValue}>{metric.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Analysis */}
        <LinearGradient
          colors={['#7C3AED', '#A855F7']}
          style={styles.aiAnalysis}
        >
          <Text style={styles.aiTitle}>AI Analysis</Text>
          <Text style={styles.aiDescription}>
            Based on technical indicators and fundamental analysis, {stockData.symbol} shows strong momentum with positive outlook for the next quarter.
          </Text>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiButtonText}>Get Full Analysis</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockInfo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  stockSymbol: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 16,
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  change: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
  },
  timeframe: {
    flexDirection: 'row',
    gap: 8,
  },
  timeframeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeframeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    backgroundColor: '#10B981',
  },
  buyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  sellButton: {
    backgroundColor: '#EF4444',
  },
  sellButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  watchButton: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    gap: 8,
  },
  watchButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  fundamentalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fundamentalCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  fundamentalValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
    marginTop: 8,
    marginBottom: 4,
  },
  fundamentalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  overviewItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  overviewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
  },
  aiAnalysis: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    padding: 24,
  },
  aiTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  aiDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginBottom: 20,
  },
  aiButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  aiButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});