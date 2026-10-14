"""
Unit & Integration Test Suite for Case 05: The 4 PM Spike Backend
Testing FR-01 through FR-05, safety constraints, and regulatory boundary headers.
"""

import pytest
from fastapi.testclient import TestClient
from main import app, SIMULATION_WATERMARK

client = TestClient(app)


def test_health_check_and_simulation_headers():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["mode"] == "ADVISORY_SIMULATION"
    assert data["simulation_watermark"] == SIMULATION_WATERMARK
    
    # Boundary compliance headers
    assert response.headers.get("X-Synergy-Simulation") == "True"
    assert "Synergy Thermal-Shield" in response.headers.get("X-Synergy-Designation", "")
    assert "PROHIBITED" in response.headers.get("X-Hardware-Actuation", "")


def test_system_overview():
    response = client.get("/api/v1/system/overview")
    assert response.status_code == 200
    data = response.json()
    assert "net_grid_draw_kw" in data
    assert "solar_generation_kw" in data
    assert data["active_ring_fenced_zones"] == 4
    assert data["governance_mode"] == "HUMAN_SUPERVISED_ADVISORY"


def test_fr01_telemetry_normalization_conservation_of_energy():
    """FR-01: Verifies monthly billing totals are decomposed while preserving energy (< 1% error)."""
    payload = {
        "building_id": "BLDG-LEGACY-ADMIN-01",
        "monthly_kwh": 45000.0,
        "month": 10,
        "days_in_month": 30,
        "building_type": "administrative",
        "reference_date": "2026-10-15"
    }
    response = client.post("/api/v1/telemetry/normalize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["building_id"] == "BLDG-LEGACY-ADMIN-01"
    assert len(data["reconstructed_intervals"]) == 24
    
    # Expected daily kWh = 45000 / 30 = 1500 kWh
    assert abs(data["reconstructed_daily_kwh"] - 1500.0) < 5.0
    assert data["conservation_error_pct"] < 1.0


def test_fr02_peak_spike_forecast():
    """FR-02: Verifies detection of the 4 PM - 8 PM peak spike curve and solar collapse."""
    payload = {
        "target_date": "2026-10-15",
        "ambient_temp_max_c": 35.0,
        "ambient_temp_min_c": 22.0,
        "solar_peak_capacity_kw": 650.0,
        "is_exam_period": False
    }
    response = client.post("/api/v1/forecast/peak-spike", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["peak_spike_window"] == "16:00 - 20:00"
    assert len(data["intervals"]) == 24
    
    # Verify solar peak occurs midday and collapses by 17:00
    solar_at_13 = next(i for i in data["intervals"] if i["hour"] == 13)
    solar_at_18 = next(i for i in data["intervals"] if i["hour"] == 18)
    assert solar_at_13["solar_generation_kw"] > 500.0
    assert solar_at_18["solar_generation_kw"] == 0.0

    # Net grid load must be highest in the evening window (16:00 - 20:00)
    assert 16 <= data["peak_hour"] <= 20


def test_fr03_thermal_optimization_schedule_and_acceptance_criteria():
    """
    FR-03: Verifies:
    1. Peak reduction >= 15.0%
    2. Thermal drift index <= 1.5 C
    3. Ring-fenced zones protected
    """
    payload = {
        "target_date": "2026-10-15",
        "pre_cool_start_hour": 13,
        "pre_cool_end_hour": 15,
        "coast_start_hour": 16,
        "coast_end_hour": 20,
        "target_pre_cool_temp_c": 22.1,
        "baseline_comfort_temp_c": 23.5
    }
    response = client.post("/api/v1/optimize/thermal-schedule", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["pre_cooling_window"] == "13:00 - 15:00"
    assert data["coasting_window"] == "16:00 - 20:00"
    
    # Acceptance Criteria Verification
    assert data["peak_reduction_pct"] >= 15.0, f"Expected >= 15%, got {data['peak_reduction_pct']}%"
    assert data["target_reduction_achieved"] is True
    assert data["thermal_drift_index_c"] <= 1.5, f"Thermal drift {data['thermal_drift_index_c']} exceeded 1.5 C"
    assert data["comfort_threshold_satisfied"] is True
    assert data["ring_fenced_zones_exempted"] == 4


def test_fr04_automated_ring_fencing_registry():
    """FR-04: Verifies the immutable registry of critical laboratory and computing assets."""
    response = client.get("/api/v1/safety/ring-fenced-zones")
    assert response.status_code == 200
    zones = response.json()
    assert len(zones) >= 4
    
    zone_ids = [z["zone_id"] for z in zones]
    assert "ZONE-LAB-01" in zone_ids  # BSL-3 Cryo Freezer
    assert "ZONE-LAB-02" in zone_ids  # HPC Cluster
    assert all(z["is_protected"] is True for z in zones)


def test_fr05_human_operator_approval_and_veto_audit_trail():
    """FR-05: Verifies human veto power and cryptographic SHA-256 audit ledger."""
    # Test Approval
    approval_payload = {
        "schedule_id": "SCHED-TEST-2026-10-15",
        "decision": "APPROVED",
        "operator_id": "ENG-SARAH-07",
        "operator_role": "Senior Facilities Controller",
        "comments": "Reviewed weather forecast; pre-cooling curve approved for hostel blocks."
    }
    resp1 = client.post("/api/v1/advisory/decision", json=approval_payload)
    assert resp1.status_code == 200
    rec1 = resp1.json()
    assert rec1["decision"] == "APPROVED"
    assert len(rec1["record_hash"]) == 64  # SHA-256 length

    # Test Veto
    veto_payload = {
        "schedule_id": "SCHED-TEST-2026-10-16",
        "decision": "VETOED",
        "operator_id": "ADMIN-DIRECTOR-01",
        "operator_role": "Campus Operations Director",
        "comments": "Vetoed due to scheduled evening international convocation in Main Auditorium."
    }
    resp2 = client.post("/api/v1/advisory/decision", json=veto_payload)
    assert resp2.status_code == 200
    rec2 = resp2.json()
    assert rec2["decision"] == "VETOED"

    # Audit Trail verification
    trail_resp = client.get("/api/v1/advisory/audit-trail")
    assert trail_resp.status_code == 200
    trail = trail_resp.json()
    assert len(trail) >= 5  # Initial 3 + 2 new
    assert any(item["decision_id"] == rec1["decision_id"] for item in trail)
    assert any(item["decision_id"] == rec2["decision_id"] for item in trail)


def test_alerts_endpoint():
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) >= 1
    assert "Solar Output Cliff" in alerts[0]["title"]
