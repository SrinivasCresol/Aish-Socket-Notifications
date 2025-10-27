import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { getUserAuth } from "../utils/storageUtils";
import { SOCKET_URL } from "../api/helpers";

const UserSocketManager = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const { roleID } = getUserAuth();
    if (!roleID) return;

    const socket = io(`${SOCKET_URL}/paymentReminders`, {
      transports: ["websocket"],
      query: { userId: roleID },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to User Socket:", socket.id);
      socket.emit("register_user", roleID);
    });

    socket.on("user_registered", (data) => {
      console.log("👤 User registered:", data);
    });

    socket.on("payment_due_reminder", (data) => {
      console.log("💸 Payment reminder received:", data);
      toast(`💰 ${data.title}\n${data.message}`, {
        icon: "💰",
      });
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚡ Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
      console.log("🔌 User socket disconnected");
    };
  }, []);

  return null;
};

export default UserSocketManager;
