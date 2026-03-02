import React, { useState } from "react";
import {
  useGetEnergyCardQuery,
  useGetEnergycardWishlistQuery,
  useGetEnergycardWishlistStatsQuery,
} from "../../redux/api/energyCardApi";
import { FiCreditCard, FiCheckCircle, FiAlertCircle, FiMail, FiChevronLeft, FiChevronRight, FiBookmark } from "react-icons/fi";
import { BsLightningChargeFill } from "react-icons/bs";
import dayjs from "dayjs";

const StatCard = ({ icon: Icon, label, value, accent, bg }) => (
  <div
    className="flex flex-col gap-4 rounded-2xl p-6 border border-[#ffbf00]/20 shadow-lg"
    style={{ background: bg }}
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: accent + "22" }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>
    </div>
    <p className="text-4xl font-extrabold" style={{ color: accent }}>
      {value?.toLocaleString() ?? "—"}
    </p>
  </div>
);

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="w-12 h-12 border-4 border-[#ffbf00] border-t-transparent rounded-full animate-spin" />
  </div>
);

const Card = () => {
  const [page, setPage] = useState(1);

  const { data: cardData, isLoading: cardLoading, isError: cardError } = useGetEnergyCardQuery();
  const { data: wishlistStatsData } = useGetEnergycardWishlistStatsQuery();
  const { data: wishlistData, isLoading: wishlistLoading } = useGetEnergycardWishlistQuery(page);

  const stats = cardData?.data;
  const wishlistTotal = wishlistStatsData?.data?.total ?? 0;
  const entries = wishlistData?.data?.entries ?? [];
  const pagination = wishlistData?.data?.pagination ?? {};

  const soldPercent =
    stats?.total > 0 ? Math.round((stats.sold / stats.total) * 100) : 0;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (soldPercent / 100) * circumference;

  if (cardLoading) return <Spinner />;

  if (cardError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-red-400">
        <FiAlertCircle size={40} />
        <p className="text-lg font-semibold">Failed to load energy card stats</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BsLightningChargeFill size={26} className="text-[#ffbf00]" />
        <h1 className="text-2xl font-bold text-[#ffbf00]">Energy Card Statistics</h1>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={FiCreditCard}   label="Total Cards" value={stats?.total}     accent="#ffbf00" bg="#393d4a" />
        <StatCard icon={FiCheckCircle}  label="Sold"        value={stats?.sold}      accent="#4ade80" bg="#393d4a" />
        <StatCard icon={FiCreditCard}   label="Remaining"   value={stats?.remaining} accent="#60a5fa" bg="#393d4a" />
        <StatCard icon={FiBookmark}     label="Wishlisted"  value={wishlistTotal}    accent="#a78bfa" bg="#393d4a" />
      </div>

      {/* ── Sales Breakdown ── */}
      <div className="bg-[#393d4a] rounded-2xl border border-[#ffbf00]/20 shadow-lg p-6 flex flex-col md:flex-row items-center gap-8">
        {/* Circular progress */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width="120" height="120" className="-rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#2d3140" strokeWidth="10" />
            <circle
              cx="60" cy="60" r={radius}
              fill="none" stroke="#ffbf00" strokeWidth="10"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-extrabold text-[#ffbf00]">{soldPercent}%</span>
            <span className="text-xs text-gray-400 mt-0.5">Sold</span>
          </div>
        </div>

        {/* Bars */}
        <div className="flex flex-col gap-4 w-full">
          <p className="text-gray-300 text-sm font-medium uppercase tracking-widest">Sales Breakdown</p>
          {[
            { label: "Sold",      value: stats?.sold,      color: "#4ade80", pct: soldPercent },
            { label: "Remaining", value: stats?.remaining, color: "#60a5fa", pct: 100 - soldPercent },
          ].map(({ label, value, color, pct }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold" style={{ color }}>{label}</span>
                <span className="text-gray-300">{value?.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-[#2d3140] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wishlist Table ── */}
      <div className="bg-[#393d4a] rounded-2xl border border-[#ffbf00]/20 shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-[#ffbf00]/10">
          <FiBookmark className="text-[#a78bfa]" size={18} />
          <h2 className="text-lg font-bold text-[#ffbf00]">Wishlist Entries</h2>
          <span className="ml-auto text-xs text-gray-400 bg-[#2d3140] px-2 py-1 rounded-full">
            {pagination.total ?? wishlistTotal} total
          </span>
        </div>

        {wishlistLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#a78bfa] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_1fr] gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-[#ffffff08]">
              <span>#</span>
              <span>Email</span>
              <span className="text-right">Joined</span>
            </div>

            {/* Rows */}
            {entries.map((entry, idx) => (
              <div
                key={entry._id}
                className="grid grid-cols-[auto_1fr_1fr] gap-4 px-6 py-4 items-center border-b border-[#ffffff06] hover:bg-[#ffffff08] transition-colors"
              >
                <span className="text-sm text-gray-500 w-6">
                  {(pagination.page - 1) * (pagination.limit ?? 10) + idx + 1}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#a78bfa22] flex items-center justify-center shrink-0">
                    <FiMail size={14} className="text-[#a78bfa]" />
                  </div>
                  <span className="text-sm text-gray-200 truncate">{entry.email}</span>
                </div>
                <span className="text-sm text-gray-400 text-right">
                  {dayjs(entry.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
            ))}

            {entries.length === 0 && (
              <p className="text-center text-gray-500 py-10 text-sm">No wishlist entries found.</p>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-xs text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#2d3140] text-gray-300 disabled:opacity-40 hover:bg-[#ffbf00]/10 hover:text-[#ffbf00] transition-colors"
                  >
                    <FiChevronLeft size={15} /> Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={pagination.page >= pagination.pages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#2d3140] text-gray-300 disabled:opacity-40 hover:bg-[#ffbf00]/10 hover:text-[#ffbf00] transition-colors"
                  >
                    Next <FiChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
