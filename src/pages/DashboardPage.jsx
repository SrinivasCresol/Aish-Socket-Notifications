import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { clearSession, getRoleID } from "../utils/storageUtils";
import { getPendingOrders } from "../api/vendorService";
import { logoutVendor } from "../api/authService";
import SocketManager from "../components/SocketManager";
import OrderPopup from "../components/OrderPopup";

const DashboardPage = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch pending orders
  const fetchPendingOrders = async () => {
    const vendorId = getRoleID();
    if (!vendorId) return;
    try {
      const data = await getPendingOrders(vendorId);
      setOrders(data.data.pendingOrders);
    } catch (err) {
      toast.error("Failed to fetch orders");
      console.error("❌ Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    await logoutVendor();
    clearSession();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // ✅ Socket Handlers with toast feedback
  const handleNewOrder = (order) => {
    console.log("📦 New order received:", order);
    toast.success(`New order received from ${order.userName}`);
    setActiveOrder(order);
  };

  const handleOrderRemoved = (orderId) => {
    console.log("🚫 Order removed:", orderId);
    toast.error("Order removed (accepted by another vendor)");
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    if (activeOrder?.orderId === orderId) {
      setActiveOrder(null);
    }
  };

  const handleOrderAccepted = (data) => {
    console.log("🎉 Order accepted successfully:", data);
    toast.success(`Order accepted successfully! OTP: ${data.otpCode}`);
    setActiveOrder(null);
    fetchPendingOrders();
  };

  // ✅ Initialize socket once
  const { acceptOrder } = SocketManager({
    onNewOrder: handleNewOrder,
    onOrderRemoved: handleOrderRemoved,
    onOrderAccepted: handleOrderAccepted,
  });

  const handleRejectOrder = (orderId) => {
    console.log("❎ Order manually rejected:", orderId);
    toast("Order dismissed");
    setActiveOrder(null);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Phlebotomist Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* PENDING ORDERS */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2">Pending Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No pending orders.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map((o) => (
              <li key={o.orderId} className="py-2">
                <div className="flex justify-between">
                  <span>
                    <strong>Order:</strong> {o.orderId}
                  </span>
                  <button
                    onClick={() => setActiveOrder(o)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* POPUP */}
      {activeOrder && (
        <OrderPopup
          order={activeOrder}
          onAccept={(orderId) => acceptOrder(orderId)}
          onReject={handleRejectOrder}
        />
      )}
    </div>
  );
};

export default DashboardPage;
