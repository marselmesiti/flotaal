import { useState, useEffect } from "react";

const STORAGE_KEY = "flotaal_data";

const defaultData = {
  drivers: [
    { id: 1, name: "Adli", phone: "069 111 2233", vehicleId: 4 },
    { id: 2, name: "Blerim", phone: "068 234 5678", vehicleId: 7 },
    { id: 3, name: "Çlirim", phone: "067 345 6789", vehicleId: 1 },
  ],
  vehicles: [
    { id: 1, plate: "AA 001 BB", type: "elektrik", model: "Tesla Model 3" },
    { id: 2, plate: "AA 002 BB", type: "elektrik", model: "Tesla Model 3" },
    { id: 3, plate: "AA 003 BB", type: "elektrik", model: "BYD Atto 3" },
    { id: 4, plate: "AA 004 BB", type: "elektrik", model: "BYD Atto 3" },
    { id: 5, plate: "AA 005 BB", type: "elektrik", model: "Hyundai Ioniq 5" },
    { id: 6, plate: "AA 006 BB", type: "elektrik", model: "Hyundai Ioniq 5" },
    { id: 7, plate: "AA 007 BB", type: "elektrik", model: "Nissan Leaf" },
    { id: 8, plate: "AA 008 BB", type: "elektrik", model: "Nissan Leaf" },
    { id: 9, plate: "AA 009 BB", type: "elektrik", model: "VW ID.4" },
    { id: 10, plate: "AA 010 BB", type: "elektrik", model: "VW ID.4" },
    { id: 11, plate: "AA 011 CC", type: "karburant", model: "Toyota Camry" },
    { id: 12, plate: "AA 012 CC", type: "karburant", model: "Toyota Camry" },
  ],
  shifts: [],
  debts: [],
};

const S = {
  app: { minHeight: "100vh", background: "#080c16", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0", display: "flex" },
  sidebar: { width: 220, background: "#0d1220", borderRight: "1px solid rgba(255,255,255,0.06)", position: "fixed", top: 0, left: 0, height: "100vh", display: "flex", flexDirection: "column", zIndex: 100 },
  logoWrap: { padding: "24px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  logoText: { fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#f59e0b,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  logoSub: { fontSize: 10, color: "#374151", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 },
  nav: { padding: "14px 10px", flex: 1, overflowY: "auto" },
  navItem: (a) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, marginBottom: 3, cursor: "pointer", background: a ? "rgba(245,158,11,0.12)" : "transparent", borderLeft: a ? "3px solid #f59e0b" : "3px solid transparent", color: a ? "#f59e0b" : "#6b7280", fontSize: 13, fontWeight: a ? 700 : 400, transition: "all 0.18s" }),
  roleRow: { margin: "0 10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: 3, display: "flex" },
  roleBtn: (a) => ({ flex: 1, padding: "7px 0", textAlign: "center", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", background: a ? "linear-gradient(135deg,#f59e0b,#ef4444)" : "transparent", color: a ? "#fff" : "#6b7280", border: "none", transition: "all 0.18s" }),
  main: { marginLeft: 220, padding: "28px 30px", flex: 1, minHeight: "100vh", boxSizing: "border-box" },
  pageHdr: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" },
  card: { background: "linear-gradient(135deg,#0f1623,#141d2e)", borderRadius: 14, padding: 20, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 },
  cardTitle: { fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#cbd5e1" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  statCard: (c) => ({ background: "linear-gradient(135deg,#0f1623,#141d2e)", borderRadius: 14, padding: 20, border: 1px solid rgba(${c},0.18), position: "relative", overflow: "hidden" }),
  statGlow: (c) => ({ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: rgba(${c},0.08) }),
  statVal: (c) => ({ fontSize: 28, fontWeight: 800, color: rgb(${c}), marginBottom: 2 }),
  statLbl: { fontSize: 12, color: "#4b5563" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "9px 12px", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "#374151", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  td: { padding: "12px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#cbd5e1", verticalAlign: "middle" },
  badge: (c) => ({ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: rgba(${c},0.14), color: rgb(${c}) }),
  btn: (v = "primary") => ({ padding: "9px 18px", borderRadius: 9, border: "none", background: v === "primary" ? "linear-gradient(135deg,#f59e0b,#ef4444)" : v === "ghost" ? "rgba(255,255,255,0.07)" : "rgba(239,68,68,0.15)", color: v === "danger" ? "#ef4444" : "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }),
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, padding: "9px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" },
  label: { fontSize: 11, color: "#6b7280", marginBottom: 5, display: "block", letterSpacing: 0.5, textTransform: "uppercase" },
  fldWrap: { marginBottom: 14 },
  row: { display: "flex", gap: 12, alignItems: "center" },
  divider: { height: 1, background: "rgba(255,255,255,0.05)", margin: "16px 0" },
  progressBg: { height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginTop: 4 },
  progressFill: (p, c) => ({ height: "100%", width: ${Math.min(p, 100)}%, borderRadius: 3, background: c }),
  tag: { display: "inline-block", background: "rgba(239,68,68,0.12)", color: "#ef4444", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, marginLeft: 6 },
};

function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) {
          setData(JSON.parse(res.value));
        } else {
          setData(defaultData);
        }
      } catch {
        setData(defaultData);
      }
      setLoading(false);
    })();
  }, []);

  const save = async (newData) => {
    setData(newData);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(newData)); } catch {}
  };

  return { data, save, loading };
}

// ── helpers ──────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (n) => Number(n || 0).toLocaleString("sq-AL");
const pct = (a, b) => (b > 0 ? (((a - b) / b) * 100).toFixed(1) : 0);

// ── SHIFT FORM ────────────────────────────────────────────
function ShiftForm({ data, onSave, onCancel, driverId }) {
  const driver = data.drivers.find(d => d.id === driverId);
  const [date, setDate] = useState(today());
  const [shiftNr, setShiftNr] = useState("");
  const [trips, setTrips] = useState([{ from: "", to: "", tm: "", vlera: "", borxh: false, klenti: "" }]);
  const [expenses, setExpenses] = useState({ gaz: "", benzine: "", karikim: "", lavazh: "", tjera: "" });

  const addTrip = () => setTrips([...trips, { from: "", to: "", tm: "", vlera: "", borxh: false, klenti: "" }]);
  const removeTrip = (i) => setTrips(trips.filter((_, idx) => idx !== i));
  const updateTrip = (i, field, val) => setTrips(trips.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  const totalTM = trips.reduce((s, t) => s + Number(t.tm || 0), 0);
  const totalVlera = trips.reduce((s, t) => s + (t.borxh ? 0 : Number(t.vlera || 0)), 0);
  const totalExpenses = Object.values(expenses).reduce((s, v) => s + Number(v || 0), 0);

  const handleSave = () => {
    if (!shiftNr) return alert("Shkruaj numrin e shiftit!");
    const shift = {
      id: Date.now(),
      driverId,
      driverName: driver?.name,
      date,
      shiftNr,
      trips: trips.filter(t => t.from || t.to),
      expenses,
      totalTM,
      totalVlera,
      totalExpenses,
      net: totalVlera - totalExpenses,
    };
    // handle debts
    const newDebts = [...(data.debts || [])];
    trips.filter(t => t.borxh && t.klenti).forEach(t => {
      const existing = newDebts.find(d => d.klenti === t.klenti && !d.paguar);
      if (existing) {
        existing.shuma += Number(t.vlera || 0);
        existing.udhetime.push({ date, from: t.from, to: t.to, vlera: Number(t.vlera || 0) });
      } else {
        newDebts.push({ id: Date.now() + Math.random(), klenti: t.klenti, driverId, driverName: driver?.name, shuma: Number(t.vlera || 0), paguar: false, udhetime: [{ date, from: t.from, to: t.to, vlera: Number(t.vlera || 0) }] });
      }
    });
    onSave({ ...data, shifts: [...data.shifts, shift], debts: newDebts });
  };

  return (
    <div style={{ ...S.card, border: "1px solid rgba(245,158,11,0.25)" }}>
      <div style={{ ...S.cardTitle, fontSize: 16 }}>📋 Shift i Ri — {driver?.name}</div>
      <div style={S.grid2}>
        <div style={S.fldWrap}><label style={S.label}>Data</label><input style={S.input} type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div style={S.fldWrap}><label style={S.label}>Nr. Shiftit (Total Shift)</label><input style={S.input} placeholder="p.sh. 17850" value={shiftNr} onChange={e => setShiftNr(e.target.value)} /></div>
      </div>

      <div style={S.divider} />
      <div style={{ ...S.cardTitle, marginBottom: 12 }}>🗺️ Udhëtimet</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 90px 90px 90px 110px 32px", gap: 6, marginBottom: 6 }}>
        {["Nisja", "Mbërritja", "TM (L)", "Vlera (L)", "Borxh?", "Klienti (borxh)", ""].map((h, i) => (
          <div key={i} style={{ fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
        ))}
      </div>

      {trips.map((t, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 90px 90px 90px 110px 32px", gap: 6, marginBottom: 6, alignItems: "center" }}>
          <input style={S.input} placeholder="Nga..." value={t.from} onChange={e => updateTrip(i, "from", e.target.value)} />
          <input style={S.input} placeholder="Për në..." value={t.to} onChange={e => updateTrip(i, "to", e.target.value)} />
          <input style={S.input} type="number" placeholder="0" value={t.tm} onChange={e => updateTrip(i, "tm", e.target.value)} />
          <input style={S.input} type="number" placeholder="0" value={t.vlera} onChange={e => updateTrip(i, "vlera", e.target.value)} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input type="checkbox" checked={t.borxh} onChange={e => updateTrip(i, "borxh", e.target.checked)} style={{ width: 18, height: 18, accentColor: "#ef4444", cursor: "pointer" }} />
          </div>
          <input style={{ ...S.input, opacity: t.borxh ? 1 : 0.3 }} placeholder="Emri" disabled={!t.borxh} value={t.klenti} onChange={e => updateTrip(i, "klenti", e.target.value)} />
          <button style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 7, color: "#ef4444", cursor: "pointer", fontWeight: 700, fontSize: 16, height: 36 }} onClick={() => removeTrip(i)}>×</button>
        </div>
      ))}

      <button style={{ ...S.btn("ghost"), marginTop: 4, marginBottom: 16 }} onClick={addTrip}>+ Shto Udhëtim</button>

      <div style={S.divider} />
      <div style={{ ...S.cardTitle, marginBottom: 12 }}>💸 Shpenzime</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 16 }}>
        {[["Gaz", "gaz"], ["Benzinë", "benzine"], ["Karikim", "karikim"], ["Lavazh", "lavazh"], ["Të tjera", "tjera"]].map(([lbl, key]) => (
          <div key={key}><label style={S.label}>{lbl} (L)</label><input style={S.input} type="number" placeholder="0" value={expenses[key]} onChange={e => setExpenses({ ...expenses, [key]: e.target.value })} /></div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px 16px", marginBottom: 16, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[["Total TM", fmt(totalTM) + " L", "245,158,11"], ["Total Vlera", fmt(totalVlera) + " L", "34,197,94"], ["Shpenzime", fmt(totalExpenses) + " L", "239,68,68"], ["Neto", fmt(totalVlera - totalExpenses) + " L", totalVlera - totalExpenses >= 0 ? "34,197,94" : "239,68,68"]].map(([lbl, val, c]) => (
          <div key={lbl}><div style={{ fontSize: 11, color: "#4b5563", marginBottom: 3 }}>{lbl}</div><div style={{ fontSize: 18, fontWeight: 800, color: rgb(${c}) }}>{val}</div></div>
        ))}
      </div>

      <div style={S.row}>
        <button style={S.btn()} onClick={handleSave}>💾 Ruaj Shiftin</button>
        <button style={S.btn("ghost")} onClick={onCancel}>Anulo</button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────
export default function FlotaAL() {
  const { data, save, loading } = useData();
  const [tab, setTab] = useState("dashboard");
  const [role, setRole] = useState("manager");
  const [activeDriverId, setActiveDriverId] = useState(null);
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [reportFilter, setReportFilter] = useState({ driver: "all", month: today().slice(0, 7) });
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: "", phone: "", vehicleId: "" });
  const [debtFilter, setDebtFilter] = useState("aktive");

  useEffect(() => {
    if (data && !activeDriverId && data.drivers.length) setActiveDriverId(data.drivers[0].id);
  }, [data]);

  if (loading || !data) return <div style={{ ...S.app, justifyContent: "center", alignItems: "center" }}><div style={{ color: "#f59e0b", fontSize: 18, fontWeight: 700 }}>⏳ Duke ngarkuar...</div></div>;

  const navItems = [
    { id: "dashboard", label: "Ballina", icon: "📊" },
    { id: "shifts", label: "Shiftet", icon: "📋" },
    { id: "debts", label: "Borxhet", icon: "💳" },
    { id: "reports", label: "Raportet", icon: "📈" },
    ...(role === "manager" ? [{ id: "fleet", label: "Flota", icon: "🚕" }] : []),
  ];

  // Dashboard stats
  const todayShifts = data.shifts.filter(s => s.date === today());
  const monthShifts = data.shifts.filter(s => s.date?.startsWith(today().slice(0, 7)));
  const todayRev = todayShifts.reduce((s, sh) => s + sh.totalVlera, 0);
  const monthRev = monthShifts.reduce((s, sh) => s + sh.totalVlera, 0);
  const activeDebts = (data.debts || []).filter(d => !d.paguar);
  const totalDebt = activeDebts.reduce((s, d) => s + d.shuma, 0);

  const addDriver = () => {
    if (!newDriver.name) return;
    const updated = { ...data, drivers: [...data.drivers, { id: Date.now(), name: newDriver.name, phone: newDriver.phone, vehicleId: parseInt(newDriver.vehicleId) || null }] };
    save(updated);
    setNewDriver({ name: "", phone: "", vehicleId: "" });
    setShowAddDriver(false);
  };

  const markDebtPaid = (debtId) => {
    const updated = { ...data, debts: data.debts.map(d => d.id === debtId ? { ...d, paguar: true, paguarDate: today() } : d) };
    save(updated);
  };

  const deleteShift = (shiftId) => {
    if (!confirm("Fshi këtë shift?")) return;
    save({ ...data, shifts: data.shifts.filter(s => s.id !== shiftId) });
    if (selectedShift?.id === shiftId) setSelectedShift(null);
  };

  // Filtered report
  const filteredShifts = data.shifts.filter(s =>
    (reportFilter.driver === "all" || s.driverId === parseInt(reportFilter.driver)) &&
    (!reportFilter.month || s.date?.startsWith(reportFilter.month))
  );
  const repTM = filteredShifts.reduce((s, sh) => s + sh.totalTM, 0);
  const repVlera = filteredShifts.reduce((s, sh) => s + sh.totalVlera, 0);
  const repExp = filteredShifts.reduce((s, sh) => s + sh.totalExpenses, 0);
  const repNet = repVlera - repExp;

  const driversForRole = role === "manager" ? data.drivers : data.drivers.filter(d => d.id === activeDriverId);

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logoWrap}>
          <div style={S.logoText}>🚖 FlotaAL</div>
          <div style={S.logoSub}>Menaxhim Taksish</div>
        </div>
        <div style={S.nav}>
          {navItems.map(item => (
            <div key={item.id} style={S.navItem(tab === item.id)} onClick={() => setTab(item.id)}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 10px 6px", fontSize: 10, color: "#1f2937", letterSpacing: 1, textTransform: "uppercase" }}>Roli</div>
        <div style={S.roleRow}>
          <button style={S.roleBtn(role === "manager")} onClick={() => setRole("manager")}>Menaxher</button>
          <button style={S.roleBtn(role === "driver")} onClick={() => setRole("driver")}>Shofer</button>
        </div>
        {role === "driver" && (
          <div style={{ padding: "0 10px 16px" }}>
            <label style={{ ...S.label, padding: "0 2px" }}>Shofer aktiv</label>
            <select style={{ ...S.input }} value={activeDriverId || ""} onChange={e => setActiveDriverId(parseInt(e.target.value))}>
              {data.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={S.main}>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <>
            <div style={S.pageHdr}>
              <div><div style={S.pageTitle}>Ballina</div><div style={{ fontSize: 13, color: "#4b5563" }}>{today()}</div></div>
            </div>
            <div style={S.grid4}>
              {[
                { lbl: "Të ardhura sot", val: fmt(todayRev) + " L", icon: "💰", c: "245,158,11" },
                { lbl: "Të ardhura muaji", val: fmt(monthRev) + " L", icon: "📅", c: "59,130,246" },
                { lbl: "Borxhe aktive", val: activeDebts.length + " klientë", icon: "💳", c: "239,68,68" },
                { lbl: "Total borxh", val: fmt(totalDebt) + " L", icon: "⚠️", c: "239,68,68" },
              ].map((s, i) => (
                <div key={i} style={S.statCard(s.c)}>
                  <div style={S.statGlow(s.c)} />
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <div style={S.statVal(s.c)}>{s.val}</div>
                  <div style={S.statLbl}>{s.lbl}</div>
                </div>
              ))}
            </div>
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.cardTitle}>👤 Shoferët — Muaji aktual</div>
                {data.drivers.map(dr => {
                  const drShifts = monthShifts.filter(s => s.driverId === dr.id);
                  const drRev = drShifts.reduce((s, sh) => s + sh.totalVlera, 0);
                  const drExp = drShifts.reduce((s, sh) => s + sh.totalExpenses, 0);
                  return (
                    <div key={dr.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{dr.name}</span>
                        <span style={{ color: "#f59e0b", fontWeight: 700 }}>{fmt(drRev)} L</span>
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280" }}>
                        <span>{drShifts.length} shifte</span>
                        <span style={{ color: "#ef4444" }}>Shp: {fmt(drExp)} L</span>
                        <span style={{ color: "#22c55e" }}>Neto: {fmt(drRev - drExp)} L</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>📋 Shiftet e Fundit</div>
                {[...data.shifts].reverse().slice(0, 6).map(sh => (
                  <div key={sh.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{sh.driverName}</span>
                      <span style={{ color: "#4b5563", fontSize: 12, marginLeft: 8 }}>{sh.date}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>{fmt(sh.totalVlera)} L</div>
                      <div style={{ fontSize: 11, color: sh.net >= 0 ? "#22c55e" : "#ef4444" }}>Neto: {fmt(sh.net)} L</div>
                    </div>
                  </div>
                ))}
                {data.shifts.length === 0 && <div style={{ color: "#4b5563", fontSize: 13 }}>Nuk ka shifte ende.</div>}
              </div>
            </div>
          </>
        )}

        {/* ── SHIFTS ── */}
        {tab === "shifts" && (
          <>
            <div style={S.pageHdr}>
              <div style={S.pageTitle}>📋 Shiftet</div>
              <button style={S.btn()} onClick={() => { setShowShiftForm(true); setSelectedShift(null); }}>+ Shift i Ri</button>
            </div>

            {showShiftForm && (
              <ShiftForm
                data={data}
                driverId={role === "driver" ? activeDriverId : (activeDriverId || data.drivers[0]?.id)}
                onSave={(newData) => { save(newData); setShowShiftForm(false); }}
                onCancel={() => setShowShiftForm(false)}
              />
            )}

            {!showShiftForm && selectedShift && (
              <div style={{ ...S.card, border: "1px solid rgba(59,130,246,0.25)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>📋 Shift #{selectedShift.shiftNr} — {selectedShift.driverName} — {selectedShift.date}</div>
                  <div style={S.row}>
                    <button style={S.btn("danger")} onClick={() => deleteShift(selectedShift.id)}>🗑️ Fshi</button>
                    <button style={S.btn("ghost")} onClick={() => setSelectedShift(null)}>✕ Mbyll</button>
                  </div>
                </div>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>#</th><th style={S.th}>Nisja</th><th style={S.th}>Mbërritja</th><th style={S.th}>TM</th><th style={S.th}>Vlera</th><th style={S.th}>Borxh</th></tr></thead>
                  <tbody>
                    {selectedShift.trips.map((t, i) => (
                      <tr key={i}>
                        <td style={S.td}>{i + 1}</td>
                        <td style={S.td}>{t.from}</td>
                        <td style={S.td}>{t.to}</td>
                        <td style={S.td}>{fmt(t.tm)} L</td>
                        <td style={S.td}>{fmt(t.vlera)} L</td>
                        <td style={S.td}>{t.borxh ? <span style={S.tag}>Borxh — {t.klenti}</span> : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ ...S.divider }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                  {[["Gaz", selectedShift.expenses?.gaz], ["Benzinë", selectedShift.expenses?.benzine], ["Karikim", selectedShift.expenses?.karikim], ["Lavazh", selectedShift.expenses?.lavazh], ["Të tjera", selectedShift.expenses?.tjera]].map(([l, v]) => Number(v) > 0 && (
                    <div key={l}><div style={{ fontSize: 11, color: "#6b7280" }}>{l}</div><div style={{ fontWeight: 700, color: "#ef4444" }}>{fmt(v)} L</div></div>
                  ))}
                </div>
                <div style={{ ...S.divider }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  {[["Total TM", selectedShift.totalTM, "245,158,11"], ["Total Vlera", selectedShift.totalVlera, "34,197,94"], ["Shpenzime", selectedShift.totalExpenses, "239,68,68"], ["Neto", selectedShift.net, selectedShift.net >= 0 ? "34,197,94" : "239,68,68"]].map(([l, v, c]) => (
                    <div key={l}><div style={{ fontSize: 11, color: "#6b7280" }}>{l}</div><div style={{ fontSize: 20, fontWeight: 800, color: rgb(${c}) }}>{fmt(v)} L</div></div>
                  ))}
                </div>
              </div>
            )}

            {!showShiftForm && (
              <div style={S.card}>
                <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                  {role === "manager" && (
                    <select style={{ ...S.input, width: "auto" }} value={activeDriverId || "all"} onChange={e => setActiveDriverId(e.target.value === "all" ? null : parseInt(e.target.value))}>
                      <option value="all">Të gjithë shoferët</option>
                      {data.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  )}
                </div>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>Data</th><th style={S.th}>Shoferi</th><th style={S.th}>Nr. Shift</th><th style={S.th}>Udhëtime</th><th style={S.th}>Total TM</th><th style={S.th}>Total Vlera</th><th style={S.th}>Shpenzime</th><th style={S.th}>Neto</th></tr></thead>
                  <tbody>
                    {[...data.shifts].filter(s => role === "driver" ? s.driverId === activeDriverId : (activeDriverId ? s.driverId === activeDriverId : true)).reverse().map(sh => (
                      <tr key={sh.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedShift(sh); setShowShiftForm(false); }}>
                        <td style={S.td}>{sh.date}</td>
                        <td style={S.td}><b>{sh.driverName}</b></td>
                        <td style={S.td}>{sh.shiftNr}</td>
                        <td style={S.td}>{sh.trips?.length || 0}</td>
                        <td style={S.td}>{fmt(sh.totalTM)} L</td>
                        <td style={{ ...S.td, color: "#f59e0b", fontWeight: 700 }}>{fmt(sh.totalVlera)} L</td>
                        <td style={{ ...S.td, color: "#ef4444" }}>{fmt(sh.totalExpenses)} L</td>
                        <td style={{ ...S.td, color: sh.net >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{fmt(sh.net)} L</td>
                      </tr>
                    ))}
                    {data.shifts.length === 0 && <tr><td style={{ ...S.td, color: "#4b5563" }} colSpan={8}>Nuk ka shifte ende. Shto shiftin e parë!</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── DEBTS ── */}
        {tab === "debts" && (
          <>
            <div style={S.pageHdr}>
              <div style={S.pageTitle}>💳 Borxhet</div>
              <div style={S.row}>
                <button style={S.btn(debtFilter === "aktive" ? "primary" : "ghost")} onClick={() => setDebtFilter("aktive")}>Aktive</button>
                <button style={S.btn(debtFilter === "paguar" ? "primary" : "ghost")} onClick={() => setDebtFilter("paguar")}>Paguar</button>
              </div>
            </div>
            <div style={S.card}>
              {(data.debts || []).filter(d => debtFilter === "aktive" ? !d.paguar : d.paguar).length === 0 ? (
                <div style={{ color: "#4b5563", fontSize: 13 }}>Nuk ka borxhe {debtFilter === "aktive" ? "aktive" : "të paguara"}.</div>
              ) : (
                <table style={S.table}>
                  <thead><tr><th style={S.th}>Klienti</th><th style={S.th}>Shoferi</th><th style={S.th}>Shuma</th><th style={S.th}>Udhëtime</th><th style={S.th}>Statusi</th>{debtFilter === "aktive" && <th style={S.th}>Veprim</th>}</tr></thead>
                  <tbody>
                    {(data.debts || []).filter(d => debtFilter === "aktive" ? !d.paguar : d.paguar).map(d => (
                      <tr key={d.id}>
                        <td style={{ ...S.td, fontWeight: 700 }}>{d.klenti}</td>
                        <td style={S.td}>{d.driverName}</td>
                        <td style={{ ...S.td, color: "#ef4444", fontWeight: 700 }}>{fmt(d.shuma)} L</td>
                        <td style={S.td}>
                          {d.udhetime?.map((u, i) => (
                            <div key={i} style={{ fontSize: 12, color: "#6b7280" }}>{u.date}: {u.from} → {u.to} ({fmt(u.vlera)} L)</div>
                          ))}
                        </td>
                        <td style={S.td}><span style={S.badge(d.paguar ? "34,197,94" : "239,68,68")}>{d.paguar ? "✅ Paguar" : "⏳ Borxh"}</span></td>
                        {debtFilter === "aktive" && <td style={S.td}><button style={S.btn()} onClick={() => markDebtPaid(d.id)}>✅ Shëno Paguar</button></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── REPORTS ── */}
        {tab === "reports" && (
          <>
            <div style={S.pageHdr}><div style={S.pageTitle}>📈 Raportet</div></div>
            <div style={{ ...S.card, padding: "16px 20px" }}>
              <div style={S.row}>
                <div><label style={S.label}>Muaji</label><input style={S.input} type="month" value={reportFilter.month} onChange={e => setReportFilter({ ...reportFilter, month: e.target.value })} /></div>
                {role === "manager" && (
                  <div><label style={S.label}>Shoferi</label>
                    <select style={S.input} value={reportFilter.driver} onChange={e => setReportFilter({ ...reportFilter, driver: e.target.value })}>
                      <option value="all">Të gjithë</option>
                      {data.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div style={S.grid4}>
              {[
                { lbl: "Total TM", val: fmt(repTM) + " L", c: "245,158,11", icon: "🔢" },
                { lbl: "Total Vlera", val: fmt(repVlera) + " L", c: "59,130,246", icon: "💰" },
                { lbl: "Shpenzime", val: fmt(repExp) + " L", c: "239,68,68", icon: "💸" },
                { lbl: "Neto", val: fmt(repNet) + " L", c: repNet >= 0 ? "34,197,94" : "239,68,68", icon: "📊" },
              ].map((s, i) => (
                <div key={i} style={S.statCard(s.c)}>
                  <div style={S.statGlow(s.c)} />
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={S.statVal(s.c)}>{s.val}</div>
                  <div style={S.statLbl}>{s.lbl}</div>
                </div>
              ))}
            </div>
            {role === "manager" && reportFilter.driver === "all" && (
              <div style={S.card}>
                <div style={S.cardTitle}>👤 Krahasimi i Shoferëve</div>
                <table style={S.table}>
                  <thead><tr><th style={S.th}>Shoferi</th><th style={S.th}>Shifte</th><th style={S.th}>Udhëtime</th><th style={S.th}>Total TM</th><th style={S.th}>Total Vlera</th><th style={S.th}>Zbritja %</th><th style={S.th}>Shpenzime</th><th style={S.th}>Neto</th></tr></thead>
                  <tbody>
                    {data.drivers.map(dr => {
                      const dsh = filteredShifts.filter(s => s.driverId === dr.id);
                      const tm = dsh.reduce((s, sh) => s + sh.totalTM, 0);
                      const vl = dsh.reduce((s, sh) => s + sh.totalVlera, 0);
                      const ex = dsh.reduce((s, sh) => s + sh.totalExpenses, 0);
                      const trips = dsh.reduce((s, sh) => s + (sh.trips?.length || 0), 0);
                      const zb = tm > 0 ? (((tm - vl) / tm) * 100).toFixed(1) : 0;
                      return (
                        <tr key={dr.id}>
                          <td style={{ ...S.td, fontWeight: 700 }}>{dr.name}</td>
                          <td style={S.td}>{dsh.length}</td>
                          <td style={S.td}>{trips}</td>
                          <td style={S.td}>{fmt(tm)} L</td>
                          <td style={{ ...S.td, color: "#f59e0b", fontWeight: 700 }}>{fmt(vl)} L</td>
                          <td style={{ ...S.td, color: "#ef4444" }}>{zb}%</td>
                          <td style={{ ...S.td, color: "#ef4444" }}>{fmt(ex)} L</td>
                          <td style={{ ...S.td, color: vl - ex >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{fmt(vl - ex)} L</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div style={S.card}>
              <div style={S.cardTitle}>📋 Detaji i Shifteve</div>
              <table style={S.table}>
                <thead><tr><th style={S.th}>Data</th><th style={S.th}>Shoferi</th><th style={S.th}>Nr.Shift</th><th style={S.th}>TM</th><th style={S.th}>Vlera</th><th style={S.th}>Zbritja%</th><th style={S.th}>Shpenzime</th><th style={S.th}>Neto</th></tr></thead>
                <tbody>
                  {filteredShifts.length === 0 ? (
                    <tr><td style={{ ...S.td, color: "#4b5563" }} colSpan={8}>Nuk ka të dhëna për periudhën e zgjedhur.</td></tr>
                  ) : [...filteredShifts].reverse().map(sh => {
                    const zb = sh.totalTM > 0 ? (((sh.totalTM - sh.totalVlera) / sh.totalTM) * 100).toFixed(1) : 0;
                    return (
                      <tr key={sh.id}>
                        <td style={S.td}>{sh.date}</td>
                        <td style={{ ...S.td, fontWeight: 700 }}>{sh.driverName}</td>
                        <td style={S.td}>{sh.shiftNr}</td>
                        <td style={S.td}>{fmt(sh.totalTM)} L</td>
                        <td style={{ ...S.td, color: "#f59e0b", fontWeight: 700 }}>{fmt(sh.totalVlera)} L</td>
                        <td style={{ ...S.td, color: "#ef4444" }}>{zb}%</td>
                        <td style={{ ...S.td, color: "#ef4444" }}>{fmt(sh.totalExpenses)} L</td>
                        <td style={{ ...S.td, color: sh.net >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{fmt(sh.net)} L</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── FLEET ── */}
        {tab === "fleet" && role === "manager" && (
          <>
            <div style={S.pageHdr}>
              <div style={S.pageTitle}>🚕 Flota & Shoferët</div>
              <button style={S.btn()} onClick={() => setShowAddDriver(true)}>+ Shto Shofer</button>
            </div>
            {showAddDriver && (
              <div style={{ ...S.card, border: "1px solid rgba(245,158,11,0.25)", marginBottom: 20 }}>
                <div style={S.cardTitle}>➕ Shofer i Ri</div>
                <div style={S.grid2}>
                  <div style={S.fldWrap}><label style={S.label}>Emri</label><input style={S.input} value={newDriver.name} onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} /></div>
                  <div style={S.fldWrap}><label style={S.label}>Telefoni</label><input style={S.input} value={newDriver.phone} onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })} /></div>
                </div>
                <div style={S.fldWrap}><label style={S.label}>Makina</label>
                  <select style={S.input} value={newDriver.vehicleId} onChange={e => setNewDriver({ ...newDriver, vehicleId: e.target.value })}>
                    <option value="">— Zgjidh —</option>
                    {data.vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} — {v.model}</option>)}
                  </select>
                </div>
                <div style={S.row}><button style={S.btn()} onClick={addDriver}>Ruaj</button><button style={S.btn("ghost")} onClick={() => setShowAddDriver(false)}>Anulo</button></div>
              </div>
            )}
            <div style={S.card}>
              <div style={S.cardTitle}>👤 Shoferët</div>
              <table style={S.table}>
                <thead><tr><th style={S.th}>Emri</th><th style={S.th}>Telefoni</th><th style={S.th}>Makina</th><th style={S.th}>Shifte muaji</th><th style={S.th}>Të ardhura muaji</th></tr></thead>
                <tbody>
                  {data.drivers.map(dr => {
                    const v = data.vehicles.find(v => v.id === dr.vehicleId);
                    const dsh = monthShifts.filter(s => s.driverId === dr.id);
                    return (
                      <tr key={dr.id}>
                        <td style={{ ...S.td, fontWeight: 700 }}>{dr.name}</td>
                        <td style={S.td}>{dr.phone}</td>
                        <td style={S.td}>{v ? ${v.plate} (${v.type === "elektrik" ? "⚡" : "⛽"} ${v.model}) : "—"}</td>
                        <td style={S.td}>{dsh.length}</td>
                        <td style={{ ...S.td, color: "#f59e0b", fontWeight: 700 }}>{fmt(dsh.reduce((s, sh) => s + sh.totalVlera, 0))} L</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>🚗 Mjetet ({data.vehicles.length})</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {data.vehicles.map(v => {
                  const driver = data.drivers.find(d => d.vehicleId === v.id);
                  return (
                    <div key={v.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: 18, marginBottom: 6 }}>{v.type === "elektrik" ? "⚡" : "⛽"}</div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{v.plate}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{v.model}</div>
                      <div style={{ fontSize: 12, color: driver ? "#22c55e" : "#4b5563" }}>{driver ? 👤 ${driver.name} : "Pa shofer"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
