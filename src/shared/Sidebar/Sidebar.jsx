/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { LuUsers } from "react-icons/lu";
import { TbReport } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { IoCloseSharp, IoLogOutOutline } from "react-icons/io5";
import {
  MdAdminPanelSettings,
} from "react-icons/md";
import { BsBookmarkCheck, BsCreditCard } from "react-icons/bs";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;
  
  // Close sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <div
      className={`bg-[#393d4a] text-white border border-[#E5E7EB] h-screen overflow-y-auto py-5 md:py-0 z-50 transition-transform shadow-lg my-5 rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.1)]
        w-[80%] sm:w-[70%] md:w-[60%] lg:w-70 xl:w-72
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        fixed top-0 left-0
        lg:static lg:translate-x-0
      `}
    >
      {/* Close Button (Mobile Only) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 lg:hidden text-white bg-#ffbf00 focus:outline-none p-2 rounded-full"
      >
        <IoCloseSharp />
      </button>

      {/* Logo */}
      <div className="flex justify-center items-center gap-2 px-5 mt-20">
        <img src="/logo.png" className="w-[140px] h-[140px]" style={{objectFit: "contain"}} alt="User Avatar" />
      </div>

      {/* Sidebar Menu */}
      <ul className="mt-10 px-5 text-[10px]">
        {/* Dashboard Page */}
        <Link to="/" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <RxDashboard className="w-5 h-5" />
            <p className="text-lg font-semibold">Dashboard</p>
          </li>
        </Link>
        {/* User Management */}
        <Link to="/user-details" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/user-details")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <LuUsers className="w-5 h-5" />
            <p className="text-lg font-semibold">All Users</p>
          </li>
        </Link>

        {/* Earnings */}
        {/* <Link to="/earnings" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/earnings")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <BsCurrencyDollar className="w-5 h-5" />
            <p className="text-lg font-semibold">Earnings</p>
          </li>
        </Link> */}

        {/* Subscriptions */}
        <Link to="/subscriptions" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/subscriptions")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <BsCreditCard className="w-5 h-5" />
            <p className="text-lg font-semibold">Subscriptions</p>
          </li>
        </Link>

        
        {/* Categories */}
        {/* <Link to="/categories" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/categories")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <BiCategory className="w-5 h-5" />
            <p className="text-lg font-semibold">Categories</p>
          </li>
        </Link> */}


        {/* Lab Management */}
        {/* <Link to="/payment-management" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/payment-management")
                ? "bg-#ffbf00 text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <RiFlaskLine className="w-5 h-5" />
            <p className="text-lg font-semibold whitespace-nowrap">Payments</p>
          </li>
        </Link> */}

        {/* Invoices */}
        {/* <Link to="/invoices" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/invoices")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <BsReceipt className="w-5 h-5" />
            <p className="text-lg font-semibold">Invoices</p>
          </li>
        </Link> */}
        
         {/* <Link to="/chat" onClick={handleLinkClick}>
          <li
            className={`flex items-center gap-2 mt-2 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/chat")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <BiCategory className="w-5 h-5" />
            <p className="text-lg font-semibold">Chat</p>
          </li>
        </Link> */}


        {/* Create Admin */}
        <Link to="/create-admin">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/create-admin")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <MdAdminPanelSettings className="w-5 h-5" />
            <p className="text-lg font-semibold">Create Admin</p>
          </li>
        </Link>

          {/*Reports*/}

      <Link to="/reports">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/reports")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <MdAdminPanelSettings className="w-5 h-5" />
            <p className="text-lg font-semibold">Reports</p>
          </li>
        </Link>
        {/* <Link to="/blogs">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/blogs")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <TbReport className="w-5 h-5" />
            <p className="text-lg font-semibold">Blogs</p>
          </li>
        </Link> */}
        <Link to="/settings">
          <li
            className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
              isActive("/settings")
                ? "bg-[#ffbe00] text-white px-3 py-3 rounded-lg"
                : "hover:bg-gray-100 px-3 py-3 rounded-lg"
            }`}
          >
            <IoMdSettings className="w-5 h-5 text-lg font-semibold" />
            <p className="text-lg font-semibold">Settings</p>
          </li>
        </Link>
      </ul>

      {/* Logout Button */}
      <div className="absolute mt-8 md:mt-20 mmd:mt-20 w-full px-5 text-[#ffbe00]">
        <Link to="/sign-in">
          <button className="flex items-center gap-4 w-full py-3 rounded-lg bg-red-500  px-3 duration-200 text-white justify-center ">
            <IoLogOutOutline className="w-5 h-5 font-bold" />
            <span>Logout</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
