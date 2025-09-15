// Maid Card Variations - Export all variations
export { default as MaidCardVariation1 } from './MaidCardVariation1';
export { default as MaidCardVariation2 } from './MaidCardVariation2';
export { default as MaidCardVariation3 } from './MaidCardVariation3';
export { default as MaidCardVariation4 } from './MaidCardVariation4';
export { default as MaidCardVariation5 } from './MaidCardVariation5';
export { default as MaidCardVariation6 } from './MaidCardVariation6';

// Variation metadata for the showcase
export const VARIATIONS_METADATA = [
  {
    id: 1,
    name: 'Compact Horizontal',
    component: 'MaidCardVariation1',
    description: 'Side-by-side layout with minimal space usage',
    features: ['Space efficient', 'High contrast', 'Quick overview'],
    bestFor: 'Dense listings, mobile views',
    accessibility: 'WCAG AA compliant with keyboard navigation'
  },
  {
    id: 2,
    name: 'Vertical Photo-Emphasis',
    component: 'MaidCardVariation2',
    description: 'Large image focus with detailed content below',
    features: ['Visual first', 'Rich information', 'Modern design'],
    bestFor: 'Portfolio display, detailed browsing',
    accessibility: 'Screen reader optimized with semantic structure'
  },
  {
    id: 3,
    name: 'Information Grid',
    component: 'MaidCardVariation3',
    description: 'Comprehensive data display in organized grid',
    features: ['Data dense', 'Organized layout', 'Complete profile'],
    bestFor: 'Detailed comparison, data analysis',
    accessibility: 'Structured markup with ARIA labels'
  },
  {
    id: 4,
    name: 'Minimal List Item',
    component: 'MaidCardVariation4',
    description: 'Clean list format for scanning and browsing',
    features: ['Text focused', 'Scannable', 'Compact actions'],
    bestFor: 'Quick scanning, search results',
    accessibility: 'High readability with clear hierarchy'
  },
  {
    id: 5,
    name: 'Professional Profile Card',
    component: 'MaidCardVariation5',
    description: 'LinkedIn-style professional presentation with large avatar and credential focus',
    features: ['Professional scoring', 'Verification badges', 'Credential display'],
    bestFor: 'Professional matching, trust building',
    accessibility: 'WCAG 2.1 AA compliant with semantic structure'
  },
  {
    id: 6,
    name: 'Interactive Hover Detail Card',
    component: 'MaidCardVariation6',
    description: 'Compact card with rich hover overlay for detailed information disclosure',
    features: ['Progressive disclosure', 'Hover interactions', 'Touch-friendly mobile'],
    bestFor: 'Dense browsing with quick details access',
    accessibility: 'Focus-triggered hover for keyboard users'
  }
];