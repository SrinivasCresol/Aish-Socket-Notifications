import { commonRequest } from "./apiClient";
import { BASE_URL } from "./helpers";

export const phlebotomistLogin = async (data) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/auth/phlebotomist/login`,
    data
  );
};

export const doctorLogin = async (data) => {
  return await commonRequest("POST", `${BASE_URL}/auth/doctor/login`, data);
};

export const nurseLogin = async (data) => {
  return await commonRequest("POST", `${BASE_URL}/auth/nurse/login`, data);
};

export const physioLogin = async (data) => {
  return await commonRequest("POST", `${BASE_URL}/auth/physio/login`, data);
};

export const elderlyCareLogin = async (data) => {
  return await commonRequest(
    "POST",
    `${BASE_URL}/auth/elderlyCare/login`,
    data
  );
};

export const careTakerLogin = async (data) => {
  return await commonRequest("POST", `${BASE_URL}/auth/careTaker/login`, data);
};

export const radiologyLabLogin = async (data) => {
  return await commonRequest("POST", `${BASE_URL}/auth/lab/login`, data);
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
