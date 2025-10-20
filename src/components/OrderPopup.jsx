import { useEffect, useState } from "react";
import { playAlertSound } from "../utils/soundUtils";

const OrderPopup = ({ order, onAccept, onReject, timeout = 30 }) => {
  const [timeLeft, setTimeLeft] = useState(timeout);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!order) return;

    playAlertSound();
    setTimeLeft(timeout);
    setProgress(100);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        setProgress((next / timeout) * 100);
        if (next <= 0) {
          clearInterval(interval);
          console.log("⏰ Auto-rejecting order:", order.orderId);
          onReject(order.orderId);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">🧪 New Order Request</h2>
        <p className="text-gray-600 mb-4">
          New order from <strong>{order.userName}</strong>
        </p>

        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="#10b981"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="276"
                strokeDashoffset={(progress / 100) * 276}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
              {timeLeft}s
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => onReject(order.orderId)}
            className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Reject
          </button>
          <button
            onClick={() => onAccept(order.orderId)}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Accept
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Expires in {timeout} seconds.
        </p>
      </div>
    </div>
  );
};

export default OrderPopup;
