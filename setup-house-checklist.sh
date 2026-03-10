#!/bin/bash

# ============================================================
#  House Hunting Checklist - Auto Setup Script
#  Tested on Linux / macOS
#  Usage: chmod +x setup-house-checklist.sh && ./setup-house-checklist.sh
# ============================================================

set -e

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${CYAN}[*]${NC} $1"; }
success() { echo -e "${GREEN}[+]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[-]${NC} $1"; exit 1; }
header()  { echo -e "\n${BOLD}${CYAN}======================================${NC}"; echo -e "${BOLD}  $1${NC}"; echo -e "${BOLD}${CYAN}======================================${NC}\n"; }

APP_DIR="$HOME/house-hunting-checklist"
NODE_MIN=16

# ============================================================
# BANNER
# ============================================================
clear
echo -e "${BOLD}${GREEN}"
echo "  ██╗  ██╗ ██████╗ ██╗   ██╗███████╗███████╗"
echo "  ██║  ██║██╔═══██╗██║   ██║██╔════╝██╔════╝"
echo "  ███████║██║   ██║██║   ██║███████╗█████╗  "
echo "  ██╔══██║██║   ██║██║   ██║╚════██║██╔══╝  "
echo "  ██║  ██║╚██████╔╝╚██████╔╝███████║███████╗"
echo "  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝"
echo -e "${NC}${BOLD}       House Hunting Master Checklist - Auto Setup${NC}"
echo -e "${CYAN}       Install dir: ${APP_DIR}${NC}\n"

# ============================================================
# STEP 1: Check Node.js
# ============================================================
header "STEP 1: Checking Node.js"

install_node() {
    info "Installing Node.js LTS via NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - \
        || error "Failed to fetch NodeSource setup script."
    sudo apt-get install -y nodejs \
        || error "apt-get install nodejs failed."
    success "Node.js installed: $(node -v)"
}

if command -v node &>/dev/null; then
    NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VER" -ge "$NODE_MIN" ]; then
        success "Node.js $(node -v) found."
    else
        warn "Node.js $(node -v) is too old (need v${NODE_MIN}+). Upgrading..."
        install_node
    fi
else
    warn "Node.js not found."
    install_node
fi

# ============================================================
# STEP 2: Check npm
# ============================================================
header "STEP 2: Checking npm"

if command -v npm &>/dev/null; then
    success "npm $(npm -v) found."
else
    warn "npm not found. Installing..."
    sudo apt-get install -y npm || error "Failed to install npm."
    success "npm $(npm -v) installed."
fi

# ============================================================
# STEP 3: Scaffold React app
# ============================================================
header "STEP 3: Creating React App"

if [ -d "$APP_DIR" ]; then
    warn "Directory $APP_DIR already exists - skipping scaffold."
    info "Delete the folder and re-run to start fresh."
else
    info "Running create-react-app (this takes a minute)..."
    npx create-react-app "$APP_DIR" \
        || error "create-react-app failed. Check your internet connection."
    success "React app scaffolded at $APP_DIR"
fi

# ============================================================
# STEP 4: Write checklist component
# ============================================================
header "STEP 4: Writing Checklist Component"

info "Injecting checklist into $APP_DIR/src/App.js ..."

cat > "$APP_DIR/src/App.js" << 'REACT_EOF'
import { useState } from "react";

const SECTIONS = [
  {
    id: "prep",
    label: "Phase 0: Pre-Search Preparation",
    color: "#8b5cf6",
    items: [
      { id: "pp1", text: "Get a Mortgage Agreement in Principle (AIP). Know your max borrowing ceiling." },
      { id: "pp2", text: "Calculate total budget: purchase price + stamp duty + solicitor + survey + moving costs." },
      { id: "pp3", text: "Define hard requirements: freehold, min bedrooms, max price, commute time to work." },
      { id: "pp4", text: "Define nice-to-haves: garden, parking, garage, home office space, no major works." },
      { id: "pp5", text: "Research stamp duty liability for your price bracket (use HMRC calculator)." },
      { id: "pp6", text: "Get conveyancer/solicitor quotes now, before you need one in a rush." },
      { id: "pp7", text: "Set up Rightmove and Zoopla alerts for every target area with your filters." },
    ],
  },
  {
    id: "recon",
    label: "Phase 1: Online Reconnaissance",
    color: "#00cfff",
    items: [
      { id: "r1", text: "Check the EPC certificate for the true internal square meterage." },
      { id: "r2", text: "Calculate Price per Sq Metre (Asking Price / EPC Sq Metres). Compare to local average." },
      { id: "r3", text: "Check Google Maps satellite view: does the garden border a main road, railway, or industrial site?" },
      { id: "r4", text: "Verify the property is fully detached (not linked by a garage or shared wall)." },
      { id: "r5", text: "Check the local council planning portal for recent applications on the property AND neighbours." },
      { id: "r6", text: "Check the Environment Agency flood risk map for the specific postcode." },
      { id: "r7", text: "Check broadband speeds at the address (Ofcom checker). Standard, superfast, ultrafast available?" },
      { id: "r8", text: "Check indoor mobile signal for your network (Ofcom or network coverage checker)." },
      { id: "r9", text: "Check police.uk crime maps for any spikes on the immediate street." },
      { id: "r10", text: "Check Land Registry for when the property last sold and for how much." },
      { id: "r11", text: "Look up the property on Rightmove sold prices: has it been flipped recently?" },
      { id: "r12", text: "Check if the property is listed (Grade I, II*, II) or in a conservation area. Both restrict modifications." },
      { id: "r13", text: "Check which direction the rear garden faces using Google Maps compass. South-facing is ideal." },
    ],
  },
  {
    id: "phone",
    label: "Phase 2: The Agent Phone Call",
    color: "#ffa94d",
    items: [
      { id: "ph1", text: "State your position immediately: AIP ready, deposit ready, chain-free (if applicable)." },
      { id: "ph2", text: "Ask: 'Is the property 100% Freehold?'" },
      { id: "ph3", text: "Ask: 'Are there any annual estate management fees or service charges?'" },
      { id: "ph4", text: "Ask: 'Which exact direction does the rear garden face?'" },
      { id: "ph5", text: "Ask: 'Why is the seller moving? What is their onward position?'" },
      { id: "ph6", text: "Ask: 'How long has it been on the market? Has the price been reduced?'" },
      { id: "ph7", text: "Ask: 'What is the exact Council Tax Band and the annual cost?'" },
      { id: "ph8", text: "Ask: 'Is there a chain? How long is it?'" },
      { id: "ph9", text: "Ask: 'What is included in the sale? Fixtures, fittings, white goods?'" },
      { id: "ph10", text: "Ask: 'Where is the best place to park when I arrive for the viewing?'" },
    ],
  },
  {
    id: "viewing",
    label: "Phase 3: The Physical Viewing",
    color: "#ff6b6b",
    items: [
      { id: "v1", text: "The Listen Test: Stand dead still in the main bedroom for 30 seconds. Note any noise." },
      { id: "v2", text: "The Stride Test: Pace out every bedroom to verify the floorplan measurements." },
      { id: "v3", text: "The Bed Trick: Are they using small double beds or single beds to make rooms look bigger?" },
      { id: "v4", text: "The Boundary Check: Does the physical fence line match the Land Registry Title Plan?" },
      { id: "v5", text: "The Parking Test: Did you have to park two streets away? That is your life now." },
      { id: "v6", text: "The Signal Test: Check your mobile signal in every room, especially the home office." },
      { id: "v7", text: "The Water Test: Flush all toilets, run taps and shower. Check pressure and drainage speed." },
      { id: "v8", text: "The Window Test: Open and close every window and external door. Do they stick, rattle, seal?" },
      { id: "v9", text: "The Compass Check: Use compass app on phone to verify which direction main rooms and garden face." },
      { id: "v10", text: "Take photos and video of EVERYTHING: exterior, street, any cracks, stains, or defects." },
      { id: "v11", text: "Check the loft if accessible: insulation depth, signs of leaks, condition of timbers." },
      { id: "v12", text: "Look at ceilings for water stains or discolouration. Ask about every mark you spot." },
    ],
  },
  {
    id: "maintenance",
    label: "Phase 4: Maintenance & Systems Inspection",
    color: "#cc5de8",
    items: [
      { id: "m1", text: "Ask the agent for the exact age and type of the boiler (combi vs system). When was it last serviced?" },
      { id: "m2", text: "Check all window seals for internal condensation, misting, or blown units." },
      { id: "m3", text: "Look at the consumer unit (fuse box): modern RCD unit or old-style rewirable fuses?" },
      { id: "m4", text: "Ask when the property was last rewired. Old wiring = potential 5k-10k cost." },
      { id: "m5", text: "For new builds (2020+): Confirm exactly how many years of NHBC warranty remain." },
      { id: "m6", text: "Check the EPC rating (A-G). D or below = higher energy bills and potential upgrade costs." },
      { id: "m7", text: "Review EPC recommendations: what improvements are suggested and estimated costs?" },
      { id: "m8", text: "Ask to see the latest Gas Safety Certificate and Electrical (EICR) report." },
    ],
  },
  {
    id: "structure",
    label: "Phase 5: Structural Red Flags",
    color: "#1e90ff",
    items: [
      { id: "sr1", text: "Look for signs of damp: peeling paint, water stains on ceilings, musty smells, tide marks on walls." },
      { id: "sr2", text: "Check external brickwork for diagonal step-cracks (the staircase pattern = potential subsidence)." },
      { id: "sr3", text: "Inspect the roof from outside: missing or slipped tiles, sagging ridge line, moss buildup." },
      { id: "sr4", text: "Check guttering and downpipes: cracked, sagging, leaking, or overflowing?" },
      { id: "sr5", text: "Check the garden for Japanese Knotweed or other invasive plants. Mortgage killer." },
      { id: "sr6", text: "Ask if any extensions, loft conversions, or conservatories have full Building Regs sign-off." },
      { id: "sr7", text: "If terraced or semi-detached: ask about party wall agreements for any previous works." },
      { id: "sr8", text: "Look for fresh paint or new plaster in isolated patches. Could be covering damp or cracks." },
    ],
  },
  {
    id: "legal",
    label: "Phase 6: Legal, Boundaries & Planning",
    color: "#ff4757",
    items: [
      { id: "le1", text: "Obtain the Land Registry Title Plan. Check boundaries are clear and match the physical property." },
      { id: "le2", text: "Overlay the title plan on satellite view. Any boundary disputes or encroachments visible?" },
      { id: "le3", text: "Ask: are there any covenants, easements, or rights of way on the property?" },
      { id: "le4", text: "Ask: any known disputes with neighbours (boundaries, noise, parking)?" },
      { id: "le5", text: "Check for any pending or approved developments nearby that could affect value or quality of life." },
      { id: "le6", text: "If building work has been done, check for Building Regulations completion certificates." },
      { id: "le7", text: "Check if the property has an indemnity insurance policy (common for missing paperwork)." },
    ],
  },
  {
    id: "financial",
    label: "Phase 7: Financial Assessment & Comparables",
    color: "#d29922",
    items: [
      { id: "fi1", text: "Pull recently sold prices for comparable properties in the same postcode (Rightmove/Land Registry)." },
      { id: "fi2", text: "Check what similar properties are currently listed for in the area." },
      { id: "fi3", text: "Check properties under offer nearby. Gives a sense of market pace and demand." },
      { id: "fi4", text: "Check withdrawn listings in the area. May indicate overpricing or local issues." },
      { id: "fi5", text: "Compare council tax bands of nearby similar properties. Check for anomalies." },
      { id: "fi6", text: "Calculate total monthly outgoings: mortgage + council tax + insurance + utilities + commute." },
      { id: "fi7", text: "If the price has been reduced: how long was it on market before the drop? How much was cut?" },
      { id: "fi8", text: "Check rental comparables for the area. Useful for knowing investment fallback potential." },
    ],
  },
  {
    id: "neighbourhood",
    label: "Phase 8: Neighbourhood Reality Check",
    color: "#00ff9d",
    items: [
      { id: "n1", text: "Do a drive-by during the evening rush hour. Test traffic noise and congestion." },
      { id: "n2", text: "Look for signs the street is used as a local rat run (speed bumps, cut-through traffic)." },
      { id: "n3", text: "Check proximity to school drop-off zones and the school's Ofsted rating." },
      { id: "n4", text: "Walk to the nearest rail station. Time it. Check the actual timetable: journey to London, frequency, last train." },
      { id: "n5", text: "Look up the annual season ticket cost for the commute." },
      { id: "n6", text: "Check for local amenities within walking distance: supermarket, GP, pharmacy, gym." },
      { id: "n7", text: "Visit on a weekend AND a weekday evening. Two different versions of the same place." },
      { id: "n8", text: "Knock on a neighbour's door. Ask what the area is really like. People are surprisingly honest." },
      { id: "n9", text: "Check local Facebook groups or community forums for the area to gauge sentiment." },
    ],
  },
  {
    id: "postoffer",
    label: "Phase 9: Making the Offer & Post-Offer",
    color: "#f78166",
    items: [
      { id: "po1", text: "Compile all findings from this checklist. Identify every leverage point for negotiation." },
      { id: "po2", text: "Decide your opening offer based on comparables, condition, time on market, and seller motivation." },
      { id: "po3", text: "Submit the offer through the agent in writing (email). State: AIP in place, no chain, ready to proceed." },
      { id: "po4", text: "If accepted: instruct your solicitor/conveyancer IMMEDIATELY. Delays lose deals." },
      { id: "po5", text: "Commission a survey: Homebuyer Report (Level 2) minimum. Building Survey (Level 3) for older properties." },
      { id: "po6", text: "Submit formal mortgage application with your lender." },
      { id: "po7", text: "Review local authority search results when they come back from your solicitor." },
      { id: "po8", text: "If the survey reveals issues: get specialist quotes and renegotiate before exchange." },
      { id: "po9", text: "Arrange buildings insurance from the exchange date. This is mandatory." },
      { id: "po10", text: "Final walkthrough before completion: check the property is in agreed condition, nothing removed." },
    ],
  },
];

const SEVERITY = {
  dealbreaker: { label: "Dealbreaker", color: "#ff4757" },
  high:        { label: "High",        color: "#f78166" },
  medium:      { label: "Check Later", color: "#d29922" },
  note:        { label: "Note",        color: "#8b949e" },
};

export default function HouseHuntingChecklist() {
  const [checked,    setChecked]    = useState({});
  const [notes,      setNotes]      = useState({});
  const [editingNote,setEditingNote]= useState(null);
  const [noteText,   setNoteText]   = useState("");
  const [collapsed,  setCollapsed]  = useState({});
  const [severities, setSeverities] = useState({});
  const [filter,     setFilter]     = useState("all");
  const [propertyName, setPropertyName] = useState("");
  const [editingName, setEditingName] = useState(false);

  const toggleItem    = (id) => setChecked(p  => ({ ...p,  [id]: !p[id] }));
  const toggleSection = (id) => setCollapsed(p => ({ ...p,  [id]: !p[id] }));

  const openNote = (id, e) => {
    e.stopPropagation();
    setEditingNote(id);
    setNoteText(notes[id] || "");
  };

  const saveNote = () => {
    if (noteText.trim()) {
      setNotes(p => ({ ...p, [editingNote]: noteText.trim() }));
    } else {
      setNotes(p => { const n = { ...p }; delete n[editingNote]; return n; });
    }
    setEditingNote(null);
  };

  const setSeverity = (id, sev, e) => {
    e.stopPropagation();
    setSeverities(p => ({ ...p, [id]: sev }));
  };

  const totalItems     = SECTIONS.reduce((a, s) => a + s.items.length, 0);
  const completedItems = Object.values(checked).filter(Boolean).length;
  const pct            = Math.round((completedItems / totalItems) * 100);

  const filteredSections = SECTIONS.map(s => ({
    ...s,
    items: s.items.filter(item => {
      if (filter === "all")       return true;
      if (filter === "completed") return  checked[item.id];
      if (filter === "remaining") return !checked[item.id];
      if (filter === "findings")  return  notes[item.id] || severities[item.id];
      return true;
    }),
  })).filter(s => s.items.length > 0);

  const resetAll = () => {
    if (window.confirm("Reset all progress for the next house?")) {
      setChecked({}); setNotes({}); setSeverities({}); setCollapsed({});
    }
  };

  const exportReport = () => {
    let report = `HOUSE HUNTING CHECKLIST REPORT\n`;
    report += `Property: ${propertyName || "Unnamed"}\n`;
    report += `Date: ${new Date().toLocaleDateString("en-GB")}\n`;
    report += `Progress: ${completedItems}/${totalItems} (${pct}%)\n`;
    report += `${"=".repeat(55)}\n\n`;

    SECTIONS.forEach(section => {
      report += `## ${section.label}\n`;
      section.items.forEach(item => {
        const done = checked[item.id] ? "[x]" : "[ ]";
        const sev = severities[item.id] ? ` [${severities[item.id].toUpperCase()}]` : "";
        const note = notes[item.id] ? `\n     -> ${notes[item.id]}` : "";
        report += `  ${done} ${item.text}${sev}${note}\n`;
      });
      report += `\n`;
    });

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `house-check-${(propertyName || "report").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const S = {
    page:       { minHeight:"100vh", background:"#0d1117", color:"#c9d1d9", fontFamily:"'Courier New',monospace", padding:0 },
    header:     { background:"linear-gradient(135deg,#161b22 0%,#0d1117 100%)", borderBottom:"1px solid #21262d", padding:"32px 40px 24px", position:"sticky", top:0, zIndex:100 },
    hRow:       { display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 },
    hTitle:     { display:"flex", alignItems:"center", gap:12, marginBottom:4 },
    h1:         { margin:0, fontSize:22, fontWeight:700, color:"#f0f6fc", letterSpacing:"0.04em" },
    subtitle:   { margin:0, fontSize:12, color:"#8b949e", paddingLeft:34 },
    propName:   { margin:"6px 0 0 34px", fontSize:13, color:"#00ff9d", cursor:"pointer", background:"none", border:"none", fontFamily:"inherit", padding:0, letterSpacing:"0.03em" },
    propInput:  { margin:"6px 0 0 34px", fontSize:13, color:"#00ff9d", background:"#0d1117", border:"1px solid #30363d", borderRadius:4, fontFamily:"inherit", padding:"4px 8px", outline:"none", width:320, maxWidth:"70vw" },
    filterRow:  { display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" },
    content:    { padding:"24px 40px", maxWidth:900, margin:"0 auto" },
    secHeader:  (color, isCollapsed) => ({ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#161b22", border:"1px solid #21262d", borderLeft:`3px solid ${color}`, borderRadius:isCollapsed?"6px":"6px 6px 0 0", cursor:"pointer", userSelect:"none" }),
    secBody:    { border:"1px solid #21262d", borderTop:"none", borderRadius:"0 0 6px 6px", overflow:"hidden" },
    itemRow:    (isDone, idx) => ({ display:"flex", alignItems:"flex-start", gap:12, padding:"11px 16px", background:isDone?"#161b22":"#0d1117", borderTop:idx>0?"1px solid #161b22":"none", cursor:"pointer" }),
    checkbox:   (isDone, color) => ({ width:16, height:16, border:`1.5px solid ${isDone?color:"#30363d"}`, borderRadius:3, background:isDone?color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, transition:"all 0.15s" }),
    itemText:   (isDone) => ({ fontSize:13, color:isDone?"#8b949e":"#c9d1d9", textDecoration:isDone?"line-through":"none", flex:1, lineHeight:1.5, wordBreak:"break-word", minWidth:0 }),
    noteRow:    { background:"#161b22", borderTop:"1px solid #21262d", padding:"8px 16px 8px 44px", fontSize:12, color:"#8b949e", fontStyle:"italic", lineHeight:1.5 },
    modal:      { position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 },
    modalBox:   { background:"#161b22", border:"1px solid #30363d", borderRadius:8, padding:24, width:480, maxWidth:"90vw" },
    textarea:   { width:"100%", minHeight:120, background:"#0d1117", border:"1px solid #30363d", borderRadius:4, color:"#c9d1d9", fontFamily:"inherit", fontSize:13, padding:12, resize:"vertical", outline:"none", boxSizing:"border-box", lineHeight:1.5 },
  };

  const filterBtn = (f) => ({
    background:    filter===f?"#21262d":"transparent",
    border:       `1px solid ${filter===f?"#30363d":"transparent"}`,
    color:         filter===f?"#f0f6fc":"#8b949e",
    padding:       "4px 10px", borderRadius:4, cursor:"pointer",
    fontSize:11,   letterSpacing:"0.05em", textTransform:"uppercase",
    fontFamily:"inherit",
  });

  const actionBtn = (extra = {}) => ({
    background:"transparent", border:"1px solid #30363d", color:"#8b949e",
    padding:"4px 10px", borderRadius:4, cursor:"pointer",
    fontSize:11, letterSpacing:"0.05em", textTransform:"uppercase",
    fontFamily:"inherit", ...extra,
  });

  const sevBtn = (key, val, sev) => ({
    background:  sev===key?val.color:"transparent",
    border:     `1px solid ${sev===key?val.color:"#30363d"}`,
    color:       sev===key?"#0d1117":val.color,
    borderRadius:3, padding:"1px 6px", fontSize:9, cursor:"pointer",
    letterSpacing:"0.04em", fontFamily:"inherit", fontWeight:sev===key?700:400,
    display:     sev&&sev!==key?"none":"block",
  });

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.hRow}>
          <div>
            <div style={S.hTitle}>
              <span style={{ fontSize:22, color:"#00ff9d" }}>▶</span>
              <h1 style={S.h1}>HOUSE HUNTING CHECKLIST</h1>
            </div>
            <p style={S.subtitle}>{completedItems}/{totalItems} steps complete</p>
            {editingName ? (
              <input
                autoFocus
                value={propertyName}
                onChange={e => setPropertyName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => e.key === "Enter" && setEditingName(false)}
                placeholder="e.g. 14 Oak Lane, Guildford, GU1 3AA"
                style={S.propInput}
              />
            ) : (
              <div onClick={() => setEditingName(true)} style={S.propName}>
                {propertyName || "Click to set property address..."}
              </div>
            )}
          </div>
          <div style={S.filterRow}>
            {["all","remaining","completed","findings"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={filterBtn(f)}>{f}</button>
            ))}
            <button onClick={exportReport} style={actionBtn({ marginLeft:4, color:"#00cfff", borderColor:"#00cfff" })}>EXPORT</button>
            <button onClick={resetAll} style={actionBtn({ marginLeft:4 })}>RESET HOUSE</button>
          </div>
        </div>
        <div style={{ marginTop:20 }}>
          <div style={{ height:3, background:"#21262d", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:pct===100?"#00ff9d":"linear-gradient(90deg,#00ff9d,#00cfff)", transition:"width 0.4s ease", borderRadius:2 }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            <span style={{ fontSize:10, color:"#8b949e" }}>PROGRESS</span>
            <span style={{ fontSize:10, color:pct===100?"#00ff9d":"#8b949e", fontWeight:700 }}>{pct}%</span>
          </div>
        </div>
      </div>

      <div style={S.content}>
        {filteredSections.map(section => {
          const sCompleted  = section.items.filter(i => checked[i.id]).length;
          const isCollapsed = collapsed[section.id];
          return (
            <div key={section.id} style={{ marginBottom:24 }}>
              <div onClick={() => toggleSection(section.id)} style={S.secHeader(section.color, isCollapsed)}>
                <span style={{ color:section.color, fontSize:11, width:14 }}>{isCollapsed?"▶":"▼"}</span>
                <span style={{ fontWeight:700, fontSize:13, color:"#f0f6fc", flex:1, letterSpacing:"0.05em", textTransform:"uppercase" }}>{section.label}</span>
                <span style={{ fontSize:11, color:sCompleted===section.items.length?section.color:"#8b949e", background:"#21262d", padding:"2px 8px", borderRadius:10 }}>{sCompleted}/{section.items.length}</span>
              </div>
              {!isCollapsed && (
                <div style={S.secBody}>
                  {section.items.map((item, idx) => {
                    const isDone  = checked[item.id];
                    const hasNote = notes[item.id];
                    const sev     = severities[item.id];
                    return (
                      <div key={item.id}>
                        <div onClick={() => toggleItem(item.id)} style={S.itemRow(isDone, idx)}>
                          <div style={S.checkbox(isDone, section.color)}>
                            {isDone && <span style={{ color:"#0d1117", fontSize:10, fontWeight:900 }}>✓</span>}
                          </div>
                          <span style={S.itemText(isDone)}>{item.text}</span>
                          <div style={{ display:"flex", gap:6, alignItems:"flex-start", flexShrink:0 }} onClick={e => e.stopPropagation()}>
                            {Object.entries(SEVERITY).map(([key, val]) => (
                              <button key={key} onClick={e => setSeverity(item.id, sev===key?null:key, e)} title={val.label} style={sevBtn(key, val, sev)}>{key.toUpperCase()}</button>
                            ))}
                            <button onClick={e => openNote(item.id, e)} style={{ background:hasNote?"#21262d":"transparent", border:`1px solid ${hasNote?"#8b949e":"#30363d"}`, color:hasNote?"#f0f6fc":"#8b949e", borderRadius:3, padding:"1px 7px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>{hasNote?"✎":"+"}</button>
                          </div>
                        </div>
                        {hasNote && <div style={S.noteRow}>↳ {hasNote}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {filteredSections.length === 0 && (
          <div style={{ textAlign:"center", color:"#8b949e", padding:60, fontSize:13 }}>No items match this filter.</div>
        )}
        <div style={{ height:60 }} />
      </div>

      {editingNote && (
        <div style={S.modal} onClick={() => setEditingNote(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <p style={{ margin:"0 0 12px", fontSize:12, color:"#8b949e", textTransform:"uppercase", letterSpacing:"0.05em" }}>PROPERTY NOTE</p>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} autoFocus placeholder="Enter the exact square metres, the boiler age, any dealbreakers, quotes from the agent..." style={S.textarea} />
            <div style={{ display:"flex", gap:8, marginTop:12, justifyContent:"flex-end" }}>
              <button onClick={() => setEditingNote(null)} style={{ background:"transparent", border:"1px solid #30363d", color:"#8b949e", padding:"6px 16px", borderRadius:4, cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>Cancel</button>
              <button onClick={saveNote} style={{ background:"#238636", border:"1px solid #2ea043", color:"#f0f6fc", padding:"6px 16px", borderRadius:4, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:700 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

REACT_EOF

success "Checklist component written."

# ============================================================
# STEP 5: Clean up boilerplate
# ============================================================
header "STEP 5: Cleaning Up Boilerplate"

rm -f "$APP_DIR/src/App.css" "$APP_DIR/src/App.test.js" "$APP_DIR/src/logo.svg" "$APP_DIR/src/reportWebVitals.js" "$APP_DIR/src/setupTests.js"

cat > "$APP_DIR/src/index.js" << 'INDEX_EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
INDEX_EOF

cat > "$APP_DIR/src/index.css" << 'CSS_EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0d1117;
}
CSS_EOF

# Update the HTML title
sed -i 's/<title>React App<\/title>/<title>House Hunting Checklist<\/title>/' "$APP_DIR/public/index.html" 2>/dev/null || true

success "Boilerplate cleaned."

# ============================================================
# STEP 6: Launch
# ============================================================
header "STEP 6: Launching"

success "All done! Starting the dev server...\n"
echo -e "${BOLD}${GREEN}  Open your browser to: http://localhost:3000${NC}\n"
echo -e "${CYAN}  To stop the server:  Ctrl+C${NC}"
echo -e "${CYAN}  To restart later:    cd $APP_DIR && npm start${NC}\n"

cd "$APP_DIR" && npm start
