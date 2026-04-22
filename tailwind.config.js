/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        foreground: '#0f172a',
        card: '#ffffff',
        muted: '#f1f5f9',
        'muted-foreground': '#64748b',
        border: '#e2e8f0',
        primary: '#6366f1',
        'primary-foreground': '#eef2ff',
        secondary: '#e0e7ff',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#f43f5e',
      },
      boxShadow: {
        card: '0 12px 30px rgba(15, 23, 42, 0.08)',
        soft: '0 8px 18px rgba(99, 102, 241, 0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
