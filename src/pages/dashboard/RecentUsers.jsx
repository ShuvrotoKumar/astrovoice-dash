import { ConfigProvider, Table } from "antd";
import { useRecentUsersQuery } from "../../redux/api/userApi";

const RecentUsers = () => {
  const { data, isLoading } = useRecentUsersQuery();
  const dataSource = data?.data?.users || data?.users || data?.data || [];

  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.avatar ? `${import.meta.env.VITE_IMAGE_URL}/${record.avatar}` : `https://avatar.iran.liara.run/public/${record._id}`}
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span className="leading-none">{value}</span>
        </div>
      ),
    },
    // { title: "Role", dataIndex: "role", key: "role" },
    // { title: "Clinic", dataIndex: "clinic", key: "clinic" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "mobile", key: "mobile" },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "[#ffbf00]",
            },

            Table: {
              headerBg: "#ffbf00",
              headerColor: "#ffffff",
              cellFontSize: 16,
              headerSplitColor: "#ffbf00",
              colorBgContainer: "#393d4a",
              colorText: "#ffffff",
              rowHoverBg: "#4a5060",
              borderColor: "#4a5060",
            },
          },
        }}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={false}
          scroll={{ x: "max-content" }}
          className="bg-[#393d4a]"
        />
      </ConfigProvider>
    </>
  );
};

export default RecentUsers;
