import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Brain,
  Zap,
  Target,
  Award,
  Clock,
  MessageCircle,
  Send
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);

  const styles = createStyles(theme);

  const aiSuggestions = [
    "Best tech stocks under $100",
    "Dividend stocks for retirement",
    "AI companies with growth potential",
    "ESG stocks with high ratings",
    "Undervalued stocks in healthcare",
    "Renewable energy opportunities"
  ];

  const trendingSearches = [
    "NVIDIA earnings",
    "Tesla production",
    "Apple iPhone sales",
    "Microsoft AI revenue",
    "Amazon cloud growth"
  ];

  const handleChatPress = () => {
    router.push('/chat');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>AI-Powered Research</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Get intelligent insights on any stock</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
            <Search size={20} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Ask AI about stocks or search symbols..."
              placeholderTextColor={theme.colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity 
              style={[styles.aiButton, isAIMode && styles.aiButtonActive]}
              onPress={() => setIsAIMode(!isAIMode)}
            >
              <Sparkles size={18} color={isAIMode ? '#FFFFFF' : theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Chat Button */}
        <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
          <LinearGradient
            colors={[theme.colors.accent, '#A855F7']}
            style={styles.chatGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MessageCircle size={24} color="#FFFFFF" />
            <View style={styles.chatContent}>
              <Text style={styles.chatTitle}>Start AI Chat</Text>
              <Text style={styles.chatSubtitle}>Get personalized stock advice</Text>
            </View>
            <Send size={20} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* AI Features */}
        <LinearGradient
          colors={[theme.colors.accent, '#A855F7']}
          style={styles.aiCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.aiHeader}>
            <Brain size={24} color="#FFFFFF" />
            <Text style={styles.aiTitle}>AI Assistant</Text>
          </View>
          <Text style={styles.aiDescription}>
            Get personalized stock recommendations based on your portfolio and risk tolerance
          </Text>
          <TouchableOpacity style={styles.aiCta}>
            <Text style={styles.aiCtaText}>Try AI Analysis</Text>
            <Sparkles size={16} color={theme.colors.accent} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${theme.colors.success}20` }]}>
              <Target size={20} color={theme.colors.success} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Stock Scanner</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${theme.colors.secondary}20` }]}>
              <TrendingUp size={20} color={theme.colors.secondary} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Market Analysis</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${theme.colors.warning}20` }]}>
              <Award size={20} color={theme.colors.warning} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Top Picks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${theme.colors.error}20` }]}>
              <Zap size={20} color={theme.colors.error} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>Hot Stocks</Text>
          </TouchableOpacity>
        </View>

        {/* AI Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>AI Suggestions</Text>
          </View>
          
          {aiSuggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} style={[styles.suggestionCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.suggestionText, { color: theme.colors.text }]}>{suggestion}</Text>
              <Brain size={16} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={theme.colors.warning} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trending Searches</Text>
          </View>
          
          {trendingSearches.map((search, index) => (
            <TouchableOpacity key={index} style={[styles.trendingCard, { backgroundColor: theme.colors.surface }]}>
              <Clock size={16} color={theme.colors.textTertiary} />
              <Text style={[styles.trendingText, { color: theme.colors.text }]}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium Features */}
        <LinearGradient
          colors={[theme.colors.surface, theme.colors.surfaceSecondary]}
          style={[styles.premiumCard, { borderColor: theme.colors.border }]}
        >
          <View style={styles.premiumHeader}>
            <Award size={24} color={theme.colors.warning} />
            <Text style={[styles.premiumTitle, { color: theme.colors.text }]}>Premium AI Features</Text>
          </View>
          <Text style={[styles.premiumDescription, { color: theme.colors.textSecondary }]}>
            Unlock advanced AI analysis, personalized recommendations, and real-time alerts
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontFamily: theme.typography.h1.fontFamily,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: theme.typography.body.fontFamily,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
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
  aiButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  chatButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  chatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  aiCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  aiTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  aiDescription: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  aiCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  aiCtaText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
  },
  suggestionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendingText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Medium',
  },
  premiumCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  premiumTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
  },
  premiumDescription: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  premiumButton: {
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  premiumButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});