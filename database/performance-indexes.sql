-- ARES Platform Performance Optimization Indexes
-- Run this after the main schema setup to optimize query performance

-- Report-related indexes for dashboard and search operations
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_client_id ON reports(client_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Finding-related indexes for vulnerability management
CREATE INDEX IF NOT EXISTS idx_findings_report_id ON findings(report_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity);
CREATE INDEX IF NOT EXISTS idx_findings_status ON findings(status);
CREATE INDEX IF NOT EXISTS idx_findings_severity_status ON findings(severity, status);

-- Upload-related indexes for file management
CREATE INDEX IF NOT EXISTS idx_uploads_report_id ON uploads(report_id);
CREATE INDEX IF NOT EXISTS idx_uploads_finding_id ON uploads(finding_id);
CREATE INDEX IF NOT EXISTS idx_uploads_uploaded_by ON uploads(uploaded_by);

-- Access control indexes for security
CREATE INDEX IF NOT EXISTS idx_client_access_user_report ON client_access(user_id, report_id);
CREATE INDEX IF NOT EXISTS idx_client_access_client_id ON client_access(client_id);

-- User management indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Client management indexes  
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_reports_client_status ON reports(client_id, status);
CREATE INDEX IF NOT EXISTS idx_findings_report_severity ON findings(report_id, severity);