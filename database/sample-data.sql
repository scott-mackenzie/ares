-- ARES Platform Sample Data
-- Optional: Sample data for testing and demonstration
-- Run this after schema and indexes to populate with demo data

-- Insert sample client
INSERT INTO clients (name, contact_email, contact_phone, address) 
VALUES ('TechCorp Solutions', 'security@techcorp.com', '+1-555-0123', '123 Business Ave, Tech City, TC 12345')
ON CONFLICT DO NOTHING;

-- Insert sample admin user (update with actual admin details when deploying)
INSERT INTO users (id, email, first_name, last_name, role) 
VALUES ('admin-user-id', 'admin@aresplatform.com', 'System', 'Administrator', 'admin')
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = now();

-- Insert sample report (only if client exists)
INSERT INTO reports (title, client_id, assessment_type, status, severity, executive_summary, created_by)
SELECT 
    'Q4 2024 Penetration Test', 
    c.id, 
    'External Penetration Test', 
    'in_progress',
    'high',
    'This assessment identified several critical vulnerabilities in the external-facing infrastructure that require immediate attention.',
    'admin-user-id'
FROM clients c WHERE c.name = 'TechCorp Solutions'
ON CONFLICT DO NOTHING;

-- Insert sample findings (only if report exists)
INSERT INTO findings (report_id, title, description, severity, cvss_score, impact, recommendation, status)
SELECT 
    r.id,
    'SQL Injection in Login Form',
    'The login form is vulnerable to SQL injection attacks allowing unauthorized database access.',
    'critical',
    '9.8',
    'Complete database compromise possible',
    'Implement parameterized queries and input validation',
    'open'
FROM reports r WHERE r.title = 'Q4 2024 Penetration Test'
ON CONFLICT DO NOTHING;

INSERT INTO findings (report_id, title, description, severity, cvss_score, impact, recommendation, status)
SELECT 
    r.id,
    'Unencrypted Admin Panel',
    'Admin panel accessible over HTTP without encryption',
    'high',
    '7.5',
    'Administrative credentials can be intercepted',
    'Enable HTTPS/TLS encryption for all admin interfaces',
    'in_progress'
FROM reports r WHERE r.title = 'Q4 2024 Penetration Test'
ON CONFLICT DO NOTHING;

INSERT INTO findings (report_id, title, description, severity, cvss_score, impact, recommendation, status)
SELECT 
    r.id,
    'Missing Security Headers',
    'Missing security headers like X-Frame-Options and CSP',
    'medium',
    '5.3',
    'Potential for clickjacking and XSS attacks',
    'Configure proper security headers on web server',
    'open'
FROM reports r WHERE r.title = 'Q4 2024 Penetration Test'
ON CONFLICT DO NOTHING;