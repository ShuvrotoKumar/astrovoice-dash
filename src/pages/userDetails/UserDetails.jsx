import { ConfigProvider, Modal, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { IoSearch, IoChevronBack, IoAddOutline, IoEyeOutline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import {
  useAllUsersQuery,
  useSingleUserQuery,
  useBlockUserMutation,
  useAllBlockedUsersQuery,
  useUnblockUserMutation,
  useDeleteUserMutation,
  useSearchUsersQuery
} from "../../redux/api/userApi";
import { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CgUnblock } from "react-icons/cg";

function UserDetails() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: usersData, isLoading: isUsersLoading } = useAllUsersQuery(undefined, {
    skip: !!debouncedQuery,
  });

  const { data: searchData, isLoading: isSearchLoading } = useSearchUsersQuery(
    { query: debouncedQuery },
    { skip: !debouncedQuery }
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const users = debouncedQuery
    ? (searchData?.data?.users || searchData?.users || searchData?.data || [])
    : (usersData?.data?.users || usersData?.users || usersData?.data || []);
  const isLoading = debouncedQuery ? isSearchLoading : isUsersLoading;

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedUserId(null);
  };

  const showViewModal = (user) => {
    setSelectedUserId(user._id);
    setIsViewModalOpen(true);
  };
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
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "mobile", key: "mobile" },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      title: "Status",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Blocked" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="" onClick={() => openBlock(record)}>
            <MdBlock className="h-5 w-5 text-red-600 cursor-pointer rounded-md" />
          </button>
          <button className="" onClick={() => showViewModal(record)}>
            <IoEyeOutline className="text-[#ffbf00] w-5 h-5 cursor-pointer rounded-md" />
          </button>
        </div>
      ),
    },
  ];

  const [blockUser] = useBlockUserMutation();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { data: singleUserDetail, isLoading: isSingleUserLoading } = useSingleUserQuery(
    { id: selectedUserId },
    { skip: !selectedUserId }
  );
  const selectedUser = singleUserDetail?.data?.user;
  const [unblockUser] = useUnblockUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { data: blockedUsersData, isLoading: isBlockedUsersLoading } = useAllBlockedUsersQuery();
  const blockedUsers = blockedUsersData?.data?.blockedUsers || [];

  const openBlock = (row) => {
    Swal.fire({
      title: 'Block User?',
      html: `Are you sure you want to block <strong>${row.fullname}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffbf00',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Block',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await blockUser({ id: row._id }).unwrap();
          return response;
        } catch (error) {
          Swal.showValidationMessage(
            `Request failed: ${error?.data?.message || error.message || 'Unknown error'}`
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Blocked!',
          text: `${row.fullname} has been blocked successfully.`,
          icon: 'success',
          confirmButtonColor: '#ffbf00',
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  };

  const handleUnblock = (row) => {
    Swal.fire({
      title: 'Unblock User?',
      html: `Are you sure you want to unblock <strong>${row.fullname}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffbf00',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Unblock',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          return await unblockUser({ id: row._id }).unwrap();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error?.data?.message || 'Error'}`);
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Unblocked!',
          text: 'User has been unblocked.',
          icon: 'success',
          confirmButtonColor: '#ffbf00'
        });
      }
    });
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: 'Delete User?',
      html: `Are you sure you want to delete <strong>${row.fullname}</strong>?<br/>This action cannot be undone.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          return await deleteUser({ id: row._id }).unwrap();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error?.data?.message || 'Error'}`);
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted.',
          icon: 'success',
          confirmButtonColor: '#ffbf00'
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
          <button
            onClick={() => setIsBlockedModalOpen(true)}
            className="bg-white text-[#ffbf00] px-4 py-2 rounded-md font-bold hover:bg-gray-100 transition whitespace-nowrap"
          >
            Blocked User
          </button>
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
          dataSource={users}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          className="bg-[#393d4a]"
        />

        <Modal
          open={isViewModalOpen}
          centered
          onCancel={handleViewCancel}
          footer={null}
          width={800}
          className="user-view-modal"
        >
          {isSingleUserLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffbf00]"></div>
            </div>
          ) : selectedUser ? (
            <div className="relative">
              {/* Header with green gradient */}
              <div className="bg-[#ffbf00] p-6 -m-6 mb-6 rounded-t-lg">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={selectedUser.avatar ? `${import.meta.env.VITE_IMAGE_URL}/${selectedUser.avatar}` : `https://avatar.iran.liara.run/public/${selectedUser._id}`}
                      alt={selectedUser.fullname}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedUser.fullname}
                    </h2>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        Joined: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
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
                    {selectedUser.mobile || 'N/A'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Joined Date</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Role</div>
                  <div className="text-lg font-semibold capitalize">
                    {selectedUser.role}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Gender</div>
                  <div className="text-lg font-semibold capitalize">
                    {selectedUser.gender || 'Not Specified'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Language</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.language || 'English'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Date of Birth</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Time of Birth</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.timeOfBirth || 'N/A'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Birth Location</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.birthLocation || 'N/A'}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Subscription</div>
                  <div className="text-lg font-semibold capitalize">
                    {selectedUser.subscriptionStatus || 'Free'} {selectedUser.isLifetime ? '(Lifetime)' : ''}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Premium Member</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.isPremiumMember ? 'Yes' : 'No'}
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
          ) : (
             <div className="text-center py-10">No user data found.</div>
          )}
        </Modal>

        {/* Blocked Users Modal */}
        <Modal
          title={<span className="text-white">Blocked Users</span>}
          open={isBlockedModalOpen}
          onCancel={() => setIsBlockedModalOpen(false)}
          footer={null}
          width={800}
          className="blocked-users-modal"
        >
          <Table
            dataSource={blockedUsers}
            loading={isBlockedUsersLoading}
            columns={[
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
                render: (val, record) => (
                  <div className="flex items-center gap-2">
                    <img
                      src={record.avatar ? `${import.meta.env.VITE_IMAGE_URL}/${record.avatar}` : `https://avatar.iran.liara.run/public/${record._id}`}
                      className="w-8 h-8 rounded-full"
                      alt=""
                    />
                    <span>{val}</span>
                  </div>
                )
              },
              { title: "Email", dataIndex: "email", key: "email" },
              {
                title: "Action",
                key: "action",
                render: (_, record) => (
                  <div className="flex gap-3">
                    <button onClick={() => handleUnblock(record)} title="Unblock">
                      <CgUnblock className="w-5 h-5 text-green-500 cursor-pointer" />
                    </button>
                    <button onClick={() => handleDelete(record)} title="Delete">
                      <AiOutlineDelete className="w-5 h-5 text-red-500 cursor-pointer" />
                    </button>
                  </div>
                )
              }
            ]}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
            className="bg-[#393d4a]"
          />
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default UserDetails;
