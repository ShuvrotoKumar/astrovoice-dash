import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import EditProfile from "./EditProfile";
import ChangePass from "./ChangePass";
import { IoChevronBack } from "react-icons/io5";
import { useMeQuery, useAvatarMutation } from "../../redux/api/adminApi";
import { getImageUrl } from "../../config/envConfig";
import Swal from 'sweetalert2';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("editProfile");
  const navigate = useNavigate();
  const { data: meData, isLoading, error, refetch } = useMeQuery();
  const [updateAvatar, { isLoading: isUploadingAvatar }] = useAvatarMutation();
  const fileInputRef = useRef(null);

  // Log for debugging
  console.log("ProfilePage Me API Data:", meData);
  console.log("ProfilePage Me API Error:", error);
  console.log("ProfilePage Avatar URL:", meData?.data?.admin?.avatar);

  const admin = meData?.data?.admin;
  const adminName = admin?.fullname || "Shah Aman";
  const adminRole = admin?.role || "Admin";
  const adminAvatar = admin?.avatar
    ? `${getImageUrl(admin.avatar)}?t=${new Date(admin.updatedAt).getTime()}`
    : "https://avatar.iran.liara.run/public/44";

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const result = await updateAvatar(formData).unwrap();
      console.log("Avatar upload result:", result);
      // Force refetch to get updated data
      await refetch();
      console.log("Refetch completed");
      Swal.fire({
        icon: 'success',
        title: 'Avatar Updated',
        text: 'Your profile picture has been updated successfully.',
        confirmButtonColor: '#ffbf00',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error?.data?.message || 'Failed to update avatar. Please try again.',
        confirmButtonColor: '#ffbf00'
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="overflow-y-auto">
      <div className="px-5 pb-5 h-full">
        <div className="bg-[#ffbf00] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-90 transition"
            aria-label="Go back"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Profile</h1>
        </div>
        <div className="mx-auto flex flex-col justify-center items-center">
          {/* Profile Picture Section */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-3xl">
              Error loading profile: {error?.message || error?.data?.message || 'Failed to fetch profile'}
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-center items-center bg-[#ffbf00] mt-5 text-white w-full max-w-3xl mx-auto p-4 md:p-5 gap-4 md:gap-5 rounded-lg">
            <div className="relative">
              <div className="w-[122px] h-[122px] bg-[#ffbf00] rounded-full border-4 border-white shadow-xl flex justify-center items-center">
                <img
                  src={adminAvatar}
                  alt="profile"
                  className="h-30 w-32 rounded-full"
                />
                {/* Upload Icon */}
                <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <label htmlFor="profilePicUpload" className="cursor-pointer">
                    <FaCamera className="text-[#575757]" />
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="profilePicUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUploadingAvatar}
                  />
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg sm:text-xl md:text-3xl font-bold">
                {isLoading ? "Loading..." : adminName}
              </p>
              <p className="text-base sm:text-lg font-semibold capitalize">
                {isLoading ? "..." : adminRole}
              </p>
            </div>
          </div>

          {/* Tab Navigation Section */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 text-sm sm:text-base md:text-xl font-semibold my-4 md:my-5">
            <p
              onClick={() => setActiveTab("editProfile")}
              className={`cursor-pointer px-3 py-1 rounded-md pb-1 ${activeTab === "editProfile"
                  ? "text-[#111827] border-b-2 border-[#111827]"
                  : "text-[#6A6D76]"
                }`}
            >
              Edit Profile
            </p>
            <p
              onClick={() => setActiveTab("changePassword")}
              className={`cursor-pointer px-3 py-1 rounded-md pb-1 ${activeTab === "changePassword"
                  ? "text-[#111827] border-b-2 border-[#111827]"
                  : "text-[#6A6D76]"
                }`}
            >
              Change Password
            </p>
          </div>

          {/* Tab Content Section */}
          <div className="flex justify-center items-center p-4 md:p-5 rounded-md w-full">
            <div className="w-full max-w-3xl">
              {activeTab === "editProfile" && <EditProfile />}
              {activeTab === "changePassword" && <ChangePass />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
