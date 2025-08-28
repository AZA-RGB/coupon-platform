import axios from "axios";
import Cookies from "js-cookie";

const refreshToken = async () => {
  try {
    while (!refreshTokens) {
      let refreshTokens = Cookies.get("refreshToken");

      console.log(refreshTokens);
      if (!refreshTokens) throw new Error("No refresh token found");

      const response = await axios.post(
        "http://164.92.67.78:3000/api/auth/refresh-token",
        {},
        {
          headers: {
            lang: "ar",
            Authorization: `Bearer ${refreshTokens}`,
          },
        },
      );

      const { access_token } = response.data.data;
      Cookies.set("token", access_token);
      return access_token;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    // throw error;
  }
};

export default refreshToken;
