# ARES - Advanced Cybersecurity Reporting Platform

A comprehensive cybersecurity reporting platform designed for penetration testing workflows, featuring secure client portals, advanced vulnerability management, and role-based access control for administrators, partners, and clients.

## 🛡️ Project Overview

ARES provides a complete solution for managing cybersecurity assessments, from initial scoping through final report delivery. The platform supports multiple user roles with dedicated portals, advanced vulnerability tracking, and Purple Team operations (Red Team and Blue Team) functionality.

### Key Features

- **Multi-Portal Architecture**: Separate interfaces for Admin, Partner, and Client roles
- **Purple Team Operations**: Red Team (offensive) and Blue Team (defensive) security functions
- **Advanced Vulnerability Management**: CVSS scoring, severity tracking, remediation workflows
- **Secure File Management**: Evidence uploads and secure document sharing
- **Real-time Dashboard**: Metrics, analytics, and progress tracking
- **Role-Based Access Control**: Granular permissions and client access management

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with Hot Module Replacement (HMR)
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom CloudCarib color scheme (purple/black theme)
- **State Management**: TanStack React Query v5 for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React and React Icons (Simple Icons for logos)

### Backend Stack
- **Runtime**: Node.js with TypeScript (ES Modules)
- **Framework**: Express.js with middleware support
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OpenID Connect (OIDC) integration
- **Session Management**: express-session with PostgreSQL store
- **File Uploads**: Multer for evidence and document handling
- **API Design**: RESTful endpoints with comprehensive error handling

### Database & ORM
- **Database**: PostgreSQL (Neon serverless for development)
- **ORM**: Drizzle ORM with type-safe queries
- **Migrations**: Drizzle Kit for schema management
- **Connection**: WebSocket-based connections with connection pooling
- **Schema**: Fully typed with Zod validation schemas

### Development Tools
- **Language**: TypeScript across entire stack
- **Package Manager**: npm
- **Code Quality**: ESLint configuration
- **Hot Reload**: Vite dev server with automatic reloading
- **Build Process**: Vite (frontend) + esbuild (backend)

## 📁 Project Structure

```
ares/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   │   ├── button.tsx       # Button component
│   │   │   │   ├── card.tsx         # Card component
│   │   │   │   ├── form.tsx         # Form components
│   │   │   │   ├── dialog.tsx       # Modal dialogs
│   │   │   │   └── ...              # Other UI primitives
│   │   │   ├── admin-*.tsx          # Admin portal components
│   │   │   ├── client-*.tsx         # Client portal components  
│   │   │   ├── sidebar.tsx          # Main navigation sidebar
│   │   │   └── user-profile-dropdown.tsx # User management
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts          # Authentication hook
│   │   │   └── use-toast.ts        # Toast notifications
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── queryClient.ts       # TanStack Query configuration
│   │   │   └── utils.ts             # General utilities
│   │   ├── pages/                   # Page components
│   │   │   ├── admin-dashboard.tsx  # Admin portal with Purple Team
│   │   │   ├── partner-portal.tsx   # Partner management interface
│   │   │   ├── client-portal.tsx    # Client reporting interface
│   │   │   └── landing.tsx          # Authentication landing page
│   │   ├── App.tsx                  # Main application component
│   │   ├── main.tsx                 # React application entry point
│   │   └── index.css                # Global styles and CSS variables
│   └── index.html                   # HTML entry point
├── server/                          # Backend Express application
│   ├── db.ts                        # Database connection configuration
│   ├── index.ts                     # Express server entry point
│   ├── replitAuth.ts               # Replit OIDC authentication setup
│   ├── routes.ts                    # API routes and endpoints
│   ├── storage.ts                   # Database storage layer (Drizzle ORM)
│   └── vite.ts                      # Vite integration for development
├── shared/                          # Shared TypeScript definitions
│   └── schema.ts                    # Database schema and Zod validators
├── database/                        # Database setup and migrations
│   ├── schema-setup.sql            # Complete PostgreSQL schema
│   ├── performance-indexes.sql     # Database performance optimizations
│   ├── sample-data.sql             # Demo data for testing
│   └── README.md                   # Database deployment guide
├── migrations/                      # Drizzle ORM migrations
│   ├── 0000_*.sql                  # Migration SQL files
│   └── meta/                       # Migration metadata
│       ├── 0000_snapshot.json      # Schema snapshots
│       └── _journal.json           # Migration history
├── package.json                     # Node.js dependencies and scripts
├── package-lock.json               # Dependency lock file
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── drizzle.config.ts               # Drizzle ORM configuration
├── components.json                 # shadcn/ui configuration
├── sync.js                         # GitHub repository synchronization
└── README.md                       # Project documentation (this file)
```

## 🎯 Core Features

### Multi-Role Portal System
- **Admin Portal**: Complete platform management with Purple Team operations
  - Red Team Functions: Scheduler, Content Library, Analytics, ARES.AI
  - Blue Team Functions: Scheduler, Analytics, Security Operations
  - Client management, report oversight, user administration
- **Partner Portal**: Collaborative assessment management
  - Shared client access, report collaboration, findings management
- **Client Portal**: Secure report access and communication
  - Report downloads, finding status tracking, secure messaging

### Purple Team Operations
- **Red Team (Offensive Security)**:
  - Scheduler: Attack simulation planning
  - Content Library: Exploit and payload management  
  - Core Integrations: Security tool integration
  - Analytics: Attack success metrics
  - Assessments: Penetration test management
  - Exposure Management: Attack surface analysis
- **Blue Team (Defensive Security)**:
  - Scheduler: Defense activity planning
  - Analytics: Security posture metrics
  - Procedures & Runbooks: Incident response workflows
  - ARES.AI: ML-powered threat detection

### Advanced Reporting System
- **Report Management**: Comprehensive assessment lifecycle
- **Finding Tracking**: CVSS scoring, severity classification, remediation status
- **File Management**: Secure evidence uploads and document sharing
- **Client Access Control**: Granular permissions per report and client
- **Dashboard Analytics**: Real-time metrics and progress tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/scott-mackenzie/ares.git
   cd ares
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Database connection
   export DATABASE_URL="postgresql://username:password@localhost:5432/ares_db"
   
   # Additional PostgreSQL variables (optional)
   export PGHOST=localhost
   export PGPORT=5432
   export PGUSER=your_username
   export PGPASSWORD=your_password
   export PGDATABASE=ares_db
   ```

4. **Set up the database**
   ```bash
   # Create database and apply schema
   createdb ares_db
   psql -d ares_db -f database/schema-setup.sql
   psql -d ares_db -f database/performance-indexes.sql
   
   # Or use Drizzle migrations
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open http://localhost:5000
   - Authenticate with Replit OAuth
   - Access appropriate portal based on user role

### Production Deployment

1. **Database Setup**: Use provided SQL files in `database/` directory
2. **Environment Configuration**: Set production DATABASE_URL
3. **Build Application**: Run `npm run build`
4. **Start Production**: Run `npm start`

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Apply database schema changes

### Code Architecture Patterns
- **Type Safety**: Full TypeScript coverage with shared schemas
- **Component Structure**: Atomic design with shadcn/ui primitives
- **State Management**: Server state via TanStack Query, local state via React hooks
- **API Design**: RESTful endpoints with consistent error handling
- **Database Queries**: Type-safe operations with Drizzle ORM
- **Authentication Flow**: OIDC integration with session management

## 🎨 UI/UX Design

### Design System
- **Color Scheme**: CloudCarib theme with purple (#8B5CF6) and black (#000000) primary colors
- **Components**: Radix UI primitives for accessibility and consistency
- **Typography**: Clean, modern font stack optimized for readability
- **Icons**: Lucide React for interface elements, Simple Icons for brand logos
- **Layout**: Responsive design with mobile-first approach
- **Navigation**: Expandable sidebar with multi-level menu support

### Theme Implementation
- CSS custom properties for consistent theming
- Dark/light mode support built into component system
- Tailwind CSS utilities for rapid development
- Custom component variants for brand consistency

## 🔒 Security Features

### Authentication & Authorization
- **OpenID Connect**: Replit OIDC integration for secure authentication
- **Role-Based Access**: Admin, Partner, Client role separation
- **Session Security**: HTTP-only cookies with PostgreSQL session storage
- **Route Protection**: Middleware-based access control

### Data Security
- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection Protection**: Parameterized queries via Drizzle ORM
- **File Upload Security**: Mime type validation and secure storage
- **CSRF Protection**: Built into session management

## 📊 Database Schema

### Core Entities
- **Users**: Authentication and profile management
- **Clients**: Customer organization data
- **Reports**: Assessment reports with metadata
- **Findings**: Individual vulnerabilities with CVSS scoring
- **Uploads**: File attachments and evidence
- **Client Access**: Granular permission management
- **Sessions**: User session storage

### Relationships
- Reports belong to clients and are created by users
- Findings belong to reports with severity tracking
- Uploads can attach to reports or specific findings
- Client access controls user permissions per report

## 🔄 Synchronization

The project includes automatic GitHub synchronization:

```bash
# Sync all changes to GitHub repository
node sync.js

# Options available
node sync.js --quiet    # Silent sync
node sync.js --help     # Show help
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the database documentation in `database/README.md`
- Review the deployment guides for hosting-specific instructions

## 🚧 Roadmap

- [ ] Advanced reporting templates
- [ ] API rate limiting and throttling
- [ ] Advanced analytics and metrics
- [ ] Mobile application support
- [ ] Integration with additional security tools
- [ ] Automated report generation
- [ ] Advanced notification system

---

**ARES Platform** - Empowering cybersecurity professionals with comprehensive reporting and management capabilities.