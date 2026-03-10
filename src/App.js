import { useState, useEffect } from "react";

var STORAGE_KEY = "house-checklist-multi";

function loadAll() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) { return null; }
}

function saveAll(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function newHouseState(name) {
  return {
    id: Date.now().toString(),
    propertyName: name || "",
    checked: {},
    notes: {},
    severities: {},
    collapsed: {},
  };
}

var SECTIONS = [
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
      { id: "ph2", text: "Ask: Is the property 100% Freehold?" },
      { id: "ph3", text: "Ask: Are there any annual estate management fees or service charges?" },
      { id: "ph4", text: "Ask: Which exact direction does the rear garden face?" },
      { id: "ph5", text: "Ask: Why is the seller moving? What is their onward position?" },
      { id: "ph6", text: "Ask: How long has it been on the market? Has the price been reduced?" },
      { id: "ph7", text: "Ask: What is the exact Council Tax Band and the annual cost?" },
      { id: "ph8", text: "Ask: Is there a chain? How long is it?" },
      { id: "ph9", text: "Ask: What is included in the sale? Fixtures, fittings, white goods?" },
      { id: "ph10", text: "Ask: Where is the best place to park when I arrive for the viewing?" },
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

var SEVERITY = {
  dealbreaker: { label: "Dealbreaker", color: "#ff4757" },
  high:        { label: "High",        color: "#f78166" },
  medium:      { label: "Check Later", color: "#d29922" },
  note:        { label: "Note",        color: "#8b949e" },
};

export default function HouseHuntingChecklist() {
  var stored = loadAll();
  var initialHouses = (stored && stored.houses && stored.houses.length > 0) ? stored.houses : [newHouseState("")];
  var initialActive = (stored && stored.activeId) ? stored.activeId : initialHouses[0].id;

  var [houses, setHouses] = useState(initialHouses);
  var [activeId, setActiveId] = useState(initialActive);
  var [showPicker, setShowPicker] = useState(false);
  var [newName, setNewName] = useState("");

  var house = houses.find(function(h) { return h.id === activeId; }) || houses[0];

  var [checked,     setChecked]    = useState(house.checked);
  var [notes,       setNotes]      = useState(house.notes);
  var [editingNote, setEditingNote]= useState(null);
  var [noteText,    setNoteText]   = useState("");
  var [collapsed,   setCollapsed]  = useState(house.collapsed);
  var [severities,  setSeverities] = useState(house.severities);
  var [filter,      setFilter]     = useState("all");
  var [propertyName, setPropertyName] = useState(house.propertyName);
  var [editingName, setEditingName] = useState(false);

  useEffect(function() {
    var updated = houses.map(function(h) {
      if (h.id === activeId) {
        return Object.assign({}, h, {
          checked: checked,
          notes: notes,
          collapsed: collapsed,
          severities: severities,
          propertyName: propertyName,
        });
      }
      return h;
    });
    setHouses(updated);
    saveAll({ houses: updated, activeId: activeId });
  }, [checked, notes, collapsed, severities, propertyName]);

  var switchHouse = function(id) {
    var target = houses.find(function(h) { return h.id === id; });
    if (target) {
      setActiveId(id);
      setChecked(target.checked);
      setNotes(target.notes);
      setCollapsed(target.collapsed);
      setSeverities(target.severities);
      setPropertyName(target.propertyName);
      setFilter("all");
      saveAll({ houses: houses, activeId: id });
    }
    setShowPicker(false);
  };

  var addHouse = function() {
    var name = newName.trim();
    if (!name) return;
    var h = newHouseState(name);
    var updated = houses.concat([h]);
    setHouses(updated);
    setNewName("");
    saveAll({ houses: updated, activeId: h.id });
    switchHouse(h.id);
  };

  var deleteHouse = function(id, e) {
    e.stopPropagation();
    if (houses.length <= 1) {
      window.alert("You need at least one house.");
      return;
    }
    if (!window.confirm("Delete this house and all its data?")) return;
    var updated = houses.filter(function(h) { return h.id !== id; });
    setHouses(updated);
    if (id === activeId) {
      switchHouse(updated[0].id);
    }
    saveAll({ houses: updated, activeId: updated[0].id });
  };

  var toggleItem    = function(id) { setChecked(function(p) { var n = Object.assign({}, p); n[id] = !n[id]; return n; }); };
  var toggleSection = function(id) { setCollapsed(function(p) { var n = Object.assign({}, p); n[id] = !n[id]; return n; }); };

  var openNote = function(id, e) {
    e.stopPropagation();
    setEditingNote(id);
    setNoteText(notes[id] || "");
  };

  var saveNote = function() {
    if (noteText.trim()) {
      setNotes(function(p) { var n = Object.assign({}, p); n[editingNote] = noteText.trim(); return n; });
    } else {
      setNotes(function(p) { var n = Object.assign({}, p); delete n[editingNote]; return n; });
    }
    setEditingNote(null);
  };

  var setSeverity = function(id, sev, e) {
    e.stopPropagation();
    setSeverities(function(p) { var n = Object.assign({}, p); n[id] = sev; return n; });
  };

  var totalItems     = SECTIONS.reduce(function(a, s) { return a + s.items.length; }, 0);
  var completedItems = Object.values(checked).filter(Boolean).length;
  var pct            = Math.round((completedItems / totalItems) * 100);

  var filteredSections = SECTIONS.map(function(s) {
    return Object.assign({}, s, {
      items: s.items.filter(function(item) {
        if (filter === "all")       return true;
        if (filter === "completed") return  checked[item.id];
        if (filter === "remaining") return !checked[item.id];
        if (filter === "findings")  return  notes[item.id] || severities[item.id];
        return true;
      }),
    });
  }).filter(function(s) { return s.items.length > 0; });

  var resetHouse = function() {
    if (window.confirm("Reset all progress for this house?")) {
      setChecked({}); setNotes({}); setSeverities({}); setCollapsed({});
    }
  };

  var exportReport = function() {
    var report = "HOUSE HUNTING CHECKLIST REPORT\n";
    report += "Property: " + (propertyName || "Unnamed") + "\n";
    report += "Date: " + new Date().toLocaleDateString("en-GB") + "\n";
    report += "Progress: " + completedItems + "/" + totalItems + " (" + pct + "%)\n";
    report += "=======================================================\n\n";

    SECTIONS.forEach(function(section) {
      report += "## " + section.label + "\n";
      section.items.forEach(function(item) {
        var done = checked[item.id] ? "[x]" : "[ ]";
        var sev = severities[item.id] ? " [" + severities[item.id].toUpperCase() + "]" : "";
        var nt = notes[item.id] ? "\n     -> " + notes[item.id] : "";
        report += "  " + done + " " + item.text + sev + nt + "\n";
      });
      report += "\n";
    });

    var blob = new Blob([report], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "house-check-" + (propertyName || "report").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  var getProgress = function(h) {
    var done = Object.values(h.checked).filter(Boolean).length;
    return Math.round((done / totalItems) * 100);
  };

  var S = {
    page:       { minHeight:"100vh", background:"#0d1117", color:"#c9d1d9", fontFamily:"'Segoe UI','Helvetica Neue',Arial,sans-serif", padding:0 },
    header:     { background:"linear-gradient(135deg,#161b22 0%,#0d1117 100%)", borderBottom:"1px solid #21262d", padding:"28px 28px 22px", position:"sticky", top:0, zIndex:100 },
    hRow:       { display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 },
    hTitle:     { display:"flex", alignItems:"center", gap:12, marginBottom:6 },
    h1:         { margin:0, fontSize:26, fontWeight:700, color:"#f0f6fc", letterSpacing:"0.02em" },
    subtitle:   { margin:0, fontSize:15, color:"#8b949e", paddingLeft:38 },
    propName:   { margin:"6px 0 0 38px", fontSize:16, color:"#00ff9d", cursor:"pointer", background:"none", border:"none", fontFamily:"inherit", padding:0, letterSpacing:"0.02em" },
    propInput:  { margin:"6px 0 0 38px", fontSize:16, color:"#00ff9d", background:"#0d1117", border:"1px solid #30363d", borderRadius:6, fontFamily:"inherit", padding:"8px 12px", outline:"none", width:340, maxWidth:"70vw" },
    filterRow:  { display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" },
    content:    { padding:"24px 28px", maxWidth:960, margin:"0 auto" },
    secHeader:  function(color, isCollapsed) { return { display:"flex", alignItems:"center", gap:14, padding:"16px 20px", background:"#161b22", border:"1px solid #21262d", borderLeft:"4px solid " + color, borderRadius:isCollapsed?"8px":"8px 8px 0 0", cursor:"pointer", userSelect:"none" }; },
    secBody:    { border:"1px solid #21262d", borderTop:"none", borderRadius:"0 0 8px 8px", overflow:"hidden" },
    itemRow:    function(isDone, idx) { return { display:"flex", alignItems:"flex-start", gap:14, padding:"14px 20px", background:isDone?"#161b22":"#0d1117", borderTop:idx>0?"1px solid #161b22":"none", cursor:"pointer" }; },
    checkbox:   function(isDone, color) { return { width:22, height:22, border:"2px solid " + (isDone?color:"#30363d"), borderRadius:4, background:isDone?color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, transition:"all 0.15s" }; },
    itemText:   function(isDone) { return { fontSize:16, color:isDone?"#8b949e":"#e6edf3", textDecoration:isDone?"line-through":"none", flex:1, lineHeight:1.6, wordBreak:"break-word", minWidth:0 }; },
    noteRow:    { background:"#161b22", borderTop:"1px solid #21262d", padding:"10px 20px 10px 56px", fontSize:14, color:"#8b949e", fontStyle:"italic", lineHeight:1.5 },
    modal:      { position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 },
    modalBox:   { background:"#161b22", border:"1px solid #30363d", borderRadius:10, padding:28, width:520, maxWidth:"92vw" },
    textarea:   { width:"100%", minHeight:140, background:"#0d1117", border:"1px solid #30363d", borderRadius:6, color:"#c9d1d9", fontFamily:"inherit", fontSize:15, padding:14, resize:"vertical", outline:"none", boxSizing:"border-box", lineHeight:1.6 },
  };

  var filterBtn = function(f) {
    return {
      background:    filter===f?"#21262d":"transparent",
      border:        "1px solid " + (filter===f?"#30363d":"transparent"),
      color:         filter===f?"#f0f6fc":"#8b949e",
      padding:       "7px 14px", borderRadius:6, cursor:"pointer",
      fontSize:13,   letterSpacing:"0.04em", textTransform:"uppercase",
      fontFamily:"inherit",
    };
  };

  var actionBtn = function(extra) {
    return Object.assign({
      background:"transparent", border:"1px solid #30363d", color:"#8b949e",
      padding:"7px 14px", borderRadius:6, cursor:"pointer",
      fontSize:13, letterSpacing:"0.04em", textTransform:"uppercase",
      fontFamily:"inherit",
    }, extra || {});
  };

  var sevBtn = function(key, val, sev) {
    return {
      background:  sev===key?val.color:"transparent",
      border:      "1px solid " + (sev===key?val.color:"#30363d"),
      color:       sev===key?"#0d1117":val.color,
      borderRadius:4, padding:"4px 10px", fontSize:11, cursor:"pointer",
      letterSpacing:"0.03em", fontFamily:"inherit", fontWeight:sev===key?700:400,
      display:     sev&&sev!==key?"none":"block",
    };
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.hRow}>
          <div>
            <div style={S.hTitle}>
              <span style={{ fontSize:26, color:"#00ff9d" }}>&#9654;</span>
              <h1 style={S.h1}>HOUSE HUNTING CHECKLIST</h1>
            </div>
            <p style={S.subtitle}>{completedItems}/{totalItems} steps complete</p>

            <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:8, marginLeft:38 }}>
              {editingName ? (
                <input
                  autoFocus
                  value={propertyName}
                  onChange={function(e) { setPropertyName(e.target.value); }}
                  onBlur={function() { setEditingName(false); }}
                  onKeyDown={function(e) { if (e.key === "Enter") setEditingName(false); }}
                  placeholder="e.g. 14 Oak Lane, Guildford, GU1 3AA"
                  style={{ fontSize:16, color:"#00ff9d", background:"#0d1117", border:"1px solid #30363d", borderRadius:6, fontFamily:"inherit", padding:"8px 12px", outline:"none", width:300, maxWidth:"50vw" }}
                />
              ) : (
                <div onClick={function() { setEditingName(true); }} style={{ fontSize:16, color:"#00ff9d", cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.02em" }}>
                  {propertyName || "Click to set property address..."}
                </div>
              )}
              <button onClick={function() { setShowPicker(true); }} style={{ background:"#21262d", border:"1px solid #30363d", color:"#00cfff", borderRadius:6, padding:"6px 14px", fontSize:13, cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.04em", textTransform:"uppercase" }}>
                {houses.length + " HOUSES"}
              </button>
            </div>
          </div>
          <div style={S.filterRow}>
            {["all","remaining","completed","findings"].map(function(f) {
              return <button key={f} onClick={function() { setFilter(f); }} style={filterBtn(f)}>{f}</button>;
            })}
            <button onClick={exportReport} style={actionBtn({ marginLeft:4, color:"#00cfff", borderColor:"#00cfff" })}>EXPORT</button>
            <button onClick={resetHouse} style={actionBtn({ marginLeft:4 })}>RESET</button>
          </div>
        </div>
        <div style={{ marginTop:20 }}>
          <div style={{ height:5, background:"#21262d", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width: pct + "%", background:pct===100?"#00ff9d":"linear-gradient(90deg,#00ff9d,#00cfff)", transition:"width 0.4s ease", borderRadius:2 }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <span style={{ fontSize:12, color:"#8b949e" }}>PROGRESS</span>
            <span style={{ fontSize:12, color:pct===100?"#00ff9d":"#8b949e", fontWeight:700 }}>{pct}%</span>
          </div>
        </div>
      </div>

      <div style={S.content}>
        {filteredSections.map(function(section) {
          var sCompleted  = section.items.filter(function(i) { return checked[i.id]; }).length;
          var isCollapsed = collapsed[section.id];
          return (
            <div key={section.id} style={{ marginBottom:24 }}>
              <div onClick={function() { toggleSection(section.id); }} style={S.secHeader(section.color, isCollapsed)}>
                <span style={{ color:section.color, fontSize:14, width:16 }}>{isCollapsed ? "\u25B6" : "\u25BC"}</span>
                <span style={{ fontWeight:700, fontSize:16, color:"#f0f6fc", flex:1, letterSpacing:"0.04em", textTransform:"uppercase" }}>{section.label}</span>
                <span style={{ fontSize:14, color:sCompleted===section.items.length?section.color:"#8b949e", background:"#21262d", padding:"4px 12px", borderRadius:12 }}>{sCompleted}/{section.items.length}</span>
              </div>
              {!isCollapsed && (
                <div style={S.secBody}>
                  {section.items.map(function(item, idx) {
                    var isDone  = checked[item.id];
                    var hasNote = notes[item.id];
                    var sev     = severities[item.id];
                    return (
                      <div key={item.id}>
                        <div onClick={function() { toggleItem(item.id); }} style={S.itemRow(isDone, idx)}>
                          <div style={S.checkbox(isDone, section.color)}>
                            {isDone && <span style={{ color:"#0d1117", fontSize:14, fontWeight:900 }}>{"\u2713"}</span>}
                          </div>
                          <span style={S.itemText(isDone)}>{item.text}</span>
                          <div style={{ display:"flex", gap:6, alignItems:"flex-start", flexShrink:0 }} onClick={function(e) { e.stopPropagation(); }}>
                            {Object.entries(SEVERITY).map(function(entry) {
                              var key = entry[0]; var val = entry[1];
                              return <button key={key} onClick={function(e) { setSeverity(item.id, sev===key?null:key, e); }} title={val.label} style={sevBtn(key, val, sev)}>{key.toUpperCase()}</button>;
                            })}
                            <button onClick={function(e) { openNote(item.id, e); }} style={{ background:hasNote?"#21262d":"transparent", border:"1px solid " + (hasNote?"#8b949e":"#30363d"), color:hasNote?"#f0f6fc":"#8b949e", borderRadius:4, padding:"4px 10px", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>{hasNote ? "\u270E" : "+"}</button>
                          </div>
                        </div>
                        {hasNote && <div style={S.noteRow}>{"\u21B3 " + hasNote}</div>}
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
        <div style={S.modal} onClick={function() { setEditingNote(null); }}>
          <div style={S.modalBox} onClick={function(e) { e.stopPropagation(); }}>
            <p style={{ margin:"0 0 14px", fontSize:15, color:"#8b949e", textTransform:"uppercase", letterSpacing:"0.05em" }}>PROPERTY NOTE</p>
            <textarea value={noteText} onChange={function(e) { setNoteText(e.target.value); }} autoFocus placeholder="Enter the exact square metres, the boiler age, any dealbreakers, quotes from the agent..." style={S.textarea} />
            <div style={{ display:"flex", gap:10, marginTop:14, justifyContent:"flex-end" }}>
              <button onClick={function() { setEditingNote(null); }} style={{ background:"transparent", border:"1px solid #30363d", color:"#8b949e", padding:"10px 20px", borderRadius:6, cursor:"pointer", fontFamily:"inherit", fontSize:14 }}>Cancel</button>
              <button onClick={saveNote} style={{ background:"#238636", border:"1px solid #2ea043", color:"#f0f6fc", padding:"10px 20px", borderRadius:6, cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:700 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showPicker && (
        <div style={S.modal} onClick={function() { setShowPicker(false); }}>
          <div style={S.modalBox} onClick={function(e) { e.stopPropagation(); }}>
            <p style={{ margin:"0 0 18px", fontSize:18, color:"#f0f6fc", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em" }}>YOUR HOUSES</p>

            <div style={{ maxHeight:300, overflowY:"auto", marginBottom:18 }}>
              {houses.map(function(h) {
                var isActive = h.id === activeId;
                var prog = getProgress(h);
                return (
                  <div key={h.id} onClick={function() { switchHouse(h.id); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:isActive?"#21262d":"#0d1117", border:"2px solid " + (isActive?"#00ff9d":"#21262d"), borderRadius:8, marginBottom:10, cursor:"pointer" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, color:isActive?"#00ff9d":"#e6edf3", fontWeight:isActive?700:400 }}>
                        {h.propertyName || "Unnamed property"}
                      </div>
                      <div style={{ fontSize:13, color:"#8b949e", marginTop:3 }}>{prog + "% complete"}</div>
                    </div>
                    <div style={{ width:60, height:4, background:"#21262d", borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:prog + "%", background:isActive?"#00ff9d":"#8b949e", borderRadius:2 }} />
                    </div>
                    <button onClick={function(e) { deleteHouse(h.id, e); }} title="Delete house" style={{ background:"transparent", border:"1px solid #30363d", color:"#ff4757", borderRadius:4, padding:"6px 12px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>DEL</button>
                  </div>
                );
              })}
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <input
                value={newName}
                onChange={function(e) { setNewName(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") addHouse(); }}
                placeholder="New house address..."
                style={{ flex:1, fontSize:15, color:"#c9d1d9", background:"#0d1117", border:"1px solid #30363d", borderRadius:6, fontFamily:"inherit", padding:"10px 14px", outline:"none" }}
              />
              <button onClick={addHouse} style={{ background:"#238636", border:"1px solid #2ea043", color:"#f0f6fc", padding:"10px 20px", borderRadius:6, cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:700 }}>ADD</button>
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:14 }}>
              <button onClick={function() { setShowPicker(false); }} style={{ background:"transparent", border:"1px solid #30363d", color:"#8b949e", padding:"10px 20px", borderRadius:6, cursor:"pointer", fontFamily:"inherit", fontSize:14 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
