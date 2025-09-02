# Admin Dashboard Components

This directory contains reusable dashboard components for the admin panel, built with shadcn/ui patterns and modern React practices.

## Components

### StatsCard
A flexible statistics card component that displays key metrics with optional trend indicators.

**Props:**
- `title` (string): Card title
- `value` (string|number): Main value to display
- `subtitle` (string): Optional subtitle text
- `icon` (Component): Lucide React icon component
- `trend` ('up'|'down'): Optional trend direction
- `trendValue` (string|number): Trend percentage
- `color` (string): Primary color (default: '#ff914d')
- `onClick` (function): Click handler for navigation
- `loading` (boolean): Show loading skeleton

**Usage:**
```jsx
<StatsCard
  title="Total Maids"
  value={125}
  subtitle="45 available • 80 employed"
  icon={Users}
  trend="up"
  trendValue="12"
  onClick={() => navigate('/admin')}
/>
```

### QuickActionCard
A compact action card for quick navigation to key admin functions.

**Props:**
- `title` (string): Action title
- `description` (string): Action description
- `icon` (Component): Lucide React icon component
- `onClick` (function): Click handler
- `color` (string): Primary color (default: '#ff914d')
- `loading` (boolean): Show loading skeleton

**Usage:**
```jsx
<QuickActionCard
  title="Add New Maid"
  description="Register a new maid profile"
  icon={Plus}
  onClick={() => navigate('/admin')}
/>
```

### ActivityCard
Displays a list of recent system activities with timestamps and icons.

**Props:**
- `title` (string): Card title (default: "Recent Activity")
- `activities` (array): Array of activity objects
- `loading` (boolean): Show loading skeleton
- `color` (string): Primary color (default: '#ff914d')

**Activity Object Structure:**
```javascript
{
  type: 'maid_added', // Activity type
  count: 5,           // Number of items
  timeframe: 'today', // When it occurred
  trending: 12        // Optional trend percentage
}
```

**Usage:**
```jsx
<ActivityCard
  title="Recent Activity"
  activities={recentActivities}
  loading={false}
/>
```

## Features

- **Responsive Design**: All components adapt to mobile and desktop screens
- **Loading States**: Built-in skeleton loading animations
- **Consistent Styling**: Matches existing admin theme colors and typography
- **Accessible**: Proper ARIA attributes and keyboard navigation support
- **Click Interactions**: Hover effects and smooth transitions
- **Icon Integration**: Works seamlessly with Lucide React icons

## Design System

The components follow the established admin design system:

- **Colors**: Orange primary theme (#ff914d), complementary colors for different metrics
- **Typography**: Consistent font weights and sizes
- **Spacing**: Uses Tailwind spacing scale
- **Shadows**: Subtle elevation with hover effects
- **Borders**: Light gray borders with hover states

## Integration

These components are designed to work with:

- **Data Hooks**: Custom hooks for fetching dashboard metrics
- **Routing**: React Router for navigation
- **State Management**: React context and local state
- **API Integration**: Existing API configuration patterns

## Customization

All components accept custom colors and can be themed to match different sections:

```jsx
// Different color schemes for different metric types
<StatsCard color="#27ae60" /> {/* Success green */}
<StatsCard color="#f39c12" /> {/* Warning orange */}
<StatsCard color="#6366f1" /> {/* Info purple */}
```