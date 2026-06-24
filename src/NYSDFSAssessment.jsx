import { useState } from "react";

// ── DESIGN TOKENS — navy/gold, financial services authority ──────────────────
const C = {
  bg: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF4FB",
  border: "#D1D5DB",
  borderBright: "rgba(30,91,168,0.4)",
  darkNavy: "#0B1E3D",
  accent: "#1E5BA8",
  accentDim: "rgba(30,91,168,0.1)",
  gold: "#B8860B",
  goldDim: "rgba(184,134,11,0.1)",
  text: "#1F2937",
  textMid: "#6B7280",
  textDim: "#9CA3AF",
  green: "#065F46",
  greenBg: "#D1FAE5",
  amber: "#92400E",
  amberBg: "#FEF3C7",
  red: "#991B1B",
  redBg: "#FEE2E2",
};

// ── ASSESSMENT DATA — 6 categories mirroring the 14-template kit ─────────────
const CATEGORIES = [
  {
    id: "governance", title: "Governance & Program", icon: "\ud83c\udfdb\ufe0f", weight: 18, color: C.accent,
    questions: [
      { id: "g1", text: "A CISO has been appointed and documented", risk: "high", template: "01" },
      { id: "g2", text: "Senior governing body exercises documented cybersecurity oversight", risk: "high", template: "01" },
      { id: "g3", text: "Cybersecurity program policy has been approved by a senior officer within the last 12 months", risk: "high", template: "01" },
      { id: "g4", text: "All 14 required policy areas are covered (incl. data retention, end-of-life mgmt)", risk: "medium", template: "01" },
      { id: "g5", text: "The cybersecurity program is based on a documented Risk Assessment", risk: "high", template: "02" },
    ],
  },
  {
    id: "risk_asset", title: "Risk Assessment & Asset Inventory", icon: "\ud83d\udccb", weight: 18, color: "#0E7490",
    questions: [
      { id: "r1", text: "A Risk Assessment has been completed and reflects the current environment", risk: "high", template: "02" },
      { id: "r2", text: "The Risk Assessment is a true risk analysis, not just a checklist", risk: "high", template: "02" },
      { id: "r3", text: "A complete written asset inventory is maintained", risk: "high", template: "03" },
      { id: "r4", text: "The asset inventory tracks owner, location, classification, support expiration, and RTO", risk: "high", template: "03" },
      { id: "r5", text: "The asset inventory is reconciled on a regular schedule", risk: "medium", template: "03" },
    ],
  },
  {
    id: "access_mfa", title: "Access Controls & MFA", icon: "\ud83d\udd10", weight: 20, color: "#1E40AF",
    questions: [
      { id: "a1", text: "Access to systems with NPI is limited to 'need to know' individuals", risk: "high", template: "04" },
      { id: "a2", text: "The number of privileged accounts is minimized", risk: "medium", template: "04" },
      { id: "a3", text: "Privileged accounts are used only for privileged functions", risk: "medium", template: "04" },
      { id: "a4", text: "Access privileges are reviewed at least annually", risk: "high", template: "04" },
      { id: "a5", text: "Access is promptly terminated following personnel departures", risk: "high", template: "04" },
      { id: "a6", text: "MFA is implemented for remote access to information systems", risk: "high", template: "05" },
      { id: "a7", text: "MFA is implemented for remote access to third-party applications", risk: "high", template: "05" },
      { id: "a8", text: "MFA is implemented for all privileged accounts", risk: "high", template: "05" },
    ],
  },
  {
    id: "tpsp_vuln", title: "Third-Party Risk & Vulnerability Mgmt", icon: "\ud83e\udd1d", weight: 16, color: "#B45309",
    questions: [
      { id: "t1", text: "A complete TPSP inventory is maintained", risk: "medium", template: "06" },
      { id: "t2", text: "Due diligence is conducted before onboarding TPSPs with NPI access", risk: "high", template: "06" },
      { id: "t3", text: "TPSPs are periodically reassessed", risk: "medium", template: "06" },
      { id: "t4", text: "Automated vulnerability scans are conducted regularly", risk: "high", template: "07" },
      { id: "t5", text: "Annual penetration testing is conducted from inside and outside the systems boundary", risk: "high", template: "07" },
    ],
  },
  {
    id: "incident", title: "Incident Response & Notification", icon: "\ud83d\udea8", weight: 18, color: C.red,
    questions: [
      { id: "i1", text: "A written Incident Response Plan is documented", risk: "high", template: "08" },
      { id: "i2", text: "The IR plan has been tested (tabletop or live exercise)", risk: "medium", template: "08" },
      { id: "i3", text: "A reportability determination process is documented for the 72-hour rule", risk: "high", template: "09" },
      { id: "i4", text: "The organization can file the Annual Certification with dual signatures by April 15", risk: "high", template: "10" },
      { id: "i5", text: "An Acknowledgment of Noncompliance procedure is documented for known gaps", risk: "medium", template: "11" },
    ],
  },
  {
    id: "retention_classA", title: "Data Retention & Class A", icon: "\ud83c\udfe6", weight: 10, color: "#7C3AED",
    questions: [
      { id: "d1", text: "A documented data retention and disposal policy is in place", risk: "medium", template: "12" },
      { id: "d2", text: "Class A Company status has been formally determined and documented", risk: "low", template: "13" },
      { id: "d3", text: "If Class A: independent audit, PAM, and EDR requirements are met", risk: "high", template: "13" },
    ],
  },
];

const ALL_QUESTIONS = CATEGORIES.flatMap(c => c.questions);

const STATUS_OPTIONS = [
  { v: "yes", label: "Yes", color: C.green, bg: C.greenBg, score: 1 },
  { v: "partial", label: "Partial", color: C.amber, bg: C.amberBg, score: 0.5 },
  { v: "no", label: "No", color: C.red, bg: C.redBg, score: 0 },
  { v: "na", label: "N/A", color: C.textMid, bg: "#F3F4F6", score: 1 },
];

const RISK_COLORS = { high: C.red, medium: C.amber, low: C.green };
const RISK_BG = { high: C.redBg, medium: C.amberBg, low: C.greenBg };

function getRiskLevel(score) {
  if (score >= 85) return { label: "Examination Ready", color: C.green, bg: C.greenBg, desc: "Strong compliance posture. Maintain documentation and prepare for your next certification cycle." };
  if (score >= 65) return { label: "Moderate Risk", color: C.amber, bg: C.amberBg, desc: "Meaningful gaps exist. NYDFS cites missing risk assessments and TPSP procedures as material noncompliance — prioritize these first." };
  if (score >= 40) return { label: "Elevated Risk", color: "#C2410C", bg: "#FFEDD5", desc: "Significant gaps detected. These are exactly the findings NYDFS scrutinizes in examinations and investigations." };
  return { label: "Critical Risk", color: C.red, bg: C.redBg, desc: "Major Part 500 gaps. NYDFS has levied fines up to $30 million for cybersecurity compliance failures." };
}

function ScoreDial({ score, size = 130 }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const risk = getRiskLevel(score);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={size*0.09} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={risk.color} strokeWidth={size*0.09}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x={size/2} y={size/2 - 2} textAnchor="middle" fontSize={size*0.24} fontWeight="800" fill={risk.color} fontFamily="Georgia, serif">{score}</text>
        <text x={size/2} y={size/2 + size*0.16} textAnchor="middle" fontSize={size*0.1} fill={C.textMid} fontFamily="Georgia, serif">/ 100</text>
      </svg>
      <div style={{
        background: risk.bg, color: risk.color, fontWeight: 700, fontSize: 13,
        padding: "4px 14px", borderRadius: 20, border: `1px solid ${risk.color}30`,
      }}>{risk.label}</div>
    </div>
  );
}

function CategoryBar({ cat, answers }) {
  const qs = cat.questions;
  const score = Math.round(
    (qs.reduce((sum, q) => sum + (STATUS_OPTIONS.find(s => s.v === answers[q.id])?.score ?? 0), 0) / qs.length) * 100
  );
  const answered = qs.filter(q => answers[q.id]).length;
  const color = score >= 80 ? C.green : score >= 60 ? C.amber : C.red;

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{cat.icon} {cat.title}</span>
        <span style={{ fontSize: 12, color, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ background: "#E5E7EB", borderRadius: 4, height: 7, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
      <div style={{ fontSize: 10, color: C.textDim, marginTop: 3 }}>{answered}/{qs.length} answered</div>
    </div>
  );
}

// ── CLASS A DETERMINATION SUB-TOOL ────────────────────────────────────────────
function ClassADeterminer() {
  const [revenue20M, setRevenue20M] = useState(null);
  const [employees2000, setEmployees2000] = useState(null);
  const [revenue1B, setRevenue1B] = useState(null);

  let result = null;
  if (revenue20M !== null) {
    if (revenue20M === false) {
      result = { isClassA: false, reason: "Does not meet the $20M NY revenue threshold." };
    } else if (employees2000 !== null && revenue1B !== null) {
      const isClassA = employees2000 || revenue1B;
      result = {
        isClassA,
        reason: isClassA
          ? "Meets $20M+ NY revenue AND (2,000+ employees OR $1B+ global revenue)."
          : "Meets $20M+ NY revenue but neither the employee nor global revenue threshold.",
      };
    }
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>\ud83c\udfe6 Class A Determination</div>
      <div style={{ fontSize: 11, color: C.textMid, marginBottom: 14, fontFamily: "Helvetica, sans-serif" }}>Answer 3 questions to check your status</div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.text, marginBottom: 6, fontFamily: "Helvetica, sans-serif" }}>
          At least $20M in gross annual NY revenue (last 2 fiscal years)?
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[true, false].map(v => (
            <button key={String(v)} onClick={() => setRevenue20M(v)} style={{
              padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "Helvetica, sans-serif",
              background: revenue20M === v ? C.accentDim : "transparent",
              color: revenue20M === v ? C.accent : C.textMid,
              border: `1px solid ${revenue20M === v ? C.accent : C.border}`,
            }}>{v ? "Yes" : "No"}</button>
          ))}
        </div>
      </div>

      {revenue20M === true && (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: C.text, marginBottom: 6, fontFamily: "Helvetica, sans-serif" }}>
              More than 2,000 employees (incl. affiliates), averaged over 2 fiscal years?
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => setEmployees2000(v)} style={{
                  padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Helvetica, sans-serif",
                  background: employees2000 === v ? C.accentDim : "transparent",
                  color: employees2000 === v ? C.accent : C.textMid,
                  border: `1px solid ${employees2000 === v ? C.accent : C.border}`,
                }}>{v ? "Yes" : "No"}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: C.text, marginBottom: 6, fontFamily: "Helvetica, sans-serif" }}>
              More than $1B in gross annual global revenue (last 2 fiscal years)?
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => setRevenue1B(v)} style={{
                  padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Helvetica, sans-serif",
                  background: revenue1B === v ? C.accentDim : "transparent",
                  color: revenue1B === v ? C.accent : C.textMid,
                  border: `1px solid ${revenue1B === v ? C.accent : C.border}`,
                }}>{v ? "Yes" : "No"}</button>
              ))}
            </div>
          </div>
        </>
      )}

      {result && (
        <div style={{
          marginTop: 14, padding: "14px 16px", borderRadius: 10,
          background: result.isClassA ? C.goldDim : C.greenBg,
          border: `1px solid ${result.isClassA ? C.gold : C.green}40`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: result.isClassA ? C.gold : C.green, marginBottom: 4 }}>
            {result.isClassA ? "\u2713 Class A Company" : "Not a Class A Company"}
          </div>
          <div style={{ fontSize: 11, color: C.textMid, fontFamily: "Helvetica, sans-serif", lineHeight: 1.5 }}>{result.reason}</div>
          {result.isClassA && (
            <div style={{ fontSize: 11, color: C.text, marginTop: 8, fontFamily: "Helvetica, sans-serif" }}>
              \u2192 See Template 13 for independent audit, PAM, and EDR requirements.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NYSDFSAssessment() {
  const [answers, setAnswers] = useState({});
  const [activeCategory, setActiveCategory] = useState(0);
  const [view, setView] = useState("assess");
  const [orgName, setOrgName] = useState("");
  const [animIn, setAnimIn] = useState(true);

  const answeredCount = Object.keys(answers).length;
  const totalCount = ALL_QUESTIONS.length;
  const progress = Math.round((answeredCount / totalCount) * 100);

  const overallScore = totalCount === 0 ? 0 : Math.round(
    (ALL_QUESTIONS.reduce((sum, q) => sum + (STATUS_OPTIONS.find(s => s.v === answers[q.id])?.score ?? 0), 0) / totalCount) * 100
  );

  const gaps = ALL_QUESTIONS
    .filter(q => answers[q.id] === "no" || answers[q.id] === "partial")
    .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.risk] - ({ high: 0, medium: 1, low: 2 }[b.risk])));

  const risk = getRiskLevel(overallScore);

  function setAnswer(qId, val) {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  }

  function switchCategory(idx) {
    setAnimIn(false);
    setTimeout(() => { setActiveCategory(idx); setAnimIn(true); }, 150);
  }

  const cat = CATEGORIES[activeCategory];
  const catAnswered = cat.questions.filter(q => answers[q.id]).length;
  const catComplete = catAnswered === cat.questions.length;

  const templateNames = {
    "01": "Cybersecurity Program Policy", "02": "Cybersecurity Risk Assessment",
    "03": "Asset Inventory Program", "04": "Access Privileges & PAM Policy",
    "05": "MFA Policy & Implementation Record", "06": "TPSP Risk Management Policy",
    "07": "Vulnerability Mgmt & Pen Testing", "08": "Incident Response Plan",
    "09": "72-Hour Notification Procedure", "10": "Annual Certification of Material Compliance",
    "11": "Acknowledgment of Noncompliance", "12": "Data Retention & Disposal Policy",
    "13": "Class A Supplemental Requirements", "14": "NYSDFS Compliance Checklist",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Georgia', serif", color: C.text }}>
      {/* Header */}
      <div style={{
        background: C.darkNavy, borderBottom: `3px solid ${C.gold}`,
        padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#BFD3EC", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2, fontFamily: "Helvetica, sans-serif" }}>
            NYSDFS 23 NYCRR 500 Kit
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#fff" }}>
            Compliance Readiness Tool
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#BFD3EC", fontFamily: "Helvetica, sans-serif" }}>Progress</div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#fff" }}>{progress}%</div>
          </div>
          {view === "assess" ? (
            <button onClick={() => setView("results")} style={{
              background: "#fff", color: C.darkNavy, border: "none", borderRadius: 8,
              padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "Helvetica, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}>View Results \u2192</button>
          ) : (
            <button onClick={() => setView("assess")} style={{
              background: "transparent", color: "#BFD3EC", border: "1px solid #BFD3EC",
              borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "Helvetica, sans-serif",
            }}>\u2190 Back to Assessment</button>
          )}
        </div>
      </div>

      {view === "assess" ? (
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "270px 1fr", gap: 24 }}>
          {/* Sidebar */}
          <div>
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: "22px 16px", marginBottom: 16, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontFamily: "Helvetica, sans-serif" }}>Live Score</div>
              <ScoreDial score={answeredCount > 0 ? overallScore : 0} />
              <div style={{ fontSize: 11, color: C.textMid, marginTop: 10, fontFamily: "Helvetica, sans-serif", lineHeight: 1.5 }}>{risk.desc}</div>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontFamily: "Helvetica, sans-serif" }}>Categories</div>
              {CATEGORIES.map((c, i) => {
                const done = c.questions.filter(q => answers[q.id]).length;
                const isActive = i === activeCategory;
                return (
                  <button key={c.id} onClick={() => switchCategory(i)} style={{
                    width: "100%", textAlign: "left", background: isActive ? C.accentDim : "transparent",
                    border: isActive ? `1px solid ${C.borderBright}` : "1px solid transparent",
                    borderRadius: 8, padding: "8px 10px", marginBottom: 4, cursor: "pointer",
                    color: isActive ? C.darkNavy : C.textMid, fontSize: 12,
                    fontFamily: "Helvetica, sans-serif", fontWeight: isActive ? 700 : 400,
                    display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s",
                  }}>
                    <span>{c.icon} {c.title}</span>
                    <span style={{
                      fontSize: 10, background: done === c.questions.length ? C.green : done > 0 ? C.amber : "#D1D5DB",
                      color: "white", borderRadius: 10, padding: "1px 7px", minWidth: 28, textAlign: "center",
                    }}>{done}/{c.questions.length}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontFamily: "Helvetica, sans-serif" }}>Breakdown</div>
              {CATEGORIES.map(c => <CategoryBar key={c.id} cat={c} answers={answers} />)}
            </div>

            <ClassADeterminer />
          </div>

          {/* Main panel */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px 32px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.15s, transform 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{cat.icon} {cat.title}</div>
                <div style={{ fontSize: 12, color: C.textMid, marginTop: 4, fontFamily: "Helvetica, sans-serif" }}>
                  {catAnswered} of {cat.questions.length} questions answered
                  {catComplete && <span style={{ color: C.green, marginLeft: 8 }}>\u2713 Complete</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: cat.color, background: cat.color + "15", padding: "4px 12px", borderRadius: 20, fontFamily: "Helvetica, sans-serif" }}>
                Weight: {cat.weight}%
              </div>
            </div>

            {cat.questions.map((q, qi) => {
              const current = answers[q.id];
              return (
                <div key={q.id} style={{
                  background: current ? C.bg : "#FAFAFA",
                  border: `1px solid ${current ? C.borderBright : "#E5E7EB"}`,
                  borderRadius: 12, padding: "16px 20px", marginBottom: 12, transition: "all 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      minWidth: 24, height: 24, borderRadius: "50%",
                      background: current ? C.accentDim : "#F3F4F6",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: current ? C.accent : C.textDim,
                      fontFamily: "Helvetica, sans-serif", flexShrink: 0, marginTop: 1,
                    }}>{qi + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: C.text, lineHeight: 1.5, marginBottom: 6 }}>{q.text}</div>
                      <span style={{
                        fontSize: 10, background: RISK_BG[q.risk], color: RISK_COLORS[q.risk],
                        padding: "2px 8px", borderRadius: 10, fontFamily: "Helvetica, sans-serif", fontWeight: 700,
                      }}>{q.risk.toUpperCase()} RISK</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, paddingLeft: 36 }}>
                    {STATUS_OPTIONS.map(opt => (
                      <button key={opt.v} onClick={() => setAnswer(q.id, opt.v)} style={{
                        padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                        fontFamily: "Helvetica, sans-serif", cursor: "pointer",
                        background: current === opt.v ? opt.bg : "#fff",
                        color: current === opt.v ? opt.color : C.textMid,
                        border: current === opt.v ? `1.5px solid ${opt.color}` : "1px solid #D1D5DB",
                        transition: "all 0.15s", transform: current === opt.v ? "scale(1.05)" : "scale(1)",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button onClick={() => switchCategory(Math.max(0, activeCategory - 1))} disabled={activeCategory === 0}
                style={{
                  background: "transparent", color: activeCategory === 0 ? "#D1D5DB" : C.accent,
                  border: `1px solid ${activeCategory === 0 ? "#E5E7EB" : C.accent}`,
                  borderRadius: 8, padding: "10px 20px", fontSize: 13,
                  cursor: activeCategory === 0 ? "not-allowed" : "pointer",
                  fontFamily: "Helvetica, sans-serif", fontWeight: 600,
                }}>\u2190 Previous</button>
              {activeCategory < CATEGORIES.length - 1 ? (
                <button onClick={() => switchCategory(activeCategory + 1)} style={{
                  background: C.darkNavy, color: "white", border: "none", borderRadius: 8,
                  padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Helvetica, sans-serif", boxShadow: "0 4px 12px rgba(11,30,61,0.3)",
                }}>Next Section \u2192</button>
              ) : (
                <button onClick={() => setView("results")} style={{
                  background: C.green, color: "white", border: "none", borderRadius: 8,
                  padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Helvetica, sans-serif", boxShadow: "0 4px 12px rgba(6,95,70,0.3)",
                }}>\u2713 Complete \u2014 View Results \u2192</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "18px 26px", marginBottom: 22, display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <span style={{ fontSize: 14, color: C.textMid, fontFamily: "Helvetica, sans-serif", whiteSpace: "nowrap" }}>Covered Entity:</span>
            <input value={orgName} onChange={e => setOrgName(e.target.value)}
              placeholder="Enter your organization name for the report..."
              style={{
                flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: "10px 14px", color: C.text, fontSize: 14, fontFamily: "Georgia, serif", outline: "none",
              }} />
          </div>

          <div style={{
            background: C.darkNavy, borderRadius: 20, padding: "40px",
            marginBottom: 22, display: "flex", alignItems: "center", gap: 40,
            boxShadow: `0 8px 40px rgba(11,30,61,0.25)`,
          }}>
            <ScoreDial score={overallScore} size={150} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#BFD3EC", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontFamily: "Helvetica, sans-serif" }}>
                NYSDFS 23 NYCRR 500 Assessment
              </div>
              <div style={{ fontSize: 27, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                {orgName || "Your Organization"}
              </div>
              <div style={{ fontSize: 14, color: "#DBEAFE", marginBottom: 16, lineHeight: 1.6 }}>{risk.desc}</div>
              <div style={{ display: "flex", gap: 14 }}>
                {[
                  { label: "Compliant", count: ALL_QUESTIONS.filter(q => answers[q.id] === "yes").length, color: "#34D399" },
                  { label: "Partial", count: ALL_QUESTIONS.filter(q => answers[q.id] === "partial").length, color: "#FBBF24" },
                  { label: "Gaps", count: ALL_QUESTIONS.filter(q => answers[q.id] === "no").length, color: "#F87171" },
                  { label: "Unanswered", count: totalCount - answeredCount, color: "#9CA3AF" },
                ].map(r => (
                  <div key={r.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.06)", border: `1px solid ${r.color}40`, borderRadius: 10, padding: "10px 18px" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: r.color }}>{r.count}</div>
                    <div style={{ fontSize: 11, color: "#fff", fontFamily: "Helvetica, sans-serif" }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px", marginBottom: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 20 }}>Score by Category</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {CATEGORIES.map(c => {
                const score = Math.round((c.questions.reduce((sum, q) => sum + (STATUS_OPTIONS.find(s => s.v === answers[q.id])?.score ?? 0), 0) / c.questions.length) * 100);
                const color = score >= 80 ? C.green : score >= 60 ? C.amber : C.red;
                const gapCount = c.questions.filter(q => answers[q.id] === "no").length;
                return (
                  <div key={c.id} style={{ background: C.bg, borderRadius: 12, padding: "16px 18px", border: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{c.icon} {c.title}</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color }}>{score}%</span>
                    </div>
                    <div style={{ background: "#E5E7EB", borderRadius: 4, height: 8, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 4, transition: "width 1s ease" }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.textDim, fontFamily: "Helvetica, sans-serif" }}>
                      {gapCount > 0 ? <span style={{ color: C.red }}>\u26a0 {gapCount} gap{gapCount > 1 ? "s" : ""} identified</span> : <span style={{ color: C.green }}>\u2713 No critical gaps</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {gaps.length > 0 && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px", marginBottom: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>\ud83d\udccb Priority Action Plan</div>
              <div style={{ fontSize: 13, color: C.textMid, marginBottom: 18, fontFamily: "Helvetica, sans-serif" }}>
                {gaps.length} items need attention — sorted by examination risk
              </div>
              {gaps.slice(0, 10).map((q, i) => {
                const catName = CATEGORIES.find(c => c.questions.some(qi => qi.id === q.id))?.title;
                const isNo = answers[q.id] === "no";
                return (
                  <div key={q.id} style={{
                    display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
                    borderRadius: 10, marginBottom: 8,
                    background: isNo ? C.redBg : C.amberBg, border: `1px solid ${isNo ? "#FCA5A5" : "#FDE68A"}`,
                  }}>
                    <div style={{
                      minWidth: 28, height: 28, borderRadius: "50%", background: isNo ? C.red : C.amber,
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, fontFamily: "Helvetica, sans-serif", flexShrink: 0,
                    }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>{q.text}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, color: C.textMid, background: "#fff", padding: "2px 8px", borderRadius: 10, fontFamily: "Helvetica, sans-serif" }}>{catName}</span>
                        <span style={{ fontSize: 10, background: RISK_BG[q.risk], color: RISK_COLORS[q.risk], padding: "2px 8px", borderRadius: 10, fontFamily: "Helvetica, sans-serif", fontWeight: 700 }}>{q.risk.toUpperCase()}</span>
                        <span style={{ fontSize: 10, color: C.accent, background: C.accentDim, padding: "2px 8px", borderRadius: 10, fontFamily: "Helvetica, sans-serif", fontWeight: 700 }}>\ud83d\udcc4 Template {q.template}: {templateNames[q.template]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {gaps.length > 10 && (
                <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", marginTop: 8, fontFamily: "Helvetica, sans-serif" }}>
                  +{gaps.length - 10} more gaps — answer all questions to see full list
                </div>
              )}
            </div>
          )}

          <div style={{
            background: "linear-gradient(135deg, rgba(184,134,11,0.08), rgba(11,30,61,0.04))",
            border: `1px solid ${C.gold}40`, borderRadius: 16, padding: "28px",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>\u26a0 Personal Liability Reminder</div>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 16, fontFamily: "Helvetica, sans-serif" }}>
              The dual-signature Annual Certification creates personal liability for both your CEO and CISO.
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
              borderRadius: 10, background: answers["i4"] === "yes" ? C.greenBg : C.redBg,
              border: `1px solid ${answers["i4"] === "yes" ? "#6EE7B7" : "#FCA5A5"}`,
            }}>
              <span style={{ fontSize: 22 }}>{answers["i4"] === "yes" ? "\u2705" : "\u26a0\ufe0f"}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Template 10 — Annual Certification of Material Compliance</div>
                <div style={{ fontSize: 12, color: C.textMid, fontFamily: "Helvetica, sans-serif" }}>
                  {answers["i4"] === "yes" ? "Ready for dual signature — keep evidence current through the next certification cycle." : "Not yet ready — due April 15 each year, requires CEO and CISO signatures."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
