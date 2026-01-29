# ⚠️ IMPORTANT: Where to Run Commands

## 🎯 Correct Location

**ALWAYS run commands from the ROOT directory:**
```
x:\Work\Glow AI\
```

**NOT from:**
```
x:\Work\Glow AI\glow-ai-native\  ❌ This folder is EMPTY!
```

## 🚀 How to Run the App

### Step 1: Make sure you're in the ROOT directory

```bash
# Check your current directory
pwd

# Should show: x:\Work\Glow AI
# If you're in glow-ai-native, go back:
cd ..
```

### Step 2: Start the Expo server

```bash
# From x:\Work\Glow AI\
npm start
```

### Step 3: Scan QR Code

The terminal will show:
- A QR code
- Local URL (http://...)
- Instructions

**On your phone:**
1. Open Expo Go app
2. Scan the QR code
3. App will load!

## 📱 Platform-Specific Commands

All commands run from `x:\Work\Glow AI\`:

```bash
# Start dev server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run in web browser
npm run web
```

## 🗂️ Project Structure After Migration

```
x:\Work\Glow AI\              ← RUN COMMANDS HERE!
├── App.tsx
├── package.json
├── src/
│   ├── components/
│   └── screens/
├── assets/
└── glow-ai-native/           ← EMPTY - DON'T USE!
```

## ✅ Current Status

**Expo Server:** 🟢 RUNNING at `x:\Work\Glow AI`

The server is already running! Just:
1. Look at the terminal output
2. Find the QR code
3. Scan with Expo Go app
4. Your app will load!

## 🔧 If You Need to Restart

```bash
# Stop current server (Ctrl+C)
# Then:
cd "x:\Work\Glow AI"
npm start
```

## 💡 Why This Happened

During migration, we moved all React Native files from `glow-ai-native/` to the root directory. The `glow-ai-native` folder is now empty and can be deleted.

## 🗑️ Optional: Clean Up

You can safely delete the empty folder:

```bash
# From x:\Work\Glow AI\
Remove-Item -Path ".\glow-ai-native" -Force
```

---

**Remember: Always run `npm start` from `x:\Work\Glow AI\` (the root directory)!**
