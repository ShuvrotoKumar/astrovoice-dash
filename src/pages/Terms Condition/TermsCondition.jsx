import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoChevronBack } from "react-icons/io5";
import { useUpdateTermsAndConditionsMutation } from "../../redux/api/termsApi";
import Swal from 'sweetalert2';

// Add custom styles for ReactQuill toolbar
const quillStyles = `
  .ql-toolbar .ql-stroke {
    stroke: black !important;
  }
  .ql-toolbar .ql-fill {
    fill: black !important;
  }
  .ql-toolbar .ql-picker {
    color: black !important;
  }
  .ql-toolbar button {
    color: black !important;
  }
  .ql-toolbar .ql-picker-label {
    color: black !important;
  }
  .ql-toolbar .ql-picker-options {
    color: black !important;
  }
`;

function TermsCondition() {
  const navigate = useNavigate();
  const [updateTermsAndConditions, { isLoading: isUpdating }] = useUpdateTermsAndConditionsMutation();
  const [content, setContent] = useState("");

  const handleSave = async () => {
    if (!content.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Empty Content',
        text: 'Terms & conditions content cannot be empty',
        confirmButtonColor: '#ffbf00'
      });
      return;
    }

    try {
      await updateTermsAndConditions({ requestData: { content } }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: 'Terms & conditions have been updated successfully',
        confirmButtonColor: '#ffbf00',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error('Terms update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error?.data?.message || 'Failed to update terms & conditions',
        confirmButtonColor: '#ffbf00'
      });
    }
  };

  return (
    <>
      <style>{quillStyles}</style>
      <div className="px-5 md:px-0 py-5 md:py-10">
      <div className="bg-[#ffbf00] px-5 py-3 rounded-md mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl font-bold">Terms & Condition</h1>
      </div>

      <div className=" bg-[#393d4a] rounded shadow p-5 h-full border border-[#4a5060]">
        <ReactQuill
          style={{ padding: "10px" }}
          theme="snow"
          value={content}
          onChange={setContent}
        />
      </div>
      <div className="text-center py-5">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-[#ffbf00] text-white font-semibold w-full py-2 rounded transition duration-200 disabled:opacity-50"
        >
          {isUpdating ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
    </>
  );
}

export default TermsCondition;
