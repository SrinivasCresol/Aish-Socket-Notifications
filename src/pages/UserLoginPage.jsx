import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userLogin, verifyUserOtp } from "../api/authService";
import { setUserAuth } from "../utils/storageUtils";

const UserLoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const res = await userLogin({ mobileNumber });
      if (res.data?.success) {
        toast.success("OTP sent successfully!");
        setOtpId(res.data.otpId);
        setIsOtpSent(true);
      } else {
        toast.error(res.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyUserOtp({
        otpId,
        receivedOTP: otp,
        fcmToken: "",
      });
      if (res.data?.success) {
        const { token, roleID } = res.data;
        setUserAuth(token, roleID.roleId);
        toast.success("Login successful!");
        navigate("/user-dashboard");
      } else {
        toast.error(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error verifying OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-6">User Login</h2>

        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        {!isOtpSent && (
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
          >
            Send OTP
          </button>
        )}

        {isOtpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-3 rounded mb-4"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserLoginPage;
