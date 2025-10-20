import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getRoleID } from "../utils/storageUtils";
import { SOCKET_URL } from "../api/helpers";

const SocketManager = ({ onNewOrder, onOrderRemoved, onOrderAccepted }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const vendorId = getRoleID();
    if (!vendorId) {
      console.warn("⚠️ Vendor ID not found, socket not connecting");
      return;
    }

    console.log("🔌 Connecting to socket:", SOCKET_URL);

    const socket = io(SOCKET_URL, {
      query: { vendorId },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
      socket.emit("register_vendor", vendorId); // Important for vendor mapping
    });

    // 🆕 When a new order is broadcast from server
    socket.on("new_order_alert", (order) => {
      console.log("📦 New order received via socket:", order);
      onNewOrder && onNewOrder(order);
    });

    // 🚫 When another vendor already accepted this order
    socket.on("order_removed", (data) => {
      console.log("🚫 Order removed:", data);
      onOrderRemoved && onOrderRemoved(data.orderId);
    });

    // 🎉 When this vendor successfully accepts
    socket.on("order_accept_success", (data) => {
      console.log("🎉 Order accept success:", data);
      onOrderAccepted && onOrderAccepted(data);
    });

    // ❌ If acceptance fails
    socket.on("order_accept_error", (data) => {
      console.error("❌ Order accept error:", data);
      alert(data.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚡ Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
      console.log("🔌 Socket disconnected cleanly");
    };
  }, []);

  // Expose this so popup can call accept_order
  const acceptOrder = (orderId) => {
    const vendorId = getRoleID();
    const socket = socketRef.current;
    if (!vendorId || !socket) return;
    console.log("🟢 Sending accept_order for:", orderId);
    socket.emit("accept_order", { orderId, vendorId });
  };

  return { acceptOrder };
};

export default SocketManager;
