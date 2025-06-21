import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

export default function AnimatedSplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to main app after 2 seconds
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
      router.replace('/(tabs)');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <LottieView
          source={require('../assets/images/animation.json')}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
