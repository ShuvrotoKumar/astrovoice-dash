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
import { useGetAllSubscriberQuery } from "../../redux/api/allSubscriberApi";

/* ─── helpers ─────────────────────────────────────────────────────────── */

const planMeta = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("pro"))
    return { icon: <FiSend />, accent: "#1D9E75", light: "rgba(29,158,117,0.12)", text: "#0f6e56" };
  if (n.includes("premium"))
    return { icon: <FiStar />, accent: "#ffbf00", light: "rgba(255,191,0,0.12)", text: "#b58900" };
  return { icon: <FiZap />, accent: "#888780", light: "rgba(136,135,128,0.12)", text: "#5f5e5a" };
};

const initials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const StatusPill = ({ status }) => {
  const map = {
    Active: { bg: "rgba(74,222,128,0.18)", color: "#16a34a", dot: "#4ade80" },
    Expired: { bg: "rgba(248,113,113,0.18)", color: "#dc2626", dot: "#f87171" },
  };
  const s = map[status] ?? { bg: "rgba(200,200,200,0.2)", color: "#666", dot: "#aaa" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 10px",
        borderRadius: 20,
      }}
    >
      <span
        style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }}
      />
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
        background: "var(--card-bg, #23262f)",
        border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.35)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* header */}
      <div
        style={{
          background: isExpired
            ? "linear-gradient(135deg, #555 0%, #333 100%)"
            : `linear-gradient(135deg, ${meta.accent} 0%, ${meta.accent}cc 100%)`,
          padding: "20px 18px 16px",
          position: "relative",
        }}
      >
        {/* top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 500,
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            <span style={{ fontSize: 13 }}>{meta.icon}</span>
            {record.name}
          </div>
          <StatusPill status={record.status} />
        </div>

        {/* price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ color: "#fff", fontSize: 30, fontWeight: 700, lineHeight: 1 }}>
            {record.price}
          </span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>/mo</span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "14px 18px", flex: 1 }}>
        {/* user */}
        {record.user && record.user !== "—" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 12,
              borderBottom: "0.5px solid rgba(255,255,255,0.07)",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: meta.light,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                color: meta.text,
                flexShrink: 0,
              }}
            >
              {initials(record.user)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{record.user}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Subscriber</div>
            </div>
          </div>
        )}

        {/* info rows */}
        {[
          { icon: <FiCalendar size={14} />, label: "Start", value: record.startDate },
          { icon: <FiCalendar size={14} />, label: "End", value: record.endDate },
          { icon: <FiCreditCard size={14} />, label: "Payment", value: record.paymentMethod },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "0.5px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
              <span style={{ color: meta.accent }}>{icon}</span>
              {label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* footer */}
      <div
        style={{
          padding: "12px 18px",
          borderTop: "0.5px solid rgba(255,255,255,0.07)",
          display: "flex",
          gap: 8,
        }}
      >
        <button
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            border: "0.5px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Details
        </button>
        <button
          onClick={() => onEdit(record)}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            border: "none",
            background: isExpired ? "#555" : meta.accent,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
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
  const [viewMode, setViewMode] = useState("card"); // "card" | "table"

  const showViewModal = (subscription) => {
    setSelectedSubscription(subscription);
    setIsViewModalOpen(true);
  };
  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedSubscription(null);
  };

  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      name: "Premium Plan",
      user: "John Doe",
      status: "Active",
      price: "$29.99",
      startDate: "2024-01-12",
      endDate: "2025-01-12",
      paymentMethod: "Credit Card",
    },
    {
      key: "2",
      name: "Basic Plan",
      user: "Emma Smith",
      status: "Expired",
      price: "$9.99",
      startDate: "2024-02-15",
      endDate: "2024-05-15",
      paymentMethod: "PayPal",
    },
    {
      key: "3",
      name: "Pro Plan",
      user: "Liam Johnson",
      status: "Active",
      price: "$49.99",
      startDate: "2024-03-20",
      endDate: "2025-03-20",
      paymentMethod: "Bank Transfer",
    },
  ]);

  const { data: subscribersData } = useGetAllSubscriberQuery();

  const mappedSubscribers = useMemo(() => {
    const payload = subscribersData ?? {};
    const dataObj = payload.data ?? payload;
    const list = Array.isArray(dataObj)
      ? dataObj
      : dataObj.subscriptionPlans ?? dataObj.plans ?? dataObj.items ?? [];
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.map((item, idx) => ({
      key: item.id ?? item._id ?? String(idx + 1),
      name: item.name ?? item.planName ?? item.title ?? `Plan ${idx + 1}`,
      user: item.user?.name ?? item.user ?? item.owner ?? "—",
      status: item.status ?? item.state ?? (item.type ? "Available" : "Active"),
      price: item.priceEuros
        ? `€${item.priceEuros}`
        : item.price
        ? String(item.price)
        : item.priceCents
        ? `€${(item.priceCents / 100).toFixed(2)}`
        : item.amount ?? item.cost ?? "—",
      startDate: item.startDate ?? item.from ?? "—",
      endDate: item.endDate ?? item.to ?? "—",
      paymentMethod: item.paymentMethod ?? item.payment ?? "—",
    }));
  }, [subscribersData]);

  useEffect(() => {
    if (mappedSubscribers?.length > 0) setDataSource(mappedSubscribers);
  }, [mappedSubscribers]);

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return dataSource.filter((r) =>
      q
        ? [r.name, r.user, r.status, r.price, r.paymentMethod]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        : true
    );
  }, [dataSource, searchQuery]);

  /* table columns */
  const columns = [
    { title: "No", key: "no", width: 60, render: (_, _r, i) => i + 1 },
    {
      title: "Plan Name",
      dataIndex: "name",
      key: "name",
      render: (v) => <span className="font-medium">{v}</span>,
    },
    { title: "User", dataIndex: "user", key: "user" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <StatusPill status={s} />,
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button onClick={() => showViewModal(record)}>
          <FiEdit2 className="text-[#ffbf00] w-5 h-5 cursor-pointer" />
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* ── top bar ── */}
      <div className="bg-[#ffbf00] px-4 md:px-5 py-3 rounded-md mb-4 flex flex-wrap md:flex-nowrap items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white hover:opacity-90 transition">
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">Subscription Management</h1>

        {/* mobile search */}
        <div className="relative w-full md:hidden mt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
          />
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto">
          {/* desktop search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscriptions..."
              className="bg-white text-[#0D0D0D] placeholder-gray-400 pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* view toggle */}
          <div className="flex items-center bg-white/20 rounded-md p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded transition ${
                viewMode === "card" ? "bg-white text-[#ffbf00]" : "text-white hover:bg-white/10"
              }`}
              title="Card view"
            >
              <IoGridOutline className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition ${
                viewMode === "table" ? "bg-white text-[#ffbf00]" : "text-white hover:bg-white/10"
              }`}
              title="Table view"
            >
              <IoListOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── card view ── */}
      {viewMode === "card" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {filteredData.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, gridColumn: "1/-1", textAlign: "center", padding: "2rem" }}>
              No subscriptions found.
            </p>
          ) : (
            filteredData.map((record) => (
              <SubscriptionCard key={record.key} record={record} onEdit={showViewModal} />
            ))
          )}
        </div>
      )}

      {/* ── table view ── */}
      {viewMode === "table" && (
        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                colorPrimaryBorder: "#111827",
                colorBorder: "#111827",
                colorPrimaryHover: "#111827",
                colorPrimary: "#111827",
              },
              Table: {
                headerBg: "#ffbf00",
                headerColor: "#ffffff",
                cellFontSize: 14,
                headerSplitColor: "#393d4a",
                colorTextHeading: "#ffffff",
                colorBgContainer: "#393d4a",
                colorText: "#ffffff",
                rowHoverBg: "#4a5060",
                borderColor: "#4a5060",
              },
            },
          }}
        >
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            className="bg-[#393d4a]"
            rowClassName="hover:bg-[#4a5060] cursor-pointer"
          />
        </ConfigProvider>
      )}

      {/* ── edit modal ── */}
      <Modal open={isViewModalOpen} centered onCancel={handleViewCancel} footer={null} width={700}>
        {selectedSubscription && (
          <div>
            {/* modal header */}
            <div
              style={{
                background: planMeta(selectedSubscription.name).accent,
                margin: "-24px -24px 24px",
                padding: "24px",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 20, color: "#fff" }}>
                  {planMeta(selectedSubscription.name).icon}
                </span>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
                  {selectedSubscription.name}
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusPill status={selectedSubscription.status} />
                {selectedSubscription.user && selectedSubscription.user !== "—" && (
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, display: "flex", alignItems: "center", gap: 5 }}>
                    <FiUser size={13} /> {selectedSubscription.user}
                  </span>
                )}
              </div>
            </div>

            {/* detail grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                { label: "Plan Name", value: selectedSubscription.name },
                { label: "Price", value: selectedSubscription.price },
                { label: "Start Date", value: selectedSubscription.startDate },
                { label: "End Date", value: selectedSubscription.endDate },
                { label: "Payment Method", value: selectedSubscription.paymentMethod },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#f9fafb",
                    border: "0.5px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* footer actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                paddingTop: 16,
                borderTop: "0.5px solid #e5e7eb",
              }}
            >
              <button
                onClick={handleViewCancel}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "0.5px solid #d1d5db",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#374151",
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log("Save:", selectedSubscription);
                  handleViewCancel();
                }}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: planMeta(selectedSubscription.name).accent,
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FiEdit2 size={14} /> Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Subscriptions;