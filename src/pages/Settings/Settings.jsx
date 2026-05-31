import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

export default function Settings() {
  return (
    <div className="w-full mx-auto p-4 lg:p-6">
      {/* Card */}
      <div className="bg-[#393d4a] rounded-md shadow border border-[#4a5060] overflow-hidden">
        {/* Header */}
        <div className="bg-[#ffbf00] px-5 py-3">
          <h1 className="text-white text-2xl font-bold">Settings</h1>
        </div>

        {/* List */}
        <ul className="divide-y divide-[#4a5060]">
          {/* Edit Profile */}
          <li>
            <Link
              to="/dashboard/profile"
              className="flex items-center justify-between px-5 py-4 hover:bg-[#4a5060] transition"
            >
              <span className="text-white text-base">Edit Profile</span>
              <IoChevronForward className="text-gray-300" />
            </Link>
          </li>
          {/* Privacy Policy */}
          <li>
            <Link
              to="/dashboard/privacy-policy"
              className="flex items-center justify-between px-5 py-4 hover:bg-[#4a5060] transition"
            >
              <span className="text-white text-base">Privacy Policy</span>
              <IoChevronForward className="text-gray-300" />
            </Link>
          </li>
          {/* Terms & Conditions */}
          <li>
            <Link
              to="/dashboard/terms-and-condition"
              className="flex items-center justify-between px-5 py-4 hover:bg-[#4a5060] transition"
            >
              <span className="text-white text-base">
                Terms & Conditions
              </span>
              <IoChevronForward className="text-gray-300" />
            </Link>
          </li>
          {/* About Us */}
          <li>
            <Link
              to="/dashboard/about-us"
              className="flex items-center justify-between px-5 py-4 hover:bg-[#4a5060] transition"
            >
              <span className="text-white text-base">About Us</span>
              <IoChevronForward className="text-gray-300" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
