import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://vptbgiayoolpxcoswemc.supabase.co";
const SUPABASE_ANON = "sb_publishable_XWh4_H4vfCENXpI0dw88Og_zAwKV7Rf";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

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
const EMPTY_CUSTOMER = {name:"",phone:"",date:todayBNT(),payment:PAYMENT_METHODS[0],status:"PAID",remarks:""};

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

  const printRef = useRef(null);
  const draftTimer = useRef(null);

  /* ── Load data ── */
  useEffect(()=>{
    (async()=>{
      try {
        const {data:svcs,error:e1}=await supabase.from("sw_services").select("*").order("sort_order"); if(e1)throw e1; setMenu(svcs||[]);
        const {data:ctr,error:e2}=await supabase.from("sw_settings").select("value").eq("key","counter").single(); if(e2&&e2.code!=="PGRST116")throw e2; if(ctr)setCounter(Number(ctr.value));
        const {data:draft,error:e3}=await supabase.from("sw_settings").select("value").eq("key","draft").single(); if(e3&&e3.code!=="PGRST116")throw e3;
        if(draft?.value){const d=draft.value; if(d.customer)setCustomer(d.customer); if(d.rows)setRows(d.rows); if(d.discountMode)setDiscountMode(d.discountMode); if(d.discountVal!==undefined)setDiscountVal(d.discountVal);}
        const {data:inv,error:e4}=await supabase.from("sw_invoices").select("*").order("created_at",{ascending:false}); if(e4)throw e4;
        setHistory((inv||[]).map(r=>({id:r.id,invoiceNo:r.invoice_no,savedAt:r.saved_at,customer:r.customer,rows:r.rows,discountMode:r.discount_mode,discountVal:r.discount_val,subtotal:r.subtotal,totalItemDisc:r.total_item_disc,subtotalAfterItemDisc:r.subtotal_after_item_disc,discountAmt:r.discount_amt,total:r.total})));
      } catch(err){ console.error(err); setDbError("Gagal sambung ke pangkalan data. Semak SUPABASE_URL dan SUPABASE_ANON_KEY."); }
      finally { setLoading(false); }
    })();
  },[]);

  /* ── Auto-save draft ── */
  useEffect(()=>{
    if(loading)return; clearTimeout(draftTimer.current);
    draftTimer.current=setTimeout(async()=>{ await supabase.from("sw_settings").upsert({key:"draft",value:{customer,rows,discountMode,discountVal}},{onConflict:"key"}); },800);
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

  /* ── Menu CRUD ── */
  const startEdit = i=>{setEditIdx(i);setEditName(menu[i].name);setEditPrice(String(menu[i].price));};
  const cancelEdit = ()=>setEditIdx(null);
  const saveEdit = async()=>{
    if(!editName.trim()||!editPrice)return;
    const{error}=await supabase.from("sw_services").update({name:editName.trim(),price:parseFloat(editPrice)}).eq("id",menu[editIdx].id);
    if(error){toast("Gagal simpan: "+error.message,"error");return;}
    setMenu(p=>p.map((s,i)=>i===editIdx?{...s,name:editName.trim(),price:parseFloat(editPrice)}:s)); setEditIdx(null);
    toast("Perkhidmatan berjaya dikemaskini!","success");
  };
  const deleteMenuItem = async i=>{
    if(!window.confirm(`Padam "${menu[i].name}"?`))return;
    const{error}=await supabase.from("sw_services").delete().eq("id",menu[i].id);
    if(error){toast("Gagal padam: "+error.message,"error");return;}
    setMenu(p=>p.filter((_,idx)=>idx!==i)); toast("Perkhidmatan dipadam.","warn");
  };
  const addMenuItem = async()=>{
    if(!newSvcName.trim()||!newSvcPrice)return;
    const{data,error}=await supabase.from("sw_services").insert({name:newSvcName.trim(),price:parseFloat(newSvcPrice),sort_order:menu.length+1}).select().single();
    if(error){toast("Gagal tambah: "+error.message,"error");return;}
    setMenu(p=>[...p,data]); setNewSvcName("");setNewSvcPrice(""); toast(`"${data.name}" berjaya ditambah!`,"success");
  };
  const resetMenuToDefault = async()=>{
    if(!window.confirm("Reset semua perkhidmatan ke senarai asal?"))return;
    await supabase.from("sw_services").delete().neq("id","00000000-0000-0000-0000-000000000000");
    const{data,error}=await supabase.from("sw_services").insert(DEFAULT_MENU.map((s,i)=>({...s,sort_order:i+1}))).select();
    if(error){toast("Gagal reset: "+error.message,"error");return;}
    setMenu(data||[]); setEditIdx(null); toast("Menu direset ke senarai asal.","info");
  };

  /* ── Save history ── */
  const saveToHistory = async()=>{
    if(rows.length===0)return;
    const snap={id:Date.now(),invoice_no:invoiceNo,saved_at:new Date().toLocaleString("en-GB",{timeZone:"Asia/Brunei"}),customer,rows:rows.map((r,i)=>({...r,...rowCalcs[i]})),discount_mode:discountMode,discount_val:discountVal,subtotal,total_item_disc:totalItemDisc,subtotal_after_item_disc:subtotalAfterItemDisc,discount_amt:discountAmt,total};
    const{error}=await supabase.from("sw_invoices").insert(snap);
    if(error){console.error(error);return null;}
    const local={id:snap.id,invoiceNo:snap.invoice_no,savedAt:snap.saved_at,customer,rows:snap.rows,discountMode,discountVal,subtotal,totalItemDisc,subtotalAfterItemDisc,discountAmt,total};
    setHistory(p=>[local,...p]); return local;
  };

  /* ── New invoice ── */
  const newInvoice = async()=>{
    if(!validate())return; setSaving(true);
    await saveToHistory();
    const next=counter+1; setCounter(next);
    await supabase.from("sw_settings").upsert({key:"counter",value:next},{onConflict:"key"});
    setCustomer(EMPTY_CUSTOMER);setRows([]);setDiscountVal("");setDiscountMode("percent");setFormErrors({});
    await supabase.from("sw_settings").upsert({key:"draft",value:null},{onConflict:"key"});
    toast(`Invois ${invoiceNo} disimpan! Sedia untuk invois baru.`,"success"); setSaving(false);
  };

  const resetInvoice = async()=>{
    if(!window.confirm("Reset borang? Data tidak akan disimpan."))return;
    setCustomer(EMPTY_CUSTOMER);setRows([]);setDiscountVal("");setDiscountMode("percent");setFormErrors({});
    await supabase.from("sw_settings").upsert({key:"draft",value:null},{onConflict:"key"});
    toast("Borang berjaya direset.","warn");
  };

  const handlePrint = ()=>{ if(!validate())return; window.print(); };

  const copyWhatsApp = ()=>{
    const lines=rows.map((r,i)=>{const{lineDisc,lineNet}=rowCalcs[i];return`• ${r.name} x${r.qty} – ${formatBND(lineNet)}${lineDisc>0?` (diskaun -${formatBND(lineDisc)})`:""}`}).join("\n");
    const text=`✨ *SAMLIA WELLNESS* ✨\n📋 Invois: ${invoiceNo}\n📅 Tarikh: ${formatDateDisplay(customer.date)}\n\n👤 Pelanggan: ${customer.name||"-"}\n📞 Tel: ${customer.phone||"-"}\n\n🌸 *Perkhidmatan:*\n${lines}\n\n💰 Subtotal : ${formatBND(subtotal)}${totalItemDisc>0?`\n🏷️ Diskaun Item: -${formatBND(totalItemDisc)}`:""}${discountAmt>0?`\n🏷️ Diskaun Trans: -${formatBND(discountAmt)}`:""}\n✅ *JUMLAH: ${formatBND(total)}*\n💳 Bayaran: ${customer.payment}\n\nTerima kasih kerana memilih Samlia Wellness! 🌸`;
    navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);toast("Ringkasan disalin ke clipboard!","success");});
  };

  const restoreFromHistory = async snap=>{
    const next=counter+1; setCounter(next);
    await supabase.from("sw_settings").upsert({key:"counter",value:next},{onConflict:"key"});
    setCustomer({...snap.customer});
    setRows(snap.rows.map(({lineTotal,lineDisc,lineNet,...r})=>r));
    setDiscountMode(snap.discountMode); setDiscountVal(snap.discountVal);
    setHistoryView(null); setShowHistory(false);
    toast(`Invois ${snap.invoiceNo} dimuat semula ke form.`,"info");
  };

  const deleteHistory = async id=>{
    if(!window.confirm("Padam rekod invois ini?"))return;
    const{error}=await supabase.from("sw_invoices").delete().eq("id",id);
    if(error){toast("Gagal padam: "+error.message,"error");return;}
    setHistory(p=>p.filter(h=>h.id!==id)); if(historyView?.id===id)setHistoryView(null);
    toast("Rekod invois dipadam.","warn");
  };
  const deleteAllHistory = async()=>{
    if(!window.confirm("Padam SEMUA riwayat invois?"))return;
    await supabase.from("sw_invoices").delete().neq("id",0); setHistory([]);
    toast("Semua riwayat invois dipadam.","warn");
  };
  const clearAllData = async()=>{
    if(!window.confirm("⚠️ Padam SEMUA data?\nTindakan ini tidak boleh dibatalkan."))return;
    await Promise.all([supabase.from("sw_invoices").delete().neq("id",0),supabase.from("sw_services").delete().neq("id","00000000-0000-0000-0000-000000000000"),supabase.from("sw_settings").upsert([{key:"counter",value:1},{key:"draft",value:null}],{onConflict:"key"})]);
    window.location.reload();
  };

  /* ── Inline styles ── */
  const inp = {width:"100%",padding:"9px 12px",border:`1.5px solid ${T.inputBorder}`,borderRadius:8,fontSize:14,color:T.inputColor,background:T.inputBg,outline:"none"};
  const card = {background:T.cardBg,borderRadius:14,padding:20,boxShadow:T.cardShadow,border:`1px solid ${T.cardBorder}`};
  const cardTitle = {fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:T.accent,marginBottom:14,paddingBottom:8,borderBottom:`2px solid ${T.divider}`};
  const lbl = {fontSize:12,fontWeight:700,color:T.textSecondary,textTransform:"uppercase",letterSpacing:0.5};
  const mInp = {padding:"9px 12px",border:`1.5px solid ${T.inputBorder}`,borderRadius:8,fontSize:13,color:T.inputColor,background:T.inputBg,outline:"none",width:"100%"};

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
        body{background:#0f172a;font-family:'Lato',sans-serif;}
        @media print{.no-print{display:none!important}.print-area{box-shadow:none!important;margin:0!important;width:100%!important}body{background:white}}
        @keyframes tp{from{width:100%}to{width:0%}}
        option{background:${T.inputBg};color:${T.inputColor};}
      `}</style>

      <div style={{minHeight:"100vh",background:T.pageBg,padding:"24px 16px",transition:"background 0.3s"}}>

        {/* ── Header ── */}
        <header className="no-print" style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,position:"relative"}}>
            <img src={LOGO_B64} alt="" style={{width:56,height:56,borderRadius:"50%",objectFit:"cover",border:`2px solid ${T.accent}`}}/>
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,color:T.accent,letterSpacing:1}}>Samlia Wellness</h1>
              <p style={{fontSize:12,color:T.textSecondary,letterSpacing:2,textTransform:"uppercase"}}>Invoice System</p>
            </div>
            {/* Dark mode toggle */}
            <button onClick={toggleDark} title={darkMode?"Light Mode":"Dark Mode"}
              style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:T.toggleBg,border:"none",borderRadius:99,width:54,height:28,cursor:"pointer",display:"flex",alignItems:"center",padding:"0 4px",transition:"background 0.3s",flexShrink:0}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:"white",boxShadow:"0 1px 4px rgba(0,0,0,0.25)",transition:"transform 0.3s",transform:darkMode?"translateX(26px)":"translateX(0)"}}/>
              <span style={{position:"absolute",fontSize:13,left:darkMode?7:"auto",right:darkMode?"auto":7}}>{darkMode?"🌙":"☀️"}</span>
            </button>
          </div>
          <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#059669",display:"inline-block",boxShadow:"0 0 6px #059669"}}/>
            <span style={{fontSize:11,color:"#059669",fontWeight:600,letterSpacing:0.5}}>Disambung ke Supabase · {saving?"Menyimpan...":"Data selamat tersimpan"}</span>
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
                <input value={customer.name} onChange={e=>{setCustomer({...customer,name:e.target.value});if(e.target.value.trim())setFormErrors(p=>({...p,name:null}));}} placeholder="Nama penuh..."
                  style={{...inp,border:formErrors.name?`1.5px solid #e11d48`:`1.5px solid ${T.inputBorder}`}}/>
                {formErrors.name&&<span style={{fontSize:11,color:"#e11d48",marginTop:-4}}>⚠️ {formErrors.name}</span>}
                <label style={lbl}>No. Telefon / Phone Number</label>
                <input value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} placeholder="+673 xxx xxxx" style={inp}/>
                <label style={lbl}>Tarikh Kunjungan / Visit Date</label>
                <input type="date" value={customer.date} onChange={e=>setCustomer({...customer,date:e.target.value})} style={inp}/>
                <label style={lbl}>Cara Bayar / Payment Method</label>
                <select value={customer.payment} onChange={e=>setCustomer({...customer,payment:e.target.value})} style={inp}>
                  {PAYMENT_METHODS.map(m=><option key={m}>{m}</option>)}
                </select>
                <label style={lbl}>Status Pembayaran</label>
                <div style={{display:"flex",gap:10}}>
                  {["PAID","UNPAID"].map(s=>(
                    <button key={s} onClick={()=>setCustomer({...customer,status:s})}
                      style={{flex:1,padding:"8px 0",borderRadius:8,border:"2px solid",cursor:"pointer",fontWeight:700,fontSize:13,transition:"all .2s",borderColor:s==="PAID"?"#059669":"#e11d48",background:customer.status===s?(s==="PAID"?"#059669":"#e11d48"):T.cardBg,color:customer.status===s?"white":(s==="PAID"?"#059669":"#e11d48")}}>
                      {s==="PAID"?"✅ LUNAS / PAID":"⏳ BELUM / UNPAID"}
                    </button>
                  ))}
                </div>
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

            {/* Action buttons */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[{l:"🖨️ Cetak",c:"#92400e",f:handlePrint},{l:copied?"✅ Disalin!":"📋 WhatsApp",c:"#059669",f:copyWhatsApp},{l:"🗑️ Reset",c:"#b45309",f:resetInvoice},{l:saving?"⏳...":"🔄 Invois Baru",c:"#1d4ed8",f:newInvoice}].map(({l,c,f})=>(
                <button key={l} onClick={f} style={{flex:1,minWidth:110,padding:"11px 12px",background:c,color:"white",border:"none",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:12,boxShadow:`0 4px 14px ${c}55`,transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";e.currentTarget.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>
                  {l}
                </button>
              ))}
            </div>

            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setHistoryView(null);setShowHistory(true);}} style={{flex:1,padding:"11px 0",background:T.cardBg,border:`2px solid ${T.accentMid}`,borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,color:T.accent,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                📜 Riwayat {history.length>0&&<span style={{background:T.accent,color:"white",borderRadius:99,padding:"1px 8px",fontSize:11}}>{history.length}</span>}
              </button>
              <button onClick={()=>setShowDashboard(true)} style={{flex:1,padding:"11px 0",background:T.cardBg,border:"2px solid #1d4ed8",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,color:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                📊 Dashboard
              </button>
            </div>
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
            <div style={{textAlign:"center",margin:"20px 0 14px"}}>
              <span style={{display:"inline-block",padding:"8px 28px",borderRadius:99,fontWeight:800,fontSize:14,letterSpacing:2,textTransform:"uppercase",background:customer.status==="PAID"?"#dcfce7":"#fee2e2",color:customer.status==="PAID"?"#059669":"#e11d48",border:`2px solid ${customer.status==="PAID"?"#059669":"#e11d48"}`}}>
                {customer.status==="PAID"?"✅ LUNAS / PAID":"⏳ BELUM LUNAS / UNPAID"}
              </span>
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
                    <div style={{textAlign:"center",marginBottom:20}}>
                      <span style={{display:"inline-block",padding:"7px 24px",borderRadius:99,fontWeight:800,fontSize:13,letterSpacing:2,background:historyView.customer.status==="PAID"?T.badgeLunasBg:T.badgeUnpaidBg,color:historyView.customer.status==="PAID"?T.badgeLunasColor:T.badgeUnpaidColor,border:`2px solid ${historyView.customer.status==="PAID"?T.badgeLunasColor:T.badgeUnpaidColor}`}}>
                        {historyView.customer.status==="PAID"?"✅ LUNAS / PAID":"⏳ BELUM LUNAS / UNPAID"}
                      </span>
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
                        <p style={{fontSize:12,color:T.textSecondary,marginTop:6}}>Riwayat akan muncul selepas klik 🔄 Invois Baru</p>
                      </div>
                    ):(
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {history.filter(h=>{const q=historySearch.toLowerCase();return!q||h.invoiceNo.toLowerCase().includes(q)||(h.customer.name||"").toLowerCase().includes(q);}).map(h=>(
                          <div key={h.id} style={{border:`1.5px solid ${T.cardBorder}`,borderRadius:12,overflow:"hidden",background:T.cardBg}}>
                            <div style={{display:"flex",alignItems:"center",padding:"12px 16px",gap:12}}>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                                  <span style={{fontSize:13,fontWeight:700,color:T.accent}}>{h.invoiceNo}</span>
                                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,fontWeight:700,background:h.customer.status==="PAID"?T.badgeLunasBg:T.badgeUnpaidBg,color:h.customer.status==="PAID"?T.badgeLunasColor:T.badgeUnpaidColor}}>{h.customer.status==="PAID"?"LUNAS":"BELUM"}</span>
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
                        {[["📋 Jumlah Invois",history.length],["✅ Lunas",history.filter(h=>h.customer.status==="PAID").length],["💰 Jumlah Terima",formatBND(history.filter(h=>h.customer.status==="PAID").reduce((s,h)=>s+h.total,0))]].map(([l,v])=>(
                          <div key={l} style={{background:T.statBg,border:`1px solid ${T.cardBorder}`,borderRadius:10,padding:"10px",textAlign:"center"}}>
                            <div style={{fontSize:10,color:T.textSecondary,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
                            <div style={{fontSize:15,fontWeight:700,color:T.accent,marginTop:4}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{marginTop:20,paddingTop:16,borderTop:`1px dashed ${T.dividerDanger}`,textAlign:"center"}}>
                      <p style={{fontSize:11,color:T.textMuted,marginBottom:10}}>⚠️ Danger Zone</p>
                      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                        <button onClick={deleteAllHistory} style={{padding:"7px 16px",background:T.badgeUnpaidBg,border:"1.5px solid #e11d48",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,color:"#e11d48"}}>🗑️ Padam Semua Riwayat</button>
                        <button onClick={clearAllData} style={{padding:"7px 16px",background:"#1f2937",border:"1.5px solid #374151",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,color:"#f9fafb"}}>💣 Reset Semua Data App</button>
                      </div>
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

        {/* ════ DASHBOARD MODAL ════ */}
        {showDashboard&&<DashboardModal history={history} formatBND={formatBND} T={T} onClose={()=>setShowDashboard(false)}/>}

        {/* ════ TOAST ════ */}
        <ToastContainer toasts={toasts} onRemove={removeToast}/>

        <style>{`@media(max-width:768px){.layout-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </>
  );
}

/* ══════ DASHBOARD ══════ */
function DashboardModal({history,formatBND,T,onClose}) {
  const [period,setPeriod] = useState("today");
  const bntNow = ()=>new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Brunei"}));
  const filtered = useMemo(()=>{
    const now=bntNow(),startOf=u=>{const d=new Date(now);if(u==="today"){d.setHours(0,0,0,0);return d;}if(u==="week"){d.setDate(d.getDate()-d.getDay());d.setHours(0,0,0,0);return d;}if(u==="month"){d.setDate(1);d.setHours(0,0,0,0);return d;}if(u==="year"){d.setMonth(0,1);d.setHours(0,0,0,0);return d;}return new Date(0);},from=startOf(period);
    return history.filter(h=>new Date(h.id)>=from);
  },[history,period]);
  const paid=filtered.filter(h=>h.customer.status==="PAID"),unp=filtered.filter(h=>h.customer.status!=="PAID");
  const rev=paid.reduce((s,h)=>s+h.total,0),unrev=unp.reduce((s,h)=>s+h.total,0),avg=paid.length>0?rev/paid.length:0;
  const svcMap={};filtered.forEach(h=>h.rows.forEach(r=>{svcMap[r.name]=(svcMap[r.name]||0)+(r.lineNet??r.price*r.qty);}));
  const top=Object.entries(svcMap).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const last7=Array.from({length:7},(_,i)=>{const d=bntNow();d.setDate(d.getDate()-(6-i));d.setHours(0,0,0,0);const nx=new Date(d);nx.setDate(nx.getDate()+1);const rv=history.filter(h=>{const hd=new Date(h.id);return hd>=d&&hd<nx&&h.customer.status==="PAID";}).reduce((s,h)=>s+h.total,0);return{label:["Ahd","Isn","Sel","Rab","Kha","Jum","Sab"][d.getDay()],rev:rv};});
  const maxR=Math.max(...last7.map(d=>d.rev),1);
  const PERIODS=[["today","Hari Ini"],["week","Minggu Ini"],["month","Bulan Ini"],["year","Tahun Ini"],["all","Semua"]];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:T.modalBg,borderRadius:18,width:"100%",maxWidth:700,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        <div style={{background:"linear-gradient(135deg,#1d4ed8,#6366f1)",padding:"18px 24px",borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <div><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"white",margin:0}}>📊 Dashboard Ringkasan</h3><p style={{fontSize:11,color:"#c7d2fe",margin:"2px 0 0"}}>SALES SUMMARY · Samlia Wellness</p></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,width:34,height:34,cursor:"pointer",color:"white",fontSize:18,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:24}}>
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
            {PERIODS.map(([v,l])=><button key={v} onClick={()=>setPeriod(v)} style={{padding:"7px 16px",borderRadius:99,border:"2px solid #1d4ed8",cursor:"pointer",fontWeight:700,fontSize:12,background:period===v?"#1d4ed8":T.cardBg,color:period===v?"white":"#1d4ed8"}}>{l}</button>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:20}}>
            {[{l:"💰 Jumlah Terima (Lunas)",v:formatBND(rev),c:"#059669",bg:T.badgeLunasBg},{l:"⏳ Belum Dibayar",v:formatBND(unrev),c:"#e11d48",bg:T.badgeUnpaidBg},{l:"📋 Total Invois",v:filtered.length,c:"#3b82f6",bg:T.dark?"#1e3a5f":"#eff6ff"},{l:"📈 Purata Per Invois",v:formatBND(avg),c:"#7c3aed",bg:T.dark?"#2e1065":"#f5f3ff"}].map(({l,v,c,bg})=>(
              <div key={l} style={{background:bg,borderRadius:14,padding:"16px 18px",border:`1.5px solid ${c}44`}}>
                <div style={{fontSize:11,color:T.textSecondary,marginBottom:6}}>{l}</div>
                <div style={{fontSize:20,fontWeight:800,color:c,fontFamily:"'Cormorant Garamond',serif"}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:T.chartBg,borderRadius:14,padding:18,marginBottom:20,border:`1px solid ${T.cardBorder}`}}>
            <p style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:14,textTransform:"uppercase",letterSpacing:1}}>📅 Hasil 7 Hari Terakhir (Lunas)</p>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:90}}>
              {last7.map(({label,rev})=>(
                <div key={label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:9,color:T.textSecondary,fontWeight:700}}>{rev>0?formatBND(rev).replace("B$ ",""):""}</div>
                  <div style={{width:"100%",background:rev>0?T.chartBar:T.chartBarEmpty,borderRadius:"4px 4px 0 0",height:`${Math.max((rev/maxR)*64,rev>0?8:4)}px`,transition:"height .4s ease"}}/>
                  <div style={{fontSize:10,color:T.textSecondary,fontWeight:600}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          {top.length>0&&(
            <div style={{background:T.cardBg,border:`1px solid ${T.cardBorder}`,borderRadius:14,padding:18,marginBottom:20}}>
              <p style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:14,textTransform:"uppercase",letterSpacing:1}}>🌸 Perkhidmatan Terlaris</p>
              {top.map(([name,rv],i)=>(
                <div key={name} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:T.textPrimary,fontWeight:600}}>#{i+1} {name}</span><span style={{fontSize:12,color:T.accent,fontWeight:700}}>{formatBND(rv)}</span></div>
                  <div style={{height:6,background:T.chartBarEmpty,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round((rv/(top[0][1]||1))*100)}%`,background:`hsl(${35-i*6},75%,${T.dark?55:45}%)`,borderRadius:99,transition:"width .5s ease"}}/></div>
                </div>
              ))}
            </div>
          )}
          <div style={{background:T.cardBg,border:`1px solid ${T.cardBorder}`,borderRadius:14,padding:18}}>
            <p style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:14,textTransform:"uppercase",letterSpacing:1}}>🧾 Transaksi Terbaru</p>
            {filtered.length===0?<p style={{textAlign:"center",color:T.textSecondary,fontStyle:"italic",padding:"20px 0",fontSize:13}}>Tiada transaksi dalam tempoh ini</p>:filtered.slice(0,8).map(h=>(
              <div key={h.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.divider}`}}>
                <div><div style={{fontSize:12,fontWeight:700,color:T.accent}}>{h.invoiceNo}</div><div style={{fontSize:11,color:T.textSecondary}}>{h.customer.name||"–"} · {h.rows.length} item</div></div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.textPrimary}}>{formatBND(h.total)}</div>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,fontWeight:700,background:h.customer.status==="PAID"?T.badgeLunasBg:T.badgeUnpaidBg,color:h.customer.status==="PAID"?T.badgeLunasColor:T.badgeUnpaidColor}}>{h.customer.status==="PAID"?"LUNAS":"BELUM"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}