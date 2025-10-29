import { useEffect, useState } from "react";
import { playAlertSound } from "../utils/soundUtils";
import { Calendar, Clock } from "lucide-react";

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
          onReject(order.orderId);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  // Format date & time
  const appointmentDate = new Date(order.appointmentDate).toLocaleDateString(
    "en-GB",
    {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  const appointmentTime = order.timeSlot
    ? `${order.timeSlot} AM`
    : "Not specified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#0E8A8A] text-white p-5 rounded-3xl shadow-2xl w-[380px]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">New Order</h2>
            <div
              onClick={() => onReject(order.orderId)}
              className="cursor-pointer text-gray-300 hover:text-white text-xl"
            >
              ✕
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white/10 rounded-xl p-4 flex justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-sm opacity-80">Appointments Date</p>
                <p className="font-semibold">{appointmentDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-sm opacity-80">Appointments Time</p>
                <p className="font-semibold">{appointmentTime}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl flex items-center gap-3 p-3">
            <img
              src={order.customerProfilePic}
              alt={order.customerName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-gray-900 font-semibold">
                {order.customerName}
              </p>
              <p className="text-gray-500 text-sm">
                {order.items?.map((i) => i.serviceDetails.name).join(", ")}
              </p>
            </div>
          </div>

          {/* View Button */}
          <button
            onClick={() => onAccept(order.orderId)}
            className="bg-white text-[#0E8A8A] py-2 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Accept
          </button>

          {/* Progress / Countdown */}
          <div className="text-center text-sm opacity-80 mt-2">
            Auto reject in {timeLeft}s
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPopup;
