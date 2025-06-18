import axios from "axios";

export const apiConnector = async (method, url, headers, bodyData, params) => {
  try {
    const response = await axios({
      method,
      url,
      headers: headers || {},
      data: bodyData || null,
      params: params || null,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};
