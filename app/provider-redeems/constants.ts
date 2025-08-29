import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://164.92.67.78:3002/api";

export const fetchRedeems = async (search = '') => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const response = await axios.get(`${API_BASE_URL}/redeems/my-redeems?${params.toString()}`, {
      headers: {
        "authorization": `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });

    const { data: redeems } = response.data;

    if (!Array.isArray(redeems)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: redeems is not an array");
    }

    return {
      redeems: redeems.map((redeem) => ({
        id: redeem.id,
        couponName: redeem.purchase_coupon?.coupon?.name || "Unknown",
        customerName: redeem.customer?.name || "Unknown",
        purchaseKey: redeem.purchase_coupon?.purchase_key || "N/A",
        price: redeem.purchase_coupon?.coupon?.price || "0.00",
        amount: redeem.purchase_coupon?.amount || "0",
        redeemDate: redeem.date ? new Date(redeem.date).toISOString() : new Date().toISOString(),
        couponDescription: redeem.purchase_coupon?.coupon?.description || "No description",
        couponCode: redeem.purchase_coupon?.coupon?.coupon_code || "N/A",
        providerName: redeem.purchase_coupon?.coupon?.provider?.name || "Unknown",
        customerEmail: redeem.customer?.email || "No email",
        customerPhone: redeem.customer?.phone || "No phone",
      })),
    };
  } catch (error) {
    console.error("Error fetching redeems:", error);
    return { redeems: [] };
  }
};