
import axios from "axios";
import Cookies from "js-cookie";

const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";
const DEFAULT_IMAGE =
  "https://cdn.pixabay.com/photo/2017/06/10/06/39/calender-2389150_1280.png";


export const fetchSeasonalEvents = async (page = 1, perPage = 10) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await axios.get(
      `http://164.92.67.78:3002/api/seasonal-events/index?${params.toString()}`
    );
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
        fromDate: event.from_date
          ? new Date(event.from_date).toISOString()
          : new Date().toISOString(),
        toDate: event.to_date
          ? new Date(event.to_date).toISOString()
          : new Date().toISOString(),
        status: event.seasonal_event_status === 0 ? "active" : "inactive",
        image:
          event.files && event.files.length > 0
            ? `${CDN_BASE_URL}/${event.files[0].path}`
            : DEFAULT_IMAGE,
        couponsCount: event.coupons ? event.coupons.length : 0,
        coupons: (event.coupons || []).map((coupon) => {
          const isCoupon = coupon.eventable_type === "coupon";
          return {
            id: coupon.id,
            couponId: coupon.eventable_id,
            name: isCoupon
              ? coupon.eventable?.name || "Unknown"
              : coupon.eventable?.title || "Unknown",
            couponCode: isCoupon
              ? coupon.eventable?.coupon_code || "N/A"
              : "N/A",
            price: isCoupon
              ? coupon.eventable?.price || "0"
              : coupon.eventable?.total_price?.toString() || "0",
          };
        }),
      })),
      totalPages: data.last_page || 1,
      currentPage: data.current_page || 1,
    };
  } catch (error) {
    console.error("Error fetching seasonal events:", error);
    return { events: [], totalPages: 1, currentPage: 1 };
  }
};

export const fetchCoupons = async () => {
  try {
    const response = await axios.get(
      `http://164.92.67.78:3002/api/coupons/index?needToken=true`,
      {
          headers: {
            "authorization": `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
    );
    const { data } = response.data;

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid coupons API response structure:", response.data);
      throw new Error(
        "Invalid API response: coupons data is missing or not an array"
      );
    }

    return data.data.map((coupon) => ({
      id: coupon.id,
      name: coupon.name || "Unnamed Coupon",
      couponCode: coupon.coupon_code || "N/A",
    }));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

export const fetchPackages = async () => {
  try {
    const response = await axios.get(
      `http://164.92.67.78:3002/api/packages/my-packages`,{
          headers: {
            "authorization": `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
    );
    const { data } = response.data;

    if (!data || !Array.isArray(data)) {
      console.error("Invalid packages API response structure:", response.data);
      throw new Error(
        "Invalid API response: packages data is missing or not an array"
      );
    }

    return data.map((pkg) => ({
      id: pkg.id,
      title: pkg.title || "Unnamed Package",
      total_price: "",
    }));
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
};

export const addItemToEvent = async (eventId, itemData) => {
  try {
    const response = await axios.post(
      `http://164.92.67.78:3002/api/seasonal-event-coupons/create`,
      itemData,
      {
          headers: {
            "authorization": `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
    );
    console.log(`Add item response for event ${eventId}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error adding item to event ${eventId}:`, error);
    return { success: false, error };
  }
};
