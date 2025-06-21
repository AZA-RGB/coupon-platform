import axios from "axios";

export const fetchCouponTypes = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get("http://164.92.67.78:3002/api/coupon-types/index", {
      params: { page, per_page: limit },
    });
    console.log("Raw fetch coupon types response:", response.data);
    const couponTypes = Array.isArray(response.data.data.data) ? response.data.data.data : [];
    return {
      couponTypes,
      totalPages: response.data.data.last_page || 1,
      currentPage: response.data.data.current_page || page,
    };
  } catch (error) {
    console.error("Error fetching coupon types:", error);
    return {
      couponTypes: [],
      totalPages: 1,
      currentPage: page,
    };
  }
};

export const deleteCouponType = async (id) => {
  try {
    const response = await axios.delete(`http://164.92.67.78:3002/api/coupon-types/${id}`);
    console.log(`Delete response for coupon type ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting coupon type ${id}:`, error);
    return { success: false, error, id };
  }
};

export const couponTypeOptions = [
  { label: "Discount Coupon", value: "discount" },
  { label: "BOGO", value: "bogo" },
  { label: "Free Shipping", value: "free_shipping" },
  { label: "Seasonal Offer", value: "seasonal" },
  { label: "Referral Coupon", value: "referral" },
  { label: "New Customer Coupon", value: "new_customer" },
];

export const topCategoriesData = [
  {
    rank: 1,
    category: "Electronics",
    sales: 1200,
    popularity: 95,
  },
  {
    rank: 2,
    category: "Fashion",
    sales: 850,
    popularity: 80,
  },
  {
    rank: 3,
    category: "Home & Kitchen",
    sales: 600,
    popularity: 65,
  },
  {
    rank: 4,
    category: "Books",
    sales: 450,
    popularity: 50,
  },
  {
    rank: 5,
    category: "Sports & Outdoors",
    sales: 300,
    popularity: 40,
  },
];