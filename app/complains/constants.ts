import axios from "axios";

const API_BASE_URL = "http://164.92.67.78:3002/api";

export const fetchComplaints = async (page = 1, perPage = 10, search = '', complainableType = '') => {
  try {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    if (search) params.append('search', search);
    if (complainableType) params.append('complainable_type', complainableType);

    const response = await axios.get(`${API_BASE_URL}/complains/all?${params.toString()}`);
    const { data } = response.data;

    if (!data || !Array.isArray(data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      complaints: data.map((complaint) => ({
        id: complaint.id,
        userId: complaint.user_id || "Unknown",
        title: complaint.title || "Untitled",
        content: complaint.content || "No content",
        complainableId: complaint.complainable_id || null,
        complainableType: complaint.complainable_type || "Unknown",
        complainable: complaint.complainable ? {
          id: complaint.complainable.id,
          name: complaint.complainable.name || complaint.complainable.user?.name || "Unknown",
          description: complaint.complainable.description || null,
          price: complaint.complainable.price || null,
          couponCode: complaint.complainable.coupon_code || null,
          location: complaint.complainable.location || null,
        } : null,
      })),
      totalPages: Math.ceil(data.length / perPage), 
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return { complaints: [], totalPages: 1, currentPage: 1 };
  }
};

export const deleteComplaint = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/complains/${id}`);
    console.log(`Delete response for complaint ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting complaint ${id}:`, error);
    return { success: false, error };
  }
};