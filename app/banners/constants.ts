import axios from "axios";

const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";
const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";

export const fetchBanners = async (page = 1, search = '') => {
  try {
    let url = `http://164.92.67.78:3002/api/banners/all?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await axios.get(url);
    const { data } = response.data;

    if (!data || !Array.isArray(data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      banners: data.map((banner) => ({
        id: banner.id,
        name: banner.name || "Untitled",
        description: banner.description || "No description",
        image: banner.files && banner.files.length > 0 ? `${CDN_BASE_URL}/${banner.files[0].path}` : DEFAULT_IMAGE,
        createdAt: banner.created_at ? new Date(banner.created_at).toISOString() : new Date().toISOString(),
      })),
      totalPages: response.data.last_page || 1,
      currentPage: response.data.current_page || 1,
    };
  } catch (error) {
    console.error("Error fetching banners:", error);
    return { banners: [], totalPages: 1, currentPage: 1 };
  }
};

export const createBanner = async (bannerData) => {
  try {
    const formData = new FormData();
    formData.append("name", bannerData.name);
    formData.append("description", bannerData.description);
    if (bannerData.file) {
      formData.append("file", bannerData.file);
    }

    const response = await axios.post(
      `http://164.92.67.78:3002/api/banners/create`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return { success: true, response };
  } catch (error) {
    console.error("Error creating banner:", error);
    return { success: false, error };
  }
};

export const updateBanner = async (id, bannerData) => {
  try {
    const formData = new FormData();
    formData.append("name", bannerData.name);
    formData.append("description", bannerData.description);
    if (bannerData.file) {
      formData.append("file", bannerData.file);
    }

    const response = await axios.put(
      `http://164.92.67.78:3002/api/banners/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return { success: true, response };
  } catch (error) {
    console.error(`Error updating banner ${id}:`, error);
    return { success: false, error };
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await axios.delete(`http://164.92.67.78:3002/api/banners/${id}`);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting banner ${id}:`, error);
    return { success: false, error };
  }
};