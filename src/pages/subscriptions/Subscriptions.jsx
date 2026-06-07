import { ConfigProvider, Modal, Table } from "antd";
import { useMemo, useState, useEffect } from "react";
import { IoSearch, IoChevronBack, IoGridOutline, IoListOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiCalendar,
  FiCreditCard,
  FiUser,
  FiRefreshCw,
  FiStar,
  FiZap,
  FiSend,
} from "react-icons/fi";
import { useGetAllSubscriberQuery, useUpdateSubscriberMutation } from "../../redux/api/allSubscriberApi";

/* ── brand gradients ── */
const ACCENT_COLOR   = "#fc9e0a";
const GRAD_PRIMARY   = "linear-gradient(135deg, #ffbf00 0%, #ff8c00 100%)";
const GRAD_EXPIRED   = "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
const GRAD_PRO       = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
const GRAD_CARD_HDR  = `linear-gradient(135deg, ${ACCENT_COLOR} 0%, #f97316 100%)`;

/* ─── helpers ─────────────────────────────────────────────────────────── */

const planMeta = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("pro"))
    return { icon: <FiSend />, grad: GRAD_PRO, accent: "#d97706", light: "rgba(245,158,11,0.12)", text: "#92400e" };
  if (n.includes("premium"))
    return { icon: <FiStar />, grad: GRAD_CARD_HDR, accent: "#fc9e0a", light: "rgba(252,158,10,0.15)", text: "#c47008" };
  return { icon: <FiZap />, grad: GRAD_EXPIRED, accent: "#6b7280", light: "rgba(107,114,128,0.12)", text: "#374151" };
};

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

const StatusPill = ({ status }) => {
  const map = {
    Active:    { bg: "rgba(74,222,128,0.18)",  color: "#16a34a", dot: "#4ade80" },
    Expired:   { bg: "rgba(248,113,113,0.18)", color: "#dc2626", dot: "#f87171" },
    Available: { bg: "#ffffff",                 color: "#111111", dot: "#fc9e0a" },
  };
  const s = map[status] ?? { bg: "rgba(200,200,200,0.2)", color: "#666", dot: "#aaa" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:s.bg, color:s.color, fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, border: status === "Available" ? "1px solid rgba(252,158,10,0.2)" : undefined }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
      {status}
    </span>
  );
};

/* ─── single card ──────────────────────────────────────────────────────── */

const SubscriptionCard = ({ record, onEdit }) => {
  const meta = planMeta(record.name);
  const isExpired = record.status === "Expired";

  return (
    <div
      style={{
        background: "#23262f",
        border: "0.5px solid rgba(252,158,10,0.15)",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(252,158,10,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* header */}
      <div style={{ background: isExpired ? GRAD_EXPIRED : meta.grad, padding: "20px 18px 16px", position: "relative", borderBottom: `2px solid ${ACCENT_COLOR}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(252,158,10,0.18)", color:"#fff", fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, border: `1px solid ${ACCENT_COLOR}` }}>
            <span style={{ fontSize:13 }}>{meta.icon}</span>
            {record.name}
          </div>
          <StatusPill status={record.status} />
        </div>
        <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
          <span style={{ color:"#fff", fontSize:30, fontWeight:700, lineHeight:1 }}>{record.price}</span>
          <span style={{ color:"rgba(255,255,255,0.75)", fontSize:13 }}>/mo</span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding:"14px 18px", flex:1 }}>
        {record.user && record.user !== "—" && (
          <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:12, borderBottom:"0.5px solid rgba(252,158,10,0.1)", marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background: isExpired ? "rgba(107,114,128,0.15)" : "rgba(252,158,10,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color: isExpired ? "#9ca3af" : "#c47008", flexShrink:0 }}>
              {initials(record.user)}
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:"#fff" }}>{record.user}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Subscriber</div>
            </div>
          </div>
        )}

        {[
          { icon: <FiCalendar size={14} />, label: "Start",   value: record.startDate },
          { icon: <FiCalendar size={14} />, label: "End",     value: record.endDate },
          { icon: <FiCreditCard size={14}/>, label: "Payment", value: record.paymentMethod },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"0.5px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, color:"rgba(255,255,255,0.4)", fontSize:13 }}>
              <span style={{ color: isExpired ? "#9ca3af" : "#fc9e0a" }}>{icon}</span>
              {label}
            </div>
            <div style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.8)" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* footer */}
      <div style={{ padding:"12px 18px", borderTop:"0.5px solid rgba(252,158,10,0.1)", display:"flex", gap:8 }}>
        <button
          onClick={() => onEdit(record)}
          style={{ flex:1, padding:"8px 0", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", border:"none", background: isExpired ? GRAD_EXPIRED : meta.grad, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
        >
          {isExpired ? <><FiRefreshCw size={13} /> Renew</> : <><FiEdit2 size={13} /> Edit</>}
        </button>
      </div>
    </div>
  );
};

/* ─── main component ───────────────────────────────────────────────────── */

function Subscriptions() {
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [editForm, setEditForm] = useState({ priceInEuros: "", description: "", eligibility: "" });

  const showViewModal = (subscription) => {
    setSelectedSubscription(subscription);
    const src = subscription?.raw ?? subscription ?? {};
    setEditForm({
      priceInEuros: src.priceEuros ?? (typeof src.priceCents === "number" ? src.priceCents / 100 : undefined) ?? (typeof src.price === "number" ? src.price : undefined) ?? "",
      description: src.description ?? "",
      eligibility: src.eligibility ?? "",
    });
    setIsViewModalOpen(true);
  };
  const handleViewCancel = () => { setIsViewModalOpen(false); setSelectedSubscription(null); };

  const [dataSource, setDataSource] = useState([
    { key:"1", name:"Premium Plan", user:"John Doe",       status:"Active",  price:"$29.99", startDate:"2024-01-12", endDate:"2025-01-12", paymentMethod:"Credit Card"   },
    { key:"2", name:"Basic Plan",   user:"Emma Smith",     status:"Expired", price:"$9.99",  startDate:"2024-02-15", endDate:"2024-05-15", paymentMethod:"PayPal"         },
    { key:"3", name:"Pro Plan",     user:"Liam Johnson",   status:"Active",  price:"$49.99", startDate:"2024-03-20", endDate:"2025-03-20", paymentMethod:"Bank Transfer"  },
  ]);

  const { data: subscribersData } = useGetAllSubscriberQuery();
  const [updateSubscriber, { isLoading: isUpdating }] = useUpdateSubscriberMutation();

  const mappedSubscribers = useMemo(() => {
    const payload = subscribersData ?? {};
    const dataObj = payload.data ?? payload;
    const list = Array.isArray(dataObj) ? dataObj : dataObj.subscriptionPlans ?? dataObj.plans ?? dataObj.items ?? [];
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.map((item, idx) => ({
      key:           item.id ?? item._id ?? String(idx + 1),
      name:          item.name ?? item.planName ?? item.title ?? `Plan ${idx + 1}`,
      user:          item.user?.name ?? item.user ?? item.owner ?? "—",
      status:        item.status ?? item.state ?? (item.type ? "Available" : "Active"),
      price:         item.priceEuros ? `€${item.priceEuros}` : item.price ? String(item.price) : item.priceCents ? `€${(item.priceCents / 100).toFixed(2)}` : item.amount ?? item.cost ?? "—",
      startDate:     item.startDate ?? item.from ?? "—",
      endDate:       item.endDate ?? item.to ?? "—",
      paymentMethod: item.paymentMethod ?? item.payment ?? "—",
      raw:           item,
    }));
  }, [subscribersData]);

  useEffect(() => { if (mappedSubscribers?.length > 0) setDataSource(mappedSubscribers); }, [mappedSubscribers]);

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return dataSource.filter((r) =>
      q ? [r.name, r.user, r.status, r.price, r.paymentMethod].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)) : true
    );
  }, [dataSource, searchQuery]);

  const columns = [
    { title:"No",         key:"no",            width:60,  render:(_,_r,i) => i+1 },
    { title:"Plan Name",  dataIndex:"name",    key:"name",   render:(v) => <span className="font-medium">{v}</span> },
    { title:"User",       dataIndex:"user",    key:"user" },
    { title:"Status",     dataIndex:"status",  key:"status", render:(s) => <StatusPill status={s} /> },
    { title:"Price",      dataIndex:"price",   key:"price" },
    { title:"Start Date", dataIndex:"startDate", key:"startDate" },
    { title:"End Date",   dataIndex:"endDate",   key:"endDate" },
    { title:"Action", key:"action", render:(_,record) => (
      <button onClick={() => showViewModal(record)}>
        <FiEdit2 className="text-[#fc9e0a] w-5 h-5 cursor-pointer" />
      </button>
    )},
  ];

  /* shared input style for modal */
  const inputStyle = { width:"100%", padding:"8px 10px", borderRadius:6, border:"1px solid rgba(252,158,10,0.25)", background:"rgba(252,158,10,0.04)", color:"#111", fontSize:14, outline:"none" };
  const fieldBox = { background:"#fafafa", border:"0.5px solid #f0e0b0", borderRadius:10, padding:"12px 16px" };

  return (
    <div>
      {/* ── top bar ── */}
      <div
        style={{ background: GRAD_CARD_HDR, padding:"12px 20px", borderRadius:8, marginBottom:16, display:"flex", flexWrap:"wrap", alignItems:"center", gap:12 }}
      >
        <button onClick={() => navigate(-1)} style={{ color:"#fff", background:"none", border:"none", cursor:"pointer", display:"flex" }}>
          <IoChevronBack size={24} />
        </button>
        <h1 style={{ color:"#fff", fontSize:22, fontWeight:700, margin:0 }}>Subscription Management</h1>

        {/* mobile search */}
        <div className="relative w-full md:hidden mt-1">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search subscriptions..."
            className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none" />
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto">
          {/* desktop search */}
          <div className="relative hidden md:block">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search subscriptions..."
              className="bg-white text-[#0D0D0D] placeholder-gray-400 pl-10 pr-3 py-2 rounded-md focus:outline-none" />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* view toggle */}
          <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.2)", borderRadius:6, padding:2, gap:2 }}>
            {[["card", <IoGridOutline size={18} />], ["table", <IoListOutline size={18} />]].map(([mode, icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{ padding:"6px", borderRadius:4, border:"none", cursor:"pointer", background: viewMode === mode ? "#fff" : "transparent", color: viewMode === mode ? "#fc9e0a" : "#fff", display:"flex", alignItems:"center" }}>
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── card view ── */}
      {viewMode === "card" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
          {filteredData.length === 0
            ? <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, gridColumn:"1/-1", textAlign:"center", padding:"2rem" }}>No subscriptions found.</p>
            : filteredData.map((record) => <SubscriptionCard key={record.key} record={record} onEdit={showViewModal} />)
          }
        </div>
      )}

      {/* ── table view ── */}
      {viewMode === "table" && (
        <ConfigProvider theme={{ components: {
          Pagination: { colorPrimaryBorder:"#fc9e0a", colorBorder:"#fc9e0a", colorPrimaryHover:"#f97316", colorPrimary:"#fc9e0a" },
          Table: { headerBg:"#fc9e0a", headerColor:"#ffffff", cellFontSize:14, headerSplitColor:"rgba(255,255,255,0.2)", colorTextHeading:"#ffffff", colorBgContainer:"#23262f", colorText:"#ffffff", rowHoverBg:"rgba(252,158,10,0.08)", borderColor:"rgba(252,158,10,0.12)" },
        }}}>
          <Table dataSource={filteredData} columns={columns} pagination={{ pageSize:10 }} scroll={{ x:"max-content" }} rowClassName="cursor-pointer" />
        </ConfigProvider>
      )}

      {/* ── edit modal ── */}
      <Modal open={isViewModalOpen} centered onCancel={handleViewCancel} footer={null} width={620}
        styles={{ content:{ padding:0, borderRadius:14, overflow:"hidden" }, mask:{ backdropFilter:"blur(4px)" } }}>
        {selectedSubscription && (() => {
          const meta = planMeta(selectedSubscription.name);
          return (
            <div>
              {/* modal header — accent gradient */}
              <div style={{ background: meta.grad, borderBottom:`2px solid ${ACCENT_COLOR}`, padding:"22px 24px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:20, color:"#fff" }}>{meta.icon}</span>
                  <h2 style={{ fontSize:20, fontWeight:700, color:"#fff", margin:0 }}>{selectedSubscription.name}</h2>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <StatusPill status={selectedSubscription.status} />
                  {selectedSubscription.user && selectedSubscription.user !== "—" && (
                    <span style={{ color:"rgba(255,255,255,0.88)", fontSize:13, display:"flex", alignItems:"center", gap:5 }}>
                      <FiUser size={12} /> {selectedSubscription.user}
                    </span>
                  )}
                </div>
              </div>

              {/* form body */}
              <div style={{ padding:"20px 24px" }}>
                <div style={{ display:"grid", gap:12, marginBottom:20 }}>

                  <div style={fieldBox}>
                    <div style={{ fontSize:11, color:ACCENT_COLOR, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Plan Name</div>
                    <div style={{ fontSize:15, fontWeight:600, color:"#111" }}>{selectedSubscription.name}</div>
                  </div>

                  <div style={fieldBox}>
                    <div style={{ fontSize:11, color:ACCENT_COLOR, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Price (EUR)</div>
                    <input type="number" step="0.01" value={editForm.priceInEuros}
                      onChange={(e) => setEditForm((s) => ({ ...s, priceInEuros: e.target.value }))}
                      style={inputStyle} />
                  </div>

                  <div style={fieldBox}>
                    <div style={{ fontSize:11, color:ACCENT_COLOR, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Description</div>
                    <textarea value={editForm.description} rows={3}
                      onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))}
                      style={{ ...inputStyle, resize:"vertical" }} />
                  </div>

                  <div style={fieldBox}>
                    <div style={{ fontSize:11, color:ACCENT_COLOR, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>Eligibility</div>
                    <input value={editForm.eligibility}
                      onChange={(e) => setEditForm((s) => ({ ...s, eligibility: e.target.value }))}
                      style={inputStyle} />
                  </div>
                </div>

                {/* footer */}
                <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:16, borderTop:"0.5px solid rgba(252,158,10,0.3)" }}>
                  <button onClick={handleViewCancel}
                    style={{ padding:"9px 20px", borderRadius:8, border:"0.5px solid rgba(252,158,10,0.3)", background:"transparent", cursor:"pointer", fontSize:14, color:"#6b7280" }}>
                    Close
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={async () => {
                      if (!selectedSubscription) return;
                      const id = selectedSubscription.raw?.id ?? selectedSubscription.key;
                      const body = { priceInEuros: Number(editForm.priceInEuros), description: editForm.description, eligibility: editForm.eligibility };
                      try {
                        await updateSubscriber({ id, data: body }).unwrap();
                        setDataSource((prev) => prev.map((p) => p.key === id ? { ...p, price:`€${Number(body.priceInEuros)}`, raw:{ ...(p.raw ?? {}), ...body } } : p));
                        handleViewCancel();
                        alert("Plan updated successfully");
                      } catch (err) { console.error("Update failed", err); alert("Failed to update plan"); }
                    }}
                    style={{ padding:"9px 20px", borderRadius:8, border:"none", background: isUpdating ? "#ccc" : meta.grad, color:"#fff", cursor: isUpdating ? "not-allowed" : "pointer", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                    <FiEdit2 size={14} /> {isUpdating ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

export default Subscriptions;
