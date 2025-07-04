"use server";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constant";
import { cookies } from "next/headers";

const removeToken = async () => {
  cookies().delete(ACCESS_TOKEN);
  cookies().delete(REFRESH_TOKEN);
};

export default removeToken;
