import { commonRequest } from "./apiClient";
import { BASE_URL } from "./helpers";

export const getPendingOrders = async () => {
  return await commonRequest(
    "GET",
    `${BASE_URL}/order/vendor/pending-requests`
  );
};
