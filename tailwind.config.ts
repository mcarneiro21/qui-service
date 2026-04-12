import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#b5161e',
        primary_dim: '#941218',
        primary_container: '#ff766d',
        surface: '#f6f6f6',
        surface_container_low: '#f0f1f1',
        surface_container: '#e8e9e9',
        surface_container_high: '#e2e3e3',
        surface_container_highest: '#dbdddd',
        surface_container_lowest: '#ffffff',
        on_surface: '#2d2f2f',
        on_surface_variant: '#5a5c5c',
        on_primary: '#ffffff',
        secondary: '#c8930a',
        secondary_container: '#f5c842',
        on_secondary_container: '#2d2000',
        outline_variant: '#c4c6c6',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
      },
      backdropBlur: {
        glass: '20px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #b5161e 0%, #ff766d 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
