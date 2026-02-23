import React, { useState } from 'react';
import { View, StatusBar, Text, LogBox } from 'react-native';

LogBox.ignoreLogs([
  'setLayoutAnimationEnabledExperimental',
  'SafeAreaView has been deprecated',
]);
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from './src/components/SplashScreen';
import { OnboardingScreens } from './src/components/OnboardingScreens';
import { HomeScreen } from './src/screens/HomeScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { AnalysisScreen } from './src/screens/AnalysisScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { ProductRecommendationScreen } from './src/screens/ProductsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeProvider } from './src/context/ThemeContext';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { PremiumScreen } from './src/screens/PremiumScreen';
import { AppSettingsScreen } from './src/screens/AppSettingsScreen';
import { HelpScreen } from './src/screens/HelpScreen';
import { RoutineProvider } from './src/context/RoutineContext';
import { EditRoutineScreen } from './src/screens/EditRoutineScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ProductProvider } from './src/context/ProductContext';
import { AddProductScreen } from './src/screens/AddProductScreen';
import { ProductDetailsScreen } from './src/screens/ProductDetailsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { HistoryProvider } from './src/context/HistoryContext';
import { StatsScreen } from './src/screens/StatsScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { GlowyAgent } from './src/components/GlowyAgent';
import { ChatScreen } from './src/screens/ChatScreen';
import { ReferralScreen } from './src/screens/ReferralScreen';
import { AdminPanelScreen } from './src/screens/AdminPanelScreen';

const Stack = createStackNavigator();

// Separate component to check auth state inside provider
function MainNavigator() {
  const { userToken, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <SplashScreen onComplete={() => { }} />; // Or simple loading spinner
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF7F5' }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FAF7F5' }
          }}
        >
          {userToken ? (
            // Check if user is Admin
            isAdmin ? (
              // Admin Stack
              <>
                <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
                <Stack.Screen name="AddProduct" component={AddProductScreen} />
                <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
              </>
            ) : (
              // Main App Stack
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen name="Analysis" component={AnalysisScreen} />
                <Stack.Screen name="Paywall" component={PaywallScreen} />
                <Stack.Screen name="Products" component={ProductRecommendationScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="Premium" component={PremiumScreen} />
                <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
                <Stack.Screen name="Help" component={HelpScreen} />
                <Stack.Screen name="EditRoutine" component={EditRoutineScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="AddProduct" component={AddProductScreen} />
                <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="Stats" component={StatsScreen} />
                <Stack.Screen name="Referral" component={ReferralScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
              </>
            )
          ) : (
            // Auth Stack
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      {userToken && <GlowyAgent />}
    </View>
  );
}

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  if (!isSplashComplete) {
    return (
      <>
        <StatusBar hidden />
        <SplashScreen onComplete={() => setIsSplashComplete(true)} />
      </>
    );
  }

  if (!isOnboardingComplete) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <OnboardingScreens
          currentStep={onboardingStep}
          onNext={() => {
            if (onboardingStep < 2) {
              setOnboardingStep(onboardingStep + 1);
            } else {
              setIsOnboardingComplete(true);
            }
          }}
          onSkip={() => setIsOnboardingComplete(true)}
        />
      </>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <RoutineProvider>
          <ProductProvider>
            <HistoryProvider>
              <MainNavigator />
            </HistoryProvider>
          </ProductProvider>
        </RoutineProvider>
      </ThemeProvider >
    </AuthProvider>
  );
}
