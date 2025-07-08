import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
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
  Send,
  Crown,
  X,
  Bot,
  User as UserIcon,
  ArrowRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [freeChatsUsed, setFreeChatsUsed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const styles = createStyles(theme);
  const MAX_FREE_CHATS = 3;

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

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    if (freeChatsUsed >= MAX_FREE_CHATS) {
      setShowPremiumModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setFreeChatsUsed(prev => prev + 1);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const responses = [
      "Based on current market trends, AAPL shows strong fundamentals with a P/E ratio of 28.3 and consistent revenue growth. The stock has good momentum for long-term investment.",
      "For dividend investing, consider stocks like JNJ, PG, and KO. These companies have a history of consistent dividend payments and growth over decades.",
      "The tech sector is experiencing volatility due to AI developments and interest rate changes. Focus on companies with strong balance sheets and innovative products.",
      "Portfolio diversification is key to managing risk. Consider allocating across different sectors: 30% tech, 20% healthcare, 15% financials, 15% consumer goods, and 20% bonds/REITs."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleUpgradeToPremium = () => {
    setShowPremiumModal(false);
    Alert.alert(
      'Upgrade to Premium',
      'Get unlimited AI chats, advanced analysis, and exclusive features for just ₹999/month.',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Upgrade Now', onPress: () => router.push('/(tabs)/premium') }
      ]
    );
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

        {/* AI Chat Section */}
        <View style={[styles.chatSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderLeft}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.accent]}
                style={styles.botAvatar}
              >
                <Bot size={20} color="#FFFFFF" />
              </LinearGradient>
              <View>
                <Text style={[styles.chatTitle, { color: theme.colors.text }]}>AI Assistant</Text>
                <Text style={[styles.chatSubtitle, { color: theme.colors.textSecondary }]}>
                  {freeChatsUsed}/{MAX_FREE_CHATS} free chats used
                </Text>
              </View>
            </View>
            <View style={[styles.premiumBadge, { backgroundColor: theme.colors.warning }]}>
              <Crown size={12} color="#FFFFFF" />
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
          </View>

          {/* Chat Messages */}
          {messages.length > 0 && (
            <View style={styles.messagesContainer}>
              {messages.slice(-4).map((message) => (
                <View key={message.id} style={styles.messageWrapper}>
                  <View style={[
                    styles.messageBubble,
                    message.isUser ? styles.userMessage : styles.aiMessage,
                    { 
                      backgroundColor: message.isUser ? theme.colors.primary : theme.colors.background,
                    }
                  ]}>
                    {!message.isUser && (
                      <LinearGradient
                        colors={[theme.colors.primary, theme.colors.accent]}
                        style={styles.messageAvatar}
                      >
                        <Bot size={12} color="#FFFFFF" />
                      </LinearGradient>
                    )}
                    <Text style={[
                      styles.messageText,
                      { color: message.isUser ? '#FFFFFF' : theme.colors.text }
                    ]}>
                      {message.text}
                    </Text>
                    {message.isUser && (
                      <View style={[styles.userAvatar, { backgroundColor: theme.colors.secondary }]}>
                        <UserIcon size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {isTyping && (
                <View style={styles.typingIndicator}>
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.accent]}
                    style={styles.typingAvatar}
                  >
                    <Bot size={12} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={[styles.typingBubble, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
                      AI is typing...
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Chat Input */}
          <View style={[styles.chatInputContainer, { borderTopColor: theme.colors.border }]}>
            <View style={[styles.chatInputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <TextInput
                style={[styles.chatInput, { color: theme.colors.text }]}
                placeholder={freeChatsUsed >= MAX_FREE_CHATS ? "Upgrade to continue chatting..." : "Ask me anything about stocks..."}
                placeholderTextColor={theme.colors.textTertiary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                editable={freeChatsUsed < MAX_FREE_CHATS}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton, 
                  { 
                    backgroundColor: (inputText.trim() && freeChatsUsed < MAX_FREE_CHATS) ? theme.colors.primary : theme.colors.surfaceSecondary 
                  }
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || freeChatsUsed >= MAX_FREE_CHATS}
              >
                <Send size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {freeChatsUsed >= MAX_FREE_CHATS && (
              <TouchableOpacity 
                style={[styles.upgradeButton, { backgroundColor: theme.colors.warning }]}
                onPress={() => setShowPremiumModal(true)}
              >
                <Crown size={16} color="#FFFFFF" />
                <Text style={styles.upgradeButtonText}>Upgrade for Unlimited Chats</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

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
      </ScrollView>

      {/* Premium Modal */}
      <Modal
        visible={showPremiumModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowPremiumModal(false)}
            >
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.accent]}
              style={styles.modalHeader}
            >
              <Crown size={32} color="#FFFFFF" />
              <Text style={styles.modalTitle}>Upgrade to Premium</Text>
              <Text style={styles.modalSubtitle}>Unlock unlimited AI conversations</Text>
            </LinearGradient>

            <View style={styles.modalFeatures}>
              <View style={styles.modalFeature}>
                <MessageCircle size={20} color={theme.colors.primary} />
                <Text style={[styles.modalFeatureText, { color: theme.colors.text }]}>Unlimited AI chats</Text>
              </View>
              <View style={styles.modalFeature}>
                <Brain size={20} color={theme.colors.primary} />
                <Text style={[styles.modalFeatureText, { color: theme.colors.text }]}>Advanced market analysis</Text>
              </View>
              <View style={styles.modalFeature}>
                <TrendingUp size={20} color={theme.colors.primary} />
                <Text style={[styles.modalFeatureText, { color: theme.colors.text }]}>Real-time alerts</Text>
              </View>
              <View style={styles.modalFeature}>
                <Award size={20} color={theme.colors.primary} />
                <Text style={[styles.modalFeatureText, { color: theme.colors.text }]}>Exclusive insights</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.modalUpgradeButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleUpgradeToPremium}
            >
              <Text style={styles.modalUpgradeButtonText}>Upgrade for ₹999/month</Text>
            </TouchableOpacity>
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
  chatSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
  },
  chatSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  messagesContainer: {
    maxHeight: 200,
    marginBottom: theme.spacing.md,
  },
  messageWrapper: {
    marginBottom: theme.spacing.sm,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '85%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageAvatar: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  typingAvatar: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    borderRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: 4,
    padding: theme.spacing.sm,
  },
  typingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  chatInputContainer: {
    borderTopWidth: 1,
    paddingTop: theme.spacing.md,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  chatInput: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    maxHeight: 80,
    paddingVertical: theme.spacing.xs,
  },
  sendButton: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  modalClose: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  modalFeatures: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  modalFeatureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  modalUpgradeButton: {
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  modalUpgradeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});