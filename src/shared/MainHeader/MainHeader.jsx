/* eslint-disable react/prop-types */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMenu, IoNotificationsOutline, IoClose } from "react-icons/io5";
import Chat from "../../pages/Chat/Chat";

const MainHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const chatRef = useRef(null);

  // Close chat when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        // Check if the click is not on the chat icon
        if (!event.target.closest('.chat-icon-button')) {
          setShowChat(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="relative w-full px-5 pt-4">
      <header className="shadow-sm rounded-lg overflow-hidden bg-[#393d4a]">
        <div className="flex justify-between items-center px-5 md:px-10 h-[80px]">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded hover:opacity-80 focus:outline-none"
          >
            <IoMenu className="w-8 h-8 text-[#ffbe00]" />
          </button>
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-full border border-[#ffbe00] hover:bg-white/60 transition"
            >
              <IoNotificationsOutline className="w-6 h-6 text-[#ffbe00]" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ffbe00] text-white text-[10px] px-1 leading-none">3</span>
            </button>

            {/* Profile */}
            <div
              onClick={() => navigate("/dashboard/profile")}
              className="flex items-center gap-2 cursor-default"
            >
              <img
                src="https://avatar.iran.liara.run/public/31"
                className="w-8 md:w-12 h-8 md:h-12 object-cover rounded-full"
                alt="User Avatar"
              />
              <div>
                <h3 className="hidden md:block text-[#ffbe00] text-lg font-semibold">
                  Mr. Admin
                </h3>
                <p className="text-[#ffbe00] text-lg font-semibold">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Overlay */}
      {showChat && (
        <div
          ref={chatRef}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowChat(false)}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#ffbe00] to-blue-700 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Messages</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden flex">
              <Chat isEmbedded={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainHeader;
