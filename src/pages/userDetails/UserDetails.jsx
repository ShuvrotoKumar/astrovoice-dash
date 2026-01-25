import { ConfigProvider, Modal, Table } from "antd";
import { useMemo, useState } from "react";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function UserDetails() {
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const showViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  const dataSource = [
    {
      key: "1",
      fullName: "John Doe",
      role: "User",
      clinic: "Downtown Dental Clinic",
      email: "john@example.com",
      phone: "+1 987 654 3210",
      joined: "2024-01-12",
    },
    {
      key: "2",
      fullName: "Emma Smith",
      role: "Vendor",
      clinic: "Smile Care Clinic",
      email: "emma@example.com",
      phone: "+1 987 654 3211",
      joined: "2024-03-28",
    },
    {
      key: "3",
      fullName: "Liam Johnson",
      role: "User",
      clinic: "Healthy Teeth Clinic",
      email: "liam@example.com",
      phone: "+1 987 654 3212",
      joined: "2024-06-15",
    },
    {
      key: "4",
      fullName: "Olivia Brown",
      role: "Vendor",
      clinic: "City Dental Center",
      email: "olivia@example.com",
      phone: "+1 987 654 3213",
      joined: "2024-08-02",
    },
    {
      key: "5",
      fullName: "Noah Davis",
      role: "User",
      clinic: "Prime Smiles",
      email: "noah@example.com",
      phone: "+1 987 654 3214",
      joined: "2024-09-10",
    },
    {
      key: "6",
      fullName: "Sophia Miller",
      role: "Vendor",
      clinic: "Bright Smile Hub",
      email: "sophia@example.com",
      phone: "+1 987 654 3215",
      joined: "2024-11-19",
    },
    {
      key: "7",
      fullName: "James Wilson",
      role: "User",
      clinic: "Downtown Dental Clinic",
      email: "james@example.com",
      phone: "+1 987 654 3216",
      joined: "2025-01-05",
    },
    {
      key: "8",
      fullName: "Isabella Moore",
      role: "Vendor",
      clinic: "Healthy Teeth Clinic",
      email: "isabella@example.com",
      phone: "+1 987 654 3217",
      joined: "2025-02-21",
    },
    {
      key: "9",
      fullName: "Benjamin Taylor",
      role: "User",
      clinic: "Prime Smiles",
      email: "benjamin@example.com",
      phone: "+1 987 654 3218",
      joined: "2025-03-03",
    },
    {
      key: "10",
      fullName: "Mia Anderson",
      role: "Vendor",
      clinic: "City Dental Center",
      email: "mia@example.com",
      phone: "+1 987 654 3219",
      joined: "2025-04-12",
    },
  ];

  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://avatar.iran.liara.run/public/${record.key}`}
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span className="leading-none">{value}</span>
        </div>
      ),
    },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "phone", key: "phone" },
    { title: "Joined Date", dataIndex: "joined", key: "joined" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="" onClick={() => openBlock(record)}>
            <MdBlock className="h-5 w-5 text-red-600 cursor-pointer rounded-md" />
          </button>
          <button className="" onClick={() => showViewModal(record)}>
            <FiEdit2 className="text-[#ffbf00] w-5 h-5 cursor-pointer rounded-md" />
          </button>
        </div>
        
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return dataSource.filter((r) => {
      const matchRole = roleFilter ? r.role === roleFilter : true;
      const matchQuery = q
        ? [r.fullName, r.email, r.phone, r.clinic, r.role]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchRole && matchQuery;
    });
  }, [dataSource, roleFilter, searchQuery]);

  const openBlock = (row) => {
    Swal.fire({
      title: 'Block User?',
      html: `Are you sure you want to block <strong>${row.fullName}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffbf00',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Block',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Blocked!',
          text: `${row.fullName} has been blocked.`,
          icon: 'success',
          confirmButtonColor: '#ffbf00',
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  };

  return (
    <div>
      <div className="bg-[#ffbf00] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">User Management</h1>
        {/* Mobile search */}
        <div className="relative w-full md:hidden mt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
          />
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="bg-white text-[#0D0D0D] placeholder-[#111827] pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]" />
          </div>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#00c0b5",
            },
            Pagination: {
              colorPrimaryBorder: "#111827",
              colorBorder: "#111827",
              colorPrimaryHover: "#111827",
              colorTextPlaceholder: "#111827",
              itemActiveBgDisabled: "#111827",
              colorPrimary: "#111827",
            },
            Table: {
              headerBg: "#393d4a",
              headerColor: "#ffffff",
              cellFontSize: 16,
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
        />
        
        {/* View Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={handleViewCancel}
          footer={null}
          width={800}
          className="user-view-modal"
        >
          {selectedUser && (
            <div className="relative">
              {/* Header with green gradient */}
              <div className="bg-[#ffbf00] p-6 -m-6 mb-6 rounded-t-lg">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={`https://avatar.iran.liara.run/public/${selectedUser.key}`}
                      alt={selectedUser.fullName}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedUser.fullName}
                    </h2>
                    <div className="flex items-center gap-3 mb-1">
                      {/* <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {selectedUser.clinic}
                      </span> */}
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        Joined: {selectedUser.joined}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Email</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.email}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Phone No</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.phone}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Joined Date</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.joined}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleViewCancel}
                  className="bg-[#ffbf00] text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default UserDetails;
