import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Example state for editing
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@email.com');

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Edit Profile
      </Text>
      <TextInput
        style={[
          styles.input,
          { color: theme.colors.text, borderColor: theme.colors.border },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={theme.colors.textTertiary}
      />
      <TextInput
        style={[
          styles.input,
          { color: theme.colors.text, borderColor: theme.colors.border },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={theme.colors.textTertiary}
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={{ color: '#fff' }}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 24, fontFamily: 'Inter-Bold', marginBottom: 24 },
    input: {
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: 12,
      marginBottom: 16,
      fontFamily: 'Inter-Regular',
    },
    saveButton: {
      padding: 16,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: 16,
    },
  });
