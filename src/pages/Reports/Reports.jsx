import { useState, useMemo } from 'react';
import { ConfigProvider, Modal, Table, Select, Input, Button } from "antd";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Reports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    status: 'Pending',
    description: ''
  });

  const [reports, setReports] = useState([
    {
      key: "1",
      title: "Monthly User Activity Report",
      type: "Analytics",
      status: "Completed",
      generatedBy: "Admin User",
      generatedDate: "2024-01-15",
      downloadCount: 45,
      fileSize: "2.4 MB"
    },
    {
      key: "2",
      title: "Revenue Analysis Q4 2023",
      type: "Financial",
      status: "Completed",
      generatedBy: "Finance Team",
      generatedDate: "2024-01-20",
      downloadCount: 32,
      fileSize: "1.8 MB"
    },
    {
      key: "3",
      title: "User Engagement Metrics",
      type: "Analytics",
      status: "Pending",
      generatedBy: "System",
      generatedDate: "2024-02-01",
      downloadCount: 0,
      fileSize: "0 MB"
    },
    {
      key: "4",
      title: "Security Audit Report",
      type: "Security",
      status: "In Progress",
      generatedBy: "Security Team",
      generatedDate: "2024-02-10",
      downloadCount: 12,
      fileSize: "3.1 MB"
    },
    {
      key: "5",
      title: "Performance Benchmark Report",
      type: "Technical",
      status: "Completed",
      generatedBy: "DevOps Team",
      generatedDate: "2024-02-15",
      downloadCount: 67,
      fileSize: "1.2 MB"
    },
    {
      key: "6",
      title: "Customer Satisfaction Survey",
      type: "Customer",
      status: "Scheduled",
      generatedBy: "Marketing Team",
      generatedDate: "2024-03-17",
      downloadCount: 0,
      fileSize: "0 MB"
    }
  ]);

  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    {
      title: "Report Title",
      dataIndex: "title",
      key: "title",
      render: (value, record) => (
        <div>
          <span className="font-medium leading-none">{value}</span>
          <div className="text-xs text-gray-500 mt-1">by {record.generatedBy}</div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const typeColors = {
          Analytics: "bg-blue-100 text-blue-800",
          Financial: "bg-green-100 text-green-800",
          Security: "bg-red-100 text-red-800",
          Technical: "bg-purple-100 text-purple-800",
          Customer: "bg-yellow-100 text-yellow-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}>
            {type}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColors = {
          Completed: "bg-green-100 text-green-800",
          Pending: "bg-yellow-100 text-yellow-800",
          "In Progress": "bg-blue-100 text-blue-800",
          Scheduled: "bg-gray-100 text-gray-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      title: "Statistics",
      key: "statistics",
      render: (_, record) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">⬇️</span>
            <span>{record.downloadCount} downloads</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">📁</span>
            <span>{record.fileSize}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Generated Date",
      dataIndex: "generatedDate",
      key: "generatedDate",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleView(record)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View report"
          >
            <FiEye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleEdit(record)}
            className="text-[#ffbf00] hover:text-blue-800 p-1"
            title="Edit report"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete report"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return reports.filter((report) => {
      const matchStatus = statusFilter === "all" ? true : report.status === statusFilter;
      const matchQuery = q
        ? [report.title, report.type, report.status, report.generatedBy]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchStatus && matchQuery;
    });
  }, [reports, statusFilter, searchQuery]);

  const handleView = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const handleEdit = (report) => {
    setSelectedReport(report);
    setFormData({
      title: report.title,
      type: report.type,
      status: report.status,
      description: ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (report) => {
    Swal.fire({
      title: 'Delete Report?',
      html: `Are you sure you want to delete the report <strong>${report.title}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffbf00',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedReports = reports.filter(r => r.key !== report.key);
        setReports(updatedReports);
        Swal.fire({
          title: 'Deleted!',
          text: 'Report has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#ffbf00',
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      type: '',
      status: 'Pending',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedReports = reports.map(report => 
      report.key === selectedReport.key 
        ? { ...report, ...formData }
        : report
    );
    setReports(updatedReports);
    setIsEditModalOpen(false);
    setSelectedReport(null);
    
    Swal.fire({
      title: 'Updated!',
      text: 'Report has been updated successfully.',
      icon: 'success',
      confirmButtonColor: '#ffbf00',
      timer: 2000,
      timerProgressBar: true
    });
  };

  const handleSaveNew = () => {
    const newReport = {
      key: String(Math.max(0, ...reports.map(report => parseInt(report.key))) + 1),
      ...formData,
      generatedBy: "Current User",
      generatedDate: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      fileSize: "0 MB"
    };
    setReports([...reports, newReport]);
    setIsAddModalOpen(false);
    
    Swal.fire({
      title: 'Added!',
      text: 'New report has been added successfully.',
      icon: 'success',
      confirmButtonColor: '#ffbf00',
      timer: 2000,
      timerProgressBar: true
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
        <h1 className="text-white text-xl sm:text-2xl font-bold">Reports Management</h1>
        
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="bg-white text-[#0D0D0D] placeholder-[#111827] pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]" />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-32"
            placeholder="Status"
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Scheduled">Scheduled</Select.Option>
          </Select>
          <button
            onClick={handleAddNew}
            className="bg-white text-[#ffbf00] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <IoAddOutline className="w-5 h-5" />
            <span>Add Report</span>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="relative w-full md:hidden mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reports..."
          className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
        />
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#ffbf00",
              headerColor: "#ffffff",
              cellFontSize: 14,
              headerSplitColor: "#393d4a",
              colorTextHeading: "#000000",
              colorBgContainer: "#393d4a",
              colorText: "#ffffff",
              rowHoverBg: "#4a5060",
              borderColor: "#4a5060",
            },
            Pagination: {
              colorPrimaryBorder: "#ffbf00",
              colorBorder: "#ffbf00",
              colorPrimaryHover: "#ffbf00",
              colorTextPlaceholder: "#6B7280",
              colorPrimary: "#ffbf00",
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

        {/* View Report Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={() => setIsViewModalOpen(false)}
          footer={null}
          width={800}
        >
          {selectedReport && (
            <div className="relative">
              <div className="bg-[#ffbf00] p-6 -m-6 mb-6 rounded-t-lg">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedReport.title}
                </h2>
                <div className="flex items-center gap-4 text-white">
                  <span>by {selectedReport.generatedBy}</span>
                  <span>•</span>
                  <span>{selectedReport.generatedDate}</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                    {selectedReport.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#ffbf00]">{selectedReport.downloadCount}</div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#ffbf00]">{selectedReport.fileSize}</div>
                  <div className="text-sm text-gray-600">File Size</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#ffbf00]">{selectedReport.status}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="font-semibold px-8 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: "#ffbf00", color: "white" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Report Modal */}
        <Modal
          title="Edit Report"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              onClick={handleSaveEdit}
              style={{ backgroundColor: "#ffbf00", borderColor: "#ffbf00" }}
            >
              Save Changes
            </Button>
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter report title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Select
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                className="w-full"
              >
                <Select.Option value="Analytics">Analytics</Select.Option>
                <Select.Option value="Financial">Financial</Select.Option>
                <Select.Option value="Security">Security</Select.Option>
                <Select.Option value="Technical">Technical</Select.Option>
                <Select.Option value="Customer">Customer</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                className="w-full"
              >
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Scheduled">Scheduled</Select.Option>
              </Select>
            </div>
          </div>
        </Modal>

        {/* Add New Report Modal */}
        <Modal
          title="Add New Report"
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              onClick={handleSaveNew}
              style={{ backgroundColor: "#ffbf00", borderColor: "#ffbf00" }}
            >
              Add Report
            </Button>
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter report title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Select
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                className="w-full"
              >
                <Select.Option value="Analytics">Analytics</Select.Option>
                <Select.Option value="Financial">Financial</Select.Option>
                <Select.Option value="Security">Security</Select.Option>
                <Select.Option value="Technical">Technical</Select.Option>
                <Select.Option value="Customer">Customer</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                className="w-full"
              >
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Scheduled">Scheduled</Select.Option>
              </Select>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Reports; 

