import { ConfigProvider, Modal, Table, Select } from "antd";
import { useMemo, useState } from "react";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { FiEdit2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

function Subscriptions() {
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [statusFilter, setStatusFilter] = useState();
  const [searchQuery, setSearchQuery] = useState("");


  const showViewModal = (subscription) => {
    setSelectedSubscription(subscription);
    setIsViewModalOpen(true);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedSubscription(null);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
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

  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    {
      title: "Plan Name",
      dataIndex: "name",
      key: "name",
      render: (value) => (
        <span className="font-medium">{value}</span>
      ),
    },
    { 
      title: "User", 
      dataIndex: "user", 
      key: "user" 
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'Active' ? 'bg-green-100 text-green-800' : 
          status === 'Expired' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    },
    { 
      title: "Price", 
      dataIndex: "price", 
      key: "price" 
    },
    { 
      title: "Start Date", 
      dataIndex: "startDate", 
      key: "startDate" 
    },
    { 
      title: "End Date", 
      dataIndex: "endDate", 
      key: "endDate" 
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="" onClick={() => openCancel(record)}>
            <FiTrash2 className="h-5 w-5 text-red-600 cursor-pointer rounded-md" />
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
      const matchStatus = statusFilter ? r.status === statusFilter : true;
      const matchQuery = q
        ? [r.name, r.user, r.status, r.price, r.paymentMethod]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchStatus && matchQuery;
    });
  }, [dataSource, statusFilter, searchQuery]);

  const openCancel = (row) => {
    Swal.fire({
      title: 'Cancel Subscription?',
      html: `Are you sure you want to cancel the subscription for <strong>${row.user}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffbf00',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep It',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setDataSource(dataSource.filter(item => item.key !== row.key));
        Swal.fire({
          title: 'Cancelled!',
          text: `Subscription for ${row.user} has been cancelled.`,
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
        <h1 className="text-white text-xl sm:text-2xl font-bold">Subscription Management</h1>
        
        {/* Mobile search */}
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
        
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscriptions..."
              className="bg-white text-[#0D0D0D] placeholder-[#111827] pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]" />
          </div>
          
          <Select
            placeholder="Filter by status"
            allowClear
            onChange={setStatusFilter}
            className="w-full md:w-40"
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Expired', label: 'Expired' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />
          
          <button
            onClick={showAddModal}
            className="bg-white text-[#ffbf00] hover:bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2 whitespace-nowrap"
          >
            <IoAddOutline className="w-5 h-5" />
            <span>Add Subscription</span>
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
        
        
        {/* View/Edit Subscription Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={handleViewCancel}
          footer={null}
          width={800}
        >
          {selectedSubscription && (
            <div className="relative">
              {/* Header with blue gradient */}
              <div className="bg-[#ffbf00] p-6 -m-6 mb-6 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedSubscription.name}
                </h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSubscription.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    selectedSubscription.status === 'Expired' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedSubscription.status}
                  </span>
                  <span className="text-white/90">
                    {selectedSubscription.user}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Plan Name</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.name}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Price</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.price}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Start Date</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.startDate}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">End Date</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.endDate}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">Payment Method</div>
                  <div className="text-lg font-semibold">
                    {selectedSubscription.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200 gap-3">
                <button
                  onClick={handleViewCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Handle edit functionality
                    console.log('Edit subscription:', selectedSubscription);
                  }}
                  className="bg-[#ffbf00] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add Subscription Modal */}
        <Modal
          title={<span style={{ color: "white" }}>Add New Subscription</span>}
          open={isAddModalOpen}
          onCancel={handleAddCancel}
          styles={{ content: { backgroundColor: "#393d4a" }, header: { backgroundColor: "#393d4a" } }}
          footer={[
            <button
              key="cancel"
              onClick={handleAddCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>,
            <button
              key="save"
              onClick={() => {
                // Handle save functionality
                console.log('Save new subscription');
                handleAddCancel();
              }}
              className="bg-[#ffbf00] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Subscription
            </button>
          ]}
          width={800}
        >
          <div className="space-y-4 bg-[#393d4a] p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  placeholder="Enter plan name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffbf00]"
                />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <input
                  type="text"
                  placeholder="Enter user name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffbf00]"
                />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  placeholder="Enter price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffbf00]"
                />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffbf00]">
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffbf00]"
                />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffbf00]"
                />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffbf00]">
                  <option value="">Select payment method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default Subscriptions;