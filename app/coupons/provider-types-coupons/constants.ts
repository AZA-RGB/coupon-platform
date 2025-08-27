import axios from "axios";

export const DEFAULT_IMAGE = "https://cdn.pixabay.com/photo/2018/04/18/18/56/percent-3331252_1280.png";
export const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";

export const fetchCouponTypes = async (page = 1, search = '', status = '') => {
  try {
    let url = `http://164.92.67.78:3002/api/coupon-types/index?page=${page}&per_page=10`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status !== '') url += `&status=${status}`;

    const response = await axios.get(url);
    const { data } = response.data;

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      couponTypes: data.data.map((type) => ({
        id: type.id,
        name: type.name || "Untitled",
        description: type.description || "No description",
        status: type.status || "pending",
        couponsCount: type.coupons_count || 0,
        image: type.files && type.files.length > 0 ? `${CDN_BASE_URL}/${type.files[0].path}` : DEFAULT_IMAGE,
      })),
      totalPages: data.last_page,
      currentPage: data.current_page,
    };
  } catch (error) {
    console.error("Error fetching coupon types:", error);
    return { couponTypes: [], totalPages: 1, currentPage: 1 };
  }
};

export const fetchTopCategories = async () => {
  try {
    const url = `http://164.92.67.78:3002/api/categories/top-selling-categories`;
    const response = await axios.get(url);
    const { data } = response.data;

    if (!data || !Array.isArray(data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return data.map((item, index) => ({
      rank: index + 1,
      category: item.name || "Unknown",
      sales: item.sales_count || 0,
      popularity: Math.min(95 - index * 10, 95),
    })).slice(0, 5); // Limit to top 5 categories
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return [];
  }
};

