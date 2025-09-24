# Post-Migration Checklist

## 🧪 Verification Steps

### 1. Dependencies Installation
```bash
# Install dependencies
npm install
# or if using yarn
yarn install
# or if using pnpm
pnpm install
```

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env` and configure values
- [ ] Update `API_BASE_URL` in `.env` file
- [ ] Verify environment variables are accessible in app

### 3. Code Quality Checks
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Combined validation
npm run validate
```

### 4. Build Verification
```bash
# Android build
npm run android

# iOS build (macOS only)
npm run ios

# Web build (if needed)
npm run web
```

### 5. Navigation Testing
- [ ] Welcome screen loads correctly
- [ ] Navigation between screens works
- [ ] Back button functionality
- [ ] Deep linking (if implemented)

### 6. Component Integration
- [ ] ThemedText and ThemedView work with new structure
- [ ] Design system tokens (Colors, Spacing, etc.) are accessible
- [ ] Custom components render correctly

### 7. State Management
- [ ] Zustand auth store functions properly
- [ ] React Query client is configured
- [ ] API client with interceptors works

## 🔧 Troubleshooting

### Common Issues

**1. Module Resolution Errors**
```bash
# Clear Metro cache
npx expo start --clear

# Reset project
npm run reset-project
```

**2. TypeScript Errors**
```bash
# Regenerate types
npx expo customize tsconfig.json
npm run typecheck
```

**3. react-native-config Issues (Expo)**
- For Expo projects, consider using `expo-constants` instead
- Or use Expo Development Build for native modules

**4. Navigation Errors**
- Ensure all screen components are properly exported
- Check navigation types in `src/navigation/types.ts`

## 📱 Platform-Specific Setup

### Android
- [ ] Verify `android/` folder builds successfully
- [ ] Check native module linking if using react-native-config

### iOS
- [ ] Verify `ios/` folder builds successfully
- [ ] Run `cd ios && pod install` if needed
- [ ] Check native module linking if using react-native-config

## 🎯 Performance Validation

### Bundle Size
```bash
# Analyze bundle
npx expo export --platform web
# Check output in dist/ folder
```

### Memory Usage
- [ ] Test app startup time
- [ ] Monitor memory usage in development
- [ ] Check for memory leaks in navigation

## ✅ Success Criteria

The migration is successful when:

1. **✅ App builds without errors** on target platforms
2. **✅ All navigation flows work** correctly
3. **✅ Environment variables** are accessible
4. **✅ Design system** components render properly
5. **✅ State management** (Zustand + React Query) functions
6. **✅ API integration** works with interceptors
7. **✅ TypeScript** validation passes
8. **✅ Linting** passes without critical errors

## 🚨 Rollback Plan

If issues occur, rollback steps:

1. **Revert to previous commit:**
   ```bash
   git log --oneline  # Find pre-migration commit
   git checkout <commit-hash>
   ```

2. **Restore original structure:**
   ```bash
   git checkout main
   mv app_deprecated app
   mv components_deprecated components
   mv constants_deprecated constants
   ```

3. **Restore package.json:**
   ```bash
   git checkout HEAD~8 -- package.json
   npm install
   ```

## 📞 Support

- Check `docs/migration-plan.md` for detailed migration context
- Review individual commit messages for specific changes
- Original code preserved in `*_deprecated/` folders

---
**Generated:** Post-migration validation guide
**Last Updated:** $(date)
