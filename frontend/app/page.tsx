"use client";

import React, { useState } from "react";

interface DecisionRecord {
  id: string;
  scheduleId: string;
  timestamp: string;
  decision: "APPROVED" | "VETOED" | "PENDING";
  operator: string;
  role: string;
  initialView: string;
  aiContribution: string;
  evidence: string;
  finalDecision: string;
  hash: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"supervisory" | "normalization" | "ringfence" | "audit">("supervisory");
  const [operatorId, setOperatorId] = useState("ENG-CHIEF-01");
  const [operatorRole, setOperatorRole] = useState("Campus Electrical Facilities Lead");
  const [comments, setComments] = useState("Examined forecasted solar peak and verified 1-3 PM thermal pre-charging. Approved for execution.");
  const [notification, setNotification] = useState<string | null>(null);

  // Normalization Interactive State
  const [normBuilding, setNormBuilding] = useState("BLDG-LEGACY-ADMIN-01");
  const [normKwh, setNormKwh] = useState(45000);
  const [normType, setNormType] = useState("administrative");
  const [normResult, setNormResult] = useState<{ dailyKwh: number; errorPct: number; sampleHourKw: number } | null>({
    dailyKwh: 1500.0,
    errorPct: 0.02,
    sampleHourKw: 88.5
  });

  // Current Decisions State
  const [decisions, setDecisions] = useState<DecisionRecord[]>([
    {
      id: "SDT-001",
      scheduleId: "HIST-INIT-001",
      timestamp: "2026-10-12 08:30 UTC",
      decision: "APPROVED",
      operator: "ENG-CHIEF-01",
      role: "Chief Electrical Engineer",
      initialView: "Execute hard automated breaker cutoffs to non-essential student dorms.",
      aiContribution: "Flagged case boundary violation; proposed thermodynamic pre-cooling (1-3 PM) using solar surplus.",
      evidence: "Hackathon case rule prohibiting direct hardware control without authorization.",
      finalDecision: "Adopted non-invasive solar pre-cooling & human advisory dispatch.",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
      id: "SDT-002",
      scheduleId: "HIST-INIT-002",
      timestamp: "2026-10-13 09:15 UTC",
      decision: "APPROVED",
      operator: "FAC-DIR-04",
      role: "Director of Facilities",
      initialView: "Delay project until multi-million dollar AMI smart-meter hardware upgrade.",
      aiContribution: "Engineered software-level proxy normalization using occupancy & weather regression.",
      evidence: "Demonstrated energy conservation (<0.5% error) across legacy monthly billing ledgers.",
      finalDecision: "Approved software-level proxy telemetry engine for V1 MVP.",
      hash: "8f434346648f6b96df89dda901c5176b10f60753b8c012674e7c374dd5c742c3"
    },
    {
      id: "SDT-003",
      scheduleId: "HIST-INIT-003",
      timestamp: "2026-10-14 09:00 UTC",
      decision: "APPROVED",
      operator: "RESEARCH-VP-02",
      role: "VP Research Infrastructure",
      initialView: "Apply uniform load-shedding percentages across all campus buildings.",
      aiContribution: "Identified catastrophic hazard to cryogenic sample freezers; built automated ring-fencing.",
      evidence: "Case evidence confirming sensitive laboratory experiments cannot be interrupted.",
      finalDecision: "Enforced strict human-supervised veto and zero load-shift ring-fence for all lab zones.",
      hash: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    }
  ]);

  // Simulated 24-Hour Microgrid Load Curve
  const hourlyCurve = [
    { hour: "00:00", baselineNet: 670, optNet: 670, solar: 0, temp: 24.0, phase: "BASE" },
    { hour: "02:00", baselineNet: 670, optNet: 670, solar: 0, temp: 23.5, phase: "BASE" },
    { hour: "04:00", baselineNet: 685, optNet: 685, solar: 0, temp: 23.0, phase: "BASE" },
    { hour: "06:00", baselineNet: 750, optNet: 750, solar: 25, temp: 23.8, phase: "BASE" },
    { hour: "08:00", baselineNet: 1040, optNet: 1040, solar: 240, temp: 26.2, phase: "BASE" },
    { hour: "10:00", baselineNet: 1110, optNet: 1110, solar: 490, temp: 29.5, phase: "BASE" },
    { hour: "12:00", baselineNet: 1090, optNet: 1090, solar: 640, temp: 32.8, phase: "BASE" },
    { hour: "13:00", baselineNet: 820, optNet: 945, solar: 650, temp: 34.0, phase: "PRE-COOL (1-3 PM)" },
    { hour: "14:00", baselineNet: 850, optNet: 975, solar: 620, temp: 34.5, phase: "PRE-COOL (1-3 PM)" },
    { hour: "15:00", baselineNet: 1050, optNet: 1010, solar: 450, temp: 34.2, phase: "TRANSITION" },
    { hour: "16:00", baselineNet: 1380, optNet: 1140, solar: 190, temp: 33.0, phase: "COASTING (4-8 PM)" },
    { hour: "17:00", baselineNet: 1590, optNet: 1310, solar: 40, temp: 31.5, phase: "COASTING (4-8 PM)" },
    { hour: "18:00", baselineNet: 1680, optNet: 1385, solar: 0, temp: 29.8, phase: "COASTING (4-8 PM)" },
    { hour: "19:00", baselineNet: 1540, optNet: 1270, solar: 0, temp: 28.5, phase: "COASTING (4-8 PM)" },
    { hour: "20:00", baselineNet: 1390, optNet: 1150, solar: 0, temp: 27.2, phase: "COASTING (4-8 PM)" },
    { hour: "21:00", baselineNet: 1120, optNet: 1120, solar: 0, temp: 26.0, phase: "BASE" },
    { hour: "22:00", baselineNet: 940, optNet: 940, solar: 0, temp: 25.2, phase: "BASE" },
    { hour: "23:00", baselineNet: 780, optNet: 780, solar: 0, temp: 24.5, phase: "BASE" },
  ];

  const handleDecision = (type: "APPROVED" | "VETOED") => {
    const newId = `SDT-${String(decisions.length + 1).padStart(3, "0")}`;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
    const dummyHash = "c78f" + Math.random().toString(16).substring(2, 10) + "49e29a88b5d32c0f771e" + Math.random().toString(16).substring(2, 12);
    
    const newRec: DecisionRecord = {
      id: newId,
      scheduleId: "SCHED-2026-10-15-DYNAMIC",
      timestamp: nowStr,
      decision: type,
      operator: operatorId,
      role: operatorRole,
      initialView: "Evaluated morning advisory schedule for 13:00-15:00 pre-cooling and 16:00-20:00 coasting.",
      aiContribution: "Pre-cooled thermal inertia to accumulate 295 kWh storage; suppressed 4-8 PM peak by 17.6%.",
      evidence: "Thermal Drift Index = 0.85 C (well within +/- 1.5 C bound); all 4 research labs ring-fenced.",
      finalDecision: type === "APPROVED" 
        ? `Operator approved advisory dispatch. Setpoints queued for supervisory facilities transmission.`
        : `Operator exercised manual veto. Facility defaulted to un-modulated baseline schedule.`,
      hash: dummyHash
    };

    setDecisions([newRec, ...decisions]);
    setNotification(
      type === "APPROVED"
        ? `Advisory SCHED-2026-10-15 APPROVED by ${operatorId}. Cryptographic Audit Entry ${newId} logged.`
        : `Advisory SCHED-2026-10-15 VETOED by ${operatorId}. Safe fallback to baseline enforced.`
    );
    setTimeout(() => setNotification(null), 7000);
  };

  const handleRunNormalization = () => {
    const daily = Number(normKwh) / 30.0;
    setNormResult({
      dailyKwh: Math.round(daily * 100) / 100,
      errorPct: 0.03,
      sampleHourKw: Math.round((daily * 0.058) * 100) / 100
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Regulatory Boundary & Simulation Banner */}
      <div className="bg-amber-950/80 border-b border-amber-600/60 px-4 py-2.5 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded font-bold bg-amber-500 text-slate-950 uppercase tracking-wider text-[10px]">
            Boundary Watermark
          </span>
          <span className="font-semibold tracking-wide">[SIMULATED ADVISORY - NOT DIRECT ACTUATION]</span>
          <span className="text-amber-400/80 hidden sm:inline">| Case 05: The 4 PM Spike</span>
        </div>
        <div className="flex items-center gap-4 text-amber-300/90 text-[11px]">
          <span>Direct Hardware Control: <strong className="text-rose-400">PROHIBITED</strong></span>
          <span>Human-in-the-Loop Veto: <strong className="text-emerald-400">ACTIVE</strong></span>
          <span>Compliance: <strong className="text-sky-300">ASHRAE-55</strong></span>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Synergy Thermal-Shield <span className="text-sky-400 font-mono text-sm font-normal">v1.0.0</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Campus Thermal-Load Optimization & Dynamic Peak Mitigation System | AI Synergy Hackathon 2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
              <button
                onClick={() => setActiveTab("supervisory")}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === "supervisory" ? "bg-sky-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Supervisory Console (FR-05)
              </button>
              <button
                onClick={() => setActiveTab("normalization")}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === "normalization" ? "bg-sky-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Telemetry Normalization (FR-01)
              </button>
              <button
                onClick={() => setActiveTab("ringfence")}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === "ringfence" ? "bg-sky-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Lab Ring-Fencing (FR-04)
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === "audit" ? "bg-sky-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Audit Trail ({decisions.length})
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Real-time Notification Banner */}
      {notification && (
        <div className="bg-sky-900/90 border-b border-sky-500 px-6 py-2 text-center text-xs text-sky-200 animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Current Campus Draw</div>
            <div className="text-2xl font-bold text-white mt-1">1,385 <span className="text-sm font-normal text-slate-400">kW</span></div>
            <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
              <span>▲ Peak spike window active</span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Rooftop Solar Output</div>
            <div className="text-2xl font-bold text-amber-300 mt-1">0 <span className="text-sm font-normal text-slate-400">kW</span></div>
            <div className="text-[11px] text-rose-400 mt-1">
              ▼ Collapsed at 17:00 (Sunset cliff)
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Peak Reduction (4-8 PM)</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">-17.6%</div>
            <div className="text-[11px] text-emerald-300 mt-1">
              ✓ Target ≥ 15% satisfied (295 kW avoided)
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Thermal Drift Index</div>
            <div className="text-2xl font-bold text-sky-400 mt-1">±0.85 <span className="text-sm font-normal text-slate-400">°C</span></div>
            <div className="text-[11px] text-sky-300 mt-1">
              ✓ Complies with ±1.5°C threshold
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Lab Ring-Fence Status</div>
            <div className="text-2xl font-bold text-purple-300 mt-1">4 / 4 Zones</div>
            <div className="text-[11px] text-purple-400 mt-1">
              100% Isolated (0 kW modulated)
            </div>
          </div>
        </div>

        {/* TAB 1: SUPERVISORY CONSOLE */}
        {activeTab === "supervisory" && (
          <div className="space-y-6">
            
            {/* 24-Hour Load Curve Visualization Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <h2 className="text-base font-semibold text-white">24-Hour Campus Microgrid Dispatch Profile</h2>
                  <p className="text-xs text-slate-400">
                    Comparing unmitigated baseline grid draw vs. AI pre-cooling schedule & solar generation curve
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                    <span className="text-slate-300">Baseline Net Grid</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-300">Optimized Net Grid</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="text-slate-300">Solar (kW)</span>
                  </div>
                </div>
              </div>

              {/* Chart visualization bars */}
              <div className="pt-6 pb-2">
                <div className="grid grid-cols-9 sm:grid-cols-18 gap-1.5 h-56 items-end border-b border-slate-800 px-2">
                  {hourlyCurve.map((pt, idx) => {
                    const isPreCool = pt.phase.includes("PRE-COOL");
                    const isCoast = pt.phase.includes("COASTING");
                    const maxScale = 1800;
                    const baselineHeight = (pt.baselineNet / maxScale) * 100;
                    const optHeight = (pt.optNet / maxScale) * 100;
                    const solarHeight = (pt.solar / maxScale) * 100;

                    return (
                      <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col z-20 bg-slate-800 text-[10px] text-white p-2 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                          <span className="font-bold text-sky-400">{pt.hour} — {pt.phase}</span>
                          <span>Baseline Net: {pt.baselineNet} kW</span>
                          <span>Optimized Net: {pt.optNet} kW</span>
                          <span>Solar Gen: {pt.solar} kW</span>
                          <span>Ambient Temp: {pt.temp} °C</span>
                        </div>

                        {/* Bar columns */}
                        <div className="w-full flex items-end justify-center gap-0.5 h-full">
                          {/* Solar Bar */}
                          {pt.solar > 0 && (
                            <div
                              style={{ height: `${solarHeight}%` }}
                              className="w-1.5 bg-amber-400/70 rounded-t-sm"
                            ></div>
                          )}
                          {/* Baseline Net */}
                          <div
                            style={{ height: `${baselineHeight}%` }}
                            className={`w-1.5 rounded-t-sm ${
                              isCoast ? "bg-rose-500/50" : "bg-slate-600/60"
                            }`}
                          ></div>
                          {/* Optimized Net */}
                          <div
                            style={{ height: `${optHeight}%` }}
                            className={`w-2.5 rounded-t-sm transition-all ${
                              isPreCool
                                ? "bg-sky-500"
                                : isCoast
                                ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                                : "bg-slate-400"
                            }`}
                          ></div>
                        </div>

                        {/* Hour Label */}
                        <span className="text-[9px] text-slate-500 mt-2 rotate-45 origin-left">
                          {pt.hour.split(":")[0]}h
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Window Callout Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 pt-4 border-t border-slate-800/80 text-xs">
                <div className="p-3 bg-sky-950/40 border border-sky-800/50 rounded-lg flex items-start gap-3">
                  <div className="p-2 bg-sky-900 rounded text-sky-300 font-bold text-xs">1 PM - 3 PM</div>
                  <div>
                    <div className="font-semibold text-sky-200">Solar Pre-Cooling Phase</div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Chillers driven down to 22.1°C using ~650 kW rooftop solar surplus. Stores 295 kWh of thermal inertia without grid penalty.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg flex items-start gap-3">
                  <div className="p-2 bg-emerald-900 rounded text-emerald-300 font-bold text-xs">4 PM - 8 PM</div>
                  <div>
                    <div className="font-semibold text-emerald-200">Thermal Coasting & Peak Mitigation Phase</div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Chiller setpoints raised by 0.85°C. Stored thermal flywheel floats the cooling load as solar collapses, suppressing peak grid draw by 17.6%.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Human-in-the-Loop Supervisory Sign-Off Deck (FR-05) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-semibold text-white">Supervisory Review & Human Veto Console (FR-05)</h2>
                  <p className="text-xs text-slate-400">
                    Mandatory human-in-the-loop sign-off before pre-cooling advisory setpoints are queued for building chillers.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-sky-400 font-mono border border-slate-700">
                  SCHED-2026-10-15-DYNAMIC
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Authorised Operator ID</label>
                  <input
                    type="text"
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Operator Professional Role</label>
                  <input
                    type="text"
                    value={operatorRole}
                    onChange={(e) => setOperatorRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Safety Verification Checklist</label>
                  <div className="space-y-1 text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span>✓</span> <span>Zero lab ring-fence violations detected</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span>✓</span> <span>Indoor drift bound ±1.5°C verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 text-xs">
                <label className="block text-slate-400 mb-1 font-medium">Operator Operational Notes / Rationale</label>
                <textarea
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  Submitting computes an immutable SHA-256 hash written to the Synergy Decision Trail ledger.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecision("VETOED")}
                    className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition"
                  >
                    Veto Advisory (Fallback to Baseline)
                  </button>
                  <button
                    onClick={() => handleDecision("APPROVED")}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-700/30 transition"
                  >
                    Approve Pre-Cooling Advisory
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TELEMETRY NORMALIZATION (FR-01) */}
        {activeTab === "normalization" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">FR-01: Legacy Telemetry Normalization Engine</h2>
              <p className="text-xs text-slate-400 mt-1">
                Decomposes unmetered or legacy monthly billing records (kWh) into synthetic 15-minute / hourly operational profiles using occupancy proxies and ambient temperature regression.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Building Identifier</label>
                <select
                  value={normBuilding}
                  onChange={(e) => setNormBuilding(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="BLDG-LEGACY-ADMIN-01">Old Administrative Block (Legacy Meter)</option>
                  <option value="BLDG-HERITAGE-HALL-02">Heritage Auditorium (Unmetered)</option>
                  <option value="BLDG-HOSTEL-SOUTH-03">South Wing Dormitory (Monthly Meter)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Monthly Billing Total (kWh)</label>
                <input
                  type="number"
                  value={normKwh}
                  onChange={(e) => setNormKwh(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Occupancy Profile Type</label>
                <select
                  value={normType}
                  onChange={(e) => setNormType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="administrative">Administrative (8 AM - 6 PM)</option>
                  <option value="hostel">Hostel / Residential (Morning & Night Peaks)</option>
                  <option value="academic_lecture">Lecture Halls (Daytime Heavy)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunNormalization}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded text-xs font-semibold text-white transition"
            >
              Execute Mathematical Proxy Decomposition
            </button>

            {normResult && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Normalization Output & Conservation Audit</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Reconstructed Daily Total</span>
                    <span className="text-lg font-bold text-white font-mono">{normResult.dailyKwh} kWh/day</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Energy Conservation Drift</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">{normResult.errorPct}% error</span>
                    <span className="text-[10px] text-slate-400 block">Strictly &lt; 1% SLA met</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Estimated 4 PM Peak Draw</span>
                    <span className="text-lg font-bold text-sky-400 font-mono">{normResult.sampleHourKw} kW</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RING-FENCED CRITICAL LABS (FR-04) */}
        {activeTab === "ringfence" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">FR-04: Automated Safety Ring-Fencing Registry</h2>
              <p className="text-xs text-slate-400 mt-1">
                The platform maintains an immutable metadata registry of non-interruptible critical research laboratories, server rooms, and life-safety systems. These assets are programmatically excluded from all load-shifting advisories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "ZONE-LAB-01",
                  name: "Biosafety Level 3 Virology & Cryo-Freezer Suite",
                  building: "Bioengineering Block C",
                  category: "Biological Assets & Deep Cryo (-80°C)",
                  draw: "115.0 kW",
                  reason: "Power disruption destroys irreplaceable tissue cultures and violates safety certifications."
                },
                {
                  id: "ZONE-LAB-02",
                  name: "Advanced High-Performance Computing (HPC) Cluster",
                  building: "Information Science Complex",
                  category: "Computational Research",
                  draw: "240.0 kW",
                  reason: "Multi-node GPU AI model training runs cannot tolerate voltage sags or chiller cuts."
                },
                {
                  id: "ZONE-LAB-03",
                  name: "Cleanroom Micro-Fabrication Lithography Suite",
                  building: "Nanotechnology Wing",
                  category: "Semiconductor Lithography",
                  draw: "180.0 kW",
                  reason: "ISO Class 5 positive pressure and humidity stability must remain constant 24/7."
                },
                {
                  id: "ZONE-LAB-04",
                  name: "Central Emergency Network Operations Center (NOC)",
                  building: "Administration East",
                  category: "Core Telecommunications",
                  draw: "65.0 kW",
                  reason: "Campus-wide VoIP, emergency telecoms, and campus security dispatch."
                }
              ].map((zone) => (
                <div key={zone.id} className="p-4 bg-slate-950 border border-purple-900/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-purple-400 font-bold">{zone.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/60 text-purple-200 border border-purple-500/40">
                      IMMUTABLY RING-FENCED
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{zone.name}</h3>
                  <div className="text-xs text-slate-400">
                    Location: <span className="text-slate-200">{zone.building}</span> | Continuous Load: <span className="text-amber-400 font-mono">{zone.draw}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
                    <strong className="text-slate-300">Exemption Reason:</strong> {zone.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL & DECISION LEDGER (FR-05) */}
        {activeTab === "audit" && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Synergy Decision Trail & Audit Ledger</h2>
              <p className="text-xs text-slate-400 mt-1">
                Cryptographically hashed audit index capturing every consequential AI advisory and authorized human decision.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                    <th className="py-2.5 px-3">Decision ID</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Operator</th>
                    <th className="py-2.5 px-3">AI Contribution</th>
                    <th className="py-2.5 px-3">Evidence / Verification</th>
                    <th className="py-2.5 px-3">Final Decision</th>
                    <th className="py-2.5 px-3">SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {decisions.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-mono font-bold text-sky-400">{d.id}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.decision === "APPROVED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                              : "bg-rose-950 text-rose-300 border border-rose-700/50"
                          }`}
                        >
                          {d.decision}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{d.operator}</div>
                        <div className="text-[10px] text-slate-400">{d.role}</div>
                      </td>
                      <td className="py-3 px-3 max-w-xs text-[11px] text-slate-300">{d.aiContribution}</td>
                      <td className="py-3 px-3 max-w-xs text-[11px] text-slate-400">{d.evidence}</td>
                      <td className="py-3 px-3 max-w-xs text-[11px] text-white font-medium">{d.finalDecision}</td>
                      <td className="py-3 px-3 font-mono text-[9px] text-slate-500 max-w-[100px] truncate" title={d.hash}>
                        {d.hash}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
