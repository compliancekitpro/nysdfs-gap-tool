import NYSDFSAssessment from './NYSDFSAssessment.jsx'

// ── Replace with your actual Etsy listing URLs before deploying ──────────────
const ETSY_FULL_KIT_URL = "https://compliancekitpro.etsy.com"
const ETSY_CLASSA_URL   = "https://compliancekitpro.etsy.com"

function CTABanner() {
  return (
    <div style={{
      background: "linear-gradient(90deg, #0B1E3D 0%, #132B52 100%)",
      borderTop: "2px solid #B8860B",
      padding: "28px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 20,
    }}>
      <div>
        <div style={{ fontSize: 10, color: "#BFD3EC", letterSpacing: 3, fontFamily: "Helvetica, sans-serif", textTransform: "uppercase", marginBottom: 6 }}>
          NYSDFS 23 NYCRR 500 Kit
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 4 }}>
          Ready to close your compliance gaps?
        </div>
        <div style={{ fontSize: 14, color: "#DBEAFE", fontFamily: "Helvetica, sans-serif" }}>
          Get all 14 fillable PDF templates — instant download on Etsy
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={ETSY_FULL_KIT_URL} target="_blank" rel="noopener noreferrer" style={{
          background: "#fff", color: "#0B1E3D", textDecoration: "none", borderRadius: 8,
          padding: "12px 24px", fontSize: 13, fontWeight: 700, fontFamily: "Helvetica, sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)", display: "inline-block",
        }}>
          Get Full Kit →
        </a>
        <a href={ETSY_CLASSA_URL} target="_blank" rel="noopener noreferrer" style={{
          background: "transparent", color: "#B8860B", textDecoration: "none", borderRadius: 8,
          padding: "12px 24px", fontSize: 13, fontWeight: 700, fontFamily: "Helvetica, sans-serif",
          border: "1px solid #B8860B", display: "inline-block",
        }}>
          Class A Bundle
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <NYSDFSAssessment />
      </div>
      <CTABanner />
    </div>
  )
}
