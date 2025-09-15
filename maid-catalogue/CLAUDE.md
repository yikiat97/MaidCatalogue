# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based maid agency catalogue application built with Vite. It provides a platform for browsing domestic helper profiles with features for both users and administrators.

## Key Commands

### Development
```bash
npm run dev              # Start development server
npm run build           # Build for production  
npm run build:prod      # Build with production environment
npm run preview         # Preview production build
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run lint:fix        # Run ESLint with auto-fix
npm run type-check      # Run TypeScript type checking
```

### Video Optimization
```bash
chmod +x ./scripts/optimize-videos.sh    # Make script executable
./scripts/optimize-videos.sh             # Run video optimization (requires ffmpeg)
```

## Architecture Overview

### Tech Stack
- **Frontend Framework**: React 19.1.0 with Vite 6.3.5
- **Routing**: React Router DOM v7
- **UI Libraries**: Material-UI v7, Chakra UI v3, Lucide React icons
- **Styling**: Tailwind CSS v3.4.17 with custom color variables
- **Animation**: Framer Motion v12

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Catalogue/       # Catalogue-specific components (FilterBar, MaidCard, NavBar)
│   ├── admin/           # Admin interface components (modals, forms, image upload)
│   ├── common/          # Shared components (Header, Footer, HeroSection)
│   │   ├── OptimizedVideo.jsx      # Performance-optimized video component
│   │   └── PhoneFramedVideo.jsx    # Mobile-style video component
│   └── ui/              # Base UI components (Button, Card, Accordion)
├── pages/              # Route components
│   ├── Home/           # Landing page sections
│   │   └── VideoSection.jsx        # Hero video section with optimizations
│   ├── Catalogue/      # Catalogue pages (listing, details, recommendations)
│   └── admin/          # Admin management pages
├── hooks/              # Custom React hooks
│   └── useOptimizedVideo.js        # Video optimization hook
├── utils/              # Utility functions
│   ├── generatePosterPlaceholders.js  # Poster image generation
│   └── videoPerformance.js           # Performance monitoring
├── config/             # Configuration files
│   ├── api.js          # API endpoints and utilities
│   └── environments.js # Environment-specific settings
├── context/            # React context providers
└── scripts/            # Utility scripts
    └── optimize-videos.sh          # Video compression script
```

### Authentication System
- User authentication with protected routes
- Separate admin access at `/system-access` endpoint
- Authentication bypass currently hardcoded to `true` in App.jsx:19

### API Configuration
- Centralized API configuration in `src/config/api.js`
- Environment-based API URLs (dev: localhost:3000, prod: yikiat.com)
- Structured endpoint organization for auth, admin, catalogue, and user operations

### Key Features
- **User Features**: Maid catalogue browsing, favorites, recommendations, detailed popup views
- **Admin Features**: Maid management, user management, link generation, S3 image uploads
- **Image Upload**: S3 integration with drag-and-drop interface
- **Interactive Elements**: Quick-view popups with maid details and direct contact options

## Environment Configuration

The app uses environment-based configuration:
- **Development**: `http://localhost:3000`
- **Production/Staging**: `https://yikiat.com`
- Environment determined by `VITE_NODE_ENV` variable

## Custom Styling System

Tailwind is extended with CSS custom properties for theming:
- Primary colors: Orange variants (`--primary-orange`, etc.)
- Background colors: Gray and blue variants
- Text colors: Various gray scales and contrast options
- Border colors: Light, medium, and orange variants

## Image Upload System

The application includes a sophisticated S3 image upload system:
- Drag & drop interface with image preview
- File validation (type, size limits)
- Automatic S3 upload through backend API
- Used in `AddMaidModal` and `EditMaidModal` components

## Component Patterns

### Modal Components
- Consistent modal structure across admin components
- Form validation and submission patterns
- Image upload integration in create/edit flows

### Context Usage
- `MaidContext` provides global state for maid data
- Use `useMaidContext()` hook to access maid list state

### Routing Patterns
- Protected routes with authentication checks
- Admin routes separate from user routes
- Dynamic routes for maid details (`/maid/:id`)
- Modal-based interactions for quick previews without navigation

## Video Optimization System 🎥

### Overview
The application implements a comprehensive video optimization system designed to improve loading performance, reduce bandwidth usage, and enhance user experience across different devices and network conditions.

### Key Components

#### 1. OptimizedVideo Component (`src/components/common/OptimizedVideo.jsx`)
A high-performance video component with advanced optimization features:

**Features:**
- **Progressive Loading**: Videos load only when visible using Intersection Observer
- **Format Fallbacks**: Supports multiple video formats (WebM, MP4, MOV) with automatic fallback
- **Error Handling**: Graceful error handling with retry functionality
- **Loading States**: Visual feedback during video loading with skeleton states
- **Custom Controls**: Optimized play/pause and mute controls
- **Performance Monitoring**: Built-in performance tracking and metrics
- **Accessibility**: Full ARIA support and keyboard navigation

**Usage:**
```jsx
<OptimizedVideo
  sources={[
    { src: '/video.webm', type: 'video/webm' },
    { src: '/video.mp4', type: 'video/mp4' }
  ]}
  poster="/poster.jpg"
  autoplay={true}
  muted={true}
  videoId="unique-video-id"
  showControls={true}
  intersectionThreshold={0.3}
/>
```

#### 2. PhoneFramedVideo Component (`src/components/common/PhoneFramedVideo.jsx`)
Specialized component for mobile-style video presentation used in the About page:

**Features:**
- Realistic phone frame design with shadows
- Inherits all OptimizedVideo optimizations
- Responsive design for different screen sizes
- Custom styling for mobile mockup presentation

#### 3. useOptimizedVideo Hook (`src/hooks/useOptimizedVideo.js`)
Custom React hook that handles video optimization logic:

**Capabilities:**
- Intersection Observer for lazy loading
- Performance monitoring integration
- State management for loading, playing, muted states
- Error handling with automatic retries
- Browser compatibility detection

#### 4. Performance Monitoring (`src/utils/videoPerformance.js`)
Comprehensive performance tracking system:

**Metrics Tracked:**
- Video load times
- Metadata load times
- Buffer progression
- Error occurrences
- Bandwidth estimation
- Core Web Vitals impact

**Usage:**
```javascript
// Access performance reports
videoPerformanceMonitor.getDebugSummary();
videoPerformanceMonitor.getAllReports();
```

### Video File Structure

#### Current Video Assets
- `rawvideo.MOV` (53MB) - Home page hero video
- `aboutfounder.mov` (52MB) - About founder video
- `historyofEH.mov` (60MB) - Company history video

#### Optimized Format Strategy
```
For each video:
├── video.mp4          # H.264 encoded, broad compatibility
├── video.webm         # VP9 encoded, better compression
├── video.mov          # Original format (fallback)
└── video-poster.jpg   # Thumbnail image
```

### Performance Optimizations Implemented

#### 1. Progressive Loading
- Videos only load when entering viewport
- Configurable intersection thresholds
- Prevents unnecessary bandwidth usage
- Improves initial page load times

#### 2. Format Optimization
- Multiple format support (WebM, MP4, MOV)
- Browser-specific format selection
- Automatic fallback chains
- Compression settings optimized for web

#### 3. Lazy Loading Strategy
```javascript
// Video loads based on visibility
intersectionThreshold: 0.3  // Load when 30% visible
preload: "none"            // Don't preload until needed
```

#### 4. Error Recovery
- Automatic retry mechanism (max 3 attempts)
- Graceful degradation for unsupported formats
- User-friendly error messages
- Format fallback on load failures

#### 5. Performance Monitoring
- Real-time load time tracking
- Bandwidth estimation
- Error logging and analytics
- Performance recommendations

### Video Optimization Script

#### Location: `scripts/optimize-videos.sh`
Automated video compression and format conversion script:

**Features:**
- Converts MOV to optimized MP4 and WebM formats
- Reduces file sizes by 70-80% while maintaining quality
- Generates poster images from video frames
- Creates backup copies of original files
- Provides detailed compression statistics

**Usage:**
```bash
# Make script executable
chmod +x ./scripts/optimize-videos.sh

# Run optimization (requires ffmpeg)
./scripts/optimize-videos.sh
```

**Output:**
- Compressed MP4 files (H.264, web-optimized)
- WebM files (VP9, better compression)
- Poster images (JPEG thumbnails)
- Original files backed up

### Implementation Details

#### Video Source Configuration
```javascript
// Format priority order for optimal compatibility
const videoSources = [
  { src: '/assets/video.webm', type: 'video/webm' },  // Best compression
  { src: '/assets/video.mp4', type: 'video/mp4' },    // Broad compatibility  
  { src: '/assets/video.mov', type: 'video/quicktime' } // Fallback
];
```

#### Performance Monitoring Integration
```javascript
// Videos are automatically monitored
const video = useOptimizedVideo({
  videoId: 'unique-identifier',
  intersectionThreshold: 0.3,
  autoplay: true,
  muted: true
});

// Access performance data
videoPerformanceMonitor.getPerformanceReport('unique-identifier');
```

### Browser Compatibility

#### Supported Formats by Browser:
- **Chrome/Edge**: WebM (VP9), MP4 (H.264)
- **Firefox**: WebM (VP9), MP4 (H.264) 
- **Safari**: MP4 (H.264), MOV
- **Mobile**: MP4 (H.264) recommended

#### Fallback Strategy:
1. Try WebM (best compression)
2. Fall back to MP4 (universal support)
3. Fall back to original MOV (last resort)
4. Show error message if all fail

### Performance Benefits

#### Expected Improvements:
- **70-80% file size reduction** (180MB → ~40MB total)
- **Faster page load times** (progressive loading)
- **Reduced bandwidth usage** (format optimization)
- **Better mobile performance** (lazy loading)
- **Improved Core Web Vitals** (LCP, CLS improvements)

#### Metrics Tracking:
- Load time monitoring
- Error rate tracking
- Bandwidth usage analysis
- User engagement metrics

### Accessibility Features

#### Built-in Accessibility:
- Full ARIA label support
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion respect
- High contrast support

#### Implementation:
```jsx
<OptimizedVideo
  aria-label="Professional service demonstration video"
  showControls={true}
  // Automatic keyboard event handling
  // Screen reader announcements
/>
```

### Development Notes

#### Adding New Videos:
1. Place original video in `public/assets/`
2. Run optimization script to generate formats
3. Update component with new sources array
4. Include poster image for better UX
5. Set appropriate videoId for monitoring

#### Performance Testing:
```javascript
// Debug performance in browser console
videoPerformanceMonitor.getDebugSummary();

// Monitor specific video
videoPerformanceMonitor.getPerformanceReport('video-id');
```

#### Custom Poster Generation:
```javascript
// Generate placeholder posters
import { generateAllPosters } from './src/utils/generatePosterPlaceholders';
generateAllPosters(); // Downloads poster images
```

## New Features

### Maid Details Popup (MaidDetailsPopup.jsx)

A comprehensive quick-view modal that displays essential maid information without navigating away from the catalogue page.

**Key Features:**
- **Responsive Design**: Full-screen on mobile, dialog on desktop
- **Authentication-Aware**: Blurs sensitive content for unauthenticated users
- **Rich Information Display**: Personal details, skills, languages, work preferences
- **Direct Actions**: WhatsApp contact and full profile navigation
- **Image Protection**: Secure image handling with blur protection
- **Performance Optimized**: Lazy loading and efficient rendering

**Implementation Details:**
- **Component**: `src/components/Catalogue/MaidDetailsPopup.jsx`
- **Integration**: Seamlessly integrated with existing `MaidCard.jsx` components
- **Props**:
  - `open`: Boolean to control modal visibility
  - `onClose`: Function to handle modal close
  - `maid`: Maid data object
  - `isAuthenticated`: Authentication status

**Usage Pattern:**
```jsx
const [showDetailsPopup, setShowDetailsPopup] = useState(false);

// In MaidCard component
<Button onClick={() => setShowDetailsPopup(true)}>
  View Details
</Button>

<MaidDetailsPopup
  open={showDetailsPopup}
  onClose={() => setShowDetailsPopup(false)}
  maid={maid}
  isAuthenticated={isAuthenticated}
/>
```

**Design Consistency:**
- Follows existing brand color scheme and typography
- Uses Material-UI components for consistency
- Maintains responsive design patterns
- Implements same authentication blur logic as existing components

## Development Notes

### Port Configuration
- Development server runs on default Vite port (typically 5173)
- Backend API expected on port 3000

### Code Style
- ESLint configuration with React hooks and refresh plugins
- JSX components use modern React patterns (hooks, functional components)
- Tailwind for styling with custom theme extensions

### State Management
- React Context for global state (maid data)
- Component-level state for UI interactions
- No external state management library (Redux, Zustand)

## Admin System Security

The admin interface uses security through obscurity:
- Admin login at non-obvious `/system-access` URL
- Separate admin components and styling
- Different visual design to avoid detection from main site

## Video Optimization Best Practices

### When Adding New Videos:
1. **Always run the optimization script** before deploying
2. **Include multiple format sources** for browser compatibility
3. **Set appropriate poster images** for better perceived performance
4. **Use unique videoId** for each video for monitoring
5. **Test on different devices** and network conditions

### Performance Monitoring:
- Check browser console for performance reports
- Monitor video load times in production
- Track error rates and user engagement
- Use performance data to optimize thresholds

### Troubleshooting:
- If videos don't load, check format compatibility
- Verify poster images exist for better UX
- Check network conditions affect loading
- Use retry functionality for transient failures

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

      
      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.