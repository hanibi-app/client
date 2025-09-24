# Migration Plan: Expo → RN CLI Structure Refactoring

## Current Project State Analysis

### Project Type & Framework
- **Current**: Expo Router based React Native app (Expo SDK ~53.0.20)
- **Target**: RN CLI structure with traditional React Navigation
- **Entry Point**: `expo-router/entry` → Will change to custom App.tsx

### Existing Dependencies Analysis
- ✅ React Navigation: Already has `@react-navigation/native` + `@react-navigation/bottom-tabs`
- ❌ Missing: `@react-navigation/native-stack`, `axios`, `zustand`, `react-native-config`, `@tanstack/react-query`
- ✅ TypeScript: Already configured with path aliases
- ✅ Build Tools: Android/iOS native projects exist

### Current Directory Structure
```
app/                    # Expo Router structure
├── (auth)/            # Auth routes
├── (tabs)/            # Tab navigation
├── caution/           # Onboarding steps
├── item/              # Item management
└── dev/               # Development tools

src/                   # Partial new structure exists
├── entities/          # Empty
├── features/          # Empty  
├── services/          # Partial (api/, ble/, nfc/, sse/, ws/)
├── shared/            # Partial structure
├── store/             # Empty (only index.ts)
├── types/             # Empty (only index.ts)
└── widgets/           # Empty

components/            # UI components (needs migration)
constants/             # Design tokens (needs migration)
hooks/                 # Empty folder (hooks moved to src/shared/hooks/)
```

### Path Aliases Configuration
- Already configured in tsconfig.json with extensive aliases (@app/*, @src/*, @shared/*, etc.)
- Need to consolidate to @/* → src/* pattern

### Shrimp MCP Server Analysis
- ❌ No .mcp.json found in project root
- ❌ No shrimp-related files detected
- ✅ No conflicts expected with shrimp integration

### Risk Assessment
1. **High Risk**: Expo Router → React Navigation migration (breaking change)
2. **Medium Risk**: Path alias consolidation (many existing imports)
3. **Low Risk**: Directory structure changes (mostly empty folders)
4. **Low Risk**: Shrimp integration (no existing conflicts)

### Files Requiring Migration
- `app/` folder → `src/screens/`
- `components/` → `src/components/`
- `constants/` → `src/styles/`
- `src/shared/hooks/` → `src/hooks/`
- Import paths throughout the codebase

### Preservation Strategy
- Keep existing `app/` folder as `app_deprecated/` during migration
- Preserve all design tokens in `constants/`
- Maintain existing TypeScript configuration where possible
- Keep existing build configurations (android/, ios/)

## Migration Steps Overview

1. **Snapshot & Analysis** ✓ (This document)
2. **Directory Scaffold** - Create new structure without conflicts
3. **Path Alias Consolidation** - Unify to @/* pattern
4. **Environment Configuration** - Add .env + react-native-config
5. **App Entry Migration** - Replace Expo Router with React Navigation
6. **Code Migration** - Move existing files to new structure
7. **Shrimp Integration Verification** - Ensure compatibility
8. **Quality Assurance** - Add scripts and validation

## Rollback Strategy
- Git commits for each step
- Keep deprecated folders until verification complete
- Document all breaking changes
- Provide step-by-step rollback instructions

---
Generated: $(date)
Last Updated: $(date)
