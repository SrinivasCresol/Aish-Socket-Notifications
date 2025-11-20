import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveSession } from "../utils/storageUtils";
import { loginApiMap } from "../utils/loginHandler";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { search } = useLocation();
  const role = new URLSearchParams(search).get("role");

  if (!role || !loginApiMap[role]) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">Invalid Role Selected</p>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loginFn = loginApiMap[role];
      const res = await loginFn({ email, password });

      if (res?.status === 200) {
        saveSession(res.data.token, res.data.roleId);
        navigate("/dashboard");
      } else {
        setError(res?.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center capitalize">
          {role} Login
        </h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
