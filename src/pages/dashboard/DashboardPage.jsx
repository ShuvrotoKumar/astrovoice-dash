import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import dayjs from "dayjs";
import RecentUsers from "./RecentUsers";
import TotalView from "./TotalView";
import { useRecentUsersQuery } from "../../redux/api/userApi";
import { useGetAllAdminQuery } from "../../redux/api/adminApi";

function DashboardPage() {
  const currentYear = dayjs().year();
  const startYear = 2020;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);

  const { data: usersData, isLoading: isUserLoading } = useRecentUsersQuery();
  const { data: adminsData, isLoading: isAdminLoading } = useGetAllAdminQuery();

  const totalUsers = usersData?.data?.pagination?.totalUsers || 0;
  const totalAdmins = adminsData?.data?.length || 0;

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-5 p-4 md:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
        {[
          { value: isUserLoading ? "..." : totalUsers, label: 'Total User' },
          { value: isAdminLoading ? "..." : totalAdmins, label: 'Total Admin' }
        ].map((stat, index, array) => (
          <div
            key={stat.label}
            className="bg-[#393d4a] p-4 rounded-lg flex flex-col items-center justify-center min-h-[120px] border-2 border-[#ffbf00]"
          >
            <p className="text-[#ffbf00] text-2xl md:text-3xl font-bold">{stat.value}</p>
            <p className="text-[#ffbf00] text-lg md:text-xl font-semibold text-center">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* User Growth Section */}
      <div className="w-full bg-[#393d4a] rounded-lg shadow-md p-4 md:p-6">
        <TotalView />
      </div>
      {/* Recent Users Section */}
      <div className="w-full">
        <h1 className="text-xl md:text-2xl text-[#ffbf00] font-bold mb-4">Recent Joined Users</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <RecentUsers />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
