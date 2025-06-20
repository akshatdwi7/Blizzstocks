import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { mockHoldings } from '@/data/mockData';
import { StockCard } from '@/components/StockCard';

export default function HoldingsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          All Holdings
        </Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {mockHoldings.map((stock, idx) => (
          <StockCard key={idx} stock={stock} showDetails />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.h2.fontSize,
      fontFamily: theme.typography.h2.fontFamily,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
  });
