import { useState, useMemo } from 'react';
import { ConfigProvider, Modal, Table, Select, Input, Button } from "antd";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Blogs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    status: 'Published',
    content: ''
  });

  const [blogs, setBlogs] = useState([
    {
      key: "1",
      title: "Exploring the Beautiful Landscapes of Ireland",
      author: "Sarah O'Connor",
      category: "Travel",
      status: "Published",
      views: 1250,
      likes: 89,
      comments: 23,
      publishedDate: "2024-01-15",
      featuredImage: "https://picsum.photos/seed/ireland1/300/200.jpg"
    },
    {
      key: "2",
      title: "Traditional Irish Cuisine: A Food Lover's Guide",
      author: "Michael Murphy",
      category: "Food",
      status: "Published",
      views: 980,
      likes: 67,
      comments: 15,
      publishedDate: "2024-01-20",
      featuredImage: "https://picsum.photos/seed/irishfood/300/200.jpg"
    },
    {
      key: "3",
      title: "The History of Dublin Castle",
      author: "Emma Kelly",
      category: "History",
      status: "Draft",
      views: 0,
      likes: 0,
      comments: 0,
      publishedDate: "2024-02-01",
      featuredImage: "https://picsum.photos/seed/dublin/300/200.jpg"
    },
    {
      key: "4",
      title: "Best Pubs in Galway for Live Music",
      author: "Patrick Walsh",
      category: "Entertainment",
      status: "Published",
      views: 2100,
      likes: 156,
      comments: 42,
      publishedDate: "2024-02-10",
      featuredImage: "https://picsum.photos/seed/galway/300/200.jpg"
    },
    {
      key: "5",
      title: "Cliffs of Moher: Visitor's Complete Guide",
      author: "Ciara Byrne",
      category: "Travel",
      status: "Published",
      views: 3400,
      likes: 234,
      comments: 78,
      publishedDate: "2024-02-15",
      featuredImage: "https://picsum.photos/seed/cliffs/300/200.jpg"
    },
    {
      key: "6",
      title: "St. Patrick's Festival 2024 Highlights",
      author: "Liam O'Brien",
      category: "Culture",
      status: "Scheduled",
      views: 0,
      likes: 0,
      comments: 0,
      publishedDate: "2024-03-17",
      featuredImage: "https://picsum.photos/seed/stpatrick/300/200.jpg"
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
      title: "Blog Title",
      dataIndex: "title",
      key: "title",
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.featuredImage}
            className="w-12 h-12 object-cover rounded"
            alt="Blog thumbnail"
          />
          <div>
            <span className="font-medium leading-none">{value}</span>
            <div className="text-xs text-gray-500 mt-1">by {record.author}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {category}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColors = {
          Published: "bg-green-100 text-green-800",
          Draft: "bg-gray-100 text-gray-800",
          Scheduled: "bg-yellow-100 text-yellow-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      title: "Engagement",
      key: "engagement",
      render: (_, record) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">👁</span>
            <span>{record.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">❤️</span>
            <span>{record.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">💬</span>
            <span>{record.comments}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleView(record)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View blog"
          >
            <FiEye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleEdit(record)}
            className="text-[#ffbf00] hover:text-blue-800 p-1"
            title="Edit blog"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete blog"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return blogs.filter((blog) => {
      const matchStatus = statusFilter === "all" ? true : blog.status === statusFilter;
      const matchQuery = q
        ? [blog.title, blog.author, blog.category, blog.status]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchStatus && matchQuery;
    });
  }, [blogs, statusFilter, searchQuery]);

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      author: blog.author,
      category: blog.category,
      status: blog.status,
      content: ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (blog) => {
    Swal.fire({
      title: 'Delete Blog?',
      html: `Are you sure you want to delete the blog <strong>${blog.title}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffbf00',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedBlogs = blogs.filter(b => b.key !== blog.key);
        setBlogs(updatedBlogs);
        Swal.fire({
          title: 'Deleted!',
          text: 'Blog has been deleted successfully.',
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
      author: '',
      category: '',
      status: 'Draft',
      content: ''
    });
    setIsAddModalOpen(true);
  };


  const handleSaveEdit = () => {
    const updatedBlogs = blogs.map(blog => 
      blog.key === selectedBlog.key 
        ? { ...blog, ...formData }
        : blog
    );
    setBlogs(updatedBlogs);
    setIsEditModalOpen(false);
    setSelectedBlog(null);
    
    Swal.fire({
      title: 'Updated!',
      text: 'Blog has been updated successfully.',
      icon: 'success',
      confirmButtonColor: '#ffbf00',
      timer: 2000,
      timerProgressBar: true
    });
  };

  const handleSaveNew = () => {
    const newBlog = {
      key: String(Math.max(0, ...blogs.map(blog => parseInt(blog.key))) + 1),
      ...formData,
      views: 0,
      likes: 0,
      comments: 0,
      publishedDate: new Date().toISOString().split('T')[0],
      featuredImage: `https://picsum.photos/seed/blog${Date.now()}/300/200.jpg`
    };
    setBlogs([...blogs, newBlog]);
    setIsAddModalOpen(false);
    
    Swal.fire({
      title: 'Added!',
      text: 'New blog has been added successfully.',
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
        <h1 className="text-white text-xl sm:text-2xl font-bold">Blog Management</h1>
        
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
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
            <Select.Option value="Published">Published</Select.Option>
            <Select.Option value="Draft">Draft</Select.Option>
            <Select.Option value="Scheduled">Scheduled</Select.Option>
          </Select>
          <button
            onClick={handleAddNew}
            className="bg-white text-[#ffbf00] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <IoAddOutline className="w-5 h-5" />
            <span>Add Blog</span>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="relative w-full md:hidden mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search blogs..."
          className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
        />
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F2F2F2",
              headerColor: "#000000",
              cellFontSize: 14,
              headerSplitColor: "#E5E7EB",
              colorTextHeading: "#000000",
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
        />

        {/* View Blog Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={() => setIsViewModalOpen(false)}
          footer={null}
          width={800}
        >
          {selectedBlog && (
            <div className="relative">
              <div className="bg-[#ffbf00] p-6 -m-6 mb-6 rounded-t-lg">
                <img
                  src={selectedBlog.featuredImage}
                  alt={selectedBlog.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedBlog.title}
                </h2>
                <div className="flex items-center gap-4 text-white">
                  <span>by {selectedBlog.author}</span>
                  <span>•</span>
                  <span>{selectedBlog.publishedDate}</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                    {selectedBlog.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#ffbf00]">{selectedBlog.views.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#ffbf00]">{selectedBlog.likes}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#ffbf00]">{selectedBlog.comments}</div>
                  <div className="text-sm text-gray-600">Comments</div>
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

        {/* Edit Blog Modal */}
        <Modal
          title="Edit Blog"
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
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                className="w-full"
              >
                <Select.Option value="Travel">Travel</Select.Option>
                <Select.Option value="Food">Food</Select.Option>
                <Select.Option value="History">History</Select.Option>
                <Select.Option value="Entertainment">Entertainment</Select.Option>
                <Select.Option value="Culture">Culture</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                className="w-full"
              >
                <Select.Option value="Published">Published</Select.Option>
                <Select.Option value="Draft">Draft</Select.Option>
                <Select.Option value="Scheduled">Scheduled</Select.Option>
              </Select>
            </div>
          </div>
        </Modal>

        {/* Add New Blog Modal */}
        <Modal
          title="Add New Blog"
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
              Add Blog
            </Button>
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                className="w-full"
              >
                <Select.Option value="Travel">Travel</Select.Option>
                <Select.Option value="Food">Food</Select.Option>
                <Select.Option value="History">History</Select.Option>
                <Select.Option value="Entertainment">Entertainment</Select.Option>
                <Select.Option value="Culture">Culture</Select.Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                className="w-full"
              >
                <Select.Option value="Published">Published</Select.Option>
                <Select.Option value="Draft">Draft</Select.Option>
                <Select.Option value="Scheduled">Scheduled</Select.Option>
              </Select>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Blogs;