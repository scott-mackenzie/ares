# ARES - Advanced Cybersecurity Reporting Platform

## Overview

ARES is a comprehensive cybersecurity reporting platform designed for penetration testing workflows. The platform provides secure client portals, advanced vulnerability management, and role-based access control for administrators, partners, and clients. It features a modern web application built with React and TypeScript on the frontend, an Express.js backend with PostgreSQL database, and integrates with Replit's authentication system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a purple and black color scheme
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Server**: Express.js with TypeScript, using ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **API Design**: RESTful API with role-based access control and comprehensive error handling
- **Session Management**: Express sessions with PostgreSQL session store

### Authentication & Authorization
- **Provider**: Replit's OpenID Connect (OIDC) authentication system
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Role System**: Three-tier role system (admin, partner, client) with appropriate access controls
- **Security**: HTTP-only cookies, secure session handling, and CSRF protection

### Database Design
- **Users Table**: Stores user profiles with role-based access control
- **Clients Table**: Manages client organizations and contact information
- **Reports Table**: Handles security assessment reports with metadata and relationships
- **Findings Table**: Stores vulnerability findings with severity levels and remediation status
- **File Management**: Upload system for report attachments and evidence
- **Client Access**: Granular permissions for client-specific data access

### Development Workflow
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Code Quality**: Shared type definitions between client and server for consistency
- **Hot Reload**: Development server with automatic reloading and error overlay

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with automatic migration support
- **Connection Management**: WebSocket-based connections for optimal performance

### Authentication Services
- **Replit OIDC**: Integrated authentication with automatic user provisioning
- **OpenID Client**: Standards-compliant authentication flow implementation

### UI & Component Libraries
- **Radix UI**: Accessible component primitives for complex UI interactions
- **shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Comprehensive icon library for UI elements

### Development & Build Tools
- **Vite**: Fast development server and build tool with HMR support
- **esbuild**: High-performance bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **TypeScript**: Static type checking across the entire application stack

### Utility Libraries
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Performance-optimized form handling with validation
- **Zod**: Runtime type validation for API requests and responses
- **date-fns**: Date manipulation and formatting utilities
- **clsx/twMerge**: Conditional CSS class management for dynamic styling