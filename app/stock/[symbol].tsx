import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChartBar as BarChart3,
  Calendar,
  Building2,
  Globe,
  Users,
  Activity,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { useTheme } from '@/contexts/ThemeContext';

export default function StockDetailScreen() {
  const { symbol } = useLocalSearchParams();
  const { theme } = useTheme();

  // Mock data for the stock (replace with real data fetch in production)
  const stockData = {
    symbol: symbol as string,
    name: 'Reliance Industries',
    price: 2850.25,
    change: 45.1,
    changePercent: 1.61,
    newvooume: 32324, 
    volume: 3200000,
    marketCap: '₹19.3T',
    pe: 25.2,
    high52w: 2999.62,
    low52w: 2100.08,
    dividend: 8.0,
    dividendYield: 1.2,
    beta: 1.05,
    eps: 112.5,
    revenue: '₹8.66T',
    employees: 389000,
    sector: 'Conglomerate',
    founded: '1973',
    headquarters: 'Mumbai, India',
    website: 'https://www.ril.com',
  };

  // Mock chart data (replace with real-time data fetch)
  const chartData = [2650, 2700, 2720, 2680, 2750, 2800, 2850];
  const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon', 'Tue'];

  // Mock news data (replace with real news fetch)
  const news = [
    {
      title: 'Reliance shares hit new high as market rallies',
      source: 'Economic Times',
      date: '2024-06-10',
      url: 'https://economictimes.indiatimes.com',
    },
    {
      title: 'Reliance announces new green energy initiative',
      source: 'Moneycontrol',
      date: '2024-06-09',
      url: 'https://www.moneycontrol.com',
    },
    {
      title: 'Reliance Q4 results beat analyst expectations',
      source: 'Business Standard',
      date: '2024-06-08',
      url: 'https://www.business-standard.com',
    },
  ];

  const isPositive = stockData.change >= 0;

  const fundamentals = [
    { label: 'Market Cap', value: stockData.marketCap, icon: Building2 },
    { label: 'P/E Ratio', value: stockData.pe.toString(), icon: BarChart3 },
    { label: 'EPS', value: `₹${stockData.eps}`, icon: DollarSign },
    { label: 'Beta', value: stockData.beta.toString(), icon: Activity },
    {
      label: 'Dividend Yield',
      value: `${stockData.dividendYield}%`,
      icon: TrendingUp,
    },
    { label: '52W High', value: `₹${stockData.high52w}`, icon: TrendingUp },
    { label: '52W Low', value: `₹${stockData.low52w}`, icon: TrendingDown },
    {
      label: 'Volume',
      value: stockData.volume.toLocaleString('en-IN'),
      icon: BarChart3,
    },
  ];

  const keyMetrics = [
    { label: 'Revenue', value: stockData.revenue },
    { label: 'Employees', value: stockData.employees.toLocaleString('en-IN') },
    { label: 'Founded', value: stockData.founded },
    { label: 'Sector', value: stockData.sector },
    { label: 'Headquarters', value: stockData.headquarters },
    { label: 'Website', value: stockData.website },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={24} color={theme.colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={24} color={theme.colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stock Info */}
        <View style={styles.stockInfo}>
          <Text style={[styles.stockSymbol, { color: theme.colors.primary }]}>
            {stockData.symbol}
          </Text>
          <Text style={[styles.stockName, { color: theme.colors.text }]}>
            {stockData.name}
          </Text>

          <View style={styles.priceSection}>
            <Text
              style={[styles.price, { color: theme.colors.text }]}
            >{`₹${stockData.price.toLocaleString('en-IN', {
              maximumFractionDigits: 2,
            })}`}</Text>
            <View
              style={[
                styles.changeContainer,
                {
                  backgroundColor: isPositive
                    ? theme.colors.success + '20'
                    : theme.colors.error + '20',
                },
              ]}
            >
              {isPositive ? (
                <TrendingUp size={16} color={theme.colors.success} />
              ) : (
                <TrendingDown size={16} color={theme.colors.error} />
              )}
              <Text
                style={[
                  styles.change,
                  {
                    color: isPositive
                      ? theme.colors.success
                      : theme.colors.error,
                  },
                ]}
              >
                {isPositive ? '+' : ''}₹
                {Math.abs(stockData.change).toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                })}{' '}
                ({isPositive ? '+' : ''}
                {stockData.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Real-Time Chart */}
        <LinearGradient
          colors={[theme.colors.accent, theme.colors.primary]}
          style={styles.chartContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: '#fff' }]}>
              Price Chart
            </Text>
            <View style={styles.timeframe}>
              {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((period) => (
                <TouchableOpacity key={period} style={styles.timeframeButton}>
                  <Text style={styles.timeframeText}>{period}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', height: 180, paddingVertical: 8 }}
          >
            <YAxis
              data={chartData}
              contentInset={{ top: 20, bottom: 20 }}
              svg={{ fontSize: 12, fill: '#fff' }}
              numberOfTicks={5}
              formatLabel={(value: number) => `₹${value}`}
            />
            <LineChart
              style={{ flex: 1, marginLeft: 8 }}
              data={chartData}
              svg={{ stroke: '#fff', strokeWidth: 3 }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveMonotoneX}
            >
              <Grid svg={{ stroke: 'rgba(255,255,255,0.2)' }} />
            </LineChart>
          </View>
          <XAxis
            style={{ marginHorizontal: -10, height: 20 }}
            data={chartData}
            formatLabel={(_value: number, index: number) => chartLabels[index]}
            contentInset={{ left: 30, right: 10 }}
            svg={{ fontSize: 12, fill: '#fff' }}
          />
        </LinearGradient>

        {/* Watch Button */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.watchButton,
              { backgroundColor: theme.colors.surfaceSecondary },
            ]}
          >
            <Heart size={20} color={theme.colors.accent} />
            <Text
              style={[styles.watchButtonText, { color: theme.colors.accent }]}
            >
              Watch
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fundamentals */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Key Fundamentals
          </Text>
          <View style={styles.fundamentalsGrid}>
            {fundamentals.map((fundamental, index) => {
              const IconComponent = fundamental.icon;
              return (
                <View
                  key={index}
                  style={[
                    styles.fundamentalCard,
                    { backgroundColor: theme.colors.surfaceSecondary },
                  ]}
                >
                  <IconComponent size={20} color={theme.colors.accent} />
                  <Text
                    style={[
                      styles.fundamentalValue,
                      { color: theme.colors.text },
                    ]}
                  >
                    {fundamental.value}
                  </Text>
                  <Text
                    style={[
                      styles.fundamentalLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {fundamental.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Company Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Company Overview
          </Text>
          <View style={styles.overviewGrid}>
            {keyMetrics.map((metric, index) => (
              <View
                key={index}
                style={[
                  styles.overviewItem,
                  { backgroundColor: theme.colors.surfaceSecondary },
                ]}
              >
                <Text
                  style={[
                    styles.overviewLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {metric.label}
                </Text>
                <Text
                  style={[styles.overviewValue, { color: theme.colors.text }]}
                >
                  {metric.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* News Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Latest News
          </Text>
          {news.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.newsCard,
                { backgroundColor: theme.colors.surfaceSecondary },
              ]}
              onPress={() => item.url && Linking.openURL(item.url)}
            >
              <Text style={[styles.newsTitle, { color: theme.colors.text }]}>
                {item.title}
              </Text>
              <View style={styles.newsMeta}>
                <Text
                  style={[
                    styles.newsSource,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.source}
                </Text>
                <Text
                  style={[
                    styles.newsDate,
                    { color: theme.colors.textTertiary },
                  ]}
                >
                  {item.date}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Analysis */}
        <LinearGradient
          colors={[theme.colors.accent, theme.colors.primary]}
          style={styles.aiInsights}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.aiHeader}>
            <TrendingUp size={24} color="#FFFFFF" />
            <Text style={styles.aiTitle}>AI Market Insights</Text>
          </View>
          <Text style={styles.aiDescription}>
            Based on recent trends, Reliance is showing strong momentum.
            Consider monitoring for further upside, but be aware of sector
            volatility.
          </Text>
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
  aiInsights: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    padding: 24,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  aiDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginBottom: 20,
  },
  newsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  newsDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});
