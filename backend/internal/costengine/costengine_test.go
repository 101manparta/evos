package costengine

import (
	"testing"
)

func TestCalculateTripCost(t *testing.T) {
	engine := New()

	input := TripCostInput{
		DistanceKm:       180.0,
		EnergyKwh:        27.0,
		ElectricityRate:  1700.0,
		DriverAllowance:  100000.0,
		TollsParking:     50000.0,
		MaintenancePerKm: 150.0,
	}

	result, err := engine.CalculateTripCost(input)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expectedCharging := 27.0 * 1700.0 // 45,900
	if result.ChargingCost != expectedCharging {
		t.Errorf("expected charging cost %v, got %v", expectedCharging, result.ChargingCost)
	}

	expectedMaintenance := 180.0 * 150.0 // 27,000
	if result.MaintenanceAllocation != expectedMaintenance {
		t.Errorf("expected maintenance %v, got %v", expectedMaintenance, result.MaintenanceAllocation)
	}

	expectedTotal := 45900.0 + 100000.0 + 50000.0 + 27000.0 // 222,900
	if result.TotalActualCost != expectedTotal {
		t.Errorf("expected total cost %v, got %v", expectedTotal, result.TotalActualCost)
	}

	expectedCostPerKm := 1238.0 // 222900 / 180 = 1238.33 -> 1238
	if result.CostPerKm != expectedCostPerKm {
		t.Errorf("expected cost per km %v, got %v", expectedCostPerKm, result.CostPerKm)
	}
}

func TestCalculateEVvsICE(t *testing.T) {
	engine := New()
	result := engine.CalculateEVvsICE(180.0)

	if result.TripEVCost >= result.TripICECost {
		t.Errorf("EV trip cost should be significantly less than ICE trip cost")
	}

	if result.SavingsPct <= 0 {
		t.Errorf("Savings percentage should be strictly positive")
	}
}
