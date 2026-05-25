/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'mz-orange':    '#FF6A00',
        'mz-orange-600':'#E55F00',
        'mz-graphite':  '#1A1F24',
        'mz-cloud':     '#F5F6F7',
        'mz-ink':       '#1A1F24',
        'mz-ink-2':     '#4A5159',
        'mz-ink-3':     '#6E757D',
        'mz-border':    '#DADDE1',
        'mz-border-2':  '#E8EAED',
        'mz-success':   '#1F8A5B',
        'mz-warning':   '#C77700',
        'mz-danger':    '#C0392B',
      },
      fontFamily: {
        display: ['Satoshi', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'SF Pro', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
