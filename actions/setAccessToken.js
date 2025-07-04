"use server";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const setAccessToken = async (accessToken, refreshToken, option) => {
  cookies().set(ACCESS_TOKEN, accessToken, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  cookies().set(REFRESH_TOKEN, refreshToken, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  if (option && option.need_password_change) {
    redirect("/change-password");
  }
  if (option && !option.need_password_change && option.redirect) {
    redirect(option.redirect);
  }
};

export default setAccessToken;
