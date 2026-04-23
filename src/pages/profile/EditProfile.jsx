import { useState } from "react";
import { useMeQuery } from "../../redux/api/adminApi";

function EditProfile() {
  const { data: meData, isLoading, error } = useMeQuery();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNo: "",
  });

  // Log for debugging
  console.log("Me API Data:", meData);
  console.log("Me API Error:", error);

  const admin = meData?.data?.admin;

  // Populate form when admin data is loaded
  if (admin && !form.fullName) {
    setForm({
      fullName: admin.fullname || "",
      email: admin.email || "",
      contactNo: "",
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // TODO: Connect with editAdmin mutation
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
              User Name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-[#4a5060] rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#ffbf00] bg-[#2a2a2a] text-white"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-white mb-2 font-semibold block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-[#4a5060] rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#ffbf00] bg-[#2a2a2a] text-white"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-white mb-2 font-semibold block">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNo"
              value={form.contactNo}
              onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
              className="w-full px-4 py-3 border border-[#4a5060] rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#ffbf00] bg-[#2a2a2a] text-white"
              placeholder="Enter contact number"
            />
          </div>

          <div className="text-center pt-2">
            <button type="submit" className="bg-[#ffbf00] text-white font-semibold w-full py-3 rounded-lg hover:opacity-95 transition">
              Save & Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
