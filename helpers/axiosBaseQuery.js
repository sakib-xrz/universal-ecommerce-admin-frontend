import axiosInstance from "./axiosInstance";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({
    url,
    method,
    data,
    params,
    headers = {
      "Content-Type": "application/json",
    },
  }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return {
        data: {
          data: result.data,
          meta: result.meta,
        },
      };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError?.status,
          message: axiosError?.message,
          errorMessages: axiosError?.errorMessages,
        },
      };
    }
  };

export default axiosBaseQuery;
