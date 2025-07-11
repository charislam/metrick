# LLM Evaluation Frontend App

A React application for evaluating LLM responses with comprehensive dark mode support.

## Features

- **Dark Mode Support**: Full dark mode implementation with system preference detection
- **Theme Persistence**: User theme preferences are saved to localStorage
- **Flash Prevention**: No flash of unstyled content (FOUC) during theme switching
- **System Integration**: Automatically syncs with user's system color scheme preference

## Dark Mode Features

### Theme Options
- **Light**: Always use light theme
- **Dark**: Always use dark theme  
- **System**: Automatically follow system preference

### How to Use
1. **Theme Toggle**: Located in the top-right corner of the navigation bar
2. **Settings Page**: View current theme status in the Settings section
3. **Automatic Detection**: The app automatically detects and applies your system's color scheme preference

### Technical Implementation
- **CSS Variables**: Uses CSS custom properties for seamless theme switching
- **Tailwind CSS**: Leverages Tailwind's dark mode utilities
- **Local Storage**: Theme preferences persist across browser sessions
- **System Media Queries**: Real-time system preference detection

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Theme Architecture

The dark mode implementation includes:

1. **Flash Prevention Script**: Inline script in `index.html` prevents FOUC
2. **Theme Utilities**: Core theme logic in `src/lib/theme.ts`
3. **Theme Toggle Component**: UI component for theme switching
4. **CSS Variables**: Comprehensive color system in `src/app.css`

### Color System
The app uses a comprehensive color system with CSS variables that automatically adapt to light/dark themes:

- `--background` / `--foreground`: Main background and text colors
- `--card` / `--card-foreground`: Card component colors
- `--primary` / `--primary-foreground`: Primary action colors
- `--secondary` / `--secondary-foreground`: Secondary action colors
- `--muted` / `--muted-foreground`: Muted text and background colors
- `--border` / `--input`: Border and input field colors

All colors are defined in OKLCH color space for better perceptual uniformity across themes.