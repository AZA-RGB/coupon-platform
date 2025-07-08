import axios from "axios";

const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";
const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";

export const fetchSeasonalEvents = async (page = 1, perPage = 10) => {
  try {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    const response = await axios.get(`http://164.92.67.78:3002/api/seasonal-events/index?${params.toString()}`);
    const { data } = response.data;

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      events: data.data.map((event) => ({
        id: event.id,
        userId: event.user_id || "Unknown",
        title: event.title || "Untitled",
        description: event.description || "No description",
        fromDate: event.from_date ? new Date(event.from_date).toISOString() : new Date().toISOString(),
        toDate: event.to_date ? new Date(event.to_date).toISOString() : new Date().toISOString(),
        status: event.seasonal_event_status === 0 ? "active" : "inactive",
        image: event.files && event.files.length > 0 ? `${CDN_BASE_URL}/${event.files[0].path}` : DEFAULT_IMAGE,
        couponsCount: event.coupons ? event.coupons.length : 0,
        coupons: event.coupons.map((coupon) => ({
          id: coupon.id,
          couponId: coupon.coupon_id,
          name: coupon.coupon.name || "Unknown",
          couponCode: coupon.coupon.coupon_code || "N/A",
          price: coupon.coupon.price || "0",
        })),
      })),
      totalPages: data.last_page || 1,
      currentPage: data.current_page || 1,
    };
  } catch (error) {
    console.error("Error fetching seasonal events:", error);
    return { events: [], totalPages: 1, currentPage: 1 };
  }
};

export const deleteSeasonalEvent = async (id) => {
  try {
    const response = await axios.delete(`http://164.92.67.78:3002/api/seasonal-events/${id}`);
    console.log(`Delete response for event ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    return { success: false, error };
  }
};

export const createSeasonalEvent = async (formData) => {
  try {
    const response = await axios.post(`http://164.92.67.78:3002/api/seasonal-events/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(`Create response for event:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error creating event:`, error);
    return { success: false, error };
  }
};