# Joocode Panel Management System

## Overview

This is a modern, professional static web application for Pterodactyl panel management with a completely redesigned user interface. The system provides a sleek login interface and responsive dashboard for managing server resources. Features include a professional design with gradient effects, smooth animations, glassmorphism styling, and mobile-first responsive design, built as a frontend-only application with client-side authentication.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and Vanilla JavaScript
- **Design Pattern**: Static Multi-Page Application with client-side routing
- **UI Framework**: Custom CSS with modern design patterns (CSS Grid, Flexbox, Glassmorphism)
- **Styling**: CSS Variables for consistent theming, gradient effects, animated backgrounds, and professional color palette
- **Typography**: Google Fonts (Inter) for modern professional appearance
- **Asset Hosting**: External image hosting via Pixhost
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop

### Page Structure
- `index.html` - Login page with authentication form (Indonesian language)
- `cpanel.html` - Dashboard/control panel interface (incomplete in current state)
- `style.css` - Unified stylesheet with CSS variables and animations
- `script.js` - Client-side JavaScript for interactions and typing animations

## Key Components

### Authentication System
- **Client-side only authentication** with form validation
- Login form with fields for: Full Name, Password, IP Address
- Session management using browser local storage
- Role-based display logic for user information in dashboard
- Logout functionality with session clearing

### User Interface Components
- **Animated Background**: Floating geometric shapes with CSS keyframe animations
- **Gradient Typography**: Linear gradient text effects for branding consistency
- **Form Components**: Custom-styled input fields with floating label animations
- **Loading States**: Spinner animations for form submissions
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Animation System
- **Typing Animation**: Auto-rotating text display for marketing messages
- **Text Rotation**: Cycles through "Auto Panel Creator", "Pterodactyl API", "Joocode Developer", "Server Management"
- **Smooth Transitions**: CSS transitions for hover effects and state changes
- **Loading Indicators**: Visual feedback during user interactions

### Resource Management
- **RAM Configuration**: Predefined RAM values mapping (1GB to 10GB, plus unlimited)
- **Disk Allocation**: Fixed disk allocation logic - disk space automatically calculated based on RAM selection (10x multiplier)
- **Server Management**: Complete Pterodactyl panel integration with proper resource allocation

## Data Flow

### Client-Side Flow
1. **Login Process**: User enters credentials → JavaScript validation → Browser storage
2. **Dashboard Access**: Authenticated users redirected to control panel
3. **Session Management**: Persistent login state across page refreshes
4. **Logout Flow**: Clear session data and redirect to login page

### Data Storage
- **Browser Storage**: User session and authentication state
- **No Backend**: Purely client-side application with no server-side persistence

## External Dependencies

### Third-Party Services
- **Google Fonts**: Poppins font family for typography
- **Pixhost**: External image hosting for logo and avatars
- **CDN Resources**: External font and asset delivery

### JavaScript Libraries
- **Vanilla JS**: No external JavaScript frameworks or libraries
- **Native Browser APIs**: Local storage, DOM manipulation, fetch API foundation

## Deployment Strategy

### Static Hosting Platforms
- **Vercel**: Configured with static build settings and routing rules
- **Glitch**: Package configuration for Node.js hosting environment
- **General Static Hosting**: Compatible with any static file hosting service

### Build Configuration
- **No Build Process**: Direct deployment of static files
- **Routing**: Custom routes for `/cpanel` endpoint via Vercel configuration
- **Security Headers**: Basic security headers configured in Vercel deployment

### Platform Configurations
- **Vercel**: Static builds with custom routing and security headers
- **Glitch**: Node.js environment setup (though no server-side code exists)
- **Package Management**: Basic NPM configuration for hosting compatibility

## Changelog

```
Changelog:
- June 29, 2025. Complete redesign with modern professional UI
  - Switched from Poppins to Inter font for better readability
  - Implemented glassmorphism design with backdrop blur effects
  - Added professional color palette with CSS variables
  - Fixed disk allocation logic (disk = RAM * 10)
  - Added mobile-first responsive design
  - Improved form validation and user feedback
  - Added smooth animations and hover effects
  - Created deployment configs for Vercel and Netlify
- June 29, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```