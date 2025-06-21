module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          orange: "var(--primary-orange)",
          "orange-light": "var(--primary-orange-light)",
          "orange-dark": "var(--primary-orange-dark)",
        },
        background: {
          "light-gray": "var(--bg-light-gray)",
          "medium-gray": "var(--bg-medium-gray)",
          "dark-gray": "var(--bg-dark-gray)",
          "light-blue": "var(--bg-light-blue)",
        },
        text: {
          "dark-gray": "var(--text-dark-gray)",
          "light-white": "var(--text-light-white)",
          "medium-gray": "var(--text-medium-gray)",
          "light-gray": "var(--text-light-gray)",
          "dark-black": "var(--text-dark-black)",
        },
        border: {
          light: "var(--border-light)",
          medium: "var(--border-medium)",
          "orange-light": "var(--border-orange-light)",
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        arial: ['Arial', 'sans-serif'],
        impact: ['Impact', 'sans-serif'],
        'avenir-next': ['Avenir Next', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};