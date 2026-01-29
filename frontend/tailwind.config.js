/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Main Brand Colors
        brand: {
          light: '#EEF2FF', // Indigo-50
          DEFAULT: '#6366F1', // Indigo-500
          dark: '#4F46E5',    // Indigo-600
          accent: '#8B5CF6',  // Violet-500
        },
        
        // Semantic Status Colors
        success: '#10B981', // Emerald
        danger: '#EF4444',  // Red
        warning: '#F59E0B', // Amber
        info: '#3B82F6',    // Blue

        // Neutral Surface & Backgrounds
        surface: {
          50: '#F8FAFC',  // Slate-50 (App Background)
          100: '#F1F5F9', // Slate-100 (Sidebar/Card Background)
          200: '#E2E8F0', // Slate-200 (Borders)
          DEFAULT: '#FFFFFF',
        },

        // Text Hierarchy
        content: {
          primary: '#0F172A',   // Slate-900 (Headings)
          secondary: '#334155', // Slate-700 (Body)
          muted: '#64748B',     // Slate-500 (Small text)
          subtle: '#94A3B8',    // Slate-400 (Placeholders)
        },
      },
    },
  },
  plugins: [],
}