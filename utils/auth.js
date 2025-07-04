import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, BASE_URL } from "./constant";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "./localStorage";
import axiosInstance from "@/helpers/axiosInstance";

export const storeUserInfo = (token) => {
  return setToLocalStorage(ACCESS_TOKEN, token);
};

export const getUserInfo = () => {
  const accessToken = getFromLocalStorage(ACCESS_TOKEN);

  if (accessToken) {
    const userData = jwtDecode(accessToken);
    return userData;
  } else {
    return null;
  }
};

export const isUserLoggedIn = () => {
  const accessToken = getFromLocalStorage(ACCESS_TOKEN);

  if (accessToken) {
    return true;
  } else {
    return false;
  }
};

export const removeUserInfo = () => {
  return removeFromLocalStorage(ACCESS_TOKEN);
};

export const getNewAccessToken = async () => {
  const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return await response.json();
};

export const logout = async () => {
  await axiosInstance.post(`${BASE_URL}/auth/logout`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
