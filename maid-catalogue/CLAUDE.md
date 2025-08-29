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
│   └── ui/              # Base UI components (Button, Card, Accordion)
├── pages/              # Route components
│   ├── Home/           # Landing page sections
│   ├── Catalogue/      # Catalogue pages (listing, details, recommendations)
│   └── admin/          # Admin management pages
├── config/             # Configuration files
│   ├── api.js          # API endpoints and utilities
│   └── environments.js # Environment-specific settings
├── context/            # React context providers
└── utils/              # Utility functions
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
- **User Features**: Maid catalogue browsing, favorites, recommendations
- **Admin Features**: Maid management, user management, link generation, S3 image uploads
- **Image Upload**: S3 integration with drag-and-drop interface

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