import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, Send, Bot, User, Sparkles, TrendingUp, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export default function ChatScreen() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI trading assistant. I can help you analyze stocks, find investment opportunities, and answer questions about the market. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "Analyze AAPL stock",
        "Best dividend stocks",
        "Tech sector outlook",
        "Portfolio diversification tips"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const styles = createStyles(theme);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
        suggestions: getRandomSuggestions(),
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

  const getRandomSuggestions = (): string[] => {
    const allSuggestions = [
      "Show me growth stocks",
      "Explain P/E ratios",
      "Market volatility analysis",
      "ESG investment options",
      "Crypto vs stocks",
      "Risk management tips"
    ];
    return allSuggestions.slice(0, 3);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <LinearGradient
              colors={[theme.colors.accent, '#A855F7']}
              style={styles.botAvatar}
            >
              <Bot size={20} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AI Assistant</Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                {isTyping ? 'Typing...' : 'Online'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.sparklesButton, { backgroundColor: `${theme.colors.accent}20` }]}>
            <Sparkles size={20} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.messageWrapper}>
              <View style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.aiMessage,
                { 
                  backgroundColor: message.isUser ? theme.colors.primary : theme.colors.surface,
                  shadowColor: theme.colors.shadow,
                }
              ]}>
                {!message.isUser && (
                  <LinearGradient
                    colors={[theme.colors.accent, '#A855F7']}
                    style={styles.messageAvatar}
                  >
                    <Bot size={16} color="#FFFFFF" />
                  </LinearGradient>
                )}
                <View style={styles.messageContent}>
                  <Text style={[
                    styles.messageText,
                    { color: message.isUser ? '#FFFFFF' : theme.colors.text }
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    { color: message.isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary }
                  ]}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                {message.isUser && (
                  <View style={[styles.userAvatar, { backgroundColor: theme.colors.secondary }]}>
                    <User size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* Suggestions */}
              {message.suggestions && (
                <View style={styles.suggestionsContainer}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.suggestionChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text style={[styles.suggestionText, { color: theme.colors.textSecondary }]}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          {isTyping && (
            <View style={styles.typingIndicator}>
              <LinearGradient
                colors={[theme.colors.accent, '#A855F7']}
                style={styles.typingAvatar}
              >
                <Bot size={16} color="#FFFFFF" />
              </LinearGradient>
              <View style={[styles.typingBubble, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, { backgroundColor: theme.colors.textTertiary }]} />
                  <View style={[styles.dot, { backgroundColor: theme.colors.textTertiary }]} />
                  <View style={[styles.dot, { backgroundColor: theme.colors.textTertiary }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
            <TrendingUp size={16} color={theme.colors.success} />
            <Text style={[styles.quickActionText, { color: theme.colors.textSecondary }]}>Market</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
            <DollarSign size={16} color={theme.colors.warning} />
            <Text style={[styles.quickActionText, { color: theme.colors.textSecondary }]}>Stocks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.surface }]}>
            <Sparkles size={16} color={theme.colors.accent} />
            <Text style={[styles.quickActionText, { color: theme.colors.textSecondary }]}>Analysis</Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.text }]}
              placeholder="Ask me anything about stocks..."
              placeholderTextColor={theme.colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.surfaceSecondary }]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  sparklesButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  messageWrapper: {
    marginBottom: theme.spacing.lg,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: theme.spacing.sm,
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
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
    marginLeft: 32,
    gap: theme.spacing.sm,
  },
  suggestionChip: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  typingAvatar: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    borderRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: 4,
    padding: theme.spacing.md,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    maxHeight: 100,
    paddingVertical: theme.spacing.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});