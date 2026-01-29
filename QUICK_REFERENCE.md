# Glow AI - Quick Reference

## 🚀 Running the App

### Development
```bash
npm run dev
```
Opens at: http://localhost:5173/

### Production Build
```bash
npm run build
```

## 📱 Screen Navigation

The app includes a **Quick Navigation** bar at the top for easy testing:
- **Splash** - Initial loading screen
- **Onboarding** - 3-step introduction
- **Camera** - Skin scan interface
- **Analysis** - Results with premium paywall
- **Paywall** - Premium upgrade screen
- **Home** - Main dashboard (default)
- **Products** - Product recommendations
- **Profile** - User settings and stats

## 🎨 Customization Guide

### Colors
Edit `src/styles/theme.css`:
- Primary gradient: `#14B8A6` to `#10B981` (teal/emerald)
- Background: `#FAF7F5` (light beige)
- Accents: `#F5D5CB` (peach), `#D1E3D1` (sage)

### Typography
Font: Plus Jakarta Sans (loaded from Google Fonts)
Sizes defined in `src/styles/theme.css` under `/* Typography */`

### Content
- **User name**: Search for "Priya" in components
- **Pricing**: Search for "₹99" or "₹999"
- **Products**: Edit the `products` array in `ProductRecommendationScreen.tsx`
- **Routine tasks**: Edit `routineTasks` in `HomeDashboard.tsx`

## 🔧 Common Modifications

### Change Premium Price
File: `src/app/components/PremiumPaywallScreen.tsx`
```tsx
<span className="text-5xl font-bold text-gray-800">₹99</span>
```

### Add New Screen
1. Create component in `src/app/components/`
2. Add to `App.tsx` screen state
3. Add navigation handler
4. Add quick nav button

### Modify Skin Score
File: `src/app/components/HomeDashboard.tsx`
```tsx
<h2 className="text-4xl font-bold text-white">78</h2>
```

### Change App Name
Files to update:
- `src/app/components/SplashScreen.tsx` - Logo text
- `src/app/components/ProfileScreen.tsx` - Footer
- `index.html` - Page title

## 📦 Project Structure

```
src/
├── app/
│   ├── App.tsx                          # Main app container
│   └── components/
│       ├── SplashScreen.tsx             # Initial loading
│       ├── OnboardingScreens.tsx        # 3-step intro
│       ├── HomeDashboard.tsx            # Main screen
│       ├── CameraUploadScreen.tsx       # Scan interface
│       ├── AnalysisResultScreen.tsx     # Results + paywall
│       ├── PremiumPaywallScreen.tsx     # Upgrade screen
│       ├── ProductRecommendationScreen.tsx  # Products
│       ├── ProfileScreen.tsx            # Settings
│       ├── ui/                          # Reusable UI components
│       └── figma/                       # Figma-specific components
├── styles/
│   ├── index.css                        # Main stylesheet
│   ├── theme.css                        # Design tokens
│   ├── tailwind.css                     # Tailwind config
│   └── fonts.css                        # Font imports
└── main.tsx                             # App entry point
```

## 🎯 Key Features

### Mobile Frame
- Size: 430px × 932px (iPhone-like)
- Rounded corners: 3rem
- Includes status bar overlay
- Proper scroll containment

### Bottom Navigation
- Fixed positioning within mobile frame
- 5 navigation items
- Center FAB (Floating Action Button)
- Active state indicators

### Animations
- Powered by Framer Motion (`motion/react`)
- Staggered reveals
- Smooth transitions
- Hover effects

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CSS Not Loading
Check that all imports are correct in `src/styles/index.css`

### Bottom Nav Not Fixed
Ensure screen containers use `min-h-full` not `min-h-screen`

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit
```

## 📚 Dependencies

### Core
- React 18.3.1
- TypeScript 5.9.3
- Vite 6.3.5

### UI
- Tailwind CSS 4.1.12
- Radix UI (various components)
- Framer Motion 12.23.24
- Lucide React (icons)

### Utilities
- clsx + tailwind-merge (className management)
- class-variance-authority (component variants)

## 🌐 Browser Support

Optimized for modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes

- The mobile frame uses CSS transforms to create proper positioning context
- All screens are designed for 430px width (mobile-first)
- Images use fallback placeholders if URLs fail to load
- Animations are optimized for 60fps performance
