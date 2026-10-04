-- EVOS Fleet Cost Intelligence Platform - Migration 002: Indexes and Row Level Security

-- Multi-Tenant Indexes for High-Velocity Queries
CREATE INDEX IF NOT EXISTS idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(company_id, status);
CREATE INDEX IF NOT EXISTS idx_trips_company_id ON trips(company_id);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(company_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_charging_company_id ON charging_sessions(company_id);
CREATE INDEX IF NOT EXISTS idx_charging_vehicle_id ON charging_sessions(company_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_company_id ON maintenance_records(company_id);
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON expenses(company_id);
CREATE INDEX IF NOT EXISTS idx_money_leaks_company_id ON money_leaks(company_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id ON audit_logs(company_id, created_at DESC);

-- Enable Row Level Security (RLS) on Tenant Tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE money_leaks ENABLE ROW LEVEL SECURITY;

-- Supabase RLS Policies (Allow access only if current authenticated user belongs to the company)
CREATE POLICY "Users can only access vehicles within their company"
ON vehicles FOR ALL
USING (
    company_id IN (
        SELECT cm.company_id FROM company_members cm
        WHERE cm.user_id = auth.uid() AND cm.status = 'ACTIVE'
    )
);

CREATE POLICY "Users can only access trips within their company"
ON trips FOR ALL
USING (
    company_id IN (
        SELECT cm.company_id FROM company_members cm
        WHERE cm.user_id = auth.uid() AND cm.status = 'ACTIVE'
    )
);

CREATE POLICY "Users can only access charging within their company"
ON charging_sessions FOR ALL
USING (
    company_id IN (
        SELECT cm.company_id FROM company_members cm
        WHERE cm.user_id = auth.uid() AND cm.status = 'ACTIVE'
    )
);
