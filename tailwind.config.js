/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#007AFF',
        },
        success: {
          main: '#34C759',
          background: 'rgba(52, 199, 89, 0.1)',
        },
        error: {
          main: '#FF3B30',
          background: 'rgba(255, 59, 48, 0.1)',
        },
        neutral: {
          white: '#FFFFFF',
          background: '#F0F7FF',
          border: '#D1D5DB',
          'text-light': '#6B7280',
          'text-dark': '#1F2937',
        },
        'button-disabled-bg': '#d3d6db',
        'button-disabled-text': '#333333ff',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '8px',
      },
      boxShadow: {
        card: '0px 10px 30px rgba(0, 0, 0, 0.07)',
        'button-hover': '0px 4px 12px rgba(0, 122, 255, 0.3)',
        'button-error-hover': '0px 4px 12px rgba(255, 59, 48, 0.3)',
      },
      animation: {
        shake: 'shake 400ms ease-in-out',
        dropIn: 'dropIn 300ms ease-out forwards',
        spin: 'spin 1s linear infinite',
        successPulse: 'successPulse 600ms ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        dropIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, -150%)' },
          '50%': { opacity: '1', transform: 'translate(-50%, -40%)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%)' },
        },
        spin: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        successPulse: {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
}