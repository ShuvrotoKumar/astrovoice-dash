import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiCalendar, FiTrendingUp, FiTrendingDown, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { IoChevronBack } from 'react-icons/io5';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useGetEarningByYearQuery, useGetTransactionsQuery } from '../../redux/api/earningApi';

/* ── brand token ── */
const GOLD = '#ffbf00';
const GOLD_DIM = 'rgba(255,191,0,0.12)';
const GOLD_MID = 'rgba(255,191,0,0.25)';

/* ── custom tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#23262f',
      border: `0.5px solid ${GOLD_MID}`,
      borderRadius: 10,
      padding: '10px 16px',
      fontSize: 13,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</p>
      <p style={{ color: GOLD, fontWeight: 600, fontSize: 16 }}>${payload[0].value}</p>
    </div>
  );
};

const Earnings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;

  const defaultChartData = [
    { name: 'Jan', earnings: 0 },
    { name: 'Feb', earnings: 0 },
    { name: 'Mar', earnings: 0 },
    { name: 'Apr', earnings: 0 },
    { name: 'May', earnings: 0 },
    { name: 'Jun', earnings: 0 },
    { name: 'Jul', earnings: 0 },
    { name: 'Aug', earnings: 0 },
    { name: 'Sep', earnings: 0 },
    { name: 'Oct', earnings: 0 },
    { name: 'Nov', earnings: 0 },
    { name: 'Dec', earnings: 0 },
  ];

  const staticTransactions = [
    { id: 1, bookingId: 'BK-001', customer: 'John Doe',       date: '2025-11-28', amount: 120.0, status: 'Completed' },
    { id: 2, bookingId: 'BK-002', customer: 'Jane Smith',     date: '2025-11-27', amount: 95.5,  status: 'Completed' },
    { id: 3, bookingId: 'BK-003', customer: 'Robert Johnson', date: '2025-11-26', amount: 150.0, status: 'Refunded' },
    { id: 4, bookingId: 'BK-004', customer: 'Emily Davis',    date: '2025-11-25', amount: 85.25,  status: 'Completed' },
    { id: 5, bookingId: 'BK-005', customer: 'Michael Brown',  date: '2025-11-24', amount: 200.0, status: 'Completed' },
    { id: 6, bookingId: 'BK-006', customer: 'Sarah Wilson',   date: '2025-11-23', amount: 75.0,  status: 'Refunded' },
  ];

  // fetch transactions from API and map to a common shape
  const { data: transactionsPayload, isLoading: isTxLoading } = useGetTransactionsQuery({});
  const apiTransactionsRaw =
    transactionsPayload?.data?.transactions ??
    transactionsPayload?.transactions ??
    transactionsPayload?.data ??
    transactionsPayload ?? [];
  const apiTransactions = Array.isArray(apiTransactionsRaw)
    ? apiTransactionsRaw.map((t, idx) => ({
        id: t.id ?? t._id ?? t.transactionId ?? idx + 1,
        bookingId: t.stripeSessionId ?? t.metadata?.planName ?? t.reference ?? `TX-${idx + 1}`,
        paymentIntent: t.stripePaymentIntentId ?? t.paymentIntentId ?? '—',
        customer: t.userId?.fullname ?? t.userId?.name ?? t.customer?.name ?? t.customer ?? t.user ?? '—',
        date: t.createdAt ?? t.updatedAt ?? t.date ?? '—',
        amount: typeof t.amount === 'number' ? t.amount : Number((t.amountCents ? t.amountCents / 100 : t.amount ?? t.amountEuros ?? 0)),
        status: String(t.status ?? t.state ?? (t.refunded ? 'Refunded' : 'Completed')).replace(/^(.)/, s => s.toUpperCase()),
      }))
    : [];

  const transactions = apiTransactions.length > 0 ? apiTransactions : staticTransactions;

  const queryYear = new Date().getFullYear();
  const { data: yearlyPayload, isLoading: isYearlyLoading } = useGetEarningByYearQuery({ year: queryYear });
  const yearlyData = yearlyPayload?.data ?? yearlyPayload ?? {};
  const displayYear = yearlyData?.year ?? queryYear;
  const chartData = yearlyData?.monthlyData?.map(({ month, earningsEuros }) => ({
    name: month?.slice(0, 3) ?? '—',
    earnings: Number(earningsEuros ?? 0),
  })) ?? defaultChartData;

  const totalEarnings = transactions
    .filter(tx => tx.status === 'Completed')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const apiTotalEarnings = yearlyData?.totalYearlyEarningsEuros ?? null;
  const apiMonthlyEarnings = yearlyData?.monthlyData?.find(m =>
    String(m.month).toLowerCase() === new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()).toLowerCase()
  )?.earningsEuros ?? null;

  const filteredTx = useMemo(() => {
    return transactions.filter(tx => {
      const q = searchTerm.toLowerCase();
      const matchSearch = q
        ? [tx.bookingId, tx.paymentIntent, tx.customer, tx.date, tx.status].some(v => String(v).toLowerCase().includes(q))
        : true;
      const matchDate = dateFilter ? String(tx.date).includes(dateFilter) : true;
      return matchSearch && matchDate;
    });
  }, [searchTerm, dateFilter, transactions]);

  const totalPages = Math.max(1, Math.ceil(filteredTx.length / PAGE_SIZE));
  const paginated = filteredTx.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /* shared card style */
  const card = {
    background: '#23262f',
    border: '0.5px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '20px 22px',
  };

  const statCards = [
    {
      label: 'Total Earnings',
      value: apiTotalEarnings !== null ? `€${Number(apiTotalEarnings).toFixed(2)}` : `$${totalEarnings.toFixed(2)}`,
      sub: '+12% from last week',
      up: true,
      icon: <FiDollarSign size={20} />,
      iconBg: GOLD_DIM,
      iconColor: GOLD,
    },
    {
      label: 'Monthly Earnings',
      value: apiMonthlyEarnings !== null ? `€${Number(apiMonthlyEarnings).toFixed(2)}` : '€0.00',
      sub: '+4 from last week',
      up: true,
      icon: <FiCheckCircle size={20} />,
      iconBg: 'rgba(29,158,117,0.12)',
      iconColor: '#1D9E75',
    },
    // {
    //   label: 'Average per Ride',
    //   value: `$${(totalEarnings / 24).toFixed(2)}`,
    //   sub: '-2% from last week',
    //   up: false,
    //   icon: <FiActivity size={20} />,
    //   iconBg: 'rgba(139,92,246,0.12)',
    //   iconColor: '#8b5cf6',
    // },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── top bar ── */}
      <div
        style={{
          background: GOLD,
          padding: '12px 20px',
          borderRadius: 8,
          marginBottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <IoChevronBack size={24} />
        </button>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0, flex: 1 }}>Earnings</h1>

        {/* controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {/* search */}
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 14 }} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                background: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px 8px 32px',
                fontSize: 13,
                color: '#111',
                width: 200,
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
        {statCards.map(sc => (
          <div key={sc.label} style={{ ...card, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: sc.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sc.iconColor, flexShrink: 0 }}>
              {sc.icon}
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{sc.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{sc.value}</p>
              <p style={{ fontSize: 12, color: sc.up ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
                {sc.up ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                {sc.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── chart ── */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0 }}>{displayYear} Earnings Overview</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: GOLD }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Earnings</span>
          </div>
        </div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,191,0,0.06)' }} />
              <Bar dataKey="earnings" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.earnings === Math.max(...chartData.map(d => d.earnings)) ? GOLD : GOLD_MID}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── recent transactions ── */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        {/* table header */}
        <div style={{ padding: '18px 22px', borderBottom: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: 0, flex: 1 }}>Recent Transactions</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <FiCalendar style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 13 }} />
              <input
                type="text"
                placeholder="Filter by date"
                value={dateFilter}
                onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '7px 12px 7px 32px',
                  fontSize: 13,
                  color: '#fff',
                  width: 160,
                  outline: 'none',
                }}
              />
            </div>
            <button style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              <FiFilter style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }} />
            </button>
          </div>
        </div>

        {/* table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'rgba(255,191,0,0.08)' }}>
                {['Booking ID', 'Payment Intent', 'Customer', 'Date', 'Amount', 'Status'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 22px',
                      textAlign: i >= 3 ? 'right' : 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: GOLD,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
                    No transactions found.
                  </td>
                </tr>
              ) : paginated.map((tx, idx) => (
                <tr
                  key={tx.id}
                  style={{
                    borderTop: '0.5px solid rgba(255,255,255,0.06)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,191,0,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}
                >
                  <td style={{ padding: '14px 22px', color: GOLD, fontWeight: 600, whiteSpace: 'nowrap' }}>{tx.bookingId}</td>
                  <td style={{ padding: '14px 22px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.paymentIntent}</td>
                  <td style={{ padding: '14px 22px', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{tx.customer}</td>
                  <td style={{ padding: '14px 22px', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>{tx.date}</td>
                  <td style={{ padding: '14px 22px', color: '#fff', fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 22px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 500,
                        background: tx.status === 'Completed' ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)',
                        color: tx.status === 'Completed' ? '#4ade80' : '#fbbf24',
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: tx.status === 'Completed' ? '#4ade80' : '#fbbf24', display: 'inline-block' }} />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div style={{
          padding: '14px 22px',
          borderTop: '0.5px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            Showing <b style={{ color: 'rgba(255,255,255,0.6)' }}>{(currentPage - 1) * PAGE_SIZE + 1}</b> to{' '}
            <b style={{ color: 'rgba(255,255,255,0.6)' }}>{Math.min(currentPage * PAGE_SIZE, filteredTx.length)}</b> of{' '}
            <b style={{ color: 'rgba(255,255,255,0.6)' }}>{filteredTx.length}</b> transactions
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: '0.5px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                fontSize: 13,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: page === currentPage ? `0.5px solid ${GOLD}` : '0.5px solid rgba(255,255,255,0.12)',
                  background: page === currentPage ? GOLD_DIM : 'rgba(255,255,255,0.04)',
                  color: page === currentPage ? GOLD : 'rgba(255,255,255,0.5)',
                  fontSize: 13,
                  fontWeight: page === currentPage ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: '0.5px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                fontSize: 13,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;