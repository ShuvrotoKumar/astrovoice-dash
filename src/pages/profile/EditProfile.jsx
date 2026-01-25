function EditProfile() {
  return (
    <div className="w-full flex justify-center items-center p-4">
      <div className="bg-[#393d4a] w-full max-w-xl px-4 sm:px-6 md:px-8 py-5 rounded-md border border-[#4a5060] shadow-sm">
        <p className="text-white text-center font-bold text-xl sm:text-2xl mb-5">
          Edit Your Profile
        </p>
        <form className="space-y-4">
          <div>
            <label className="text-sm md:text-base text-white mb-2 font-semibold block">
              User Name
            </label>
            <input
              type="text"
              name="fullName"
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
              className="w-full px-4 py-3 border border-[#4a5060] rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#ffbf00] bg-[#2a2a2a] text-white"
              placeholder="Enter contact number"
              required
            />
          </div>

          <div className="text-center pt-2">
            <button className="bg-[#ffbf00] text-white font-semibold w-full py-3 rounded-lg hover:opacity-95 transition">
              Save & Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
