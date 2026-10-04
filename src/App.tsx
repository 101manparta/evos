import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { DashboardSidebar } from './components/navigation/DashboardSidebar';
import { DashboardTopBar } from './components/dashboard/DashboardTopBar';

// Landing Sections
import { HeroSection } from './components/landing/HeroSection';
import { ValueStrip } from './components/landing/ValueStrip';
import { DashboardShowcaseSection } from './components/landing/DashboardShowcaseSection';
import { FeaturesGridSection } from './components/landing/FeaturesGridSection';
import { CostIntelligencePreview } from './components/landing/CostIntelligencePreview';
import { MoneyLeakDetectorSection } from './components/landing/MoneyLeakDetectorSection';
import { WhyDrilldownSection } from './components/landing/WhyDrilldownSection';
import { EvVsIceSection } from './components/landing/EvVsIceSection';
import { WhatIfSimulatorSection } from './components/landing/WhatIfSimulatorSection';
import { CoastalCtaBanner } from './components/landing/CoastalCtaBanner';

// Dashboard Tabs
import { OverviewTab } from './components/dashboard/OverviewTab';
import { FleetVehiclesTab } from './components/dashboard/FleetVehiclesTab';
import { DriversTab } from './components/dashboard/DriversTab';
import { TripsTab } from './components/dashboard/TripsTab';
import { ChargingTab } from './components/dashboard/ChargingTab';
import { MaintenanceTab } from './components/dashboard/MaintenanceTab';
import { ExpensesTab } from './components/dashboard/ExpensesTab';
import { CostIntelligenceTab } from './components/dashboard/CostIntelligenceTab';
import { MoneyLeaksTab } from './components/dashboard/MoneyLeaksTab';
import { ReportsTab } from './components/dashboard/ReportsTab';
import { SimulationTab } from './components/dashboard/SimulationTab';
import { AdminTab } from './components/dashboard/AdminTab';
import { SettingsTab } from './components/dashboard/SettingsTab';

// Auth Pages & Context
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AuthProvider, useAuth } from './context/AuthContext';

// Marketing Subpages
import { PlatformPage } from './components/pages/PlatformPage';
import { SolutionsPage } from './components/pages/SolutionsPage';
import { PricingPage } from './components/pages/PricingPage';

import { TripRecord } from './types';
import { Zap } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>('month');
  const [selectedTripForWhy, setSelectedTripForWhy] = useState<TripRecord | null>(null);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Protected route enforcement
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && currentPath.startsWith('/dashboard')) {
        navigateTo('/login');
      } else if (isAuthenticated && (currentPath === '/login' || currentPath === '/register')) {
        navigateTo('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, currentPath]);

  const isDashboard = currentPath.startsWith('/dashboard');
  const isAuth = currentPath === '/login' || currentPath === '/register';

  // Compute breadcrumbs for dashboard top bar
  const getBreadcrumbs = () => {
    if (!isDashboard) return [];
    const sub = currentPath.replace('/dashboard', '').replace('/', '');
    const map: Record<string, string> = {
      '': 'Fleet Overview',
      'fleet': 'Fleet Registry',
      'vehicles': 'Vehicles Directory',
      'drivers': 'Drivers Roster',
      'trips': 'Trips & Variance Audit',
      'charging': 'Charging Telemetry Depot',
      'maintenance': 'Predictive Maintenance',
      'expenses': 'Operating Expenses Ledger',
      'cost-intelligence': 'Cost Intelligence Engine',
      'money-leaks': 'Money Leak Radar',
      'reports': 'Executive Reports & Ledgers',
      'simulation': 'What-If Electrification Simulator',
      'admin': 'Platform Admin Console',
      'settings': 'Fleet Profile & API Configuration',
    };
    return ['EVOS Intelligence', 'Operations', map[sub] || 'Console'];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050608] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
          <Zap className="w-6 h-6" />
        </div>
        <div className="font-['Syne',sans-serif] text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Verifying EVOS Intelligence Session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] text-[#E4E7EC] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. AUTH PAGES */}
      {currentPath === '/login' && (
        <LoginForm
          onLoginSuccess={() => navigateTo('/dashboard')}
          onNavigateRegister={() => navigateTo('/register')}
          onBackToHome={() => navigateTo('/')}
        />
      )}

      {currentPath === '/register' && (
        <RegisterForm
          onRegisterSuccess={() => navigateTo('/dashboard')}
          onNavigateLogin={() => navigateTo('/login')}
          onBackToHome={() => navigateTo('/')}
        />
      )}

      {/* 2. PROTECTED DASHBOARD PAGES */}
      {isDashboard && isAuthenticated && (
        <div className="flex min-h-screen bg-[#05070A]">
          {/* Collapsible Sidebar */}
          <DashboardSidebar
            currentPath={currentPath}
            onNavigate={navigateTo}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            leakCount={2}
            onLogout={async () => {
              await logout();
              navigateTo('/login');
            }}
          />

          {/* Main Dashboard Content Area */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
            }`}
          >
            {/* Top Bar */}
            <DashboardTopBar
              breadcrumbs={getBreadcrumbs()}
              onOpenMobileMenu={() => setSidebarCollapsed(!sidebarCollapsed)}
              onExport={() => navigateTo('/dashboard/reports')}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              notificationsCount={2}
            />

            {/* Sub-view Viewport Container */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
              {currentPath === '/dashboard' && (
                <OverviewTab
                  onNavigateTab={navigateTo}
                  onSelectTrip={(trip) => {
                    setSelectedTripForWhy(trip);
                    navigateTo('/dashboard/trips');
                  }}
                />
              )}

              {(currentPath === '/dashboard/fleet' || currentPath === '/dashboard/vehicles') && (
                <FleetVehiclesTab />
              )}

              {currentPath === '/dashboard/drivers' && <DriversTab />}

              {currentPath === '/dashboard/trips' && (
                <TripsTab
                  selectedTripForWhy={selectedTripForWhy}
                  onClearSelectedTrip={() => setSelectedTripForWhy(null)}
                />
              )}

              {currentPath === '/dashboard/charging' && <ChargingTab />}

              {currentPath === '/dashboard/maintenance' && <MaintenanceTab />}

              {currentPath === '/dashboard/expenses' && <ExpensesTab />}

              {currentPath === '/dashboard/cost-intelligence' && <CostIntelligenceTab />}

              {currentPath === '/dashboard/money-leaks' && <MoneyLeaksTab />}

              {currentPath === '/dashboard/reports' && <ReportsTab />}

              {currentPath === '/dashboard/simulation' && <SimulationTab />}

              {currentPath === '/dashboard/admin' && <AdminTab />}

              {currentPath === '/dashboard/settings' && <SettingsTab />}
            </main>
          </div>
        </div>
      )}

      {/* 3. PUBLIC MARKETING PAGES */}
      {!isDashboard && !isAuth && (
        <>
          <Navbar currentPath={currentPath} onNavigate={navigateTo} />

          <main className="flex-1">
            {currentPath === '/' && (
              <>
                {/* 1. Hero Section matching reference */}
                <HeroSection
                  onGetStarted={() => navigateTo(isAuthenticated ? '/dashboard' : '/login')}
                  onExplore={() => {
                    const el = document.getElementById('dashboard-preview');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* 2. Horizontal Feature Icon Strip */}
                <ValueStrip />

                {/* 3. All-in-One Dashboard Showcase (Dual Mockup + Kontrol Penuh) */}
                <div id="dashboard-preview">
                  <DashboardShowcaseSection
                    onLaunchConsole={() => navigateTo(isAuthenticated ? '/dashboard' : '/login')}
                  />
                </div>

                {/* 4. Fitur Utama (2x3 Bento Grid) */}
                <FeaturesGridSection onExploreAll={() => navigateTo('/platform')} />

                {/* 5. Deep Intelligence Modules */}
                <CostIntelligencePreview />
                <MoneyLeakDetectorSection />
                <WhyDrilldownSection />
                <EvVsIceSection />
                <WhatIfSimulatorSection />

                {/* 6. Coastal Sunset Drive Banner */}
                <CoastalCtaBanner
                  onGetStarted={() => navigateTo(isAuthenticated ? '/dashboard' : '/login')}
                  onExplore={() => navigateTo('/dashboard/simulation')}
                />
              </>
            )}

            {currentPath === '/platform' && (
              <PlatformPage onGetStarted={() => navigateTo(isAuthenticated ? '/dashboard' : '/login')} />
            )}

            {currentPath === '/solutions' && (
              <SolutionsPage onLaunchDemo={() => navigateTo(isAuthenticated ? '/dashboard' : '/login')} />
            )}

            {currentPath === '/pricing' && (
              <PricingPage onSelectPlan={() => navigateTo('/register')} />
            )}
          </main>

          <Footer onNavigate={navigateTo} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
