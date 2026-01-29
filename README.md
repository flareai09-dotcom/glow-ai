# Glow AI - React Native Mobile App

A beautiful AI-powered skincare assistant mobile app built with React Native and Expo.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Run on your device:**
   - Scan the QR code with:
     - **iOS**: Camera app → Opens in Expo Go
     - **Android**: Expo Go app → Scan QR

### Platform-Specific Commands

```bash
npm run android  # Run on Android emulator/device
npm run ios      # Run on iOS simulator (Mac only)
npm run web      # Run in web browser
```

## 📱 App Features

### Core Features
- ✨ **AI Skin Analysis** - Advanced skin scanning and analysis
- 📊 **Personalized Routines** - Custom morning & evening skincare routines
- 🛍️ **Product Recommendations** - Curated Indian skincare products
- 📈 **Progress Tracking** - Weekly skin score tracking
- 🎯 **Achievements** - Gamified skincare journey
- 💰 **Premium Features** - ₹99 lifetime access

### Screens
1. **Splash Screen** - Animated app intro
2. **Onboarding** - 3-step feature introduction
3. **Home Dashboard** - Main hub with stats and routines
4. **Camera Screen** - Skin analysis capture
5. **Analysis Results** - AI-powered skin analysis
6. **Premium Paywall** - Upgrade to unlock features
7. **Products** - Skincare product recommendations
8. **Profile** - User settings and achievements

## 🎨 Design System

### Colors
- **Primary**: Teal/Emerald (#14B8A6, #10B981)
- **Background**: Light Beige (#FAF7F5)
- **Accents**: Peach (#F5D5CB), Sage (#D1E3D1)

### Typography
- **Font**: Plus Jakarta Sans
- Modern, rounded, highly readable

### UI Components
- Gradient backgrounds
- Smooth animations
- Card-based layouts
- Bottom navigation
- Floating action buttons

## 📦 Tech Stack

### Core
- **React Native** 0.81.5
- **Expo SDK** 54
- **TypeScript** 5.9.2

### Navigation
- **React Navigation** 7.1.28
- Stack Navigator

### UI & Styling
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Animatable** - Smooth animations
- **Lucide React Native** - Beautiful icons

### Utilities
- **clsx** - Conditional classNames
- **tailwind-merge** - Tailwind utility merging

## 📁 Project Structure

```
.
├── App.tsx                    # Main app component with navigation
├── index.ts                   # Entry point
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
│
├── src/
│   ├── components/            # Reusable components
│   │   ├── SplashScreen.tsx
│   │   └── OnboardingScreens.tsx
│   │
│   ├── screens/               # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── AnalysisScreen.tsx
│   │   ├── PaywallScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   ├── navigation/            # Navigation setup
│   ├── hooks/                 # Custom React hooks
│   ├── constants/             # App constants
│   └── assets/                # Images and resources
│
└── assets/                    # App assets (icons, splash)
    ├── icon.png
    ├── splash.png
    └── adaptive-icon.png
```

## 🛠️ Development

### Running the App

**Development Mode:**
```bash
npm start
```

**Clear Cache:**
```bash
npm start -- --clear
```

**Specific Platform:**
```bash
npm run android    # Android
npm run ios        # iOS (Mac only)
npm run web        # Web browser
```

### Building for Production

**Android APK:**
```bash
eas build --platform android
```

**iOS IPA:**
```bash
eas build --platform ios
```

*Note: Requires Expo Application Services (EAS) account*

## 🎯 Key Features Explained

### Premium Model (₹99 Lifetime)
- **Unlimited Scans** - No limits on skin analysis
- **Detailed Analysis** - Full breakdown of skin concerns
- **Product Recommendations** - Personalized product suggestions
- **Custom Routines** - Tailored morning & evening routines
- **Progress Tracking** - Weekly skin score history
- **Achievements** - Unlock badges and rewards

### Free Features
- 1 free skin scan preview
- Basic skin score
- Limited concern visibility
- App exploration

## 🌍 Localization

- **Currency**: Indian Rupees (₹)
- **Products**: Indian skincare brands
- **Target Audience**: Indian Gen Z (16-30 years)
- **Climate**: Optimized for Indian weather conditions

## 🔧 Configuration

### App Settings (`app.json`)
```json
{
  "expo": {
    "name": "Glow AI",
    "slug": "glow-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FAF7F5"
    }
  }
}
```

### Customization
- Edit `app.json` for app metadata
- Modify colors in screen components
- Update product data in `ProductsScreen.tsx`
- Change pricing in `PaywallScreen.tsx`

## 📱 Testing

### On Physical Device
1. Install Expo Go from App Store/Play Store
2. Run `npm start`
3. Scan QR code with your phone

### On Emulator
**Android:**
1. Install Android Studio
2. Set up Android emulator
3. Run `npm run android`

**iOS (Mac only):**
1. Install Xcode
2. Run `npm run ios`

## 🚀 Deployment

### Expo Go (Development)
- Already set up - just scan QR code

### Standalone App
1. Create Expo account
2. Install EAS CLI: `npm install -g eas-cli`
3. Configure: `eas build:configure`
4. Build: `eas build --platform android`

### App Stores
- Follow Expo's [App Store deployment guide](https://docs.expo.dev/distribution/app-stores/)

## 📝 Notes

- **Optimized for Mobile**: Best experience on phones (not tablets)
- **Indian Market Focus**: Pricing, products, and design for Indian users
- **Gen Z Appeal**: Modern aesthetics, gamification, social proof
- **Premium Conversion**: Strategic paywall after first scan

## 🤝 Contributing

This is a UI template project. Feel free to:
- Customize the design
- Add new features
- Integrate real AI backend
- Connect to payment gateway
- Add user authentication

## 📄 License & Attribution

See `ATTRIBUTIONS.md` for third-party licenses and credits.

## 🆘 Troubleshooting

### Common Issues

**"Unable to find expo"**
```bash
npm install
```

**Metro bundler issues**
```bash
npm start -- --clear
```

**TypeScript errors**
```bash
npm install --save-dev @types/react @types/react-native
```

**Build fails**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues or questions:
1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review the [React Native docs](https://reactnative.dev/)
3. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

---

**Made with ❤️ for Indian skin**

Version 1.0.0 | React Native + Expo
