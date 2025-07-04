import axios from "axios";

const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";
const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";
const API_BASE_URL = "http://164.92.67.78:3002/api";

export const fetchProviders = async (page = 1, perPage = 10) => {
  try {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    const response = await axios.get(`${API_BASE_URL}/providers/index?${params.toString()}`);
    const { data } = response.data;

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      providers: data.data.map((provider) => ({
        id: provider.id,
        name: provider.name || provider.user?.name || "Unknown",
        email: provider.user?.email || "No email",
        phone: provider.user?.phone_number || "No phone",
        requestDate: provider.created_at ? new Date(provider.created_at).toISOString() : new Date().toISOString(),
        status: provider.status || "pending", // Assuming status might be added later
        totalCoupons: provider.coupons ? provider.coupons.length : 0,
        totalPackages: provider.packages ? provider.packages.length : 0,
        image: provider.profile_image?.path ? `${CDN_BASE_URL}/${provider.profile_image.path}` : DEFAULT_IMAGE,
        location: provider.location || "Unknown",
        description: provider.description || "No description",
      })),
      totalPages: data.last_page,
      currentPage: data.current_page,
    };
  } catch (error) {
    console.error("Error fetching providers:", error);
    return { providers: [], totalPages: 1, currentPage: 1 };
  }
};

export const deleteProvider = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/providers/${id}`);
    console.log(`Delete response for provider ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting provider ${id}:`, error);
    return { success: false, error };
  }
};

export const fetchProviderDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/providers/${id}`);
    const { data } = response.data;
    return {
      id: data.id,
      name: data.name || data.user?.name || "Unknown",
      email: data.user?.email || "No email",
      phone: data.user?.phone_number || "No phone",
      location: data.location || "Unknown",
      description: data.description || "No description",
      image: data.profile_image?.path ? `${CDN_BASE_URL}/${data.profile_image.path}` : DEFAULT_IMAGE,
    };
  } catch (error) {
    console.error(`Error fetching provider details ${id}:`, error);
    throw error;
  }
};

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

export const requestsData = [
  {
    id: 1,
    name: "John Doe",
    requestDateTime: "2025-05-27 08:30 AM",
  },
  {
    id: 2,
    name: "Jane Smith",
    requestDateTime: "2025-05-26 03:15 PM",
  },
  {
    id: 3,
    name: "Alice Johnson",
    requestDateTime: "2025-05-26 09:45 AM",
  },
  {
    id: 4,
    name: "Bob Wilson",
    requestDateTime: "2025-05-25 06:20 PM",
  },
  {
    id: 5,
    name: "Emma Brown",
    requestDateTime: "2025-05-25 11:10 AM",
  },
];