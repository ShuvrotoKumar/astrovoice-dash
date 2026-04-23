import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useChangePasswordMutation } from "../../redux/api/authApi";
import Swal from 'sweetalert2';

function ChangePass() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all fields',
        confirmButtonColor: '#ffbf00'
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'New password and confirm password do not match',
        confirmButtonColor: '#ffbf00'
      });
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Password Changed',
        text: 'Your password has been changed successfully.',
        confirmButtonColor: '#ffbf00',
        timer: 2000,
        timerProgressBar: true
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Password change error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Change Failed',
        text: error?.data?.message || 'Failed to change password. Please try again.',
        confirmButtonColor: '#ffbf00'
      });
    }
  };

  return (
    <div className="bg-[#393d4a] w-full max-w-xl mx-auto px-4 sm:px-6 md:px-8 pt-8 py-5 rounded-md border border-[#4a5060] shadow-sm">
      <p className="text-[#111827] text-center font-bold text-xl sm:text-2xl mb-5">
        Change Password
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full">
          <label
            htmlFor="oldPassword"
            className="text-sm md:text-base text-white mb-2 font-semibold"
          >
            Current Password
          </label>
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="**********"
              className="w-full bg-[#393d4a] border border-gray-300 rounded-md outline-none px-4 py-3 placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#6A6D76]"
            >
              {showPassword ? (
                <IoEyeOffOutline className="w-5 h-5" />
              ) : (
                <IoEyeOutline className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="newPassword"
            className="text-sm md:text-base text-white mb-2 font-semibold"
          >
            New Password
          </label>
          <div className="w-full relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="**********"
              className="w-full bg-[#393d4a] border border-gray-300 rounded-md outline-none px-4 py-3 placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#6A6D76]"
            >
              {showNewPassword ? (
                <IoEyeOffOutline className="w-5 h-5" />
              ) : (
                <IoEyeOutline className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="confirmNewPassword"
            className="text-sm md:text-base text-white mb-2 font-semibold"
          >
            Confirm New Password
          </label>
          <div className="w-full relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="**********"
              className="w-full bg-[#393d4a] border border-gray-300 rounded-md outline-none px-4 py-3 placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#6A6D76]"
            >
              {showConfirmPassword ? (
                <IoEyeOffOutline className="w-5 h-5" />
              ) : (
                <IoEyeOutline className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#ffbf00] text-white font-semibold w-full py-3 rounded-md hover:opacity-95 transition disabled:opacity-50"
          >
            {isLoading ? 'Changing...' : 'Save & Change'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePass;
