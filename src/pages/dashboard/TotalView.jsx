import { useEffect, useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useUserGrowthQuery } from "../../redux/api/userApi";
import { Select, Spin } from "antd";
import { IoChevronDown } from "react-icons/io5";

const monthShortNames = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { month, count } = payload[0].payload;
    return (
      <div className="bg-[#393d4a] shadow-md p-3 rounded-md border border-[#ffbf00] text-[#ffbf00]">
        <p className="font-medium">Month: {month}</p>
        <p className="font-medium">Users: {count}</p>
      </div>
    );
  }
  return null;
};

const TotalView = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartHeight, setChartHeight] = useState(220);

  const { data: growthData, isLoading } = useUserGrowthQuery({ year: selectedYear });

  const chartData = useMemo(() => {
    const growth = growthData?.data?.monthlyGrowth || [];
    return growth.map((item) => ({
      month: monthShortNames[item.month] || item.month,
      count: item.count,
    }));
  }, [growthData]);

  const maxCount = useMemo(() => {
    const counts = chartData.map((item) => item.count);
    return counts.length > 0 ? Math.max(...counts, 10) : 10;
  }, [chartData]);

  const years = useMemo(() => {
    const startYear = 2024;
    const endYear = currentYear + 1;
    const yearList = [];
    for (let y = endYear; y >= startYear; y--) {
      yearList.push({ value: y, label: String(y) });
    }
    return yearList;
  }, [currentYear]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 220) {
        setChartHeight(250); // Adjust height for mobile
      } else if (window.innerWidth < 768) {
        setChartHeight(220); // Adjust height for smaller tablets
      } else {
        setChartHeight(220); // Default height for larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount to set the initial height

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">User Growth</h2>
        <Select
          value={selectedYear}
          onChange={(val) => setSelectedYear(val)}
          options={years}
          suffixIcon={<IoChevronDown className="text-white" />}
          className="year-select"
          dropdownClassName="year-select-dropdown"
          style={{ width: 120 }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center" style={{ height: chartHeight }}>
          <Spin size="large" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <XAxis
              tickLine={false}
              axisLine={false}
              dataKey="month"
              className="text-[#ffbf00] text-xs"
              tick={{ fill: '#ffbf00' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, maxCount + 2]}
              className="text-[#ffbf00] text-xs"
              tick={{ fill: '#ffbf00' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 191, 0, 0.1)' }} />
            <Bar
              barSize={20}
              radius={[4, 4, 0, 0]}
              dataKey="count"
              fill="#ffbf00"
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      <style jsx global>{`
        .year-select .ant-select-selector {
          background-color: #393d4a !important;
          color: white !important;
          border: 1px solid #ffbf00 !important;
          border-radius: 6px !important;
        }
        .year-select .ant-select-selection-item {
          color: white !important;
          font-weight: 600;
        }
        .year-select-dropdown {
          background-color: #393d4a !important;
          z-index: 9999 !important;
        }
        .year-select-dropdown .ant-select-item {
          color: white !important;
        }
        .year-select-dropdown .ant-select-item-option-selected {
          background-color: #ffbf00 !important;
          color: white !important;
        }
        .year-select-dropdown .ant-select-item-option-active {
          background-color: #4a5060 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default TotalView;
