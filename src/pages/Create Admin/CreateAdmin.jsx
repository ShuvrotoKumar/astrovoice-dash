import { ConfigProvider, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  IoChevronBack,
  IoAddOutline,
} from "react-icons/io5";
import { useGetAllAdminQuery } from "../../redux/api/adminApi";

export default function CreateAdmin() {
  const navigate = useNavigate();
  const { data: adminData, isLoading, error } = useGetAllAdminQuery();

  // Log for debugging
  console.log("Admin API Data:", adminData);
  console.log("Admin API Error:", error);

  const dataSource = useMemo(() => {
    if (!adminData?.data) return [];
    try {
      return adminData.data.map((admin, index) => ({
        key: admin._id || String(index),
        no: String(index + 1),
        name: admin.fullname || admin.name || 'Unknown',
        email: admin.email || 'N/A',
        password: "********",
        designation: admin.role || admin.designation || 'N/A',
      }));
    } catch (err) {
      console.error("Error mapping admin data:", err);
      return [];
    }
  }, [adminData]);

  const columns = [
    { title: "No", dataIndex: "no", key: "no", width: 80 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Password", dataIndex: "password", key: "password", width: 120 },
    { title: "Designation", dataIndex: "designation", key: "designation" },
  ];

  return (
    <div className="p-5">
      <div className="bg-[#ffbf00] px-5 py-3 rounded-md mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl font-bold">Create Admin</h1>
        <button
          type="button"
          onClick={() => navigate("/add-admin")}
          className="ml-auto bg-white text-[#ffbf00] px-3 py-1 rounded-md font-semibold flex items-center gap-2 hover:opacity-95 transition"
        >
          <IoAddOutline className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#ffbf00",
              headerColor: "#ffffff",
              cellFontSize: 16,
              headerSplitColor: "#393d4a",
              colorTextHeading: "#ffffff",
              colorBgContainer: "#393d4a",
              colorText: "#ffffff",
              rowHoverBg: "#4a5060",
              borderColor: "#4a5060",
            },
            Pagination: {
              colorPrimaryBorder: "[#ffbf00]",
              colorBorder: "[#ffbf00]",
              colorPrimaryHover: "[#ffbf00]",
              colorTextPlaceholder: "[#ffbf00]",
              itemActiveBgDisabled: "[#ffbf00]",
              colorPrimary: "[#ffbf00]",
            },
          },
        }}
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            Error loading admins: {error?.message || error?.data?.message || 'Failed to fetch admins'}
          </div>
        )}
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          className="bg-[#393d4a]"
        />
      </ConfigProvider>
    </div>
  );
}
