# Migration script to convert to React Native only app
Write-Host "Starting migration to React Native app..." -ForegroundColor Green

# Step 1: Backup web files (optional)
Write-Host "Creating backup folder..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path ".\web-backup" -Force | Out-Null

# Backup web-specific files
$webFiles = @(
    "index.html",
    "vite.config.ts",
    "postcss.config.mjs",
    "tsconfig.node.json"
)

foreach ($file in $webFiles) {
    if (Test-Path $file) {
        Copy-Item $file ".\web-backup\" -Force
        Write-Host "  Backed up: $file" -ForegroundColor Gray
    }
}

# Backup src folder
if (Test-Path ".\src") {
    Copy-Item ".\src" ".\web-backup\src" -Recurse -Force
    Write-Host "  Backed up: src folder" -ForegroundColor Gray
}

# Step 2: Copy React Native files to root
Write-Host "`nMoving React Native files to root..." -ForegroundColor Yellow

# Copy all files from glow-ai-native to root (except node_modules and .expo)
$itemsToCopy = Get-ChildItem ".\glow-ai-native" -Exclude "node_modules", ".expo", "package-lock.json"

foreach ($item in $itemsToCopy) {
    $destPath = Join-Path "." $item.Name
    
    # If destination exists and is from web app, remove it
    if (Test-Path $destPath) {
        Remove-Item $destPath -Recurse -Force
        Write-Host "  Removed old: $($item.Name)" -ForegroundColor Gray
    }
    
    # Copy from glow-ai-native
    Copy-Item $item.FullName $destPath -Recurse -Force
    Write-Host "  Copied: $($item.Name)" -ForegroundColor Green
}

# Step 3: Remove web-specific files
Write-Host "`nRemoving web-specific files..." -ForegroundColor Yellow

$filesToRemove = @(
    "index.html",
    "vite.config.ts",
    "postcss.config.mjs",
    "tsconfig.node.json",
    "src",
    "node_modules",
    "package-lock.json"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Recurse -Force
        Write-Host "  Removed: $file" -ForegroundColor Red
    }
}

# Step 4: Copy package files from glow-ai-native
Write-Host "`nCopying React Native package files..." -ForegroundColor Yellow
Copy-Item ".\glow-ai-native\package.json" ".\package.json" -Force
Copy-Item ".\glow-ai-native\package-lock.json" ".\package-lock.json" -Force
Write-Host "  Updated package.json and package-lock.json" -ForegroundColor Green

# Step 5: Remove glow-ai-native folder
Write-Host "`nCleaning up..." -ForegroundColor Yellow
Remove-Item ".\glow-ai-native" -Recurse -Force
Write-Host "  Removed glow-ai-native folder" -ForegroundColor Red

# Step 6: Update documentation
Write-Host "`nUpdating documentation..." -ForegroundColor Yellow

# Update README
$readmeContent = @"
# Glow AI - AI-Powered Skincare Assistant

A beautiful React Native mobile app for AI-powered skin analysis and personalized skincare recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Expo CLI (will be installed automatically)
- Expo Go app on your phone (iOS/Android)

### Installation

1. Install dependencies:
``````bash
npm install
``````

2. Start the development server:
``````bash
npm start
``````

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## 📱 Features

- ✨ AI-powered skin analysis
- 📊 Personalized skincare routines
- 🛍️ Product recommendations (Indian brands)
- 📈 Progress tracking
- 🎯 Achievement system
- 💰 Premium features (₹99 lifetime)

## 🛠️ Development

### Run on specific platform
``````bash
npm run android  # Android emulator/device
npm run ios      # iOS simulator (Mac only)
npm run web      # Web browser
``````

### Project Structure
``````
.
├── App.tsx                 # Main app component
├── src/
│   ├── components/         # Reusable components
│   ├── screens/           # App screens
│   ├── navigation/        # Navigation setup
│   ├── hooks/             # Custom hooks
│   └── constants/         # Constants and theme
├── assets/                # Images and fonts
└── app.json              # Expo configuration
``````

## 📚 Screens

1. **Splash Screen** - Animated intro
2. **Onboarding** - 3-step introduction
3. **Home Dashboard** - Main screen with stats
4. **Camera Screen** - Skin analysis capture
5. **Analysis Results** - AI analysis with paywall
6. **Premium Paywall** - Upgrade screen
7. **Products** - Skincare recommendations
8. **Profile** - User settings and achievements

## 🎨 Design

- **Colors**: Teal/Emerald gradients (#14B8A6, #10B981)
- **Font**: Plus Jakarta Sans
- **UI Library**: React Native + Expo
- **Icons**: Lucide React Native
- **Animations**: React Native Animatable

## 📦 Key Dependencies

- React Native 0.81.5
- Expo SDK 54
- React Navigation 7
- Expo Linear Gradient
- Lucide React Native
- React Native Animatable

## 🔧 Configuration

Edit `app.json` to customize:
- App name and slug
- Bundle identifiers
- App icons and splash screen
- Orientation and status bar

## 📝 Notes

- Optimized for Indian market (₹ pricing, local brands)
- Designed for Gen Z audience (16-30 years)
- Premium features unlock at ₹99 (one-time)
- All screens are fully functional and animated

## 🤝 Contributing

This is a UI template. Feel free to customize and extend!

## 📄 License

See ATTRIBUTIONS.md for third-party licenses.
"@

Set-Content -Path ".\README.md" -Value $readmeContent -Force
Write-Host "  Updated README.md" -ForegroundColor Green

Write-Host "`n✅ Migration complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm install" -ForegroundColor White
Write-Host "  2. Run: npm start" -ForegroundColor White
Write-Host "  3. Scan QR code with Expo Go app" -ForegroundColor White
Write-Host "`nWeb backup saved in: .\web-backup\" -ForegroundColor Gray
