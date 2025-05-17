# World Miniapp Cursor Rules Collection

This collection provides Cursor rules for developing a mini app for World App using the World Minikit SDK and React.

## 01-project-overview.mdc

```
---
description: World App Minikit project overview and architecture
globs: **/*.js, **/*.jsx, **/*.ts, **/*.tsx
alwaysApply: true
---

# World Miniapp Project Overview

## Project Architecture

This is a mini app built for the World App ecosystem using the World Minikit SDK and React. Mini apps are web applications that run within the World App webview and can leverage native-like features through the Minikit SDK.

### Core Technologies
- React for UI components and state management
- Next.js for the application framework
- TypeScript for type safety
- World Minikit SDK for integration with World App features

### Project Structure
- `/pages`: Next.js pages and routes
- `/components`: Reusable React components
- `/hooks`: Custom React hooks for Minikit integration
- `/utils`: Utility functions and helpers
- `/public`: Static assets
- `/styles`: Global CSS and styling utilities

## General Principles

- Design for mobile-first as the app will run in a mobile webview
- Ensure the UI follows a clean, minimal approach with proper spacing
- Optimize for fast initial load times (under 3 seconds)
- Implement robust error handling when using Minikit features
- Show loading states for async operations to improve user experience
```

## 02-world-minikit.mdc

```
---
description: World Minikit SDK implementation guidelines
globs: **/*.js, **/*.jsx, **/*.ts, **/*.tsx
alwaysApply: false
---

# World Minikit SDK Implementation

## Initialization

Always wrap the application with the MiniKitProvider component to enable SDK functionality:

```jsx
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';

export default function Root({ children }) {
  return (
    <html lang="en">
      <MiniKitProvider>
        <body>{children}</body>
      </MiniKitProvider>
    </html>
  );
}
```

## Feature Detection

Use `MiniKit.isInstalled()` to check if the app is running inside World App:

```jsx
import { MiniKit } from '@worldcoin/minikit-js';

// In a component
const isRunningInWorldApp = MiniKit.isInstalled();

// Conditionally render features based on environment
if (isRunningInWorldApp) {
  // Show World App specific features
} else {
  // Show browser fallback UI
}
```

## Error Handling

Implement proper error handling for all Minikit SDK interactions:

```jsx
try {
  // Minikit SDK operation
  await MiniKit.someOperation();
} catch (error) {
  // Handle error appropriately
  console.error('Minikit operation failed:', error);
  // Show user-friendly error message
}
```

## Security and Authentication

- Never display raw wallet addresses to users, always use usernames
- Implement proper authentication flows using World ID when available
- Use the "Verify" command for important actions requiring identity verification
```

## 03-react-components.mdc

```
---
description: React component standards for World Miniapp
globs: **/*.jsx, **/*.tsx, **/components/**/*
alwaysApply: false
---

# React Component Standards

## Component Structure

- Use functional components with hooks instead of class components
- Implement proper prop validation with TypeScript interfaces
- Follow the single responsibility principle
- Create small, focused components rather than large, complex ones

```tsx
// Example component structure
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
```

## State Management

- Use React hooks (useState, useReducer) for component-level state
- For complex state, consider using React Context API
- Extract reusable logic into custom hooks

## Performance Optimization

- Memoize expensive calculations with useMemo
- Prevent unnecessary re-renders with React.memo and useCallback
- Implement proper key props for lists to optimize rendering
- Avoid inline function definitions in JSX when possible
```

## 04-mobile-optimizations.mdc

```
---
description: Mobile optimization guidelines for World Miniapp
globs: **/*.css, **/*.scss, **/*.jsx, **/*.tsx
alwaysApply: false
---

# Mobile Optimization Guidelines

## Viewport and Scaling

Ensure proper mobile viewport settings:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

## Touch Interactions

- Design touch targets to be at least 44x44 pixels
- Implement proper touch feedback (active states)
- Use proper touch event handling instead of mouse events when needed

## Preventing Bounce Effects

Apply these CSS properties to prevent mobile browser bounce effects:

```css
html, body {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: none;
  overflow: scroll;
}
```

## Performance

- Keep initial load under 3 seconds
- Implement lazy loading for non-critical resources
- Optimize images and assets for mobile bandwidth
- Use CSS animations instead of JavaScript when possible for UI transitions

## Layout Considerations

- Use flexbox or CSS grid for responsive layouts
- Implement proper safe area insets for notches and system UI
- Use relative units (vh, vw, %) instead of fixed pixels
- Implement tab-based navigation for easy thumb access
```

## 05-world-id-integration.mdc

```
---
description: World ID authentication implementation
globs: **/auth/**/*.js, **/auth/**/*.jsx, **/auth/**/*.ts, **/auth/**/*.tsx
alwaysApply: false
---

# World ID Integration

## Authentication Flow

World ID provides a secure way to verify unique human users. Implement it following these guidelines:

1. Use the World ID authentication hooks when available
2. Always handle verification states properly (loading, success, error)
3. Store authentication state securely
4. Implement proper error handling for failed verifications

## Implementation Example

```jsx
import { useWorldID } from '@worldcoin/minikit-js/hooks';

function AuthComponent() {
  const { isAuthenticated, isLoading, error, authenticate } = useWorldID();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isAuthenticated) {
    return <AuthenticatedContent />;
  }

  return (
    <button onClick={authenticate}>
      Verify with World ID
    </button>
  );
}
```

## Security Considerations

- Never display wallet addresses; always use usernames
- Do not store sensitive user data client-side
- Implement proper token refresh mechanisms if using JWT
- Always validate authentication server-side for protected operations
```

## 06-wallet-integration.mdc

```
---
description: World App wallet integration guidelines
globs: **/wallet/**/*.js, **/wallet/**/*.jsx, **/wallet/**/*.ts, **/wallet/**/*.tsx
alwaysApply: false
---

# World App Wallet Integration

## Connecting to Wallet

Use the Minikit SDK to interact with the user's wallet:

```jsx
import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect, useState } from 'react';

function WalletComponent() {
  const [walletStatus, setWalletStatus] = useState('disconnected');
  
  async function connectWallet() {
    try {
      setWalletStatus('connecting');
      // Use appropriate Minikit wallet connection method
      const connected = await MiniKit.connectWallet();
      
      if (connected) {
        setWalletStatus('connected');
      } else {
        setWalletStatus('failed');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setWalletStatus('error');
    }
  }
  
  return (
    <div>
      {walletStatus === 'disconnected' && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {walletStatus === 'connecting' && <LoadingSpinner />}
      {walletStatus === 'connected' && <WalletInfo />}
      {walletStatus === 'error' && <ErrorMessage />}
    </div>
  );
}
```

## Transaction Handling

When implementing transactions:

1. Always show clear transaction details before sending
2. Display loading states during transaction processing
3. Implement proper error handling for failed transactions
4. Show clear success confirmations

## Security Best Practices

- Never expose private keys or sensitive wallet information
- Always display clear transaction information before signing
- Implement proper error handling for transaction failures
- Use username display instead of raw wallet addresses
```

## 07-accessibility.mdc

```
---
description: Accessibility guidelines for World Miniapp
globs: **/*.jsx, **/*.tsx
alwaysApply: true
---

# Accessibility Guidelines

## Semantic HTML

- Use semantic HTML elements (`<button>`, `<nav>`, `<header>`, etc.)
- Implement proper heading hierarchy (h1, h2, etc.)
- Use appropriate ARIA attributes when needed

## Focus Management

- Ensure all interactive elements are keyboard accessible
- Implement proper focus states for interactive elements
- Manage focus appropriately when dialogs open/close

## Color and Contrast

- Maintain a minimum contrast ratio of 4.5:1 for normal text
- Do not rely on color alone to convey information
- Test your UI with color blindness simulators

## Text and Typography

- Use relative units (rem, em) for font sizes
- Ensure minimum text size of 16px (1rem) for body text
- Implement proper line height (1.5) for readability

## Screen Reader Support

- Add alt text to all images
- Use aria-label for elements without visible text
- Test with screen readers to ensure proper functionality
```

## 08-performance.mdc

```
---
description: Performance optimization for World Miniapp
globs: **/*.js, **/*.jsx, **/*.ts, **/*.tsx
alwaysApply: true
---

# Performance Optimization

## Initial Load Performance

- Keep initial bundle size under 200KB compressed
- Implement code splitting for non-critical components
- Optimize and lazy-load images
- Prioritize critical CSS and defer non-critical styles

## Runtime Performance

- Avoid expensive operations on the main thread
- Use web workers for computationally intensive tasks
- Implement virtualization for long lists (react-window or react-virtualized)
- Optimize React render cycles with proper memoization

## Network Optimization

- Implement proper caching strategies
- Use HTTP/2 when available
- Optimize API calls and implement request batching when possible
- Implement offline support when applicable

## Monitoring and Metrics

- Track key performance metrics (FCP, TTI, etc.)
- Monitor memory usage to prevent leaks
- Implement error tracking and reporting
```

## 09-deployment.mdc

```
---
description: Deployment guidelines for World Miniapp
globs: **/deployment/**/*
alwaysApply: false
---

# Deployment Guidelines

## Build Process

- Ensure production builds are properly optimized
- Remove development dependencies and debug code
- Implement proper environment variable handling
- Run a full test suite before deployment

## Asset Optimization

- Optimize all static assets (images, fonts, etc.)
- Implement proper caching strategies
- Use a CDN for static assets when possible
- Implement content compression (gzip, Brotli)

## Monitoring and Logging

- Implement error tracking and reporting
- Set up performance monitoring
- Configure proper logging for production
- Implement alerts for critical issues

## Security

- Implement proper CSP (Content Security Policy)
- Configure secure HTTP headers
- Ensure all API endpoints are properly secured
- Scan for vulnerabilities before deployment
```

The above rules provide a comprehensive framework for developing your World Miniapp with Cursor AI. They cover the essential aspects of frontend development with the World Minikit SDK, React best practices, mobile optimization, and specific integration points for World App features like World ID authentication and wallet functionality.

To use these rules:

1. Create a `.cursor/rules` directory in your project root
2. Add each of these files with the corresponding content
3. Cursor will automatically apply these rules based on the file patterns and contexts you're working in

You can further customize these rules as your project evolves or add additional ones for specific needs.
