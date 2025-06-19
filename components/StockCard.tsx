import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: string;
  pe?: number;
  dividend?: number;
}

interface StockCardProps {
  stock: Stock;
  showDetails?: boolean;
}

export function StockCard({ stock, showDetails = false }: StockCardProps) {
  const { theme } = useTheme();
  const isPositive = stock.change >= 0;
  
  const styles = createStyles(theme);
  
  const handlePress = () => {
    router.push(`/stock/${stock.symbol}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.surface }]} 
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={[styles.symbol, { color: theme.colors.text }]}>{stock.symbol}</Text>
          <Text style={[styles.name, { color: theme.colors.textSecondary }]} numberOfLines={1}>{stock.name}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.colors.text }]}>${stock.price.toFixed(2)}</Text>
          <View style={[
            styles.changeContainer, 
            { backgroundColor: isPositive ? `${theme.colors.positive}20` : `${theme.colors.negative}20` }
          ]}>
            {isPositive ? (
              <TrendingUp size={12} color={theme.colors.positive} />
            ) : (
              <TrendingDown size={12} color={theme.colors.negative} />
            )}
            <Text style={[
              styles.change, 
              { color: isPositive ? theme.colors.positive : theme.colors.negative }
            ]}>
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
      
      {showDetails && (
        <View style={[styles.details, { borderTopColor: theme.colors.border }]}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Volume</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {stock.volume?.toLocaleString() || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>Market Cap</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {stock.marketCap || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textTertiary }]}>P/E</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {stock.pe?.toFixed(1) || 'N/A'}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  name: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    gap: 4,
  },
  change: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});