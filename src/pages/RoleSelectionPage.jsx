import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    if (role === "vendor") {
      navigate("/login");
    } else if (role === "user") {
      navigate("/user-login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
        <h2 className="text-2xl font-semibold mb-6">Select Role</h2>
        <div className="space-y-4">
          <button
            className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            onClick={() => handleSelect("vendor")}
          >
            Vendor
          </button>
          <button
            className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
            onClick={() => handleSelect("user")}
          >
            User
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
