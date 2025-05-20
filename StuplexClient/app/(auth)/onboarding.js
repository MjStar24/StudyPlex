import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useColorScheme,
  Pressable,
  Link
} from 'react-native';
import { useRouter } from 'expo-router'; 
import ThemedView from '../../components/ThemeView';
import { Colors } from '../../constants/color.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


const OnboardingScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.light;
  const router = useRouter();
    
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('isFirstTime', 'true');
      router.push('/login');
    } catch (error) {
      console.log('Error setting onboarding flag', error);
    }
  };


  return (
    <ThemedView style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/OnboardingImg2.png')}
        style={styles.image}
      />

      <Text style={[styles.quote, { color: theme.text }]}>
        "Empower your learning journey with StudyPlex!"
      </Text>

      <Pressable
        onPress={handleGetStarted}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? theme.primaryPressed || '#0055aa'
              : theme.primary || '#007bff',
          },
          styles.button,
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText || '#fff' }]}>
          Get Started
        </Text>
      </Pressable>
      </SafeAreaView>
</ThemedView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  quote: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
