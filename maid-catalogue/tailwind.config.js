module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: ["class", "class"],
  theme: {
  	extend: {
  		screens: {
  			'xxs': '400px',   // Small phones
  			'xs': '475px',    // Large phones
  			'2xl': '1536px',  // Large desktops
  			'3xl': '1920px',  // Ultra-wide displays
  		},
  		colors: {
  			primary: {
  				orange: 'var(--primary-orange)',
  				'orange-light': 'var(--primary-orange-light)',
  				'orange-dark': 'var(--primary-orange-dark)'
  			},
  			background: {
  				'light-gray': 'var(--bg-light-gray)',
  				'medium-gray': 'var(--bg-medium-gray)',
  				'dark-gray': 'var(--bg-dark-gray)',
  				'light-blue': 'var(--bg-light-blue)'
  			},
  			text: {
  				'dark-gray': 'var(--text-dark-gray)',
  				'light-white': 'var(--text-light-white)',
  				'medium-gray': 'var(--text-medium-gray)',
  				'light-gray': 'var(--text-light-gray)',
  				'dark-black': 'var(--text-dark-black)'
  			},
  			border: {
  				light: 'var(--border-light)',
  				medium: 'var(--border-medium)',
  				'orange-light': 'var(--border-orange-light)'
  			}
  		},
  		spacing: {
  			'safe-top': 'env(safe-area-inset-top)',
  			'safe-bottom': 'env(safe-area-inset-bottom)',
  			'safe-left': 'env(safe-area-inset-left)',
  			'safe-right': 'env(safe-area-inset-right)',
  			'header-sm': '4rem',      // 64px for mobile
  			'header-md': '5rem',      // 80px for tablet  
  			'header-lg': '6rem',      // 96px for desktop
  			'section-xs': '2rem',     // 32px
  			'section-sm': '3rem',     // 48px
  			'section-md': '4rem',     // 64px
  			'section-lg': '5rem',     // 80px
  			'section-xl': '6rem',     // 96px
  		},
  		fontSize: {
  			'hero-xs': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],  // 18px
  			'hero-sm': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],   // 20px
  			'hero-md': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }], // 30px
  			'hero-lg': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],   // 40px
  			'hero-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],   // 56px
  			'hero-2xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],     // 72px
  			'desc-xs': ['0.875rem', { lineHeight: '1.5' }],    // 14px
  			'desc-sm': ['1rem', { lineHeight: '1.6' }],        // 16px
  			'desc-md': ['1.125rem', { lineHeight: '1.6' }],    // 18px
  			'desc-lg': ['1.25rem', { lineHeight: '1.5' }],     // 20px
  			'desc-xl': ['1.375rem', { lineHeight: '1.5' }],    // 22px
  		},
  		fontFamily: {
  			inter: [
  				'Inter',
  				'sans-serif'
  			],
  			arial: [
  				'Arial',
  				'sans-serif'
  			],
  			impact: [
  				'Impact',
  				'sans-serif'
  			],
  			'avenir-next': [
  				'Avenir Next',
  				'sans-serif'
  			],
  			roboto: [
  				'Roboto',
  				'sans-serif'
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
};