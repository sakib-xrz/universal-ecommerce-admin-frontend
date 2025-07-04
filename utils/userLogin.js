import axiosInstance from "@/helpers/axiosInstance";
import { storeUserInfo } from "./auth";
import { BASE_URL } from "./constant";
import setAccessToken from "@/actions/setAccessToken";
import { jwtDecode } from "jwt-decode";

const userLogin = async (payload) => {
  const urlParams = new URLSearchParams(window?.location?.search);
  const existingRedirectURL = urlParams.get("next");

  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/auth/login`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );

    const { accessToken, refreshToken, need_password_change } =
      response?.data || {};

    if (accessToken) {
      const { role } = jwtDecode(accessToken);

      if (role === "CUSTOMER") {
        throw new Error("You are not allowed to access this page");
      }

      storeUserInfo(accessToken);
      await setAccessToken(accessToken, refreshToken, {
        need_password_change,
        redirect: existingRedirectURL
          ? existingRedirectURL
          : `/${role === "SUPER_ADMIN" ? "super-admin" : role.toLowerCase()}/dashboard`,
      });

      // window.location.reload();
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export default userLogin;
