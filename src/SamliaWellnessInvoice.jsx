import { useState, useMemo, useRef, useCallback } from "react";

/* ─── LOGO BASE64 ─── */
const LOGO_B64 =
  "data:image/jpeg;base64,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";

/* ─── HELPERS ─── */
const formatBND = (n) =>
  "B$ " +
  Number(n || 0).toLocaleString("en-BN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const todayBNT = () => {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Brunei" })
  );
  return d.toISOString().split("T")[0];
};

const formatDateDisplay = (iso) => {
  if (!iso) return "";
  const [y, m, day] = iso.split("-");
  const months = [
    "Januari","Februari","Mac","April","Mei","Jun",
    "Julai","Ogos","September","Oktober","November","Disember",
  ];
  return `${parseInt(day, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
};

const genInvoiceNo = (counter) => {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Brunei" })
  );
  const ymd =
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  return `SW-${ymd}-${String(counter).padStart(3, "0")}`;
};

/* ─── DEFAULT SERVICES ─── */
const DEFAULT_MENU = [
  { name: "Body Spa", price: 45 },
  { name: "Body Scrub", price: 35 },
  { name: "Foot Spa", price: 25 },
  { name: "Foot Reflexology", price: 30 },
  { name: "Manicure & Pedicure", price: 28 },
  { name: "Callus Treatment", price: 22 },
  { name: "Rawatan Pantang Bersalin", price: 65 },
  { name: "Ratus Temanten", price: 55 },
];

const PAYMENT_METHODS = [
  "Tunai / Cash",
  "Pindahan Bank / Bank Transfer",
  "QR Pay (BIBD / BAIDURI)",
  "Kad Debit / Debit Card",
];

/* ══════════════════════════════════════════
   LOCALSTORAGE HOOK
══════════════════════════════════════════ */
function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = (value) => {
    setState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return [state, setValue];
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function SamliaInvoice() {
  /* ─── invoice counter — kekal selepas refresh ─── */
  const [counter, setCounter] = useLocalStorage("sw_counter", 1);

  /* ─── draft invois semasa — auto-simpan saat taip ─── */
  const [customer, setCustomer] = useLocalStorage("sw_customer", {
    name: "",
    phone: "",
    date: todayBNT(),
    payment: PAYMENT_METHODS[0],
    status: "PAID",
    remarks: "",
  });

  /* ─── selected services (rows) ─── */
  const [rows, setRows] = useLocalStorage("sw_rows", []);

  /* ─── discount ─── */
  const [discountMode, setDiscountMode] = useLocalStorage("sw_discountMode", "percent");
  const [discountVal, setDiscountVal] = useLocalStorage("sw_discountVal", "");

  /* ─── custom service adder ─── */
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  /* ─── copy feedback ─── */
  const [copied, setCopied] = useState(false);

  /* ─── hover state for service buttons ─── */
  const [hoveredService, setHoveredService] = useState(null);

  /* ─── service menu CRUD — kekal selepas refresh ─── */
  const [menu, setMenu] = useLocalStorage("sw_menu", DEFAULT_MENU);
  const [showManager, setShowManager] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [newSvcName, setNewSvcName] = useState("");
  const [newSvcPrice, setNewSvcPrice] = useState("");

  /* ─── history / riwayat invois — kekal selepas refresh ─── */
  const [history, setHistory] = useLocalStorage("sw_history", []);
  const [showHistory, setShowHistory] = useState(false);
  const [historyView, setHistoryView] = useState(null);
  const [historySearch, setHistorySearch] = useState("");

  const printRef = useRef(null);

  /* ─── invoice number ─── */
  const invoiceNo = useMemo(() => genInvoiceNo(counter), [counter]);

  /* ─── calculations ─── */
  const rowCalcs = useMemo(() => rows.map((r) => {
    const lineTotal = r.price * r.qty;
    const dv = parseFloat(r.discVal) || 0;
    const lineDisc = r.discMode === "percent" ? (lineTotal * dv) / 100 : Math.min(dv, lineTotal);
    const lineNet = lineTotal - lineDisc;
    return { lineTotal, lineDisc, lineNet };
  }), [rows]);

  const { subtotal, totalItemDisc, subtotalAfterItemDisc, discountAmt, total } = useMemo(() => {
    const sub = rowCalcs.reduce((s, r) => s + r.lineTotal, 0);
    const itemDisc = rowCalcs.reduce((s, r) => s + r.lineDisc, 0);
    const subAfter = sub - itemDisc;
    const dv = parseFloat(discountVal) || 0;
    const disc = discountMode === "percent" ? (subAfter * dv) / 100 : dv;
    const discCapped = Math.min(disc, subAfter);
    return {
      subtotal: sub,
      totalItemDisc: itemDisc,
      subtotalAfterItemDisc: subAfter,
      discountAmt: discCapped,
      total: Math.max(subAfter - discCapped, 0),
    };
  }, [rowCalcs, discountVal, discountMode]);

  /* ─── handlers ─── */
  const addService = (svc) => {
    setRows((prev) => {
      const existing = prev.findIndex((r) => r.name === svc.name);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], qty: updated[existing].qty + 1 };
        return updated;
      }
      // discMode: 'percent' | 'fixed' — per-item discount
      return [...prev, { ...svc, qty: 1, discMode: "percent", discVal: "" }];
    });
  };

  const addCustom = () => {
    if (!customName.trim() || !customPrice) return;
    addService({ name: customName.trim(), price: parseFloat(customPrice) });
    setCustomName("");
    setCustomPrice("");
  };

  const updateQty = (i, val) => {
    const q = Math.max(1, parseInt(val, 10) || 1);
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, qty: q } : r)));
  };

  const updateRowDisc = (i, field, val) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));

  const removeRow = (i) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  /* ─── menu CRUD handlers ─── */
  const startEdit = (i) => {
    setEditIdx(i);
    setEditName(menu[i].name);
    setEditPrice(String(menu[i].price));
  };
  const saveEdit = () => {
    if (!editName.trim() || !editPrice) return;
    setMenu((prev) => prev.map((s, i) => i === editIdx ? { name: editName.trim(), price: parseFloat(editPrice) } : s));
    setEditIdx(null);
  };
  const cancelEdit = () => setEditIdx(null);
  const deleteMenuItem = (i) => {
    if (window.confirm(`Padam "${menu[i].name}"?`)) {
      setMenu((prev) => prev.filter((_, idx) => idx !== i));
    }
  };
  const addMenuItem = () => {
    if (!newSvcName.trim() || !newSvcPrice) return;
    setMenu((prev) => [...prev, { name: newSvcName.trim(), price: parseFloat(newSvcPrice) }]);
    setNewSvcName("");
    setNewSvcPrice("");
  };

  /* ─── save current invoice to history ─── */
  const saveToHistory = () => {
    if (rows.length === 0) return alert("Tiada perkhidmatan untuk disimpan.");
    const snap = {
      id: Date.now(),
      invoiceNo,
      savedAt: new Date().toLocaleString("en-GB", { timeZone: "Asia/Brunei" }),
      customer: { ...customer },
      rows: rows.map((r, i) => ({ ...r, ...rowCalcs[i] })),
      discountMode, discountVal,
      subtotal, totalItemDisc, subtotalAfterItemDisc, discountAmt, total,
    };
    setHistory((prev) => [snap, ...prev]);
    return snap;
  };

  const newInvoice = () => {
    if (rows.length > 0) saveToHistory();
    setCounter((c) => c + 1);
    setCustomer({ name: "", phone: "", date: todayBNT(), payment: PAYMENT_METHODS[0], status: "PAID", remarks: "" });
    setRows([]);
    setDiscountVal("");
    setDiscountMode("percent");
  };

  /* ─── hapus semua data localStorage ─── */
  const clearAllData = () => {
    if (window.confirm("⚠️ Padam SEMUA data termasuk riwayat dan menu perkhidmatan?\nTindakan ini tidak boleh dibatalkan.")) {
      ["sw_counter","sw_customer","sw_rows","sw_discountMode","sw_discountVal","sw_menu","sw_history"]
        .forEach((k) => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  /* ─── restore history entry back into form ─── */
  const restoreFromHistory = (snap) => {
    setCounter((c) => c + 1);
    setCustomer({ ...snap.customer });
    setRows(snap.rows.map(({ lineTotal, lineDisc, lineNet, ...r }) => r));
    setDiscountMode(snap.discountMode);
    setDiscountVal(snap.discountVal);
    setHistoryView(null);
    setShowHistory(false);
  };

  const deleteHistory = (id) => {
    if (window.confirm("Padam rekod invois ini?"))
      setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handlePrint = () => window.print();

  const copyWhatsApp = () => {
    const lines = rows.map((r, i) => {
      const { lineTotal, lineDisc, lineNet } = rowCalcs[i];
      const discStr = lineDisc > 0 ? ` (diskaun -${formatBND(lineDisc)})` : "";
      return `• ${r.name} x${r.qty} – ${formatBND(lineNet)}${discStr}`;
    }).join("\n");
    const itemDiscStr = totalItemDisc > 0 ? `\n🏷️ Diskaun Item  : -${formatBND(totalItemDisc)}` : "";
    const txDiscStr = discountAmt > 0 ? `\n🏷️ Diskaun Trans : -${formatBND(discountAmt)}` : "";
    const text =
      `✨ *SAMLIA WELLNESS* ✨\n` +
      `📋 Invois: ${invoiceNo}\n` +
      `📅 Tarikh: ${formatDateDisplay(customer.date)}\n\n` +
      `👤 Pelanggan: ${customer.name || "-"}\n` +
      `📞 Tel: ${customer.phone || "-"}\n\n` +
      `🌸 *Perkhidmatan:*\n${lines}\n\n` +
      `💰 Subtotal : ${formatBND(subtotal)}${itemDiscStr}${txDiscStr}\n` +
      `✅ *JUMLAH   : ${formatBND(total)}*\n` +
      `💳 Bayaran  : ${customer.payment}\n\n` +
      `Terima kasih kerana memilih Samlia Wellness! 🌸`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <>
      {/* ── Print CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fdf8f0; font-family: 'Lato', sans-serif; }
        @media print {
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; margin: 0 !important; width: 100% !important; }
          body { background: white; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#fdf8f0 0%,#f5ede0 100%)", padding: "24px 16px" }}>

        {/* ── App Header ── */}
        <header className="no-print" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <img src={LOGO_B64} alt="Samlia Wellness" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #92400e" }} />
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: "#92400e", letterSpacing: 1 }}>Samlia Wellness</h1>
              <p style={{ fontSize: 12, color: "#a16207", letterSpacing: 2, textTransform: "uppercase" }}>Invoice System</p>
            </div>
          </div>
          {/* ── Autosave indicator ── */}
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", display: "inline-block", boxShadow: "0 0 6px #059669" }} />
            <span style={{ fontSize: 11, color: "#059669", fontWeight: 600, letterSpacing: 0.5 }}>
              Data tersimpan secara automatik · Auto-saved
            </span>
          </div>
        </header>

        {/* ── Two-panel layout ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1280, margin: "0 auto" }}
          className="layout-grid">

          {/* ════════ LEFT: FORM ════════ */}
          <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Customer Info Card */}
            <Card title="Maklumat Pelanggan / Customer Info">
              <Label>Nama Pelanggan / Customer Name</Label>
              <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Nama penuh..." />

              <Label>No. Telefon / Phone Number</Label>
              <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="+673 xxx xxxx" />

              <Label>Tarikh Kunjungan / Visit Date</Label>
              <Input type="date" value={customer.date} onChange={(e) => setCustomer({ ...customer, date: e.target.value })} />

              <Label>Cara Bayar / Payment Method</Label>
              <select value={customer.payment} onChange={(e) => setCustomer({ ...customer, payment: e.target.value })}
                style={selectStyle}>
                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>

              <Label>Status Pembayaran / Payment Status</Label>
              <div style={{ display: "flex", gap: 10 }}>
                {["PAID", "UNPAID"].map((s) => (
                  <button key={s} onClick={() => setCustomer({ ...customer, status: s })}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "2px solid", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all .2s",
                      borderColor: s === "PAID" ? "#059669" : "#e11d48",
                      background: customer.status === s ? (s === "PAID" ? "#059669" : "#e11d48") : "white",
                      color: customer.status === s ? "white" : (s === "PAID" ? "#059669" : "#e11d48") }}>
                    {s === "PAID" ? "✅ LUNAS / PAID" : "⏳ BELUM / UNPAID"}
                  </button>
                ))}
              </div>

              <Label>Catatan / Remarks (Opsional)</Label>
              <textarea value={customer.remarks} onChange={(e) => setCustomer({ ...customer, remarks: e.target.value })}
                placeholder="Catatan tambahan..." rows={2}
                style={{ ...inputStyle, resize: "vertical" }} />
            </Card>

            {/* Services Menu Card */}
            <div style={{ background: "white", borderRadius: 14, padding: 20, boxShadow: "0 4px 20px rgba(146,64,14,0.08)", border: "1px solid #fde68a" }}>
              {/* Card header with Manage button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 8, borderBottom: "2px solid #fde68a" }}>
                <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700, color: "#92400e" }}>
                  Pilih Perkhidmatan / Select Services
                </h4>
                <button onClick={() => setShowManager(true)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: "#fef3c7", border: "1.5px solid #d97706", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#92400e", transition: "all .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#92400e"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fef3c7"; e.currentTarget.style.color = "#92400e"; }}>
                  ⚙️ Urus / Manage
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {menu.map((s) => {
                  const isHovered = hoveredService === s.name;
                  return (
                    <button key={s.name} onClick={() => addService(s)}
                      onMouseEnter={() => setHoveredService(s.name)}
                      onMouseLeave={() => setHoveredService(null)}
                      style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                        transition: "background .2s, color .2s", fontSize: 12, fontWeight: 600,
                        border: "1.5px solid #d97706",
                        background: isHovered ? "#92400e" : "white",
                        color: isHovered ? "white" : "#92400e" }}>
                      <div>{s.name}</div>
                      <div style={{ fontWeight: 400, marginTop: 2 }}>{formatBND(s.price)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Rows */}
            {rows.length > 0 && (
              <Card title="Perkhidmatan Dipilih / Selected Services">
                {rows.map((r, i) => {
                  const { lineTotal, lineDisc, lineNet } = rowCalcs[i];
                  const hasDisc = lineDisc > 0;
                  return (
                    <div key={i} style={{ borderBottom: "1px solid #fde68a", paddingBottom: 12, marginBottom: 4 }}>
                      {/* Row top: name + qty + remove */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ flex: 1, fontSize: 13, color: "#78350f", fontWeight: 700 }}>{r.name}</span>
                        <span style={{ fontSize: 11, color: "#a16207" }}>{formatBND(r.price)} ×</span>
                        <input type="number" min={1} value={r.qty} onChange={(e) => updateQty(i, e.target.value)}
                          style={{ width: 48, padding: "4px 6px", border: "1.5px solid #d97706", borderRadius: 6, textAlign: "center", fontSize: 13 }} />
                        <button onClick={() => removeRow(i)}
                          style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#e11d48", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✕</button>
                      </div>

                      {/* Row bottom: per-item discount + net total */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        {/* Label */}
                        <span style={{ fontSize: 11, color: "#a16207", fontWeight: 600, whiteSpace: "nowrap" }}>🏷️ Diskaun item:</span>
                        {/* Mode toggle */}
                        <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "1.5px solid #d97706", flexShrink: 0 }}>
                          {["percent", "fixed"].map((m) => (
                            <button key={m} onClick={() => updateRowDisc(i, "discMode", m)}
                              style={{ padding: "3px 9px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", transition: "all .15s",
                                background: r.discMode === m ? "#d97706" : "white",
                                color: r.discMode === m ? "white" : "#d97706" }}>
                              {m === "percent" ? "%" : "B$"}
                            </button>
                          ))}
                        </div>
                        {/* Value input */}
                        <input type="number" min={0} value={r.discVal}
                          onChange={(e) => updateRowDisc(i, "discVal", e.target.value)}
                          placeholder="0"
                          style={{ width: 68, padding: "4px 8px", border: "1.5px solid #fde68a", borderRadius: 6, fontSize: 12, color: "#78350f", background: "#fef9ee", outline: "none", textAlign: "center" }} />
                        {/* Result */}
                        <div style={{ marginLeft: "auto", textAlign: "right" }}>
                          {hasDisc && (
                            <div style={{ fontSize: 11, color: "#e11d48", textDecoration: "line-through" }}>{formatBND(lineTotal)}</div>
                          )}
                          <div style={{ fontSize: 13, fontWeight: 700, color: hasDisc ? "#059669" : "#92400e" }}>
                            {formatBND(lineNet)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Card>
            )}

            {/* Transaction Discount Card */}
            <Card title="Diskaun Transaksi / Transaction Discount">
              <p style={{ fontSize: 11, color: "#a16207", marginBottom: 4 }}>
                Diskaun ini dikenakan ke atas jumlah keseluruhan selepas diskaun item.
              </p>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {["percent", "fixed"].map((m) => (
                  <button key={m} onClick={() => setDiscountMode(m)}
                    style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "2px solid #d97706", cursor: "pointer", fontWeight: 700, fontSize: 13,
                      background: discountMode === m ? "#d97706" : "white", color: discountMode === m ? "white" : "#d97706" }}>
                    {m === "percent" ? "Peratus %" : "Nominal B$"}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#92400e", fontWeight: 700 }}>{discountMode === "percent" ? "%" : "B$"}</span>
                <Input type="number" min={0} value={discountVal} onChange={(e) => setDiscountVal(e.target.value)}
                  placeholder={discountMode === "percent" ? "cth: 10" : "cth: 5.00"} />
              </div>
            </Card>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <ActionBtn onClick={handlePrint} color="#92400e">🖨️ Cetak / Print</ActionBtn>
              <ActionBtn onClick={copyWhatsApp} color="#059669">{copied ? "✅ Disalin!" : "📋 Salin Ringkasan"}</ActionBtn>
              <ActionBtn onClick={() => {
                if (window.confirm("Reset borang invois semasa? Data tidak akan disimpan.")) {
                  setCustomer({ name: "", phone: "", date: todayBNT(), payment: PAYMENT_METHODS[0], status: "PAID", remarks: "" });
                  setRows([]);
                  setDiscountVal("");
                }
              }} color="#b45309">🗑️ Reset Invois</ActionBtn>
              <ActionBtn onClick={newInvoice} color="#1d4ed8">🔄 Invois Baru</ActionBtn>
            </div>

            {/* History trigger */}
            <button onClick={() => { setHistoryView(null); setShowHistory(true); }}
              style={{ width: "100%", padding: "11px 0", background: "white", border: "2px solid #d97706", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#92400e", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              📜 Riwayat Invois / Invoice History
              {history.length > 0 && (
                <span style={{ background: "#92400e", color: "white", borderRadius: 99, padding: "1px 8px", fontSize: 11 }}>
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {/* ════════ RIGHT: INVOICE PREVIEW ════════ */}
          <div ref={printRef} className="print-area"
            style={{ background: "white", borderRadius: 16, boxShadow: "0 8px 40px rgba(146,64,14,0.12)", padding: 36, fontFamily: "'Lato',sans-serif", minHeight: 700 }}>

            {/* Invoice Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <img src={LOGO_B64} alt="Samlia Wellness" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ textAlign: "right" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#92400e" }}>Samlia Wellness</h2>
                <p style={{ fontSize: 11, color: "#78350f", lineHeight: 1.7 }}>
                  Tanjong Bunut, Brunei Darussalam<br />
                  +673 869 8379 · yani2912@gmail.com
                </p>
              </div>
            </div>

            {/* Gold divider */}
            <div style={{ height: 3, background: "linear-gradient(90deg,#92400e,#d97706,#fcd34d,#d97706,#92400e)", borderRadius: 2, marginBottom: 20 }} />

            {/* INVOIS title + number */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#92400e", letterSpacing: 2, textTransform: "uppercase" }}>Invois / Invoice</h3>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#78350f" }}>{invoiceNo}</div>
                <div style={{ fontSize: 12, color: "#a16207" }}>{formatDateDisplay(customer.date)}</div>
                <div style={{ fontSize: 11, color: "#92400e", marginTop: 2 }}>{customer.payment}</div>
              </div>
            </div>

            {/* Customer info */}
            <div style={{ background: "#fef9ee", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#a16207", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Pelanggan / Customer</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#78350f" }}>{customer.name || "–"}</div>
              <div style={{ fontSize: 13, color: "#92400e" }}>{customer.phone || "–"}</div>
              {customer.remarks && <div style={{ fontSize: 11, color: "#a16207", marginTop: 6, fontStyle: "italic" }}>"{customer.remarks}"</div>}
            </div>

            {/* Services Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#92400e", color: "white" }}>
                  {["No","Perkhidmatan / Service","Qty","Harga","Diskaun","Jumlah"].map((h, i) => (
                    <th key={i} style={{ padding: "8px 8px", textAlign: i >= 2 ? "center" : "left", fontSize: 10, letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#d97706", fontStyle: "italic", fontSize: 12 }}>
                    Tiada perkhidmatan dipilih / No services selected
                  </td></tr>
                ) : rows.map((r, i) => {
                  const { lineTotal, lineDisc, lineNet } = rowCalcs[i];
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fef9ee" }}>
                      <td style={{ padding: "8px 8px", color: "#92400e", fontWeight: 700 }}>{i + 1}</td>
                      <td style={{ padding: "8px 8px", color: "#78350f" }}>{r.name}</td>
                      <td style={{ padding: "8px 8px", textAlign: "center", color: "#92400e" }}>{r.qty}</td>
                      <td style={{ padding: "8px 8px", textAlign: "center", color: "#78350f" }}>{formatBND(r.price)}</td>
                      <td style={{ padding: "8px 8px", textAlign: "center", color: lineDisc > 0 ? "#e11d48" : "#9ca3af" }}>
                        {lineDisc > 0 ? `-${formatBND(lineDisc)}` : "–"}
                      </td>
                      <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: 700, color: "#92400e" }}>{formatBND(lineNet)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ marginLeft: "auto", width: 290 }}>
              <TotalRow label="Subtotal (Harga Asal)" value={formatBND(subtotal)} />
              {totalItemDisc > 0 && <TotalRow label="Diskaun Item" value={`-${formatBND(totalItemDisc)}`} color="#e11d48" />}
              {totalItemDisc > 0 && <TotalRow label="Subtotal Selepas Diskaun" value={formatBND(subtotalAfterItemDisc)} />}
              {discountAmt > 0 && <TotalRow label="Diskaun Transaksi" value={`-${formatBND(discountAmt)}`} color="#e11d48" />}
              <div style={{ height: 1, background: "#d97706", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, color: "#92400e" }}>JUMLAH / TOTAL DUE</span>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#92400e" }}>{formatBND(total)}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div style={{ textAlign: "center", margin: "20px 0 14px" }}>
              <span style={{
                display: "inline-block", padding: "8px 28px", borderRadius: 99, fontWeight: 800, fontSize: 14, letterSpacing: 2, textTransform: "uppercase",
                background: customer.status === "PAID" ? "#dcfce7" : "#fee2e2",
                color: customer.status === "PAID" ? "#059669" : "#e11d48",
                border: `2px solid ${customer.status === "PAID" ? "#059669" : "#e11d48"}`
              }}>
                {customer.status === "PAID" ? "✅ LUNAS / PAID" : "⏳ BELUM LUNAS / UNPAID"}
              </span>
            </div>

            {/* Gold divider bottom */}
            <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#d97706,transparent)", margin: "14px 0" }} />

            {/* Footer */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: "#92400e", marginBottom: 4 }}>
                🌸 Terima kasih kerana memilih Samlia Wellness 🌸
              </p>
              <p style={{ fontSize: 11, color: "#a16207" }}>Thank you for choosing Samlia Wellness</p>
              <p style={{ fontSize: 10, color: "#ca8a04", marginTop: 8 }}>
                Tanjong Bunut, Brunei Darussalam · +673 869 8379 · yani2912@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* ════════ HISTORY MODAL ════════ */}
        {showHistory && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={(e) => { if (e.target === e.currentTarget) { setShowHistory(false); setHistoryView(null); } }}>
            <div style={{ background: "white", borderRadius: 18, width: "100%", maxWidth: historyView ? 680 : 620, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

              {/* Modal header */}
              <div style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", padding: "18px 24px", borderRadius: "18px 18px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {historyView && (
                    <button onClick={() => setHistoryView(null)}
                      style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "white", fontSize: 13, fontWeight: 700 }}>
                      ← Kembali
                    </button>
                  )}
                  <div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>
                      {historyView ? `📄 ${historyView.invoiceNo}` : "📜 Riwayat Invois"}
                    </h3>
                    <p style={{ fontSize: 11, color: "#bfdbfe", margin: "2px 0 0", letterSpacing: 1 }}>
                      {historyView ? historyView.customer.name || "–" : `INVOICE HISTORY · ${history.length} rekod`}
                    </p>
                  </div>
                </div>
                <button onClick={() => { setShowHistory(false); setHistoryView(null); }}
                  style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "white", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>

              <div style={{ padding: 24 }}>
                {/* ── DETAIL VIEW ── */}
                {historyView ? (
                  <div>
                    {/* Info box */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                      {[
                        ["📋 No. Invois", historyView.invoiceNo],
                        ["📅 Tarikh", formatDateDisplay(historyView.customer.date)],
                        ["👤 Pelanggan", historyView.customer.name || "–"],
                        ["📞 Telefon", historyView.customer.phone || "–"],
                        ["💳 Bayaran", historyView.customer.payment],
                        ["🕐 Disimpan", historyView.savedAt],
                      ].map(([label, val]) => (
                        <div key={label} style={{ background: "#fef9ee", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px" }}>
                          <div style={{ fontSize: 10, color: "#a16207", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#78350f", marginTop: 3 }}>{val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Remarks */}
                    {historyView.customer.remarks && (
                      <div style={{ background: "#fef9ee", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#a16207", fontStyle: "italic" }}>
                        "{historyView.customer.remarks}"
                      </div>
                    )}

                    {/* Services table */}
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#92400e", color: "white" }}>
                          {["No","Perkhidmatan","Qty","Harga","Diskaun","Jumlah"].map((h, i) => (
                            <th key={i} style={{ padding: "8px", textAlign: i >= 2 ? "center" : "left", fontSize: 10 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {historyView.rows.map((r, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fef9ee" }}>
                            <td style={{ padding: "8px", color: "#92400e", fontWeight: 700 }}>{i + 1}</td>
                            <td style={{ padding: "8px", color: "#78350f" }}>{r.name}</td>
                            <td style={{ padding: "8px", textAlign: "center" }}>{r.qty}</td>
                            <td style={{ padding: "8px", textAlign: "center", color: "#78350f" }}>{formatBND(r.price)}</td>
                            <td style={{ padding: "8px", textAlign: "center", color: r.lineDisc > 0 ? "#e11d48" : "#9ca3af" }}>
                              {r.lineDisc > 0 ? `-${formatBND(r.lineDisc)}` : "–"}
                            </td>
                            <td style={{ padding: "8px", textAlign: "right", fontWeight: 700, color: "#92400e" }}>{formatBND(r.lineNet)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div style={{ marginLeft: "auto", width: 280, marginBottom: 20 }}>
                      <TotalRow label="Subtotal" value={formatBND(historyView.subtotal)} />
                      {historyView.totalItemDisc > 0 && <TotalRow label="Diskaun Item" value={`-${formatBND(historyView.totalItemDisc)}`} color="#e11d48" />}
                      {historyView.discountAmt > 0 && <TotalRow label="Diskaun Transaksi" value={`-${formatBND(historyView.discountAmt)}`} color="#e11d48" />}
                      <div style={{ height: 1, background: "#d97706", margin: "8px 0" }} />
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, color: "#92400e" }}>JUMLAH</span>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, color: "#92400e" }}>{formatBND(historyView.total)}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                      <span style={{ display: "inline-block", padding: "7px 24px", borderRadius: 99, fontWeight: 800, fontSize: 13, letterSpacing: 2,
                        background: historyView.customer.status === "PAID" ? "#dcfce7" : "#fee2e2",
                        color: historyView.customer.status === "PAID" ? "#059669" : "#e11d48",
                        border: `2px solid ${historyView.customer.status === "PAID" ? "#059669" : "#e11d48"}` }}>
                        {historyView.customer.status === "PAID" ? "✅ LUNAS / PAID" : "⏳ BELUM LUNAS / UNPAID"}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => restoreFromHistory(historyView)}
                        style={{ flex: 1, padding: "10px 0", background: "#1d4ed8", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                        🔄 Muat Semula ke Form
                      </button>
                      <button onClick={() => { deleteHistory(historyView.id); setHistoryView(null); }}
                        style={{ padding: "10px 18px", background: "#fee2e2", border: "1.5px solid #e11d48", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#e11d48" }}>
                        🗑️ Padam
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── LIST VIEW ── */
                  <div>
                    {/* Search */}
                    <input value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="🔍 Cari nama pelanggan atau no. invois..."
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #fde68a", borderRadius: 10, fontSize: 13, color: "#78350f", background: "#fef9ee", outline: "none", marginBottom: 16 }} />

                    {history.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "48px 0", color: "#d97706" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "#92400e" }}>Tiada riwayat invois</p>
                        <p style={{ fontSize: 12, color: "#a16207", marginTop: 6 }}>Simpan invois pertama anda dengan butang 💾 Simpan</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {history
                          .filter((h) => {
                            const q = historySearch.toLowerCase();
                            return !q || h.invoiceNo.toLowerCase().includes(q) || (h.customer.name || "").toLowerCase().includes(q);
                          })
                          .map((h) => (
                            <div key={h.id} style={{ border: "1.5px solid #fde68a", borderRadius: 12, overflow: "hidden", transition: "box-shadow .2s" }}
                              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(146,64,14,0.15)"}
                              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>
                              <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12 }}>
                                {/* Left: info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>{h.invoiceNo}</span>
                                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 700,
                                      background: h.customer.status === "PAID" ? "#dcfce7" : "#fee2e2",
                                      color: h.customer.status === "PAID" ? "#059669" : "#e11d48" }}>
                                      {h.customer.status === "PAID" ? "LUNAS" : "BELUM"}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: "#78350f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    👤 {h.customer.name || "–"}
                                  </div>
                                  <div style={{ fontSize: 11, color: "#a16207", marginTop: 2 }}>
                                    📅 {formatDateDisplay(h.customer.date)} · 🕐 {h.savedAt}
                                  </div>
                                  <div style={{ fontSize: 11, color: "#92400e", marginTop: 2 }}>
                                    {h.rows.length} perkhidmatan · {h.customer.payment}
                                  </div>
                                </div>
                                {/* Right: total + buttons */}
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>
                                    {formatBND(h.total)}
                                  </div>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => setHistoryView(h)}
                                      style={{ padding: "5px 12px", background: "#eff6ff", border: "1.5px solid #3b82f6", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
                                      👁️ Lihat
                                    </button>
                                    <button onClick={() => deleteHistory(h.id)}
                                      style={{ padding: "5px 10px", background: "#fee2e2", border: "1.5px solid #e11d48", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#e11d48" }}>
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Summary stats */}
                    {history.length > 0 && (
                      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed #fde68a", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                        {[
                          ["📋 Jumlah Invois", history.length],
                          ["✅ Lunas", history.filter(h => h.customer.status === "PAID").length],
                          ["💰 Jumlah Terima", formatBND(history.filter(h => h.customer.status === "PAID").reduce((s, h) => s + h.total, 0))],
                        ].map(([label, val]) => (
                          <div key={label} style={{ background: "#fef9ee", border: "1px solid #fde68a", borderRadius: 10, padding: "10px", textAlign: "center" }}>
                            <div style={{ fontSize: 10, color: "#a16207", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#92400e", marginTop: 4 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Danger zone */}
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed #fca5a5", textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>⚠️ Danger Zone</p>
                      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                        <button onClick={() => { if (window.confirm("Padam SEMUA riwayat invois?")) { setHistory([]); } }}
                          style={{ padding: "7px 16px", background: "#fee2e2", border: "1.5px solid #e11d48", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#e11d48" }}>
                          🗑️ Padam Semua Riwayat
                        </button>
                        <button onClick={clearAllData}
                          style={{ padding: "7px 16px", background: "#1f2937", border: "1.5px solid #374151", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#f9fafb" }}>
                          💣 Reset Semua Data App
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════ CRUD MODAL ════════ */}
        {showManager && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowManager(false); }}>
            <div style={{ background: "white", borderRadius: 18, width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>

              {/* Modal Header */}
              <div style={{ background: "linear-gradient(135deg,#92400e,#d97706)", padding: "18px 24px", borderRadius: "18px 18px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>⚙️ Urus Perkhidmatan</h3>
                  <p style={{ fontSize: 11, color: "#fde68a", margin: "3px 0 0", letterSpacing: 1 }}>MANAGE SERVICES</p>
                </div>
                <button onClick={() => { setShowManager(false); setEditIdx(null); }}
                  style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "white", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>

              <div style={{ padding: 24 }}>

                {/* ── ADD NEW SERVICE ── */}
                <div style={{ background: "#fef9ee", border: "1.5px dashed #d97706", borderRadius: 12, padding: 16, marginBottom: 22 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#a16207", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                    + Tambah Perkhidmatan Baru / Add New Service
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input value={newSvcName} onChange={(e) => setNewSvcName(e.target.value)}
                      placeholder="Nama perkhidmatan..."
                      style={{ ...modalInputStyle, flex: "2 1 160px" }}
                      onKeyDown={(e) => e.key === "Enter" && addMenuItem()} />
                    <input value={newSvcPrice} onChange={(e) => setNewSvcPrice(e.target.value)}
                      type="number" min="0" placeholder="Harga B$"
                      style={{ ...modalInputStyle, flex: "1 1 90px" }}
                      onKeyDown={(e) => e.key === "Enter" && addMenuItem()} />
                    <button onClick={addMenuItem}
                      style={{ padding: "9px 18px", background: "#92400e", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
                      + Tambah
                    </button>
                  </div>
                </div>

                {/* ── SERVICE LIST ── */}
                <p style={{ fontSize: 12, fontWeight: 700, color: "#a16207", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  Senarai Perkhidmatan / Service List ({menu.length})
                </p>

                {menu.length === 0 && (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#d97706", fontStyle: "italic" }}>
                    Tiada perkhidmatan. Tambah yang baru di atas.
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {menu.map((s, i) => (
                    <div key={i} style={{ border: "1.5px solid #fde68a", borderRadius: 10, overflow: "hidden" }}>
                      {editIdx === i ? (
                        /* ── EDIT MODE ── */
                        <div style={{ background: "#fef9ee", padding: 12 }}>
                          <p style={{ fontSize: 11, color: "#a16207", marginBottom: 8, fontWeight: 700 }}>✏️ Edit Perkhidmatan #{i + 1}</p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <input value={editName} onChange={(e) => setEditName(e.target.value)}
                              placeholder="Nama perkhidmatan"
                              style={{ ...modalInputStyle, flex: "2 1 160px" }} />
                            <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                              type="number" min="0" placeholder="Harga"
                              style={{ ...modalInputStyle, flex: "1 1 90px" }} />
                          </div>
                          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                            <button onClick={saveEdit}
                              style={{ flex: 1, padding: "8px 0", background: "#059669", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                              ✅ Simpan / Save
                            </button>
                            <button onClick={cancelEdit}
                              style={{ flex: 1, padding: "8px 0", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                              Batal / Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── VIEW MODE ── */
                        <div style={{ display: "flex", alignItems: "center", padding: "11px 14px", gap: 10 }}>
                          <div style={{ width: 26, height: 26, background: "#fef3c7", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#92400e", flexShrink: 0 }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#78350f" }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: "#d97706", marginTop: 1 }}>{formatBND(s.price)}</div>
                          </div>
                          <button onClick={() => startEdit(i)}
                            style={{ padding: "5px 12px", background: "#eff6ff", border: "1.5px solid #3b82f6", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => deleteMenuItem(i)}
                            style={{ padding: "5px 12px", background: "#fee2e2", border: "1.5px solid #e11d48", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#e11d48" }}>
                            🗑️ Padam
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Reset to default */}
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed #fde68a", textAlign: "center" }}>
                  <button onClick={() => { if (window.confirm("Reset semua perkhidmatan ke senarai asal?")) { setMenu(DEFAULT_MENU); setEditIdx(null); } }}
                    style={{ padding: "8px 20px", background: "white", border: "1.5px solid #d97706", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#a16207", fontWeight: 600 }}>
                    🔄 Reset ke Senarai Asal / Reset to Default
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Responsive CSS override */}
        <style>{`
          @media (max-width: 768px) {
            .layout-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </>
  );
}

/* ─── Small UI Components ─── */
function Card({ title, children }) {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: 20, boxShadow: "0 4px 20px rgba(146,64,14,0.08)", border: "1px solid #fde68a" }}>
      <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700, color: "#92400e", marginBottom: 14, paddingBottom: 8, borderBottom: "2px solid #fde68a" }}>{title}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function Label({ children }) {
  return <label style={{ fontSize: 12, fontWeight: 700, color: "#a16207", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: -4 }}>{children}</label>;
}

const inputStyle = { width: "100%", padding: "9px 12px", border: "1.5px solid #fde68a", borderRadius: 8, fontSize: 14, color: "#78350f", background: "#fef9ee", outline: "none" };
const selectStyle = { ...inputStyle };
const btnSmall = { padding: "9px 16px", background: "#92400e", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 16 };
const modalInputStyle = { padding: "9px 12px", border: "1.5px solid #fde68a", borderRadius: 8, fontSize: 13, color: "#78350f", background: "white", outline: "none", width: "100%" };

function Input({ style, ...props }) {
  return <input style={{ ...inputStyle, ...style }} {...props} />;
}

function TotalRow({ label, value, color = "#78350f" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
      <span style={{ color: "#a16207" }}>{label}</span>
      <span style={{ fontWeight: 600, color }}>{value}</span>
    </div>
  );
}

function ActionBtn({ onClick, color, children }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, minWidth: 130, padding: "11px 16px", background: color, color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, boxShadow: `0 4px 14px ${color}44`, transition: "all .2s" }}
      onMouseEnter={(e) => { e.target.style.opacity = "0.85"; e.target.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }}>
      {children}
    </button>
  );
}