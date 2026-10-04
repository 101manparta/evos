-- EVOS Fleet Cost Intelligence Platform - Migration 001: Core Tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Companies (Tenants)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    legal_name VARCHAR(255),
    industry VARCHAR(100) DEFAULT 'Hospitality & Logistics',
    country VARCHAR(100) DEFAULT 'Indonesia',
    timezone VARCHAR(100) DEFAULT 'Asia/Makassar',
    currency VARCHAR(10) DEFAULT 'IDR',
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TRIAL', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Users / Profiles
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_platform_admin BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'INVITED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Company Members (Multi-Tenant Memberships with RBAC)
CREATE TABLE IF NOT EXISTS company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'VIEWER' CHECK (role IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'FINANCE_MANAGER', 'OPERATOR', 'VIEWER')),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- Vehicles (Fleet Assets)
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_code VARCHAR(50) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'VIP Shuttles',
    year INT NOT NULL DEFAULT 2024,
    battery_capacity_kwh NUMERIC(8, 2) NOT NULL DEFAULT 77.4,
    current_soc_percent INT NOT NULL DEFAULT 85 CHECK (current_soc_percent >= 0 AND current_soc_percent <= 100),
    range_km NUMERIC(8, 2) NOT NULL DEFAULT 420.0,
    estimated_consumption_kwh_per_100km NUMERIC(8, 2) NOT NULL DEFAULT 14.2,
    odometer_km NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    cost_per_km NUMERIC(12, 2) NOT NULL DEFAULT 465.0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'IDLE', 'CHARGING', 'MAINTENANCE', 'INACTIVE')),
    assigned_driver VARCHAR(255),
    depot_location VARCHAR(255) DEFAULT 'Denpasar South Hub',
    purchase_price NUMERIC(15, 2) DEFAULT 850000000.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(company_id, vehicle_code)
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    employee_code VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ON_DUTY', 'OFF_DUTY', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(company_id, employee_code)
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    trip_code VARCHAR(50) NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    driver_name VARCHAR(255) NOT NULL,
    route VARCHAR(255) NOT NULL,
    distance_km NUMERIC(8, 2) NOT NULL CHECK (distance_km >= 0),
    energy_used_kwh NUMERIC(8, 2) NOT NULL CHECK (energy_used_kwh >= 0),
    estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.0 CHECK (estimated_cost >= 0),
    actual_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.0 CHECK (actual_cost >= 0),
    variance_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    variance_percent NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'FLAGGED_VARIANCE', 'CANCELLED')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trip Cost Allocations & Why Variance Details
CREATE TABLE IF NOT EXISTS trip_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    charging_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    driver_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    tolls_parking NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    maintenance_allocation NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    why_explanation JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Charging Sessions
CREATE TABLE IF NOT EXISTS charging_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    charger_type VARCHAR(100) NOT NULL DEFAULT 'DC Fast 150kW',
    location VARCHAR(255) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_minutes INT NOT NULL DEFAULT 40,
    energy_kwh NUMERIC(8, 2) NOT NULL CHECK (energy_kwh >= 0),
    rate_per_kwh NUMERIC(10, 2) NOT NULL DEFAULT 1700.0,
    cost NUMERIC(12, 2) NOT NULL CHECK (cost >= 0),
    efficiency_rating VARCHAR(50) DEFAULT 'Optimal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maintenance Records
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    service_type VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    performed_date DATE,
    estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    actual_cost NUMERIC(12, 2),
    service_provider VARCHAR(255) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Routine' CHECK (priority IN ('Routine', 'High Wear', 'Critical Safety')),
    status VARCHAR(50) NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed', 'Overdue', 'Warranty Claim')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('DRIVER', 'PARKING', 'TOLL', 'ENERGY', 'MAINTENANCE', 'INSURANCE', 'DEPRECIATION', 'OTHER')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    description TEXT NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Money Leaks (Autonomous Anomaly Radar)
CREATE TABLE IF NOT EXISTS money_leaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CHARGING_ANOMALY', 'MAINTENANCE_ANOMALY', 'HIGH_COST_PER_KM', 'LOW_UTILIZATION', 'UNEXPECTED_COST_INCREASE', 'PEAK_SURGE')),
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    metric_label VARCHAR(100) NOT NULL,
    current_value VARCHAR(100) NOT NULL,
    benchmark_value VARCHAR(100) NOT NULL,
    percentage_diff VARCHAR(50) NOT NULL,
    estimated_financial_impact NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    recommendation TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'IGNORED')),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Audit Logs (Append-Only)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotency Keys (Financial write protection)
CREATE TABLE IF NOT EXISTS idempotency_keys (
    key VARCHAR(255) PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    response_body JSONB NOT NULL,
    response_code INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);
