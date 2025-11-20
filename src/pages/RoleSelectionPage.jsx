import { useNavigate } from "react-router-dom";

const roles = [
  "phlebotomist",
  "doctor",
  "nurse",
  "physio",
  "elderlyCare",
  "careTaker",
  "radiologyLab",
  "user",
];

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    if (role === "user") {
      navigate("/user-login");
    } else {
      navigate(`/login?role=${role}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
        <h2 className="text-2xl font-semibold mb-6">Select Role</h2>

        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role}
              className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition capitalize"
              onClick={() => handleSelect(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
