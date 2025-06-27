# Color System Guide

## Overview
We use a centralized color system to maintain consistency across the application. Colors are defined in three places for different use cases:

## 1. Tailwind CSS Classes (Recommended)
Use these in your component classes:

```jsx
// Background colors
<div className="bg-palette-night">      // Primary dark background
<div className="bg-palette-bistre">    // Secondary backgrounds
<div className="bg-palette-olive">     // Accent backgrounds

// Text colors
<p className="text-palette-garnet">     // Highlighted text
<p className="text-palette-beaver">     // Secondary text
<p className="text-palette-olive">      // Subtle text

// Border colors
<div className="border-palette-olive">   // Default borders
<div className="hover:border-palette-garnet"> // Hover state

// Example usage
<button className="bg-palette-bistre hover:bg-palette-olive border border-palette-garnet text-palette-garnet">
  Click me
</button>
```

## 2. CSS Custom Properties
Use these in custom CSS or when Tailwind classes aren't available:

```css
.custom-element {
  background-color: var(--color-earth-dark);
  color: var(--text-highlight);
  border-color: var(--border-default);
}
```

## 3. JavaScript Constants
Import and use when you need colors in JavaScript:

```jsx
import { COLORS, THEME_COLORS } from '../constants/colors';

// Direct color access
const bgColor = COLORS.earth.dark;

// Semantic access
const textColor = THEME_COLORS.text.highlight;

// For gradients in SVGs or Canvas
const gradient = THEME_COLORS.gradients.wave1;
```

## Color Palette Reference

| Color Name | Hex Value | Tailwind Class | CSS Variable | Usage |
|------------|-----------|----------------|--------------|--------|
| Night | #171614 | `palette-night` | `--color-palette-night` | Primary backgrounds |
| Bistre | #3A2618 | `palette-bistre` | `--color-palette-bistre` | Secondary backgrounds, buttons |
| Black Olive | #37423D | `palette-olive` | `--color-palette-olive` | Borders, alternative backgrounds |
| Beaver | #9A8873 | `palette-beaver` | `--color-palette-beaver` | Body text, secondary elements |
| Garnet | #754043 | `palette-garnet` | `--color-palette-garnet` | Headings, CTAs, highlights |

## Migration Examples

### Before:
```jsx
<div className="bg-[#171614] text-[#754043] border-[#37423D]">
```

### After:
```jsx
<div className="bg-palette-night text-palette-garnet border-palette-olive">
```

## Benefits
- **Consistency**: All colors defined in one place
- **Maintainability**: Easy to update colors globally
- **IntelliSense**: Tailwind classes provide autocomplete
- **Type Safety**: JavaScript constants can be typed
- **Flexibility**: Multiple ways to access colors based on context 