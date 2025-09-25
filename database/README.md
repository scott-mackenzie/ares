# ARES Platform Database Setup

This directory contains all database schema and migration files needed to deploy the ARES Cybersecurity Platform on external hosting providers.

## Files Overview

### Core Database Files
- **`schema-setup.sql`** - Complete PostgreSQL schema with all tables and constraints
- **`performance-indexes.sql`** - Performance optimization indexes (run after schema)
- **`sample-data.sql`** - Optional sample data for testing and demonstration
- **`../migrations/`** - Drizzle ORM migration files for development

### Configuration Files
- **`../shared/schema.ts`** - TypeScript schema definitions (Drizzle ORM)
- **`../drizzle.config.ts`** - Drizzle configuration for migrations
- **`../server/db.ts`** - Database connection configuration

## Deployment Instructions

### Option 1: Direct SQL Import (Recommended for Production)

1. **Create PostgreSQL Database**
   ```bash
   # Create database (adjust connection details for your hosting provider)
   createdb ares_platform
   ```

2. **Run Schema Setup**
   ```bash
   # Import main schema
   psql -d ares_platform -f database/schema-setup.sql
   
   # Add performance indexes
   psql -d ares_platform -f database/performance-indexes.sql
   
   # (Optional) Add sample data for testing
   psql -d ares_platform -f database/sample-data.sql
   ```

3. **Configure Environment Variables**
   ```bash
   export DATABASE_URL="postgresql://username:password@host:port/ares_platform"
   ```

### Option 2: Using Drizzle Migrations (Development)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Database URL**
   ```bash
   export DATABASE_URL="postgresql://username:password@host:port/ares_platform"
   ```

3. **Run Migrations**
   ```bash
   npm run db:push
   # or
   npx drizzle-kit push
   ```

## Database Schema Overview

### Tables
- **`users`** - User accounts and authentication (OpenID Connect compatible)
- **`clients`** - Client organizations and contact information
- **`reports`** - Security assessment reports and metadata
- **`findings`** - Vulnerability findings and recommendations
- **`uploads`** - File attachments and evidence
- **`client_access`** - Granular access permissions
- **`sessions`** - User session storage (express-session compatible)

### Key Relationships
- Reports belong to clients and are created by users
- Findings belong to reports
- Uploads can be attached to reports or specific findings
- Client access controls user permissions per report

### Performance Optimizations
- Indexes on frequently queried columns (status, severity, dates)
- Composite indexes for complex dashboard queries
- Foreign key indexes for join performance
- Session expiration index for cleanup

## Environment Variables Required

```bash
# Database connection (required)
DATABASE_URL="postgresql://username:password@host:port/database_name"

# PostgreSQL connection details (optional, extracted from DATABASE_URL)
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=ares_platform
```

## Security Considerations

1. **Database User Permissions**: Create a dedicated database user with minimal required permissions
2. **Connection Security**: Use SSL/TLS connections in production
3. **Backup Strategy**: Implement regular database backups
4. **Access Control**: Restrict database access to application servers only

## Hosting Provider Specific Notes

### AWS RDS
- Use RDS PostgreSQL instance
- Configure security groups for application access
- Enable automated backups

### Google Cloud SQL
- Use Cloud SQL for PostgreSQL
- Configure authorized networks
- Enable point-in-time recovery

### Digital Ocean Managed Databases
- Use DO Managed PostgreSQL
- Configure trusted sources
- Enable automatic backups

### Heroku Postgres
- Add Heroku Postgres addon
- DATABASE_URL is automatically configured
- Use `heroku pg:psql` to run SQL files

### Railway
- Add PostgreSQL service
- Use provided DATABASE_URL
- Import schema through Railway dashboard or CLI

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check firewall settings
   - Verify DATABASE_URL format
   - Ensure database server is accessible

2. **Permission Denied**
   - Verify user has CREATE TABLE permissions
   - Check database ownership
   - Ensure user can create indexes

3. **Constraint Violations**
   - Run schema-setup.sql before sample-data.sql
   - Check for existing data conflicts
   - Verify foreign key relationships

### Migration from Existing Data

If migrating from another database:

1. Export existing data to SQL format
2. Run schema-setup.sql to create tables
3. Import data with appropriate transformations
4. Run performance-indexes.sql for optimization

## Support

For deployment assistance or issues:
- Check application logs for database connection errors
- Verify all environment variables are set correctly
- Ensure PostgreSQL version compatibility (12+)
- Test connection with `psql` command line tool