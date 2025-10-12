# Perfect Models Management - Technical Documentation

## Overview

Perfect Models Management is a comprehensive web application for a modeling agency based in Libreville, Gabon. The platform serves as a digital hub for managing models, events, magazine content, educational programs, casting processes, and administrative operations. Built with React and Firebase, it provides role-based access for administrators, professional models, beginner students, jury members, and registration staff.

## Recent Changes

**October 12, 2025 - Migrated from Vercel to Replit**
- Configured Vite development server for Replit environment (port 5000, host 0.0.0.0)
- Updated all environment variable references from `process.env` to `import.meta.env.VITE_*` for Vite compatibility
- Fixed import path issues throughout the codebase (SocialIcons, Footer, DataContext, beginnerCourseData)
- Configured deployment settings for autoscale deployment on Replit
- Application successfully running on Replit without errors

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- **React 18.2** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **React Router DOM (v6)** for client-side routing using hash-based navigation
- **Tailwind CSS** for utility-first styling with custom theme extensions
- **Framer Motion** for animations and transitions

**Key Design Patterns:**
- **Lazy Loading**: All pages are code-split using React's `lazy()` and `Suspense` for improved initial load performance
- **Context API**: Centralized data management through `DataContext` that wraps the entire application
- **Protected Routes**: Role-based access control using a `ProtectedRoute` component that validates user sessions
- **Custom Hooks**: `useDataStore` centralizes all Firebase data operations and state management

**State Management:**
The application uses a hybrid approach:
- Firebase Realtime Database for persistent data storage
- Context API (`DataContext`) for global application state
- Local `useState` for component-level state
- `sessionStorage` for user authentication and role persistence

**Routing Strategy:**
Hash-based routing (`HashRouter`) is used for compatibility with static hosting environments. This allows the SPA to work correctly when deployed to services like Vercel without server-side configuration.

### Backend Architecture

**Database: Firebase Realtime Database**
- **Rationale**: Chosen for real-time synchronization, simple setup, and seamless integration with React
- **Structure**: Flat JSON structure with indexed fields (e.g., articles indexed by slug)
- **Data Seeding**: Initial data is automatically populated from `constants/data.ts` if the database is empty
- **Security**: Database rules allow public read/write access (defined in `database.rules.json`) - suitable for development but should be restricted for production

**Data Flow:**
1. Application initializes and checks Firebase for existing data
2. If empty, seeds database with default data from constants
3. Real-time listener (`onValue`) keeps local state synchronized with Firebase
4. All mutations go through `saveData()` function which updates both local state and Firebase
5. Changes propagate to all connected clients in real-time

**Authentication & Authorization:**
- **Simple session-based auth** using `sessionStorage`
- Role types: `admin`, `student` (pro models), `beginner`, `jury`, `registration`
- Login credentials stored directly in Firebase (models, jury members, students)
- No third-party auth service - custom implementation for simplicity

### Key Features & Components

**1. Multi-Role Dashboard System:**
- Admin dashboard with comprehensive management tools
- Model/student portals with educational content (Classroom)
- Jury interface for casting evaluations
- Registration staff interface for event management

**2. Educational Platform (Classroom):**
- Two course tracks: Professional (`courseData`) and Beginner (`beginnerCourseData`)
- Module-based learning with chapters, quizzes, and progress tracking
- Quiz system with attempt limits and anti-cheat measures (visibility change detection)
- Forum system for student interaction

**3. Casting & Event Management:**
- Casting application forms with photo upload
- Jury scoring system with weighted criteria
- Printable evaluation sheets
- Fashion Day event applications and management

**4. Content Management:**
- Magazine articles with rich content blocks (text, images, quotes, headings)
- Service catalog with booking system
- Dynamic model portfolios with galleries
- News feed and testimonials

**5. AI Integration:**
- Google Generative AI (Gemini) for content assistance
- AI-powered article generation
- Context-aware content suggestions
- Structured JSON output for predictable data formats

### External Dependencies

**Third-Party Services:**

1. **Firebase (v12.2.1)**
   - Realtime Database for data persistence
   - Compat SDK for legacy API support
   - Configuration in `firebaseConfig.ts`

2. **Google Generative AI (@google/genai v1.17)**
   - Powers AI assistant features
   - Content generation for articles, testimonials, distinctions
   - Uses structured output with JSON schemas
   - API key required: `GEMINI_API_KEY` environment variable

3. **Image Hosting (ImgBB)**
   - External image storage via API
   - API key: `imgbbApiKey` in data constants
   - Used for model photos, article images, portfolio uploads

4. **Email Services:**
   - Formspree endpoint for contact form submissions
   - Resend API for notifications (configured but not actively used)

5. **Heroicons (v2.1.3)**
   - Icon library for UI elements
   - Outline and solid variants

6. **Framer Motion (v12.23.12)**
   - Animation library for transitions and interactive elements

7. **html2canvas (v1.4.1)**
   - Screenshot generation for printable sheets

**PWA Capabilities:**
- Service Worker (`sw.js`) for offline caching
- Web App Manifest for installability
- Cache-first strategy for static assets
- Network-first for Firebase API calls

**SEO & Metadata:**
- Dynamic SEO component for meta tags
- Open Graph support for social sharing
- Sitemap and robots.txt for search engines
- Canonical URLs and structured data support

**Build & Deployment:**
- Vite for bundling and optimization (configured for Replit environment on port 5000)
- Deployment target: Autoscale for stateless frontend
- Security headers configured
- Environment variables: Use `VITE_` prefix for Vite (e.g., `VITE_API_KEY` for Gemini API key)

**Development Considerations:**
- TypeScript for type safety with strict mode enabled
- Path aliases configured (`@/*` maps to `src/*`)
- Tailwind custom theme with brand colors and animations
- Responsive design with mobile-first approach
- Accessibility considerations (ARIA labels, semantic HTML)