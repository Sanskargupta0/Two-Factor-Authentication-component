# Two-Factor Authentication Component

A beautiful, responsive, and accessible Two-Factor Authentication (2FA) component built with SvelteKit and Tailwind CSS. Features smooth animations, comprehensive keyboard navigation, and production-ready security considerations.

## ✨ Features

### 🎨 **Visual Design**
- Modern, clean interface with smooth animations
- Responsive design that works on all devices
- Status-based color coding (default, success, error)
- Animated pulse waves for visual feedback
- Smooth digit drop animations
- Custom cursor animations with slide-up effect

### 🚀 **User Experience**
- **Keyboard Navigation**: Full arrow key, backspace, and tab support
- **Paste Support**: Ctrl+V and right-click paste functionality
- **Auto-advance**: Automatically moves to next field after input
- **Auto-submit**: Submits when all 6 digits are entered
- **Error Handling**: Visual feedback for invalid codes
- **Loading States**: Smooth loading animations during verification

### ♿ **Accessibility**
- Screen reader compatible
- High contrast mode support
- Keyboard-only navigation
- Focus management
- ARIA labels and descriptions
- Semantic HTML structure

### 🔧 **Developer Experience**
- TypeScript support ready
- Comprehensive API
- Customizable validation
- Event callbacks
- Easy integration
- Well-documented code

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Sanskargupta0/Two-Factor-Authentication-component.git
cd Two-Factor-Authentication-component
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 🚀 Usage

### Basic Implementation

```svelte
<script>
  import TwoFactorAuth from '$lib/components/TwoFactorAuth.svelte';
  
  let twoFactorRef;
  
  function handleSuccess(code) {
    console.log('2FA Success:', code);
    // Handle successful verification
  }
  
  function handleError(error) {
    console.log('2FA Error:', error);
    // Handle verification error
  }
</script>

<TwoFactorAuth 
  bind:this={twoFactorRef}
  correctCode="123456"
  on:success={handleSuccess}
  on:error={handleError}
/>
```

### Advanced Configuration

```svelte
<script>
  import TwoFactorAuth from '$lib/components/TwoFactorAuth.svelte';
  
  let twoFactorRef;
  
  // Custom verification function
  async function verifyCode(code) {
    try {
      const response = await fetch('/api/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Verification failed:', error);
      return false;
    }
  }
</script>

<TwoFactorAuth 
  bind:this={twoFactorRef}
  {verifyCode}
  placeholder="Enter authentication code"
  loadingText="Verifying..."
  successText="Welcome!"
  errorText="Invalid code. Please try again."
  autoSubmit={true}
  maxAttempts={3}
/>
```

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `correctCode` | `string` | `"123456"` | Expected authentication code (demo mode) |
| `verifyCode` | `function` | `null` | Custom verification function |
| `autoSubmit` | `boolean` | `true` | Auto-submit when all digits are filled |
| `placeholder` | `string` | `"Enter 6-digit code..."` | Status text placeholder |
| `loadingText` | `string` | `"Verifying..."` | Text shown during verification |
| `successText` | `string` | `"Success!"` | Text shown on successful verification |
| `errorText` | `string` | `"Invalid code"` | Text shown on verification failure |
| `maxAttempts` | `number` | `null` | Maximum verification attempts |
| `disabled` | `boolean` | `false` | Disable the component |

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `reset()` | None | Reset component to initial state |
| `setCorrectCode(code)` | `code: string` | Update the expected code (demo mode) |
| `focus()` | None | Focus the first input field |
| `clear()` | None | Clear all input fields |
| `setValue(code)` | `code: string` | Set the current code value |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `success` | `{ code: string }` | Fired on successful verification |
| `error` | `{ code: string, attempts: number }` | Fired on verification failure |
| `input` | `{ code: string, isComplete: boolean }` | Fired on each input change |
| `paste` | `{ code: string }` | Fired when code is pasted |
| `reset` | None | Fired when component is reset |

## 🎨 Customization

### Styling

The component uses Tailwind CSS and CSS custom properties for easy customization:

```css
/* Custom CSS variables */
:root {
  --2fa-primary-color: #007AFF;
  --2fa-success-color: #34C759;
  --2fa-error-color: #FF3B30;
  --2fa-background-color: #F0F7FF;
  --2fa-input-border: #D1D5DB;
  --2fa-input-size: 48px;
  --2fa-border-radius: 8px;
}
```

### Animation Timing

```css
/* Customize animation durations */
:root {
  --2fa-drop-duration: 300ms;
  --2fa-cursor-duration: 300ms;
  --2fa-pulse-duration: 2s;
  --2fa-shake-duration: 400ms;
}
```

### Responsive Breakpoints

```css
/* Mobile optimizations */
@media (max-width: 480px) {
  --2fa-input-size: 42px;
  --2fa-font-size: 24px;
  --2fa-gap: 8px;
}
```

## 🔒 Security Considerations

### Production Implementation

⚠️ **Important**: The demo code (`123456`) is for development only. In production:

1. **Server-side Verification**
```javascript
// ❌ Don't do this in production
correctCode="123456"

// ✅ Do this instead
verifyCode={async (code) => {
  const response = await fetch('/api/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, sessionId })
  });
  return response.ok;
}}
```

2. **Rate Limiting**
- Implement server-side rate limiting
- Use exponential backoff for failed attempts
- Consider temporary account lockouts

3. **Session Management**
- Use secure session tokens
- Implement proper CSRF protection
- Validate session state on server

4. **Code Generation**
- Use time-based codes (TOTP)
- Implement proper secret key management
- Support backup codes

### Best Practices

- Never store codes in client-side code
- Always validate on the server
- Use HTTPS in production
- Implement proper error handling
- Log security events for monitoring
- Consider biometric fallbacks

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Coverage

The component includes comprehensive tests for:

- ✅ User input validation
- ✅ Keyboard navigation
- ✅ Paste functionality
- ✅ Error handling
- ✅ Animation states
- ✅ Accessibility features
- ✅ Edge cases

### Manual Testing Checklist

#### Functionality
- [ ] Can enter digits 0-9
- [ ] Rejects non-numeric input
- [ ] Auto-advances between fields
- [ ] Backspace clears and moves back
- [ ] Arrow keys navigate correctly
- [ ] Paste works with Ctrl+V and right-click
- [ ] Auto-submits when complete
- [ ] Shows loading state during verification
- [ ] Displays success/error states

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Focus management is correct
- [ ] High contrast mode works
- [ ] Tab order is logical

#### Visual
- [ ] Animations are smooth
- [ ] Responsive on mobile
- [ ] Colors match design system
- [ ] Loading states are clear
- [ ] Error states are obvious

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| iOS Safari | 14+ | ✅ Fully supported |
| Android Chrome | 90+ | ✅ Fully supported |

### Feature Support

- **CSS Grid/Flexbox**: Required
- **CSS Custom Properties**: Required
- **Clipboard API**: Required for paste functionality
- **ES6+ Features**: Required

## 📱 Mobile Optimization

### Touch Targets
- Minimum 44px touch target size
- Optimized spacing for thumb navigation
- Responsive font sizes

### Virtual Keyboard
- Numeric input mode on mobile
- Prevents zooming on input focus
- Optimized for various keyboard layouts

### Performance
- Optimized animations for 60fps
- Minimal JavaScript bundle size
- Efficient DOM updates

## 🔧 Development

### Project Structure

```
src/
├── lib/
│   └── components/
│       └── TwoFactorAuth.svelte    # Main component
├── routes/
│   └── +page.svelte                # Demo page
├── app.css                         # Global styles
└── app.html                        # HTML template

tests/
├── unit/                           # Unit tests
├── integration/                    # Integration tests
└── e2e/                           # End-to-end tests
```

### Development Workflow

1. **Make changes** to component
2. **Test locally** with `npm run dev`
3. **Run tests** with `npm test`
4. **Check accessibility** with browser tools
5. **Test on multiple devices**
6. **Update documentation** if needed

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

## 📝 Changelog

### v1.0.0 (Latest)
- ✨ Initial release
- 🎨 Complete UI/UX implementation
- ♿ Full accessibility support
- 📱 Mobile optimization
- 🧪 Comprehensive test suite
- 📚 Complete documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Sanskar Gupta](https://github.com/Sanskargupta0)
