import axios from "axios";

const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";
const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";

export const fetchReels = async (page = 1, perPage = 10) => {
  try {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    const response = await axios.get(`http://164.92.67.78:3002/api/reels/index?${params.toString()}`);
    const { data } = response.data;

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      reels: data.data.map((reel) => ({
        id: reel.id,
        providerId: reel.provider_id || "Unknown",
        description: reel.description || "No description",
        date: reel.date ? new Date(reel.date).toISOString() : new Date().toISOString(),
        media: reel.reel?.path ? `${CDN_BASE_URL}/${reel.reel.path}` : DEFAULT_IMAGE,
        fileType: reel.reel?.file_type || 0, // 0 for image, 1 for video
        providerName: reel.provider?.name || "Unknown",
      })),
      totalPages: data.last_page || 1,
      currentPage: data.current_page || 1,
    };
  } catch (error) {
    console.error("Error fetching reels:", error);
    return { reels: [], totalPages: 1, currentPage: 1 };
  }
};

export const addReel = async (formData) => {
  try {
    const response = await axios.post(`http://164.92.67.78:3002/api/reels/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Add reel response:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Error adding reel:", error);
    return { success: false, error };
  }
};

export const deleteReel = async (reelId) => {
  try {
    const response = await axios.delete(`http://164.92.67.78:3002/api/reels/${reelId}`);
    console.log(`Delete reel response for reel ${reelId}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting reel ${reelId}:`, error);
    return { success: false, error };
  }
};