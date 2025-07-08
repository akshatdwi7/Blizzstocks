import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface RealTimeChartProps {
  symbol: string;
  data?: number[];
  labels?: string[];
  height?: number;
  showGrid?: boolean;
  animated?: boolean;
}

export function RealTimeChart({ 
  symbol, 
  data = [], 
  labels = [], 
  height = 200,
  showGrid = true,
  animated = true 
}: RealTimeChartProps) {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<number[]>(data);
  const [chartLabels, setChartLabels] = useState<string[]>(labels);
  const [isPositive, setIsPositive] = useState(true);

  const styles = createStyles(theme);

  // Generate mock real-time data if no data provided
  useEffect(() => {
    if (data.length === 0) {
      const generateMockData = () => {
        const basePrice = 2850;
        const newData = Array.from({ length: 20 }, (_, i) => {
          const variation = (Math.random() - 0.5) * 100;
          return basePrice + variation + (i * 2);
        });
        
        const newLabels = Array.from({ length: 20 }, (_, i) => {
          const time = new Date();
          time.setMinutes(time.getMinutes() - (19 - i));
          return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        setChartData(newData);
        setChartLabels(newLabels);
        setIsPositive(newData[newData.length - 1] > newData[0]);
      };

      generateMockData();

      // Update data every 5 seconds for real-time effect
      const interval = setInterval(() => {
        setChartData(prevData => {
          const newPrice = prevData[prevData.length - 1] + (Math.random() - 0.5) * 20;
          const newData = [...prevData.slice(1), newPrice];
          setIsPositive(newData[newData.length - 1] > newData[0]);
          return newData;
        });

        setChartLabels(prevLabels => {
          const newTime = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          return [...prevLabels.slice(1), newTime];
        });
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setChartData(data);
      setChartLabels(labels);
      setIsPositive(data[data.length - 1] > data[0]);
    }
  }, [data, labels]);

  const chartColor = isPositive ? theme.colors.success : theme.colors.error;

  return (
    <View style={[styles.container, { height: height + 60 }]}>
      <View style={styles.header}>
        <Text style={[styles.symbol, { color: theme.colors.text }]}>{symbol}</Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: isPositive ? theme.colors.success : theme.colors.error }
        ]}>
          <Text style={styles.statusText}>
            {isPositive ? '↗' : '↘'} LIVE
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <View style={{ flexDirection: 'row', height }}>
          <YAxis
            data={chartData}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{ 
              fontSize: 10, 
              fill: theme.colors.textTertiary,
              fontFamily: 'Inter-Regular',
            }}
            numberOfTicks={5}
            formatLabel={(value: number) => `₹${Math.round(value)}`}
            style={{ width: 50 }}
          />
          
          <View style={{ flex: 1 }}>
            <LineChart
              style={{ flex: 1 }}
              data={chartData}
              svg={{ 
                stroke: chartColor, 
                strokeWidth: 2.5,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
              contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
              curve={shape.curveMonotoneX}
            >
              {showGrid && (
                <Grid 
                  svg={{ 
                    stroke: theme.colors.border, 
                    strokeWidth: 0.5,
                    strokeOpacity: 0.5,
                  }} 
                />
              )}
            </LineChart>
          </View>
        </View>

        <XAxis
          style={{ marginHorizontal: 50, height: 30, marginTop: 10 }}
          data={chartData}
          formatLabel={(value: number, index: number) => {
            // Show every 4th label to avoid crowding
            return index % 4 === 0 ? chartLabels[index] || '' : '';
          }}
          contentInset={{ left: 10, right: 10 }}
          svg={{ 
            fontSize: 10, 
            fill: theme.colors.textTertiary,
            fontFamily: 'Inter-Regular',
          }}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.priceInfo}>
          <Text style={[styles.currentPrice, { color: theme.colors.text }]}>
            ₹{chartData[chartData.length - 1]?.toFixed(2) || '0.00'}
          </Text>
          <Text style={[styles.priceChange, { color: chartColor }]}>
            {isPositive ? '+' : ''}{((chartData[chartData.length - 1] - chartData[0]) || 0).toFixed(2)} 
            ({isPositive ? '+' : ''}{(((chartData[chartData.length - 1] - chartData[0]) / chartData[0]) * 100 || 0).toFixed(2)}%)
          </Text>
        </View>
        <View style={[styles.liveIndicator, { backgroundColor: chartColor }]}>
          <View style={[styles.pulse, { backgroundColor: chartColor }]} />
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  symbol: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  chartContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  priceInfo: {
    flex: 1,
  },
  currentPrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  priceChange: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  liveIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
});