import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc,
  getDocs, addDoc, updateDoc,
  collection, query, orderBy, writeBatch,
} from "firebase/firestore";

/* ══════════════════════════════════════════
   🔥 FIREBASE CONFIG
   Langkah setup:
   1. Pergi ke: console.firebase.google.com
   2. Buat project baru (contoh: "samlia-wellness")
   3. Klik "+ Add app" → pilih Web (</>)
   4. Project Settings → Your Apps → SDK snippet → Config
   5. Salin nilai-nilai di bawah dan ganti:
══════════════════════════════════════════ */
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const fbApp = initializeApp(firebaseConfig);
const db    = getFirestore(fbApp);

/* ─── Firestore collection/doc refs ─── */
const COL_SVC = "sw_services";
const COL_INV = "sw_invoices";
const COL_CUS = "sw_customers";
const docCounter = () => doc(db, "sw_settings", "counter");
const docDraft   = () => doc(db, "sw_settings", "draft");

/* ─── helper: batch-delete seluruh koleksi ─── */
async function deleteCollection(colName) {
  const snap = await getDocs(collection(db, colName));
  if (snap.empty) return;
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}


const LOGO_B64 = "data:image/jpeg;base64,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";

/* ─── HELPERS ─── */
const formatBND = (n) => "B$ " + Number(n||0).toLocaleString("en-BN",{minimumFractionDigits:2,maximumFractionDigits:2});
const todayBNT = () => { const d=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Brunei"})); return d.toISOString().split("T")[0]; };
const formatDateDisplay = (iso) => { if(!iso)return""; const[y,m,day]=iso.split("-"); const months=["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"]; return `${parseInt(day,10)} ${months[parseInt(m,10)-1]} ${y}`; };
const genInvoiceNo = (counter) => { const d=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Brunei"})); const ymd=d.getFullYear()+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0"); return `SW-${ymd}-${String(counter).padStart(3,"0")}`; };

const DEFAULT_MENU = [
  {name:"Body Spa",price:45},{name:"Body Scrub",price:35},{name:"Foot Spa",price:25},
  {name:"Foot Reflexology",price:30},{name:"Manicure & Pedicure",price:28},
  {name:"Callus Treatment",price:22},{name:"Rawatan Pantang Bersalin",price:65},{name:"Ratus Temanten",price:55},
];
const PAYMENT_METHODS = ["Tunai / Cash","Pindahan Bank / Bank Transfer","QR Pay (BIBD / BAIDURI)","Kad Debit / Debit Card"];
const EMPTY_CUSTOMER = {name:"",phone:"",date:todayBNT(),payment:PAYMENT_METHODS[0],remarks:""};
/* ══════ THEMES ══════ */
const LIGHT = {
  dark:false, pageBg:"linear-gradient(135deg,#fdf8f0,#f5ede0)", cardBg:"#fff", cardBorder:"#fde68a",
  cardShadow:"0 4px 20px rgba(146,64,14,0.08)", modalBg:"#fff", inputBg:"#fef9ee",
  inputBorder:"#fde68a", inputColor:"#78350f", textPrimary:"#78350f", textSecondary:"#a16207",
  textMuted:"#ca8a04", accent:"#92400e", accentSoft:"#fef3c7", accentMid:"#d97706", divider:"#fde68a",
  dividerDanger:"#fca5a5", rowAlt:"#fef9ee", statBg:"#fef9ee", searchBg:"#fef9ee",
  badgeLunasBg:"#dcfce7", badgeLunasColor:"#059669", badgeUnpaidBg:"#fee2e2", badgeUnpaidColor:"#e11d48",
  svcBtnBg:"#fff", svcBtnColor:"#92400e", svcBtnBorder:"#d97706",
  toggleBg:"#e5e7eb", chartBg:"#fef9ee", chartBar:"#d97706", chartBarEmpty:"#fde68a",
  viewBtnBg:"#eff6ff", viewBtnColor:"#1d4ed8", viewBtnBorder:"#3b82f6",
  editBtnBg:"#eff6ff", editBtnColor:"#3b82f6",
};
const DARK = {
  dark:true, pageBg:"linear-gradient(135deg,#0f172a,#1a2235)", cardBg:"#1e293b", cardBorder:"#334155",
  cardShadow:"0 4px 20px rgba(0,0,0,0.4)", modalBg:"#1e293b", inputBg:"#0f172a",
  inputBorder:"#475569", inputColor:"#e2e8f0", textPrimary:"#e2e8f0", textSecondary:"#94a3b8",
  textMuted:"#64748b", accent:"#f59e0b", accentSoft:"#292524", accentMid:"#fbbf24", divider:"#334155",
  dividerDanger:"#7f1d1d", rowAlt:"#0f172a", statBg:"#0f172a", searchBg:"#0f172a",
  badgeLunasBg:"#064e3b", badgeLunasColor:"#34d399", badgeUnpaidBg:"#450a0a", badgeUnpaidColor:"#f87171",
  svcBtnBg:"#0f172a", svcBtnColor:"#fbbf24", svcBtnBorder:"#f59e0b",
  toggleBg:"#f59e0b", chartBg:"#0f172a", chartBar:"#f59e0b", chartBarEmpty:"#334155",
  viewBtnBg:"#1e3a5f", viewBtnColor:"#60a5fa", viewBtnBorder:"#3b82f6",
  editBtnBg:"#1e3a5f", editBtnColor:"#60a5fa",
};

/* ══════ TOAST SYSTEM ══════ */
function useToast() {
  const [toasts,setToasts] = useState([]);
  const add = useCallback((msg,type="success",duration=3500) => {
    const id = Date.now()+Math.random();
    setToasts(p=>[...p,{id,msg,type,duration}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)), duration+600);
  },[]);
  const remove = useCallback((id)=>setToasts(p=>p.filter(t=>t.id!==id)),[]);
  return {toasts,add,remove};
}

function ToastItem({toast,onRemove}) {
  const [vis,setVis] = useState(false);
  useEffect(()=>{ const t1=setTimeout(()=>setVis(true),10); const t2=setTimeout(()=>setVis(false),toast.duration); return()=>{clearTimeout(t1);clearTimeout(t2)}; },[toast.duration]);
  const cfg = {success:{bg:"#059669",icon:"✅",label:"Berjaya"},error:{bg:"#e11d48",icon:"❌",label:"Ralat"},warn:{bg:"#d97706",icon:"⚠️",label:"Amaran"},info:{bg:"#1d4ed8",icon:"ℹ️",label:"Info"}}[toast.type]||{bg:"#059669",icon:"✅",label:"Berjaya"};
  return (
    <div onClick={()=>onRemove(toast.id)} style={{display:"flex",alignItems:"flex-start",gap:10,background:cfg.bg,color:"white",padding:"12px 16px",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.3)",cursor:"pointer",minWidth:270,maxWidth:360,transform:vis?"translateX(0)":"translateX(120%)",opacity:vis?1:0,transition:"transform 0.35s cubic-bezier(.34,1.4,.64,1), opacity 0.3s ease",overflow:"hidden",position:"relative"}}>
      <span style={{fontSize:18,flexShrink:0,marginTop:1}}>{cfg.icon}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:1,opacity:0.75,marginBottom:2,textTransform:"uppercase"}}>{cfg.label}</div>
        <div style={{fontSize:13,fontWeight:600,lineHeight:1.4}}>{toast.msg}</div>
      </div>
      <span style={{fontSize:16,opacity:0.6,flexShrink:0,marginTop:1}}>×</span>
      <div style={{position:"absolute",bottom:0,left:0,height:3,background:"rgba(255,255,255,0.35)",borderRadius:99,animation:`tp ${toast.duration}ms linear forwards`}}/>
    </div>
  );
}

function ToastContainer({toasts,onRemove}) {
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:10,alignItems:"flex-end",pointerEvents:"none"}}>
      {toasts.map(t=><div key={t.id} style={{pointerEvents:"all"}}><ToastItem toast={t} onRemove={onRemove}/></div>)}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function SamliaInvoice() {
  const [darkMode,setDarkMode] = useState(()=>{ try{return localStorage.getItem("sw_dark")==="1"}catch{return false} });
  const T = darkMode ? DARK : LIGHT;
  const toggleDark = () => setDarkMode(p=>{ const n=!p; try{localStorage.setItem("sw_dark",n?"1":"0")}catch{} return n; });

  const [loading,setLoading] = useState(true);
  const [dbError,setDbError] = useState(null);
  const [saving,setSaving] = useState(false);
  const {toasts,add:toast,remove:removeToast} = useToast();

  const [counter,setCounter] = useState(1);
  const [customer,setCustomer] = useState(EMPTY_CUSTOMER);
  const [rows,setRows] = useState([]);
  const [discountMode,setDiscountMode] = useState("percent");
  const [discountVal,setDiscountVal] = useState("");
  const [copied,setCopied] = useState(false);
  const [hoveredSvc,setHoveredSvc] = useState(null);
  const [formErrors,setFormErrors] = useState({});
  const [showDashboard,setShowDashboard] = useState(false);

  const [menu,setMenu] = useState([]);
  const [showManager,setShowManager] = useState(false);
  const [editIdx,setEditIdx] = useState(null);
  const [editName,setEditName] = useState("");
  const [editPrice,setEditPrice] = useState("");
  const [newSvcName,setNewSvcName] = useState("");
  const [newSvcPrice,setNewSvcPrice] = useState("");

  const [history,setHistory] = useState([]);
  const [showHistory,setShowHistory] = useState(false);
  const [historyView,setHistoryView] = useState(null);
  const [historySearch,setHistorySearch] = useState("");

  /* ── Pelanggan (customer DB) ── */
  const [customers,setCustomers] = useState([]);
  const [showCustomers,setShowCustomers] = useState(false);
  const [custSearch,setCustSearch] = useState("");
  const [custSuggest,setCustSuggest] = useState([]);
  const [showCustSuggest,setShowCustSuggest] = useState(false);



  const printRef = useRef(null);
  const draftTimer = useRef(null);

  /* ══ LOAD DATA (Firebase) ══ */
  useEffect(()=>{
    const timeoutId = setTimeout(()=>{
      setDbError("Sambungan Firebase terlalu lambat. Kemungkinan:\n1. firebaseConfig salah — semak projectId dan apiKey\n2. Firestore belum diaktifkan di Firebase Console\n3. Rules Firestore terlalu ketat (perlu allow read, write: if true)");
      setLoading(false);
    }, 10000);

    (async()=>{
      try {
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY" || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
          throw new Error("firebaseConfig belum diisi! Ganti semua nilai YOUR_... dengan nilai sebenar dari Firebase Console → Project Settings.");
        }

        // 1. Menu perkhidmatan — auto-seed jika kosong
        const svcSnap = await getDocs(query(collection(db, COL_SVC), orderBy("sort_order")));
        if (svcSnap.empty) {
          const seeded = [];
          for (let i = 0; i < DEFAULT_MENU.length; i++) {
            const data = { ...DEFAULT_MENU[i], sort_order: i + 1 };
            const ref = await addDoc(collection(db, COL_SVC), data);
            seeded.push({ id: ref.id, ...data });
          }
          setMenu(seeded);
        } else {
          setMenu(svcSnap.docs.map(d=>({id:d.id,...d.data()})));
        }

        // 2. Counter
        const ctrSnap = await getDoc(docCounter());
        if (ctrSnap.exists()) setCounter(Number(ctrSnap.data().value));

        // 3. Draft invois semasa
        const draftSnap = await getDoc(docDraft());
        if (draftSnap.exists() && draftSnap.data().value) {
          const d = draftSnap.data().value;
          if (d.customer) setCustomer(d.customer);
          if (d.rows) setRows(d.rows);
          if (d.discountMode) setDiscountMode(d.discountMode);
          if (d.discountVal !== undefined) setDiscountVal(d.discountVal);
        }

        // 4. Riwayat invois
        const invSnap = await getDocs(collection(db, COL_INV));
        const invList = invSnap.docs.map(d=>({...d.data(),id:Number(d.id)||d.data().id}));
        invList.sort((a,b)=>b.id-a.id);
        setHistory(invList);

        // 5. Pelanggan — load dari Firebase
        const cusSnap = await getDocs(collection(db, COL_CUS));
        const cusList = cusSnap.docs.map(d=>({id:d.id,...d.data()}));
        cusList.sort((a,b)=>a.name.localeCompare(b.name));
        setCustomers(cusList);

        clearTimeout(timeoutId);
      } catch(err) {
        clearTimeout(timeoutId);
        console.error("Firebase load error:", err);
        setDbError(err.message || "Gagal sambung ke Firebase. Semak firebaseConfig di dalam fail SamliaWellnessInvoice.jsx.");
      } finally {
        setLoading(false);
      }
    })();

    return () => clearTimeout(timeoutId);
  },[]);

  /* ══ AUTO-SAVE DRAFT (Firebase) ══ */
  useEffect(()=>{
    if(loading)return; clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(async()=>{
      await setDoc(docDraft(), {value:{customer,rows,discountMode,discountVal}}, {merge:true});
    }, 800);
    return()=>clearTimeout(draftTimer.current);
  },[customer,rows,discountMode,discountVal,loading]);

  const invoiceNo = useMemo(()=>genInvoiceNo(counter),[counter]);

  const rowCalcs = useMemo(()=>rows.map(r=>{ const lt=r.price*r.qty,dv=parseFloat(r.discVal)||0,ld=r.discMode==="percent"?(lt*dv)/100:Math.min(dv,lt); return{lineTotal:lt,lineDisc:ld,lineNet:lt-ld}; }),[rows]);

  const {subtotal,totalItemDisc,subtotalAfterItemDisc,discountAmt,total} = useMemo(()=>{
    const sub=rowCalcs.reduce((s,r)=>s+r.lineTotal,0), id=rowCalcs.reduce((s,r)=>s+r.lineDisc,0), sa=sub-id, dv=parseFloat(discountVal)||0;
    const dc=Math.min(discountMode==="percent"?(sa*dv)/100:dv,sa);
    return{subtotal:sub,totalItemDisc:id,subtotalAfterItemDisc:sa,discountAmt:dc,total:Math.max(sa-dc,0)};
  },[rowCalcs,discountVal,discountMode]);

  /* ── Validate ── */
  const validate = () => {
    const e={};
    if(!customer.name.trim())e.name="Nama pelanggan wajib diisi";
    if(rows.length===0)e.rows="Pilih minimal satu perkhidmatan";
    setFormErrors(e);
    if(Object.keys(e).length>0){toast(e.name||e.rows,"error");return false;}
    return true;
  };

  /* ── Row handlers ── */
  const addService = s=>setRows(p=>{const i=p.findIndex(r=>r.name===s.name);if(i>=0){const u=[...p];u[i]={...u[i],qty:u[i].qty+1};return u;}return[...p,{name:s.name,price:s.price,qty:1,discMode:"percent",discVal:""}];});
  const updateQty = (i,v)=>setRows(p=>p.map((r,idx)=>idx===i?{...r,qty:Math.max(1,parseInt(v,10)||1)}:r));
  const updateRowDisc = (i,f,v)=>setRows(p=>p.map((r,idx)=>idx===i?{...r,[f]:v}:r));
  const removeRow = i=>setRows(p=>p.filter((_,idx)=>idx!==i));

  /* ── Customer autocomplete ── */
  const handleCustNameChange = (val) => {
    setCustomer(p=>({...p,name:val}));
    if(formErrors.name&&val.trim())setFormErrors(p=>({...p,name:null}));
    if(val.trim().length===0){
      // Tunjuk semua pelanggan (max 6) bila input kosong
      if(customers.length>0){
        setCustSuggest(customers.slice(0,6));
        setShowCustSuggest(true);
      } else {
        setShowCustSuggest(false);
      }
    } else {
      const q=val.toLowerCase();
      const matches=customers.filter(c=>c.name.toLowerCase().includes(q)||(c.phone||"").includes(q)).slice(0,6);
      setCustSuggest(matches);
      setShowCustSuggest(matches.length>0);
    }
  };

  const selectCustSuggest = (cust) => {
    // Auto-isi semua info pelanggan dari database
    setCustomer(p=>({
      ...p,
      name: cust.name,
      phone: cust.phone || p.phone,
      // date & payment kekal (mungkin berbeza setiap kunjungan)
      // remarks dikosongkan semula
      remarks: "",
    }));
    setShowCustSuggest(false);
    setCustSuggest([]);
    const visits = cust.visitCount || 0;
    const spent  = cust.totalSpent || 0;
    const last   = cust.lastVisit ? ` · Terakhir: ${cust.lastVisit}` : "";
    toast(`👤 ${cust.name} dipilih — ${visits}x kunjungan · ${formatBND(spent)} total${last}`, "info", 4000);
  };

  /* ── Upsert customer ke Firestore ── */
  const upsertCustomer = async(invTotal) => {
    const name = customer.name.trim();
    if (!name) return;
    const existing = customers.find(c=>c.name.toLowerCase()===name.toLowerCase());
    if (existing) {
      const updated = {
        ...existing,
        phone: customer.phone || existing.phone,
        visitCount: (existing.visitCount||0)+1,
        totalSpent: (existing.totalSpent||0)+invTotal,
        lastVisit: todayBNT(),
      };
      await updateDoc(doc(db, COL_CUS, existing.id), {
        phone:updated.phone, visitCount:updated.visitCount,
        totalSpent:updated.totalSpent, lastVisit:updated.lastVisit,
      });
      setCustomers(p=>p.map(c=>c.id===existing.id?updated:c));
    } else {
      const data = {name, phone:customer.phone||"", visitCount:1, totalSpent:invTotal, lastVisit:todayBNT(), createdAt:todayBNT()};
      const ref = await addDoc(collection(db, COL_CUS), data);
      setCustomers(p=>[...p,{id:ref.id,...data}].sort((a,b)=>a.name.localeCompare(b.name)));
    }
  };

  const deleteCustomer = async(id) => {
    if(!window.confirm("Padam rekod pelanggan ini?"))return;
    await deleteDoc(doc(db, COL_CUS, id));
    setCustomers(p=>p.filter(c=>c.id!==id));
    toast("Rekod pelanggan dipadam.","warn");
  };


  /* ── Menu CRUD (Firebase) ── */
  const startEdit = i=>{setEditIdx(i);setEditName(menu[i].name);setEditPrice(String(menu[i].price));};
  const cancelEdit = ()=>setEditIdx(null);

  const saveEdit = async()=>{
    if(!editName.trim()||!editPrice)return;
    try {
      await updateDoc(doc(db, COL_SVC, menu[editIdx].id), {name:editName.trim(),price:parseFloat(editPrice)});
      setMenu(p=>p.map((s,i)=>i===editIdx?{...s,name:editName.trim(),price:parseFloat(editPrice)}:s));
      setEditIdx(null);
      toast("Perkhidmatan berjaya dikemaskini!","success");
    } catch(e){ toast("Gagal simpan: "+e.message,"error"); }
  };

  const deleteMenuItem = async i=>{
    if(!window.confirm(`Padam "${menu[i].name}"?`))return;
    try {
      await deleteDoc(doc(db, COL_SVC, menu[i].id));
      setMenu(p=>p.filter((_,idx)=>idx!==i));
      toast("Perkhidmatan dipadam.","warn");
    } catch(e){ toast("Gagal padam: "+e.message,"error"); }
  };

  const addMenuItem = async()=>{
    if(!newSvcName.trim()||!newSvcPrice)return;
    try {
      const data = {name:newSvcName.trim(),price:parseFloat(newSvcPrice),sort_order:menu.length+1};
      const ref = await addDoc(collection(db, COL_SVC), data);
      setMenu(p=>[...p,{id:ref.id,...data}]);
      setNewSvcName(""); setNewSvcPrice("");
      toast(`"${data.name}" berjaya ditambah!`,"success");
    } catch(e){ toast("Gagal tambah: "+e.message,"error"); }
  };

  const resetMenuToDefault = async()=>{
    if(!window.confirm("Reset semua perkhidmatan ke senarai asal?"))return;
    try {
      await deleteCollection(COL_SVC);
      const newMenu = [];
      for (let i=0; i<DEFAULT_MENU.length; i++) {
        const data = {...DEFAULT_MENU[i], sort_order:i+1};
        const ref = await addDoc(collection(db, COL_SVC), data);
        newMenu.push({id:ref.id,...data});
      }
      setMenu(newMenu); setEditIdx(null);
      toast("Menu direset ke senarai asal.","info");
    } catch(e){ toast("Gagal reset: "+e.message,"error"); }
  };

  /* ── Save history (Firebase) ── */
  const saveToHistory = async()=>{
    if(rows.length===0)return;
    const id = Date.now();
    const snap = {
      id, invoiceNo, savedAt: new Date().toLocaleString("en-GB",{timeZone:"Asia/Brunei"}),
      customer, rows:rows.map((r,i)=>({...r,...rowCalcs[i]})),
      discountMode, discountVal,
      subtotal, totalItemDisc, subtotalAfterItemDisc, discountAmt, total,
    };
    try {
      await setDoc(doc(db, COL_INV, String(id)), snap);
      setHistory(p=>[snap,...p]);
      await upsertCustomer(total); // Kemas kini rekod pelanggan
      return snap;
    } catch(e){ console.error("Save history error:", e); return null; }
  };

  /* ── New invoice ── */
  const newInvoice = async()=>{
    if(!validate())return; setSaving(true);
    await saveToHistory();
    const next = counter+1; setCounter(next);
    await setDoc(docCounter(), {value:next}, {merge:true});
    setCustomer(EMPTY_CUSTOMER); setRows([]); setDiscountVal(""); setDiscountMode("percent"); setFormErrors({});
    await setDoc(docDraft(), {value:null}, {merge:true});
    toast(`Invois ${invoiceNo} disimpan! Sedia untuk invois baru.`,"success");
    setSaving(false);
  };

  const resetInvoice = async()=>{
    if(!window.confirm("Reset borang? Data tidak akan disimpan."))return;
    setCustomer(EMPTY_CUSTOMER); setRows([]); setDiscountVal(""); setDiscountMode("percent"); setFormErrors({});
    await setDoc(docDraft(), {value:null}, {merge:true});
    toast("Borang berjaya direset.","warn");
  };

  const handlePrint = () => {
    if(!validate()) return;
    // Mobile PWA-safe print: open print-area in new window
    const printContent = printRef.current?.innerHTML;
    if (!printContent) { window.print(); return; }
    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) { window.print(); return; } // fallback if popup blocked
    win.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Invois Samlia Wellness</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Lato',sans-serif;background:white;padding:20px}
  @media print{body{padding:0}}
</style>
</head><body>${printContent}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(()=>{ win.print(); win.close(); }, 600);
  };

  const copyWhatsApp = ()=>{
    const lines=rows.map((r,i)=>{const{lineDisc,lineNet}=rowCalcs[i];return`• ${r.name} x${r.qty} – ${formatBND(lineNet)}${lineDisc>0?` (diskaun -${formatBND(lineDisc)})`:""}`;}).join("\n");
    const text=`✨ *SAMLIA WELLNESS* ✨\n📋 Invois: ${invoiceNo}\n📅 Tarikh: ${formatDateDisplay(customer.date)}\n\n👤 Pelanggan: ${customer.name||"-"}\n📞 Tel: ${customer.phone||"-"}\n\n🌸 *Perkhidmatan:*\n${lines}\n\n💰 Subtotal : ${formatBND(subtotal)}${totalItemDisc>0?`\n🏷️ Diskaun Item: -${formatBND(totalItemDisc)}`:""}${discountAmt>0?`\n🏷️ Diskaun Trans: -${formatBND(discountAmt)}`:""}\n✅ *JUMLAH: ${formatBND(total)}*\n💳 Bayaran: ${customer.payment}\n\nTerima kasih kerana memilih Samlia Wellness! 🌸`;
    navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);toast("Ringkasan disalin ke clipboard!","success");});
  };

  const restoreFromHistory = async snap=>{
    const next=counter+1; setCounter(next);
    await setDoc(docCounter(), {value:next}, {merge:true});
    setCustomer({...snap.customer});
    setRows(snap.rows.map(({lineTotal,lineDisc,lineNet,...r})=>r));
    setDiscountMode(snap.discountMode); setDiscountVal(snap.discountVal);
    setHistoryView(null); setShowHistory(false);
    toast(`Invois ${snap.invoiceNo} dimuat semula ke form.`,"info");
  };

  const deleteHistory = async id=>{
    if(!window.confirm("Padam rekod invois ini?"))return;
    try {
      await deleteDoc(doc(db, COL_INV, String(id)));
      setHistory(p=>p.filter(h=>h.id!==id)); if(historyView?.id===id)setHistoryView(null);
      toast("Rekod invois dipadam.","warn");
    } catch(e){ toast("Gagal padam: "+e.message,"error"); }
  };

  const deleteAllHistory = async()=>{
    if(!window.confirm("Padam SEMUA riwayat invois?"))return;
    await deleteCollection(COL_INV); setHistory([]);
    toast("Semua riwayat invois dipadam.","warn");
  };

  const clearAllData = async()=>{
    if(!window.confirm("⚠️ Padam SEMUA data?\nTindakan ini tidak boleh dibatalkan."))return;
    await Promise.all([
      deleteCollection(COL_INV),
      deleteCollection(COL_SVC),
      setDoc(docCounter(), {value:1}),
      setDoc(docDraft(), {value:null}),
    ]);
    window.location.reload();
  };

  /* ── Inline styles ── */
  const inp = {width:"100%",padding:"10px 12px",border:`1.5px solid ${T.inputBorder}`,borderRadius:10,fontSize:14,color:T.inputColor,background:T.inputBg,outline:"none",WebkitAppearance:"none",appearance:"none"};
  const card = {background:T.cardBg,borderRadius:16,padding:"18px 16px",boxShadow:T.cardShadow,border:`1px solid ${T.cardBorder}`};
  const cardTitle = {fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:T.accent,marginBottom:14,paddingBottom:8,borderBottom:`2px solid ${T.divider}`};
  const lbl = {fontSize:12,fontWeight:700,color:T.textSecondary,textTransform:"uppercase",letterSpacing:0.5};
  const mInp = {padding:"10px 12px",border:`1.5px solid ${T.inputBorder}`,borderRadius:10,fontSize:14,color:T.inputColor,background:T.inputBg,outline:"none",width:"100%",WebkitAppearance:"none"};
  /* ══════════ LOADING ══════════ */
  if(loading) return(
    <div style={{minHeight:"100vh",background:T.pageBg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <img src={LOGO_B64} alt="logo" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover"}}/>
      <div style={{display:"flex",gap:8}}>{[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:"#d97706",animation:"pulse 1.2s ease-in-out infinite",animationDelay:`${i*0.2}s`}}/>)}</div>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.accent}}>Memuatkan data...</p>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );

  if(dbError) return(
    <div style={{minHeight:"100vh",background:T.pageBg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:24}}>
      <div style={{fontSize:48}}>⚠️</div>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:T.accent}}>Ralat Sambungan</h2>
      <p style={{fontSize:14,color:T.textPrimary,textAlign:"center",maxWidth:400}}>{dbError}</p>
      <button onClick={()=>window.location.reload()} style={{padding:"10px 24px",background:T.accent,color:"white",border:"none",borderRadius:10,cursor:"pointer",fontWeight:700}}>Cuba Semula</button>
    </div>
  );

  /* ══════════ RENDER ══════════ */
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0f172a;font-family:'Lato',sans-serif;-webkit-text-size-adjust:100%;}
        @media print{.no-print{display:none!important}.print-area{box-shadow:none!important;margin:0!important;width:100%!important;padding:12px!important}body{background:white}}
        @keyframes tp{from{width:100%}to{width:0%}}
        option{background:${T.inputBg};color:${T.inputColor};}

        /* ── Mobile responsive ── */
        @media(max-width:768px){
          .layout-grid{grid-template-columns:1fr!important;}
          .print-area{display:none;}
        }

        /* ── Input/select: prevent iOS zoom (font-size >= 16px) ── */
        @media(max-width:768px){
          input,select,textarea{font-size:16px!important;}
        }

        /* ── Safe area for notch/status bar phones ── */
        .app-wrapper{
          padding-top: max(20px, env(safe-area-inset-top));
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* ── Scrollbar minimal ── */
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${T.divider};border-radius:99px;}
      `}</style>

      <div className="app-wrapper" style={{minHeight:"100vh",background:T.pageBg,padding:"16px 12px 60px",transition:"background 0.3s",paddingTop:"max(20px, env(safe-area-inset-top))"}}>

        {/* ── Header ── */}
        <header className="no-print" style={{textAlign:"center",marginBottom:28,position:"relative"}}>
          {/* Dark mode toggle — fixed top right, not overlapping content */}
          <button onClick={toggleDark} title={darkMode?"Light Mode":"Dark Mode"}
            style={{position:"fixed",top:"max(14px, calc(env(safe-area-inset-top) + 8px))",right:14,zIndex:200,background:T.toggleBg,border:"none",borderRadius:99,width:54,height:28,cursor:"pointer",display:"flex",alignItems:"center",padding:"0 4px",transition:"background 0.3s",boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:"white",boxShadow:"0 1px 4px rgba(0,0,0,0.25)",transition:"transform 0.3s",transform:darkMode?"translateX(26px)":"translateX(0)"}}/>
            <span style={{position:"absolute",fontSize:13,left:darkMode?7:"auto",right:darkMode?"auto":7}}>{darkMode?"🌙":"☀️"}</span>
          </button>

          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,paddingRight:64}}>
            <img src={LOGO_B64} alt="" style={{width:56,height:56,borderRadius:"50%",objectFit:"cover",border:`2px solid ${T.accent}`,flexShrink:0}}/>
            <div style={{textAlign:"left"}}>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:T.accent,letterSpacing:1,lineHeight:1.1}}>Samlia Wellness</h1>
              <p style={{fontSize:11,color:T.textSecondary,letterSpacing:2,textTransform:"uppercase"}}>Invoice System</p>
            </div>
          </div>
          <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#059669",display:"inline-block",boxShadow:"0 0 6px #059669"}}/>
            <span style={{fontSize:11,color:"#059669",fontWeight:600,letterSpacing:0.5}}>🔥 Firebase · {saving?"Menyimpan...":"Data selamat tersimpan"}</span>
          </div>
        </header>

        {/* ── Layout ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:1280,margin:"0 auto"}} className="layout-grid">

          {/* ════ LEFT: FORM ════ */}
          <div className="no-print" style={{display:"flex",flexDirection:"column",gap:18}}>

            {/* Customer info */}
            <div style={card}>
              <h4 style={cardTitle}>Maklumat Pelanggan / Customer Info</h4>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <label style={lbl}>Nama Pelanggan / Customer Name</label>
                <div style={{position:"relative"}}>
                  <input value={customer.name} onChange={e=>handleCustNameChange(e.target.value)}
                    onBlur={()=>setTimeout(()=>setShowCustSuggest(false),400)}
                    onFocus={()=>{ if(customer.name.trim().length>=2){ const q=customer.name.toLowerCase(); const m=customers.filter(c=>c.name.toLowerCase().includes(q)||(c.phone||"").includes(q)).slice(0,5); if(m.length>0){setCustSuggest(m);setShowCustSuggest(true);} } }}
                    placeholder="Nama penuh..."
                    style={{...inp,border:formErrors.name?`1.5px solid #e11d48`:`1.5px solid ${T.inputBorder}`}}/>
                  {showCustSuggest&&custSuggest.length>0&&(
                    <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:T.cardBg,border:`1.5px solid ${T.accentMid}`,borderRadius:12,zIndex:100,boxShadow:"0 8px 28px rgba(0,0,0,0.18)",overflow:"hidden"}}>
                      <div style={{padding:"6px 12px",background:T.statBg,borderBottom:`1px solid ${T.divider}`,fontSize:10,color:T.textSecondary,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8}}>
                        👥 Pelanggan Lama — Klik untuk isi semula
                      </div>
                      {custSuggest.map((cust,idx)=>(
                        <div key={cust.id}
                          onMouseDown={e=>{e.preventDefault();selectCustSuggest(cust);}}
                          onTouchStart={e=>{e.preventDefault();selectCustSuggest(cust);}}
                          style={{padding:"11px 14px",cursor:"pointer",borderBottom:idx<custSuggest.length-1?`1px solid ${T.divider}`:"none",display:"flex",alignItems:"center",gap:12,transition:"background .15s"}}
                          onMouseEnter={e=>e.currentTarget.style.background=T.accentSoft}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          {/* Avatar */}
                          <div style={{width:36,height:36,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:15,flexShrink:0}}>
                            {cust.name[0].toUpperCase()}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:700,color:T.textPrimary}}>{cust.name}</div>
                            <div style={{fontSize:11,color:T.textSecondary,marginTop:1}}>
                              📞 {cust.phone||"–"} &nbsp;·&nbsp; {cust.visitCount||0}x kunjungan
                            </div>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{fontSize:12,fontWeight:700,color:T.accent}}>{formatBND(cust.totalSpent||0)}</div>
                            <div style={{fontSize:10,color:T.textSecondary,marginTop:1}}>{cust.lastVisit||""}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formErrors.name&&<span style={{fontSize:11,color:"#e11d48",marginTop:-4}}>⚠️ {formErrors.name}</span>}
                <label style={lbl}>No. Telefon / Phone Number</label>
                <input value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} placeholder="+673 xxx xxxx" style={inp}/>
                <label style={lbl}>Tarikh Kunjungan / Visit Date</label>
                <input type="date" value={customer.date} onChange={e=>setCustomer({...customer,date:e.target.value})} style={inp}/>
                <label style={lbl}>Cara Bayar / Payment Method</label>
                <select value={customer.payment} onChange={e=>setCustomer({...customer,payment:e.target.value})} style={inp}>
                  {PAYMENT_METHODS.map(m=><option key={m}>{m}</option>)}
                </select>

                <label style={lbl}>Catatan / Remarks (Opsional)</label>
                <textarea value={customer.remarks} onChange={e=>setCustomer({...customer,remarks:e.target.value})} placeholder="Catatan tambahan..." rows={2} style={{...inp,resize:"vertical"}}/>

              </div>
            </div>

            {/* Menu */}
            <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,paddingBottom:8,borderBottom:`2px solid ${T.divider}`}}>
                <h4 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:T.accent}}>Pilih Perkhidmatan / Select Services</h4>
                <button onClick={()=>setShowManager(true)}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:T.accentSoft,border:`1.5px solid ${T.accentMid}`,borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,color:T.accent,transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=T.accent;e.currentTarget.style.color="white";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=T.accentSoft;e.currentTarget.style.color=T.accent;}}>
                  ⚙️ Urus / Manage
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {menu.map(s=>{
                  const isH=hoveredSvc===s.id;
                  return(
                    <button key={s.id} onClick={()=>addService(s)} onMouseEnter={()=>setHoveredSvc(s.id)} onMouseLeave={()=>setHoveredSvc(null)}
                      style={{padding:"8px 10px",borderRadius:8,cursor:"pointer",textAlign:"left",transition:"all .2s",fontSize:12,fontWeight:600,border:`1.5px solid ${T.svcBtnBorder}`,background:isH?T.accent:T.svcBtnBg,color:isH?"white":T.svcBtnColor}}>
                      <div>{s.name}</div>
                      <div style={{fontWeight:400,marginTop:2,opacity:0.8}}>{formatBND(s.price)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected rows */}
            {rows.length>0&&(
              <div style={card}>
                <h4 style={cardTitle}>Perkhidmatan Dipilih / Selected Services</h4>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {rows.map((r,i)=>{
                    const{lineTotal,lineDisc,lineNet}=rowCalcs[i]; const hd=lineDisc>0;
                    return(
                      <div key={i} style={{borderBottom:`1px solid ${T.divider}`,paddingBottom:12,marginBottom:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <span style={{flex:1,fontSize:13,color:T.textPrimary,fontWeight:700}}>{r.name}</span>
                          <span style={{fontSize:11,color:T.textSecondary}}>{formatBND(r.price)} ×</span>
                          <input type="number" min={1} value={r.qty} onChange={e=>updateQty(i,e.target.value)} style={{width:48,padding:"4px 6px",border:`1.5px solid ${T.accentMid}`,borderRadius:6,textAlign:"center",fontSize:13,background:T.inputBg,color:T.inputColor}}/>
                          <button onClick={()=>removeRow(i)} style={{background:T.badgeUnpaidBg,border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",color:"#e11d48",fontWeight:700,fontSize:14,flexShrink:0}}>✕</button>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,color:T.textSecondary,fontWeight:600,whiteSpace:"nowrap"}}>🏷️ Diskaun item:</span>
                          <div style={{display:"flex",borderRadius:6,overflow:"hidden",border:`1.5px solid ${T.accentMid}`,flexShrink:0}}>
                            {["percent","fixed"].map(m=>(
                              <button key={m} onClick={()=>updateRowDisc(i,"discMode",m)} style={{padding:"3px 9px",fontSize:11,fontWeight:700,border:"none",cursor:"pointer",transition:"all .15s",background:r.discMode===m?T.accentMid:T.inputBg,color:r.discMode===m?"white":T.accentMid}}>
                                {m==="percent"?"%":"B$"}
                              </button>
                            ))}
                          </div>
                          <input type="number" min={0} value={r.discVal} onChange={e=>updateRowDisc(i,"discVal",e.target.value)} placeholder="0"
                            style={{width:68,padding:"4px 8px",border:`1.5px solid ${T.inputBorder}`,borderRadius:6,fontSize:12,color:T.inputColor,background:T.inputBg,outline:"none",textAlign:"center"}}/>
                          <div style={{marginLeft:"auto",textAlign:"right"}}>
                            {hd&&<div style={{fontSize:11,color:"#e11d48",textDecoration:"line-through"}}>{formatBND(lineTotal)}</div>}
                            <div style={{fontSize:13,fontWeight:700,color:hd?"#059669":T.accent}}>{formatBND(lineNet)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Jumlah perkhidmatan dipilih ── */}
                <div style={{marginTop:8,paddingTop:10,borderTop:`2px dashed ${T.divider}`}}>
                  {totalItemDisc>0&&(
                    <>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.textSecondary,marginBottom:3}}>
                        <span>Subtotal ({rows.reduce((s,r)=>s+r.qty,0)} item)</span>
                        <span style={{textDecoration:"line-through"}}>{formatBND(subtotal)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#e11d48",marginBottom:3}}>
                        <span>🏷️ Jumlah diskaun item</span>
                        <span>-{formatBND(totalItemDisc)}</span>
                      </div>
                    </>
                  )}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:T.textSecondary}}>Jumlah ({rows.reduce((s,r)=>s+r.qty,0)} item)</span>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:800,color:T.accent}}>{formatBND(subtotalAfterItemDisc)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction discount */}
            <div style={card}>
              <h4 style={cardTitle}>Diskaun Transaksi / Transaction Discount</h4>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <p style={{fontSize:11,color:T.textSecondary}}>Diskaun ini dikenakan ke atas jumlah keseluruhan selepas diskaun item.</p>
                <div style={{display:"flex",gap:8}}>
                  {["percent","fixed"].map(m=>(
                    <button key={m} onClick={()=>setDiscountMode(m)} style={{flex:1,padding:"7px 0",borderRadius:8,border:`2px solid ${T.accentMid}`,cursor:"pointer",fontWeight:700,fontSize:13,background:discountMode===m?T.accentMid:T.cardBg,color:discountMode===m?"white":T.accentMid}}>
                      {m==="percent"?"Peratus %":"Nominal B$"}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:T.accent,fontWeight:700}}>{discountMode==="percent"?"%":"B$"}</span>
                  <input type="number" min={0} value={discountVal} onChange={e=>setDiscountVal(e.target.value)} placeholder={discountMode==="percent"?"cth: 10":"cth: 5.00"} style={inp}/>
                </div>
              </div>
            </div>

            {formErrors.rows&&<div style={{padding:"10px 14px",background:T.badgeUnpaidBg,border:"1.5px solid #e11d48",borderRadius:10,fontSize:12,color:"#e11d48",fontWeight:600}}>⚠️ {formErrors.rows}</div>}


            {/* ── Action buttons: 2×2 grid ── */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {/* Cetak */}
              <button onClick={handlePrint}
                style={{padding:"14px 10px",background:"#92400e",color:"white",border:"none",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:"0 4px 14px #92400e55",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}
                onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>
                <span style={{fontSize:20}}>🖨️</span>
                <span>Cetak / PDF</span>
              </button>

              {/* WhatsApp */}
              <button onClick={copyWhatsApp}
                style={{padding:"14px 10px",background:"#059669",color:"white",border:"none",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:"0 4px 14px #05966955",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}
                onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>
                <span style={{fontSize:20}}>{copied?"✅":"📤"}</span>
                <span>{copied?"Disalin!":"Salin"}</span>
              </button>

              {/* Reset */}
              <button onClick={resetInvoice}
                style={{padding:"14px 10px",background:T.cardBg,color:"#b45309",border:`2px solid #b45309`,borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13,transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}
                onMouseEnter={e=>{e.currentTarget.style.background="#b45309";e.currentTarget.style.color="white";}}
                onMouseLeave={e=>{e.currentTarget.style.background=T.cardBg;e.currentTarget.style.color="#b45309";}}>
                <span style={{fontSize:20}}>🗑️</span>
                <span>Reset</span>
              </button>

              {/* Invois Baru — primary CTA, spans full width */}
              <button onClick={newInvoice}
                style={{padding:"14px 10px",background:"#1d4ed8",color:"white",border:"none",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13,boxShadow:"0 4px 14px #1d4ed855",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}
                onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>
                <span style={{fontSize:20}}>{saving?"⏳":"💾"}</span>
                <span>{saving?"Menyimpan...":"Simpan"}</span>
              </button>
            </div>

            {/* ── Secondary: Riwayat + Dashboard ── */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button onClick={()=>{setHistoryView(null);setShowHistory(true);}}
                style={{padding:"12px 8px",background:T.cardBg,border:`2px solid ${T.accentMid}`,borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13,color:T.accent,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                📜 Riwayat
                {history.length>0&&<span style={{background:T.accent,color:"white",borderRadius:99,padding:"1px 8px",fontSize:11,lineHeight:"16px"}}>{history.length}</span>}
              </button>
              <button onClick={()=>setShowDashboard(true)}
                style={{padding:"12px 8px",background:T.cardBg,border:"2px solid #1d4ed8",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13,color:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                📊 Dashboard
              </button>
            </div>

            {/* ── Pelanggan DB ── */}
            <button onClick={()=>setShowCustomers(true)}
              style={{padding:"12px",background:T.cardBg,border:"2px solid #059669",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13,color:"#059669",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s",width:"100%"}}>
              👥 Database Pelanggan
              {customers.length>0&&<span style={{background:"#059669",color:"white",borderRadius:99,padding:"1px 8px",fontSize:11}}>{customers.length}</span>}
            </button>
          </div>

          {/* ════ RIGHT: INVOICE PREVIEW (always light) ════ */}
          <div ref={printRef} className="print-area" style={{background:"white",borderRadius:16,boxShadow:"0 8px 40px rgba(146,64,14,0.12)",padding:36,fontFamily:"'Lato',sans-serif",minHeight:700}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <img src={LOGO_B64} alt="" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover"}}/>
              <div style={{textAlign:"right"}}>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#92400e"}}>Samlia Wellness</h2>
                <p style={{fontSize:11,color:"#78350f",lineHeight:1.7}}>Tanjong Bunut, Brunei Darussalam<br/>+673 869 8379 · yani2912@gmail.com</p>
              </div>
            </div>
            <div style={{height:3,background:"linear-gradient(90deg,#92400e,#d97706,#fcd34d,#d97706,#92400e)",borderRadius:2,marginBottom:20}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#92400e",letterSpacing:2,textTransform:"uppercase"}}>Invois / Invoice</h3>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:700,color:"#78350f"}}>{invoiceNo}</div>
                <div style={{fontSize:12,color:"#a16207"}}>{formatDateDisplay(customer.date)}</div>
                <div style={{fontSize:11,color:"#92400e",marginTop:2}}>{customer.payment}</div>
              </div>
            </div>
            <div style={{background:"#fef9ee",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px",marginBottom:20}}>
              <div style={{fontSize:10,color:"#a16207",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Pelanggan / Customer</div>
              <div style={{fontWeight:700,fontSize:15,color:"#78350f"}}>{customer.name||"–"}</div>
              <div style={{fontSize:13,color:"#92400e"}}>{customer.phone||"–"}</div>
              {customer.remarks&&<div style={{fontSize:11,color:"#a16207",marginTop:6,fontStyle:"italic"}}>"{customer.remarks}"</div>}
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20,fontSize:12}}>
              <thead>
                <tr style={{background:"#92400e",color:"white"}}>
                  {["No","Perkhidmatan / Service","Qty","Harga","Diskaun","Jumlah"].map((h,i)=><th key={i} style={{padding:"8px",textAlign:i>=2?"center":"left",fontSize:10,letterSpacing:0.5}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.length===0?(
                  <tr><td colSpan={6} style={{textAlign:"center",padding:24,color:"#d97706",fontStyle:"italic",fontSize:12}}>Tiada perkhidmatan dipilih / No services selected</td></tr>
                ):rows.map((r,i)=>{const{lineDisc,lineNet}=rowCalcs[i];return(
                  <tr key={i} style={{background:i%2===0?"white":"#fef9ee"}}>
                    <td style={{padding:"8px",color:"#92400e",fontWeight:700}}>{i+1}</td>
                    <td style={{padding:"8px",color:"#78350f"}}>{r.name}</td>
                    <td style={{padding:"8px",textAlign:"center",color:"#92400e"}}>{r.qty}</td>
                    <td style={{padding:"8px",textAlign:"center",color:"#78350f"}}>{formatBND(r.price)}</td>
                    <td style={{padding:"8px",textAlign:"center",color:lineDisc>0?"#e11d48":"#9ca3af"}}>{lineDisc>0?`-${formatBND(lineDisc)}`:"–"}</td>
                    <td style={{padding:"8px",textAlign:"right",fontWeight:700,color:"#92400e"}}>{formatBND(lineNet)}</td>
                  </tr>
                );})}
              </tbody>
            </table>
            <div style={{marginLeft:"auto",width:290}}>
              {[["Subtotal (Harga Asal)",formatBND(subtotal),"#78350f"],...(totalItemDisc>0?[["Diskaun Item",`-${formatBND(totalItemDisc)}`,"#e11d48"],["Subtotal Selepas Diskaun",formatBND(subtotalAfterItemDisc),"#78350f"]]:[]),(discountAmt>0?["Diskaun Transaksi",`-${formatBND(discountAmt)}`,"#e11d48"]:null)].filter(Boolean).map(([l,v,c])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span style={{color:"#a16207"}}>{l}</span><span style={{fontWeight:600,color:c}}>{v}</span></div>
              ))}
              <div style={{height:1,background:"#d97706",margin:"8px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0"}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,color:"#92400e"}}>JUMLAH / TOTAL DUE</span>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:"#92400e"}}>{formatBND(total)}</span>
              </div>
            </div>
            <div style={{height:2,background:"linear-gradient(90deg,transparent,#d97706,transparent)",margin:"14px 0"}}/>
            <div style={{textAlign:"center"}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#92400e",marginBottom:4}}>🌸 Terima kasih kerana memilih Samlia Wellness 🌸</p>
              <p style={{fontSize:11,color:"#a16207"}}>Thank you for choosing Samlia Wellness</p>
              <p style={{fontSize:10,color:"#ca8a04",marginTop:8}}>Tanjong Bunut, Brunei Darussalam · +673 869 8379 · yani2912@gmail.com</p>
            </div>
          </div>
        </div>

        {/* ════ HISTORY MODAL ════ */}
        {showHistory&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget){setShowHistory(false);setHistoryView(null);}}}>
            <div style={{background:T.modalBg,borderRadius:18,width:"100%",maxWidth:historyView?680:620,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
              <div style={{background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",padding:"18px 24px",borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {historyView&&<button onClick={()=>setHistoryView(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"white",fontSize:13,fontWeight:700}}>← Kembali</button>}
                  <div>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"white",margin:0}}>{historyView?`📄 ${historyView.invoiceNo}`:"📜 Riwayat Invois"}</h3>
                    <p style={{fontSize:11,color:"#bfdbfe",margin:"2px 0 0"}}>{historyView?historyView.customer.name||"–":`INVOICE HISTORY · ${history.length} rekod`}</p>
                  </div>
                </div>
                <button onClick={()=>{setShowHistory(false);setHistoryView(null);}} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:34,height:34,cursor:"pointer",color:"white",fontSize:18,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              <div style={{padding:24}}>
                {historyView?(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                      {[["📋 No. Invois",historyView.invoiceNo],["📅 Tarikh",formatDateDisplay(historyView.customer.date)],["👤 Pelanggan",historyView.customer.name||"–"],["📞 Telefon",historyView.customer.phone||"–"],["💳 Bayaran",historyView.customer.payment],["🕐 Disimpan",historyView.savedAt]].map(([l,v])=>(
                        <div key={l} style={{background:T.statBg,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:"10px 14px"}}>
                          <div style={{fontSize:10,color:T.textSecondary,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                          <div style={{fontSize:13,fontWeight:700,color:T.textPrimary,marginTop:3}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {historyView.customer.remarks&&<div style={{background:T.statBg,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:T.textSecondary,fontStyle:"italic"}}>"{historyView.customer.remarks}"</div>}
                    <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16,fontSize:12}}>
                      <thead><tr style={{background:"#92400e",color:"white"}}>{["No","Perkhidmatan","Qty","Harga","Diskaun","Jumlah"].map((h,i)=><th key={i} style={{padding:"8px",textAlign:i>=2?"center":"left",fontSize:10}}>{h}</th>)}</tr></thead>
                      <tbody>{historyView.rows.map((r,i)=>(
                        <tr key={i} style={{background:i%2===0?T.cardBg:T.rowAlt}}>
                          <td style={{padding:"8px",color:T.accent,fontWeight:700}}>{i+1}</td>
                          <td style={{padding:"8px",color:T.textPrimary}}>{r.name}</td>
                          <td style={{padding:"8px",textAlign:"center",color:T.textPrimary}}>{r.qty}</td>
                          <td style={{padding:"8px",textAlign:"center",color:T.textPrimary}}>{formatBND(r.price)}</td>
                          <td style={{padding:"8px",textAlign:"center",color:r.lineDisc>0?"#e11d48":T.textMuted}}>{r.lineDisc>0?`-${formatBND(r.lineDisc)}`:"–"}</td>
                          <td style={{padding:"8px",textAlign:"right",fontWeight:700,color:T.accent}}>{formatBND(r.lineNet)}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                    <div style={{marginLeft:"auto",width:280,marginBottom:20}}>
                      <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span style={{color:T.textSecondary}}>Subtotal</span><span style={{fontWeight:600,color:T.textPrimary}}>{formatBND(historyView.subtotal)}</span></div>
                      {historyView.totalItemDisc>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span style={{color:T.textSecondary}}>Diskaun Item</span><span style={{fontWeight:600,color:"#e11d48"}}>-{formatBND(historyView.totalItemDisc)}</span></div>}
                      {historyView.discountAmt>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span style={{color:T.textSecondary}}>Diskaun Transaksi</span><span style={{fontWeight:600,color:"#e11d48"}}>-{formatBND(historyView.discountAmt)}</span></div>}
                      <div style={{height:1,background:T.accentMid,margin:"8px 0"}}/>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:T.accent}}>JUMLAH</span><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,color:T.accent}}>{formatBND(historyView.total)}</span></div>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>restoreFromHistory(historyView)} style={{flex:1,padding:"10px 0",background:"#1d4ed8",color:"white",border:"none",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13}}>🔄 Muat Semula ke Form</button>
                      <button onClick={()=>{deleteHistory(historyView.id);setHistoryView(null);}} style={{padding:"10px 18px",background:T.badgeUnpaidBg,border:"1.5px solid #e11d48",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,color:"#e11d48"}}>🗑️ Padam</button>
                    </div>
                  </div>
                ):(
                  <div>
                    <input value={historySearch} onChange={e=>setHistorySearch(e.target.value)} placeholder="🔍 Cari nama atau no. invois..."
                      style={{width:"100%",padding:"10px 14px",border:`1.5px solid ${T.cardBorder}`,borderRadius:10,fontSize:13,color:T.inputColor,background:T.searchBg,outline:"none",marginBottom:16}}/>
                    {history.length===0?(
                      <div style={{textAlign:"center",padding:"48px 0"}}>
                        <div style={{fontSize:40,marginBottom:12}}>📭</div>
                        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.accent}}>Tiada riwayat invois</p>
                        <p style={{fontSize:12,color:T.textSecondary,marginTop:6}}>Riwayat akan muncul selepas klik 💾 Simpan</p>
                      </div>
                    ):(
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {history.filter(h=>{const q=historySearch.toLowerCase();return!q||h.invoiceNo.toLowerCase().includes(q)||(h.customer.name||"").toLowerCase().includes(q);}).map(h=>(
                          <div key={h.id} style={{border:`1.5px solid ${T.cardBorder}`,borderRadius:12,overflow:"hidden",background:T.cardBg}}>
                            <div style={{display:"flex",alignItems:"center",padding:"12px 16px",gap:12}}>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                                  <span style={{fontSize:13,fontWeight:700,color:T.accent}}>{h.invoiceNo}</span>
                                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,fontWeight:700,background:T.badgeLunasBg,color:T.badgeLunasColor}}>LUNAS</span>
                                </div>
                                <div style={{fontSize:13,fontWeight:600,color:T.textPrimary}}>👤 {h.customer.name||"–"}</div>
                                <div style={{fontSize:11,color:T.textSecondary,marginTop:2}}>📅 {formatDateDisplay(h.customer.date)} · 🕐 {h.savedAt}</div>
                                <div style={{fontSize:11,color:T.textSecondary,marginTop:2}}>{h.rows.length} perkhidmatan · {h.customer.payment}</div>
                              </div>
                              <div style={{textAlign:"right",flexShrink:0}}>
                                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:T.accent,marginBottom:8}}>{formatBND(h.total)}</div>
                                <div style={{display:"flex",gap:6}}>
                                  <button onClick={()=>setHistoryView(h)} style={{padding:"5px 12px",background:T.viewBtnBg,border:`1.5px solid ${T.viewBtnBorder}`,borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,color:T.viewBtnColor}}>👁️ Lihat</button>
                                  <button onClick={()=>deleteHistory(h.id)} style={{padding:"5px 10px",background:T.badgeUnpaidBg,border:"1.5px solid #e11d48",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,color:"#e11d48"}}>🗑️</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {history.length>0&&(
                      <div style={{marginTop:20,paddingTop:16,borderTop:`1px dashed ${T.divider}`,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                        {[["📋 Jumlah Invois",history.length],["💰 Jumlah Terima",formatBND(history.reduce((s,h)=>s+h.total,0))],["📈 Purata",formatBND(history.length>0?history.reduce((s,h)=>s+h.total,0)/history.length:0)]].map(([l,v])=>(
                          <div key={l} style={{background:T.statBg,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:"10px",textAlign:"center"}}>
                            <div style={{fontSize:10,color:T.textSecondary,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
                            <div style={{fontSize:15,fontWeight:700,color:T.accent,marginTop:4}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{marginTop:20,paddingTop:16,borderTop:`1px dashed ${T.dividerDanger}`,textAlign:"center"}}>
                      <p style={{fontSize:11,color:T.textMuted,marginBottom:10}}>⚠️ Danger Zone</p>
                      <button onClick={deleteAllHistory} style={{padding:"7px 16px",background:T.badgeUnpaidBg,border:"1.5px solid #e11d48",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,color:"#e11d48"}}>🗑️ Padam Semua Riwayat</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════ CRUD MODAL ════ */}
        {showManager&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget)setShowManager(false);}}>
            <div style={{background:T.modalBg,borderRadius:18,width:"100%",maxWidth:560,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
              <div style={{background:"linear-gradient(135deg,#92400e,#d97706)",padding:"18px 24px",borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"white",margin:0}}>⚙️ Urus Perkhidmatan</h3>
                  <p style={{fontSize:11,color:"#fde68a",margin:"3px 0 0",letterSpacing:1}}>MANAGE SERVICES</p>
                </div>
                <button onClick={()=>{setShowManager(false);setEditIdx(null);}} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:34,height:34,cursor:"pointer",color:"white",fontSize:18,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              <div style={{padding:24}}>
                <div style={{background:T.statBg,border:`1.5px dashed ${T.accentMid}`,borderRadius:12,padding:16,marginBottom:22}}>
                  <p style={{fontSize:12,fontWeight:700,color:T.textSecondary,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>+ Tambah Perkhidmatan Baru</p>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <input value={newSvcName} onChange={e=>setNewSvcName(e.target.value)} placeholder="Nama perkhidmatan..." style={{...mInp,flex:"2 1 160px"}} onKeyDown={e=>e.key==="Enter"&&addMenuItem()}/>
                    <input value={newSvcPrice} onChange={e=>setNewSvcPrice(e.target.value)} type="number" min="0" placeholder="Harga B$" style={{...mInp,flex:"1 1 90px"}} onKeyDown={e=>e.key==="Enter"&&addMenuItem()}/>
                    <button onClick={addMenuItem} style={{padding:"9px 18px",background:"#92400e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:14,whiteSpace:"nowrap"}}>+ Tambah</button>
                  </div>
                </div>
                <p style={{fontSize:12,fontWeight:700,color:T.textSecondary,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Senarai Perkhidmatan ({menu.length})</p>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {menu.map((s,i)=>(
                    <div key={s.id} style={{border:`1.5px solid ${T.cardBorder}`,borderRadius:10,overflow:"hidden"}}>
                      {editIdx===i?(
                        <div style={{background:T.statBg,padding:12}}>
                          <p style={{fontSize:11,color:T.textSecondary,marginBottom:8,fontWeight:700}}>✏️ Edit #{i+1}</p>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                            <input value={editName} onChange={e=>setEditName(e.target.value)} style={{...mInp,flex:"2 1 160px"}}/>
                            <input value={editPrice} onChange={e=>setEditPrice(e.target.value)} type="number" style={{...mInp,flex:"1 1 90px"}}/>
                          </div>
                          <div style={{display:"flex",gap:8,marginTop:10}}>
                            <button onClick={saveEdit} style={{flex:1,padding:"8px 0",background:"#059669",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>✅ Simpan</button>
                            <button onClick={cancelEdit} style={{flex:1,padding:"8px 0",background:T.statBg,color:T.textSecondary,border:`1px solid ${T.cardBorder}`,borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>Batal</button>
                          </div>
                        </div>
                      ):(
                        <div style={{display:"flex",alignItems:"center",padding:"11px 14px",gap:10,background:T.cardBg}}>
                          <div style={{width:26,height:26,background:T.accentSoft,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.accent,flexShrink:0}}>{i+1}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:700,color:T.textPrimary}}>{s.name}</div>
                            <div style={{fontSize:12,color:T.accentMid,marginTop:1}}>{formatBND(s.price)}</div>
                          </div>
                          <button onClick={()=>startEdit(i)} style={{padding:"5px 12px",background:T.editBtnBg,border:`1.5px solid ${T.viewBtnBorder}`,borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,color:T.editBtnColor}}>✏️ Edit</button>
                          <button onClick={()=>deleteMenuItem(i)} style={{padding:"5px 12px",background:T.badgeUnpaidBg,border:"1.5px solid #e11d48",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,color:"#e11d48"}}>🗑️ Padam</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:20,paddingTop:16,borderTop:`1px dashed ${T.divider}`,textAlign:"center"}}>
                  <button onClick={resetMenuToDefault} style={{padding:"8px 20px",background:T.cardBg,border:`1.5px solid ${T.accentMid}`,borderRadius:8,cursor:"pointer",fontSize:12,color:T.textSecondary,fontWeight:600}}>🔄 Reset ke Senarai Asal</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ PELANGGAN MODAL ════ */}
        {showCustomers&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget)setShowCustomers(false);}}>
            <div style={{background:T.modalBg,borderRadius:18,width:"100%",maxWidth:640,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
              <div style={{background:"linear-gradient(135deg,#059669,#10b981)",padding:"18px 24px",borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
                <div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"white",margin:0}}>👥 Database Pelanggan</h3>
                  <p style={{fontSize:11,color:"#a7f3d0",margin:"2px 0 0"}}>CUSTOMER DATABASE · {customers.length} pelanggan</p>
                </div>
                <button onClick={()=>setShowCustomers(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:34,height:34,cursor:"pointer",color:"white",fontSize:18,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              <div style={{padding:24}}>
                <input value={custSearch} onChange={e=>setCustSearch(e.target.value)} placeholder="🔍 Cari nama atau no. telefon..."
                  style={{width:"100%",padding:"10px 14px",border:`1.5px solid ${T.cardBorder}`,borderRadius:10,fontSize:13,color:T.inputColor,background:T.searchBg,outline:"none",marginBottom:16}}/>
                {customers.length===0?(
                  <div style={{textAlign:"center",padding:"40px 0"}}>
                    <div style={{fontSize:40,marginBottom:12}}>👥</div>
                    <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.accent}}>Tiada rekod pelanggan</p>
                    <p style={{fontSize:12,color:T.textSecondary,marginTop:6}}>Rekod akan auto-simpan apabila klik 💾 Simpan</p>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {customers.filter(c=>{const q=custSearch.toLowerCase();return!q||c.name.toLowerCase().includes(q)||(c.phone||"").includes(q);}).map(c=>(
                      <div key={c.id} style={{background:T.cardBg,border:`1.5px solid ${T.cardBorder}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:40,height:40,borderRadius:"50%",background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:16,flexShrink:0}}>
                          {c.name[0].toUpperCase()}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,fontWeight:700,color:T.textPrimary}}>{c.name}</div>
                          <div style={{fontSize:12,color:T.textSecondary,marginTop:2}}>📞 {c.phone||"–"} · 📅 Terakhir: {formatDateDisplay(c.lastVisit)||"–"}</div>
                          <div style={{display:"flex",gap:12,marginTop:4}}>
                            <span style={{fontSize:11,background:T.badgeLunasBg,color:T.badgeLunasColor,padding:"2px 8px",borderRadius:99,fontWeight:700}}>{c.visitCount||0}x kunjungan</span>
                            <span style={{fontSize:11,color:T.accent,fontWeight:700}}>{formatBND(c.totalSpent||0)} total</span>
                          </div>
                        </div>
                        <button onClick={()=>deleteCustomer(c.id)} style={{padding:"5px 10px",background:T.badgeUnpaidBg,border:"1.5px solid #e11d48",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,color:"#e11d48",flexShrink:0}}>🗑️</button>
                      </div>
                    ))}
                  </div>
                )}
                {customers.length>0&&(
                  <div style={{marginTop:16,paddingTop:16,borderTop:`1px dashed ${T.divider}`,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {[["👥 Jumlah",customers.length],["🏆 Paling Kerap",customers.sort((a,b)=>(b.visitCount||0)-(a.visitCount||0))[0]?.name||"–"],["💰 Tertinggi",formatBND(Math.max(...customers.map(c=>c.totalSpent||0)))]].map(([l,v])=>(
                      <div key={l} style={{background:T.statBg,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:"10px",textAlign:"center"}}>
                        <div style={{fontSize:10,color:T.textSecondary,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
                        <div style={{fontSize:13,fontWeight:700,color:T.accent,marginTop:4}}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


                        {/* ════ DASHBOARD MODAL ════ */}
        {showDashboard&&<DashboardModal history={history} formatBND={formatBND} T={T} onClose={()=>setShowDashboard(false)}/>}

        {/* ════ TOAST ════ */}
        <ToastContainer toasts={toasts} onRemove={removeToast}/>


      </div>
    </>
  );
}

/* ══════ DASHBOARD ══════ */
function DashboardModal({history,formatBND,T,onClose}) {
  const bntNow = ()=>new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Brunei"}));
  const thisYear = bntNow().getFullYear();

  const availYears = useMemo(()=>{
    const yrs = new Set(history.map(h=>new Date(h.id).getFullYear()));
    yrs.add(thisYear);
    return Array.from(yrs).sort((a,b)=>b-a);
  },[history,thisYear]);

  // "ringkas" = cepat | "custom" = pilih sendiri
  const [viewMode, setViewMode] = useState("ringkas");
  const [quickPeriod, setQuickPeriod] = useState("month");
  const [selYear, setSelYear] = useState(thisYear);
  const [selMonth, setSelMonth] = useState(null);
  const [selDay, setSelDay] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview | services | transactions

  const MONTHS = ["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ogo","Sep","Okt","Nov","Dis"];
  const MONTHS_FULL = ["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"];
  const DAYS = [{v:1,l:"Isnin"},{v:2,l:"Selasa"},{v:3,l:"Rabu"},{v:4,l:"Khamis"},{v:5,l:"Jumaat"},{v:6,l:"Sabtu"},{v:0,l:"Ahad"}];
  const QUICK = [["today","Hari Ini"],["week","Minggu Ini"],["month","Bulan Ini"],["year","Tahun Ini"],["all","Semua"]];

  const filtered = useMemo(()=>{
    const now = bntNow();
    let list = history;

    if (viewMode === "ringkas") {
      const startOf = u => {
        const d = new Date(now);
        if(u==="today"){d.setHours(0,0,0,0);return d;}
        if(u==="week"){d.setDate(d.getDate()-d.getDay());d.setHours(0,0,0,0);return d;}
        if(u==="month"){d.setDate(1);d.setHours(0,0,0,0);return d;}
        if(u==="year"){d.setMonth(0,1);d.setHours(0,0,0,0);return d;}
        return new Date(0);
      };
      list = list.filter(h=>new Date(h.id)>=startOf(quickPeriod));
    } else {
      list = list.filter(h=>{
        const d = new Date(h.id);
        const yOk = d.getFullYear()===selYear;
        const mOk = selMonth===null || d.getMonth()===selMonth;
        const dOk = selDay===null || d.getDay()===selDay;
        return yOk && mOk && dOk;
      });
    }
    return list;
  },[history,viewMode,quickPeriod,selYear,selMonth,selDay]);

  const rev = filtered.reduce((s,h)=>s+h.total,0);
  const avg = filtered.length>0 ? rev/filtered.length : 0;

  // Top services
  const svcMap={};
  filtered.forEach(h=>h.rows.forEach(r=>{svcMap[r.name]=(svcMap[r.name]||0)+(r.lineNet??r.price*r.qty);}));
  const top = Object.entries(svcMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  // Chart: 12 bulan (custom tahun) or 7 hari (ringkas)
  const chartBars = useMemo(()=>{
    if (viewMode==="custom" && selMonth===null && selDay===null) {
      return MONTHS.map((label,mi)=>{
        const rv = history.filter(h=>{
          const d=new Date(h.id);
          return d.getFullYear()===selYear && d.getMonth()===mi
            ;
        }).reduce((s,h)=>s+h.total,0);
        return {label, rv};
      });
    }
    if (viewMode==="custom" && selDay===null && selMonth!==null) {
      // Hari dalam bulan yg dipilih — group by day of week
      return DAYS.map(({v,l})=>{
        const rv = filtered.filter(h=>new Date(h.id).getDay()===v).reduce((s,h)=>s+h.total,0);
        return {label:l.slice(0,3), rv};
      });
    }
    // Default: 7 hari terakhir
    return Array.from({length:7},(_,i)=>{
      const d=bntNow(); d.setDate(d.getDate()-(6-i)); d.setHours(0,0,0,0);
      const nx=new Date(d); nx.setDate(nx.getDate()+1);
      const rv=history.filter(h=>{
        const hd=new Date(h.id);
        return hd>=d&&hd<nx;
      }).reduce((s,h)=>s+h.total,0);
      return {label:["Ahd","Isn","Sel","Rab","Kha","Jum","Sab"][d.getDay()], rv};
    });
  },[filtered,viewMode,selYear,selMonth,selDay,history]);
  const maxR = Math.max(...chartBars.map(d=>d.rv),1);

  // Period label for header
  const periodLabel = viewMode==="ringkas"
    ? QUICK.find(([v])=>v===quickPeriod)?.[1]||""
    : `${selMonth!==null?MONTHS_FULL[selMonth]:"Semua Bulan"} ${selYear}${selDay!==null?" · "+DAYS.find(d=>d.v===selDay)?.l:""}`;

  const chartLabel = viewMode==="custom" && selMonth===null && selDay===null
    ? `Hasil Bulanan ${selYear}` : "Hasil 7 Hari Terakhir";

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:T.modalBg,borderRadius:18,width:"100%",maxWidth:680,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>

        {/* ── Header ── */}
        <div style={{background:"linear-gradient(135deg,#1d4ed8,#6366f1)",padding:"16px 20px",borderRadius:"18px 18px 0 0",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"white",margin:0}}>📊 Dashboard</h3>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",color:"white",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>

          {/* ── Tab: Ringkas / Custom ── */}
          <div style={{display:"flex",gap:6,background:"rgba(0,0,0,0.2)",borderRadius:10,padding:3}}>
            {[["ringkas","⚡ Ringkas"],["custom","🗓️ Pilih Tarikh"]].map(([v,l])=>(
              <button key={v} onClick={()=>setViewMode(v)}
                style={{flex:1,padding:"6px 0",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,
                  background:viewMode===v?"white":"transparent",color:viewMode===v?"#1d4ed8":"rgba(255,255,255,0.8)",transition:"all .2s"}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:16}}>

          {/* ── Filter Ringkas ── */}
          {viewMode==="ringkas"&&(
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {QUICK.map(([v,l])=>(
                <button key={v} onClick={()=>setQuickPeriod(v)}
                  style={{padding:"6px 14px",borderRadius:99,border:"2px solid #1d4ed8",cursor:"pointer",fontWeight:700,fontSize:12,
                    background:quickPeriod===v?"#1d4ed8":T.cardBg,color:quickPeriod===v?"white":"#1d4ed8"}}>
                  {l}
                </button>
              ))}
            </div>
          )}

          {/* ── Filter Custom ── */}
          {viewMode==="custom"&&(
            <div style={{background:T.statBg,borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:10}}>
              {/* Tahun */}
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,color:T.textSecondary,minWidth:44}}>Tahun</span>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {availYears.map(y=>(
                    <button key={y} onClick={()=>setSelYear(y)}
                      style={{padding:"4px 12px",borderRadius:99,border:"2px solid #1d4ed8",cursor:"pointer",fontWeight:700,fontSize:12,
                        background:selYear===y?"#1d4ed8":T.cardBg,color:selYear===y?"white":"#1d4ed8"}}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              {/* Bulan */}
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,color:T.textSecondary,minWidth:44}}>Bulan</span>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  <button onClick={()=>setSelMonth(null)}
                    style={{padding:"4px 10px",borderRadius:99,border:`2px solid ${T.accentMid}`,cursor:"pointer",fontWeight:700,fontSize:11,
                      background:selMonth===null?T.accentMid:T.cardBg,color:selMonth===null?"white":T.accentMid}}>Semua</button>
                  {MONTHS.map((m,mi)=>(
                    <button key={mi} onClick={()=>setSelMonth(mi)}
                      style={{padding:"4px 9px",borderRadius:99,border:"2px solid #1d4ed8",cursor:"pointer",fontWeight:700,fontSize:11,
                        background:selMonth===mi?"#1d4ed8":T.cardBg,color:selMonth===mi?"white":"#1d4ed8"}}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {/* Hari */}
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,color:T.textSecondary,minWidth:44}}>Hari</span>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  <button onClick={()=>setSelDay(null)}
                    style={{padding:"4px 10px",borderRadius:99,border:`2px solid ${T.accentMid}`,cursor:"pointer",fontWeight:700,fontSize:11,
                      background:selDay===null?T.accentMid:T.cardBg,color:selDay===null?"white":T.accentMid}}>Semua</button>
                  {DAYS.map(({v,l})=>(
                    <button key={v} onClick={()=>setSelDay(selDay===v?null:v)}
                      style={{padding:"4px 9px",borderRadius:99,border:"2px solid #059669",cursor:"pointer",fontWeight:700,fontSize:11,
                        background:selDay===v?"#059669":T.cardBg,color:selDay===v?"white":"#059669"}}>
                      {l.slice(0,3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── KPI Cards ── */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              {icon:"💰",label:"Jumlah Hasil",value:formatBND(rev),color:"#059669",bg:T.badgeLunasBg},
              {icon:"📋",label:"Invois",value:filtered.length,color:"#1d4ed8",bg:T.dark?"#1e3a5f":"#eff6ff"},
              {icon:"📈",label:"Purata",value:formatBND(avg),color:"#7c3aed",bg:T.dark?"#2e1065":"#f5f3ff"},
            ].map(({icon,label,value,color,bg})=>(
              <div key={label} style={{background:bg,borderRadius:12,padding:"12px 10px",border:`1.5px solid ${color}33`,textAlign:"center"}}>
                <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
                <div style={{fontSize:18,fontWeight:800,color,fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{value}</div>
                <div style={{fontSize:10,color:T.textSecondary,marginTop:4,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Content Tabs ── */}
          <div style={{display:"flex",gap:0,background:T.statBg,borderRadius:10,padding:3}}>
            {[["overview","📊 Graf"],["services","🌸 Perkhidmatan"],["transactions","🧾 Transaksi"]].map(([v,l])=>(
              <button key={v} onClick={()=>setActiveTab(v)}
                style={{flex:1,padding:"7px 4px",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:11,
                  background:activeTab===v?T.cardBg:"transparent",color:activeTab===v?T.accent:T.textSecondary,
                  boxShadow:activeTab===v?"0 1px 4px rgba(0,0,0,0.1)":"none",transition:"all .2s"}}>
                {l}
              </button>
            ))}
          </div>

          {/* ── Tab: Graf ── */}
          {activeTab==="overview"&&(
            <div style={{background:T.chartBg,borderRadius:12,padding:16,border:`1px solid ${T.cardBorder}`}}>
              <p style={{fontSize:11,fontWeight:700,color:T.accent,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>📅 {chartLabel}</p>
              {filtered.length===0?(
                <p style={{textAlign:"center",color:T.textSecondary,fontSize:13,padding:"20px 0",fontStyle:"italic"}}>Tiada data untuk tempoh ini</p>
              ):(
                <div style={{display:"flex",alignItems:"flex-end",gap:3,height:100}}>
                  {chartBars.map(({label,rv})=>(
                    <div key={label} style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      {rv>0&&<div style={{fontSize:7,color:T.textSecondary,fontWeight:700,textAlign:"center",whiteSpace:"nowrap"}}>
                        {formatBND(rv).replace("B$ ","")}
                      </div>}
                      <div style={{width:"80%",background:rv>0?T.chartBar:T.chartBarEmpty,borderRadius:"3px 3px 0 0",
                        height:`${Math.max((rv/maxR)*72,rv>0?6:3)}px`,transition:"height .4s ease"}}/>
                      <div style={{fontSize:9,color:T.textSecondary,fontWeight:600,textAlign:"center"}}>{label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Perkhidmatan ── */}
          {activeTab==="services"&&(
            top.length===0
            ?<p style={{textAlign:"center",color:T.textSecondary,fontSize:13,padding:"20px 0",fontStyle:"italic"}}>Tiada data</p>
            :<div style={{background:T.cardBg,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:16}}>
              {top.map(([name,rv],i)=>(
                <div key={name} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:22,height:22,borderRadius:"50%",background:`hsl(${35-i*6},75%,${T.dark?55:45}%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",flexShrink:0}}>{i+1}</span>
                      <span style={{fontSize:13,color:T.textPrimary,fontWeight:600}}>{name}</span>
                    </div>
                    <span style={{fontSize:13,color:T.accent,fontWeight:700,flexShrink:0}}>{formatBND(rv)}</span>
                  </div>
                  <div style={{height:6,background:T.chartBarEmpty,borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.round((rv/(top[0][1]||1))*100)}%`,background:`hsl(${35-i*6},75%,${T.dark?55:45}%)`,borderRadius:99,transition:"width .5s ease"}}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tab: Transaksi ── */}
          {activeTab==="transactions"&&(
            filtered.length===0
            ?<p style={{textAlign:"center",color:T.textSecondary,fontSize:13,padding:"20px 0",fontStyle:"italic"}}>Tiada transaksi dalam tempoh ini</p>
            :<div style={{background:T.cardBg,border:`1px solid ${T.cardBorder}`,borderRadius:12,overflow:"hidden"}}>
              {filtered.slice(0,15).map((h,idx)=>(
                <div key={h.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderBottom:idx<Math.min(filtered.length,15)-1?`1px solid ${T.divider}`:"none",background:idx%2===0?T.cardBg:T.rowAlt}}>
                  <div style={{minWidth:0,flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.accent}}>{h.invoiceNo}</div>
                    <div style={{fontSize:11,color:T.textSecondary,marginTop:1}}>{h.customer.name||"–"}</div>
                    <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>{h.savedAt}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                    <div style={{fontSize:14,fontWeight:800,color:T.textPrimary}}>{formatBND(h.total)}</div>
                    <div style={{fontSize:10,color:T.textSecondary}}>{h.rows.length} item</div>
                  </div>
                </div>
              ))}
              {filtered.length>15&&<div style={{textAlign:"center",padding:"10px",fontSize:12,color:T.textSecondary}}>+{filtered.length-15} transaksi lagi...</div>}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}