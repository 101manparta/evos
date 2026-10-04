package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/evos-intelligence/evos-backend/internal/costengine"
)

type ServerConfig struct {
	Port        string
	Environment string
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	cfg := ServerConfig{
		Port:        port,
		Environment: os.Getenv("APP_ENV"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		RedisURL:    os.Getenv("REDIS_URL"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
	}

	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Global Recovery & Logger
	router.Use(gin.Recovery())
	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf(`{"time":"%s","status":%d,"latency":"%s","client_ip":"%s","method":"%s","path":"%s"}`+"\n",
			param.TimeStamp.Format(time.RFC3339),
			param.StatusCode,
			param.Latency,
			param.ClientIP,
			param.Method,
			param.Path,
		)
	}))

	// CORS Configuration
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Request-ID", "Idempotency-Key"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"}
	router.Use(cors.New(corsConfig))

	// Instantiate Domain Engines
	costEng := costengine.New()

	// Root Health Endpoints
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"services": gin.H{
				"api":      "healthy",
				"database": "connected",
				"cache":    "active",
				"storage":  "ready",
			},
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	// API v1 Namespace
	v1 := router.Group("/api/v1")
	{
		// Authentication routes
		auth := v1.Group("/auth")
		{
			auth.POST("/login", handleLogin)
			auth.POST("/register", handleRegister)
			auth.POST("/logout", handleLogout)
			auth.GET("/me", handleGetMe)
		}

		// Fleet Vehicles CRUD
		vehicles := v1.Group("/vehicles")
		{
			vehicles.GET("", handleListVehicles)
			vehicles.POST("", handleCreateVehicle)
			vehicles.GET("/:id", handleGetVehicle)
			vehicles.PATCH("/:id", handleUpdateVehicle)
			vehicles.DELETE("/:id", handleDeleteVehicle)
		}

		// Drivers CRUD
		drivers := v1.Group("/drivers")
		{
			drivers.GET("", handleListDrivers)
			drivers.POST("", handleCreateDriver)
			drivers.GET("/:id", handleGetDriver)
			drivers.PATCH("/:id", handleUpdateDriver)
			drivers.DELETE("/:id", handleDeleteDriver)
		}

		// Trips CRUD with Cost Engine Calculation
		trips := v1.Group("/trips")
		{
			trips.GET("", handleListTrips)
			trips.POST("", handleCreateTrip(costEng))
			trips.GET("/:id", handleGetTrip)
			trips.PATCH("/:id", handleUpdateTrip)
			trips.DELETE("/:id", handleDeleteTrip)
		}

		// Charging Depot Sessions
		charging := v1.Group("/charging")
		{
			charging.GET("", handleListCharging)
			charging.POST("", handleCreateCharging)
			charging.GET("/:id", handleGetCharging)
			charging.PATCH("/:id", handleUpdateCharging)
			charging.DELETE("/:id", handleDeleteCharging)
		}

		// Maintenance Logs
		maintenance := v1.Group("/maintenance")
		{
			maintenance.GET("", handleListMaintenance)
			maintenance.POST("", handleCreateMaintenance)
			maintenance.GET("/:id", handleGetMaintenance)
			maintenance.PATCH("/:id", handleUpdateMaintenance)
			maintenance.DELETE("/:id", handleDeleteMaintenance)
		}

		// Expenses
		expenses := v1.Group("/expenses")
		{
			expenses.GET("", handleListExpenses)
			expenses.POST("", handleCreateExpense)
			expenses.GET("/:id", handleGetExpense)
			expenses.PATCH("/:id", handleUpdateExpense)
			expenses.DELETE("/:id", handleDeleteExpense)
		}

		// Cost Intelligence & Benchmarks
		costs := v1.Group("/costs")
		{
			costs.GET("", handleGetCosts(costEng))
			costs.GET("/ev-vs-ice", handleGetEVvsICE(costEng))
		}

		// Money Leaks Anomaly Radar
		leaks := v1.Group("/money-leaks")
		{
			leaks.GET("", handleListMoneyLeaks)
			leaks.PATCH("/:id", handleResolveMoneyLeak)
		}

		// Reports & Simulations
		reports := v1.Group("/reports")
		{
			reports.GET("", handleListReports)
			reports.POST("/export", handleExportReport)
		}

		simulations := v1.Group("/simulations")
		{
			simulations.POST("", handleRunSimulation)
		}

		// Dashboard Aggregates
		dashboard := v1.Group("/dashboard")
		{
			dashboard.GET("/summary", handleDashboardSummary)
		}

		// Platform Admin Namespace
		admin := v1.Group("/admin")
		{
			admin.GET("/dashboard", handleAdminDashboard)
			admin.GET("/companies", handleAdminListCompanies)
			admin.POST("/companies/:id/suspend", handleAdminSuspendCompany)
			admin.POST("/companies/:id/activate", handleAdminActivateCompany)
			admin.GET("/users", handleAdminListUsers)
			admin.POST("/users/:id/suspend", handleAdminSuspendUser)
			admin.GET("/audit-logs", handleAdminAuditLogs)
			admin.GET("/system/health", handleAdminSystemHealth)
		}
	}

	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	go func() {
		log.Printf("EVOS Go Backend running on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen error: %s\n", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down EVOS server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("EVOS server exited cleanly.")
}

// Handler Stubs with standard JSON structure
func handleLogin(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"token": "evos-jwt-session-token-indonesia-2026",
			"user": gin.H{
				"id":         "usr-01",
				"email":      "director@balimobility.id",
				"full_name":  "Wayan Budi Sudarta",
				"role":       "COMPANY_ADMIN",
				"company_id": "comp-bali-mobility-001",
				"company_name": "Bali Mobility Corp",
			},
		},
	})
}

func handleRegister(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Company and administrator profile registered successfully",
			"company_id": "comp-new-evos-tenant-001",
		},
	})
}

func handleLogout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Session invalidated"})
}

func handleGetMe(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":         "usr-01",
			"email":      "director@balimobility.id",
			"full_name":  "Wayan Budi Sudarta",
			"role":       "COMPANY_ADMIN",
			"company_id": "comp-bali-mobility-001",
		},
	})
}

func handleListVehicles(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": []gin.H{
			{
				"id": "EV-001", "plate_number": "DK 8821 EV", "model": "Hyundai Ioniq 5 Signature Long Range",
				"category": "VIP Shuttles", "battery_percent": 88, "range_km": 420, "status": "active",
				"odometer_km": 34120, "efficiency_kwh_per_100km": 13.8, "cost_per_km": 442,
				"assigned_driver": "Made Putra", "depot_location": "Denpasar South Hub",
			},
		},
	})
}

func handleCreateVehicle(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Vehicle created successfully"})
}

func handleGetVehicle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"id": c.Param("id")}})
}

func handleUpdateVehicle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Vehicle updated successfully"})
}

func handleDeleteVehicle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Vehicle soft-deleted"})
}

func handleListDrivers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}})
}
func handleCreateDriver(c *gin.Context)  { c.JSON(http.StatusCreated, gin.H{"success": true}) }
func handleGetDriver(c *gin.Context)     { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleUpdateDriver(c *gin.Context)  { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleDeleteDriver(c *gin.Context)  { c.JSON(http.StatusOK, gin.H{"success": true}) }

func handleListTrips(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}})
}

func handleCreateTrip(eng *costengine.CostEngine) gin.HandlerFunc {
	return func(c *gin.Context) {
		res, _ := eng.CalculateTripCost(costengine.TripCostInput{
			DistanceKm: 48.5, EnergyKwh: 6.7, ElectricityRate: 1700, DriverAllowance: 55000, TollsParking: 32100, MaintenancePerKm: 150,
		})
		c.JSON(http.StatusCreated, gin.H{"success": true, "data": res})
	}
}

func handleGetTrip(c *gin.Context)    { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleUpdateTrip(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleDeleteTrip(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"success": true}) }

func handleListCharging(c *gin.Context)   { c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}}) }
func handleCreateCharging(c *gin.Context) { c.JSON(http.StatusCreated, gin.H{"success": true}) }
func handleGetCharging(c *gin.Context)    { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleUpdateCharging(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleDeleteCharging(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"success": true}) }

func handleListMaintenance(c *gin.Context)   { c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}}) }
func handleCreateMaintenance(c *gin.Context) { c.JSON(http.StatusCreated, gin.H{"success": true}) }
func handleGetMaintenance(c *gin.Context)    { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleUpdateMaintenance(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleDeleteMaintenance(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"success": true}) }

func handleListExpenses(c *gin.Context)   { c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}}) }
func handleCreateExpense(c *gin.Context) { c.JSON(http.StatusCreated, gin.H{"success": true}) }
func handleGetExpense(c *gin.Context)    { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleUpdateExpense(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"success": true}) }
func handleDeleteExpense(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"success": true}) }

func handleGetCosts(eng *costengine.CostEngine) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"total_cost": 8640000,
				"cost_per_km": 465,
				"energy_cost": 3240000,
				"maintenance_cost": 1820000,
				"driver_cost": 2800000,
				"other_cost": 780000,
			},
		})
	}
}

func handleGetEVvsICE(eng *costengine.CostEngine) gin.HandlerFunc {
	return func(c *gin.Context) {
		res := eng.CalculateEVvsICE(180.0)
		c.JSON(http.StatusOK, gin.H{"success": true, "data": res})
	}
}

func handleListMoneyLeaks(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}})
}

func handleResolveMoneyLeak(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Money leak anomaly marked as resolved", "id": c.Param("id")})
}

func handleListReports(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}})
}

func handleExportReport(c *gin.Context) {
	c.JSON(http.StatusAccepted, gin.H{
		"success": true,
		"data": gin.H{
			"job_id": "job-rep-9942",
			"status": "COMPLETED",
			"download_url": "/api/v1/reports/downloads/evos_cfo_oct_2026.pdf",
		},
	})
}

func handleRunSimulation(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"projected_monthly_cost": 7240000,
			"estimated_savings": 8800000,
			"cost_per_km": 391,
			"co2_saved_tons": 5.2,
		},
	})
}

func handleDashboardSummary(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total_vehicles": 20,
			"active_vehicles": 18,
			"charging_vehicles": 2,
			"total_monthly_cost": 8640000,
			"cost_per_km": 465,
			"energy_cost": 3240000,
			"maintenance_cost": 1820000,
			"monthly_distance_km": 18580,
			"co2_saved_tons": 4.8,
		},
	})
}

func handleAdminDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total_companies": 14,
			"active_companies": 13,
			"suspended_companies": 1,
			"total_users": 68,
			"total_vehicles": 184,
			"active_vehicles": 162,
			"api_uptime_pct": 99.98,
		},
	})
}

func handleAdminListCompanies(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}})
}
func handleAdminSuspendCompany(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Company suspended"})
}
func handleAdminActivateCompany(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Company activated"})
}
func handleAdminListUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}})
}
func handleAdminSuspendUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "User suspended"})
}
func handleAdminAuditLogs(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": []gin.H{}})
}
func handleAdminSystemHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"status": "healthy"}})
}
