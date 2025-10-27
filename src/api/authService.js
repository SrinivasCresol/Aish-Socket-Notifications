import { commonRequest } from "./apiClient";
import { BASE_URL } from "./helpers";

export const loginVendor = async (data) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/auth/phlebotomist/login`,
    data
  );
};

export const logoutVendor = async (header) => {
  return await commonRequest("POST", `${BASE_URL}/auth/logout`, header);
};

export const userLogin = async (data) => {
  return await commonRequest("POST", `${BASE_URL}/user/login`, data);
};

export const verifyUserOtp = async (data) => {
  return await commonRequest("POST", `${BASE_URL}/user/verify-otp`, data);
};
