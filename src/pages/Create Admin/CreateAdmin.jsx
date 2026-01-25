import { ConfigProvider, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  IoChevronBack,
  IoAddOutline,
} from "react-icons/io5";
import Swal from 'sweetalert2';

export default function CreateAdmin() {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      no: "1",
      name: "John Admin",
      email: "john@tdk.com",
      password: "********",
      designation: "Super Admin",
    },
    {
      key: "2",
      no: "2",
      name: "Jane Admin",
      email: "jane@tdk.com",
      password: "********",
      designation: "Admin",
    },
    {
      key: "3",
      no: "3",
      name: "Sam Manager",
      email: "sam@tdk.com",
      password: "********",
      designation: "Admin",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all fields',
        confirmButtonColor: '#ffbf00'
      });
      return;
    }
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match',
        confirmButtonColor: '#ffbf00'
      });
      return;
    }
    
    const nextNo = String(dataSource.length + 1);
    const newRow = {
      key: nextNo,
      no: nextNo,
      name: form.name,
      email: form.email,
      password: "********",
      designation: "Admin",
    };
    setDataSource((prev) => [newRow, ...prev]);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    Swal.fire({
      icon: 'success',
      title: 'Admin Added Successfully',
      text: `${form.name} has been added to the admin list.`,
      confirmButtonColor: '#ffbf00',
      timer: 2000,
      timerProgressBar: true
    });
  };

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Password", dataIndex: "password", key: "password" },
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
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          className="bg-[#393d4a]"
        />
      </ConfigProvider>
    </div>
  );
}
