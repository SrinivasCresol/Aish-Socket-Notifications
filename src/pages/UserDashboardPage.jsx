import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { acceptUserPayment, getPendingPayments } from "../api/userPayments";
import UserSocketManager from "../components/userSocketManager";
import { clearUserAuth } from "../utils/storageUtils";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [pendingList, setPendingList] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState({});
  const navigate = useNavigate();

  // Fetch pending payments
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await getPendingPayments();
        if (res.data?.success) {
          setPendingList(res.data.pendingPayments);
          toast.success("Pending payments loaded");
        } else {
          toast.error("Failed to fetch pending payments");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching pending payments");
      }
    };
    fetchPending();
  }, []);

  const handlePaymentMethodChange = (orderId, method) => {
    setSelectedMethods((prev) => ({ ...prev, [orderId]: method }));
  };

  const handleApprovePayment = async (payment) => {
    const { orderId, amountDue, context } = payment;
    const paymentMethod = selectedMethods[orderId];

    if (!paymentMethod) {
      toast.error("Select a payment method first");
      return;
    }

    try {
      const res = await acceptUserPayment({
        orderId,
        amountDue,
        context,
        paymentStatus: "paid",
        paymentMethod,
      });

      if (res.data?.success) {
        toast.success(`Payment for ${orderId} marked as paid`);
        // Remove from list
        setPendingList((prev) => prev.filter((p) => p.orderId !== orderId));
      } else {
        toast.error(res.data?.message || "Payment update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while updating payment");
    }
  };

  const handleLogout = () => {
    clearUserAuth();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">💰 Pending Payments</h2>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <UserSocketManager />
      <h2 className="text-2xl font-semibold mb-6">💰 Pending Payments</h2>

      {pendingList.length === 0 ? (
        <p>No pending payments 🎉</p>
      ) : (
        <div className="space-y-4">
          {pendingList.map((payment) => (
            <div
              key={payment.orderId}
              className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div>
                <h3 className="font-semibold text-lg">{payment.orderId}</h3>
                <p>Amount Due: ₹{payment.amountDue}</p>
                <p className="text-sm text-gray-500">
                  Context: {payment.context}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedMethods[payment.orderId] || ""}
                  onChange={(e) =>
                    handlePaymentMethodChange(payment.orderId, e.target.value)
                  }
                  className="border rounded-lg p-2"
                >
                  <option value="">Select Method</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="netBanking">Net Banking</option>
                </select>

                <button
                  onClick={() => handleApprovePayment(payment)}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
