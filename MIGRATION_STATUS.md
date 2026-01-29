# React Native App Migration - Final Steps

## Current Status

✅ Web app files backed up to `web-backup/`
✅ React Native package.json in place
✅ App.tsx, babel.config.js, tsconfig.json configured
✅ Directory structure created (`src/components`, `src/screens`, etc.)

## ⚠️ Important: Missing Files

The React Native screen files need to be restored. The `glow-ai-native` folder was emptied during migration.

## Option 1: Restore from Git (Recommended if available)

If the glow-ai-native folder was committed to git:

```bash
# Check git history
git log --all --full-history -- "glow-ai-native/src/*"

# If found, restore from a specific commit
git checkout <commit-hash> -- glow-ai-native/src

# Then copy to root
Copy-Item -Path ".\glow-ai-native\src\*" -Destination ".\src\" -Recurse -Force
```

## Option 2: Manual Recreation

The following React Native screen files need to be created in `src/screens/`:

### Required Screen Files:

1. **HomeScreen.tsx** - Main dashboard with routines and progress
2. **CameraScreen.tsx** - Skin analysis capture interface
3. **AnalysisScreen.tsx** - Analysis results with paywall
4. **PaywallScreen.tsx** - Premium upgrade screen
5. **ProductsScreen.tsx** - Product recommendations
6. **ProfileScreen.tsx** - User settings and achievements

### Required Component Files in `src/components/`:

1. **SplashScreen.tsx** - Animated intro screen
2. **OnboardingScreens.tsx** - 3-step onboarding flow

## Option 3: Use Web Components as Reference

The web versions are backed up in `web-backup/src/app/components/`. These can be adapted to React Native by:

1. Replacing HTML elements with React Native components:
   - `<div>` → `<View>`
   - `<p>`, `<span>`, `<h1>` → `<Text>`
   - `<button>` → `<TouchableOpacity>` or `<Pressable>`
   - `<img>` → `<Image>`

2. Replacing CSS with StyleSheet:
   ```tsx
   // Web (Tailwind)
   <div className="flex items-center bg-white p-4">
   
   // React Native
   <View style={styles.container}>
   
   const styles = StyleSheet.create({
     container: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: '#ffffff',
       padding: 16,
     }
   });
   ```

3. Replacing Framer Motion with React Native Animatable:
   ```tsx
   // Web
   import { motion } from 'motion/react';
   <motion.div animate={{ opacity: 1 }}>
   
   // React Native
   import * as Animatable from 'react-native-animatable';
   <Animatable.View animation="fadeIn">
   ```

## Quick Setup Script

Create the basic screen structure:

```bash
# Create placeholder screens
@"
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF7F5',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
"@ | Out-File -FilePath ".\src\screens\HomeScreen.tsx" -Encoding UTF8

# Repeat for other screens...
```

## Next Steps

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```

3. **Test on Device:**
   - Scan QR code with Expo Go app

## Files to Keep

- ✅ `App.tsx` - Main app with navigation
- ✅ `package.json` - React Native dependencies
- ✅ `babel.config.js` - Babel configuration
- ✅ `tsconfig.json` - TypeScript config
- ✅ `app.json` - Expo configuration
- ✅ `index.ts` - Entry point

## Files to Remove (Optional)

After confirming the app works:
- `web-backup/` - Old web app files
- `glow-ai-native/` - Empty folder
- `migrate-to-native.ps1` - Migration script
- `FIXES_APPLIED.md` - Web app fixes (no longer relevant)
- `QUICK_REFERENCE.md` - Web app reference (no longer relevant)

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Metro bundler issues
```bash
npm start -- --clear
```

### Missing screens
Recreate them using the templates above or adapt from web-backup

## Contact

If you have the original glow-ai-native files backed up elsewhere, restore them to `src/` directory.

Otherwise, the screens need to be recreated using React Native components.
