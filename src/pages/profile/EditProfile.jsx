import { useState } from "react";
import { useMeQuery, useProfileMutation } from "../../redux/api/adminApi";
import Swal from 'sweetalert2';

function EditProfile() {
  const { data: meData, isLoading, error, refetch } = useMeQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useProfileMutation();
  const [form, setForm] = useState({
    fullname: "",
    mobile: "",
  });

  // Log for debugging
  console.log("Me API Data:", meData);
  console.log("Me API Error:", error);

  const admin = meData?.data?.admin;

  // Populate form when admin data is loaded
  if (admin && !form.fullname) {
    setForm({
      fullname: admin.fullname || "",
      mobile: admin.mobile || "",
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateProfile({
        fullname: form.fullname,
        mobile: form.mobile,
      }).unwrap();

      console.log("Profile update result:", result);
      // Refetch to get updated data
      await refetch();

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        confirmButtonColor: '#ffbf00',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Profile update error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error?.data?.message || 'Failed to update profile. Please try again.',
        confirmButtonColor: '#ffbf00'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-4">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading profile: {error?.message || error?.data?.message || 'Failed to fetch profile'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center p-4">
      <div className="bg-[#393d4a] w-full max-w-xl px-4 sm:px-6 md:px-8 py-5 rounded-md border border-[#4a5060] shadow-sm">
        <p className="text-white text-center font-bold text-xl sm:text-2xl mb-5">
          Edit Your Profile
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm md:text-base text-white mb-2 font-semibold block">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              className="w-full px-4 py-3 border border-[#4a5060] rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#ffbf00] bg-[#2a2a2a] text-white"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-white mb-2 font-semibold block">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full px-4 py-3 border border-[#4a5060] rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#ffbf00] bg-[#2a2a2a] text-white"
              placeholder="Enter mobile number"
            />
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-[#ffbf00] text-white font-semibold w-full py-3 rounded-lg hover:opacity-95 transition disabled:opacity-50"
            >
              {isUpdatingProfile ? "Saving..." : "Save & Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
