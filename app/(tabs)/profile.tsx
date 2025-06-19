import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, Crown, ChevronRight, Moon, DollarSign, ChartBar as BarChart3, Star, Gift, Sun } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const styles = createStyles(theme);

  const profileStats = [
    { label: 'Portfolio Value', value: '$125,430', icon: DollarSign, color: theme.colors.success },
    { label: 'Total Trades', value: '247', icon: BarChart3, color: theme.colors.secondary },
    { label: 'Win Rate', value: '72%', icon: Star, color: theme.colors.warning },
  ];

  const menuItems = [
    { title: 'Account Settings', icon: Settings, color: theme.colors.textTertiary },
    { title: 'Notifications', icon: Bell, color: theme.colors.warning },
    { title: 'Security', icon: Shield, color: theme.colors.success },
    { title: 'Help & Support', icon: HelpCircle, color: theme.colors.secondary },
    { title: 'Refer Friends', icon: Gift, color: theme.colors.accent },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <LinearGradient
              colors={theme.colors.gradient.primary}
              style={styles.avatar}
            >
              <User size={32} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={[styles.name, { color: theme.colors.text }]}>Alex Johnson</Text>
              <Text style={[styles.email, { color: theme.colors.textSecondary }]}>alex.johnson@email.com</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Premium Status */}
        <LinearGradient
          colors={theme.colors.gradient.warning}
          style={styles.premiumCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.premiumContent}>
            <Crown size={24} color="#FFFFFF" />
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Premium Member</Text>
              <Text style={styles.premiumSubtitle}>Unlimited access to all features</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View key={index} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <IconComponent size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings</Text>
          
          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: `${theme.colors.warning}20` }]}>
                <Bell size={20} color={theme.colors.warning} />
              </View>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.primary }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : theme.colors.textTertiary}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: `${theme.colors.secondary}20` }]}>
                {isDark ? (
                  <Moon size={20} color={theme.colors.secondary} />
                ) : (
                  <Sun size={20} color={theme.colors.secondary} />
                )}
              </View>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.primary }}
              thumbColor={isDark ? '#FFFFFF' : theme.colors.textTertiary}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={index} style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                    <IconComponent size={20} color={item.color} />
                  </View>
                  <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.colors.textTertiary }]}>StockWise v1.0.0</Text>
          <Text style={[styles.appDescription, { color: theme.colors.textTertiary }]}>
            Your intelligent stock trading companion
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: `${theme.colors.error}20` }]}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  name: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
    marginBottom: 4,
  },
  email: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
  },
  editButton: {
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
  },
  premiumCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  manageButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  manageButtonText: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontFamily: theme.typography.h3.fontFamily,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Medium',
  },
  menuItem: {
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
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Medium',
  },
  appInfo: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: theme.typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  logoutText: {
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'Inter-Medium',
  },
});