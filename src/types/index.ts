export type VehicleStatus = 'active' | 'charging' | 'idle' | 'maintenance';

export interface Vehicle {
  id: string; // e.g. "EV-001"
  plateNumber: string; // e.g. "DK 8821 EV"
  model: string; // e.g. "Hyundai Ioniq 5 Signature Long Range"
  category: 'Passenger' | 'VIP Shuttles' | 'Light Cargo' | 'Executive Sedans';
  batteryPercent: number;
  rangeKm: number;
  status: VehicleStatus;
  odometerKm: number;
  efficiencyKwhPer100km: number; // e.g. 14.2
  costPerKm: number; // in IDR, e.g. 465
  assignedDriver: string;
  depotLocation: string;
  lastCharging: {
    date: string;
    kwhAdded: number;
    costIdr: number;
    location: string;
  };
  lastMaintenance: {
    date: string;
    description: string;
    costIdr: number;
  };
  monthlyCostIdr: number;
}

export interface TripRecord {
  id: string; // e.g. "TRIP-2490"
  vehicleId: string;
  driverName: string;
  route: string; // e.g. "Ngurah Rai Airport -> Ubud Hanging Gardens"
  distanceKm: number;
  energyKwh: number;
  estimatedCostIdr: number;
  actualCostIdr: number;
  variancePercent: number;
  date: string;
  status: 'Completed' | 'In Transit' | 'Flagged Variance';
  breakdown: {
    chargingCost: number;
    driverAllowance: number;
    tollsParking: number;
    maintenanceAllocation: number;
    anomalySurge?: number;
  };
  whyVariance?: {
    factor: string;
    deltaIdr: number;
    explanation: string;
  }[];
}

export interface MoneyLeakAnomaly {
  id: string;
  type: 'charging' | 'maintenance' | 'utilization' | 'surge' | 'route';
  title: string;
  severity: 'high' | 'medium' | 'low';
  vehicleId: string;
  detectedDate: string;
  impactMonthlyIdr: number;
  metricLabel: string;
  currentValue: string;
  benchmarkValue: string;
  percentageDiff: string;
  explanation: string;
  recommendation: string;
  status: 'Investigate' | 'Mitigation In Progress' | 'Resolved';
}

export interface ChargingSession {
  id: string;
  vehicleId: string;
  chargerType: 'DC Fast 150kW' | 'AC Commercial 22kW' | 'Depot Slow Overnight';
  location: string;
  startTime: string;
  durationMinutes: number;
  kwhDelivered: number;
  costIdr: number;
  ratePerKwh: number;
  efficiencyRating: 'Optimal' | 'Sub-optimal Peak' | 'Off-Peak Prime';
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  serviceType: string;
  scheduledDate: string;
  status: 'Upcoming' | 'Completed' | 'Overdue';
  estimatedCostIdr: number;
  actualCostIdr?: number;
  serviceProvider: string;
  priority: 'Routine' | 'High Wear' | 'Critical Safety';
}

export interface FleetCostMetrics {
  totalMonthlyCostIdr: number;
  costPerKmIdr: number;
  energyCostIdr: number;
  maintenanceCostIdr: number;
  driverCostIdr: number;
  otherOperatingCostIdr: number;
  activeVehicles: number;
  totalVehicles: number;
  chargingVehicles: number;
  criticalAlerts: number;
  monthlyDistanceKm: number;
  co2SavedTons: number;
}

export interface Driver {
  id: string; // e.g. "DRV-01"
  company_id: string;
  name: string;
  employee_code: string;
  phone: string;
  license_number: string;
  assigned_vehicle_id: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'OFF_DUTY';
  rating: number;
  total_trips: number;
  joined_date: string;
}

export interface Expense {
  id: string; // e.g. "EXP-001"
  company_id: string;
  vehicle_id: string;
  category: 'Charging' | 'Toll & Highway' | 'Maintenance' | 'Driver Allowance' | 'Insurance' | 'Registration & Tax';
  amount_idr: number;
  date: string;
  receipt_ref: string;
  description: string;
  status: 'Approved' | 'Pending Review' | 'Flagged';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company_id: string;
  company_name?: string;
  is_platform_admin: boolean;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  country: string;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED';
}
