import { commonRequest } from "./apiClient";
import { BASE_URL } from "./helpers";

// Get all pending payments
export const getPendingPayments = async () => {
  return await commonRequest("GET", `${BASE_URL}/user/order/pending-payments`);
};

// Accept / Mark payment as paid
export const acceptUserPayment = async (data) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/user/order/accept-payment`,
    data
  );
};
