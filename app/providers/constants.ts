import axios from "axios";

const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";
const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";
const API_BASE_URL = "http://164.92.67.78:3002/api";

export const fetchProviders = async (page = 1, perPage = 10, search = '', status = '') => {
  try {
    let url = `${API_BASE_URL}/providers/index?page=${page}&per_page=${perPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status !== '') url += `&provider_status=${status}`;
    
    const response = await axios.get(url);
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
        status: provider.status || "pending",
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

export const fetchTopCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/top-selling-categories`);
    const { data } = response.data;

    if (!data || !Array.isArray(data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return data.slice(0, 4).map((category, index) => ({
      rank: index + 1,
      category: category.name || "Unknown",
      sales: category.sales_count || 0,
      popularity: Math.min((category.sales_count / 15) * 100, 100),
    }));
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return [
      { rank: 1, category: "Travel", sales: 15, popularity: 100 },
      { rank: 2, category: "Restaurants", sales: 9, popularity: 60 },
      { rank: 3, category: "Electronics", sales: 6, popularity: 40 },
      { rank: 4, category: "Fashion", sales: 5, popularity: 33 },
      { rank: 5, category: "Entertainment", sales: 4, popularity: 27 },
    ];
  }
};

export const fetchPendingRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/registration-requests/pending?page=1&per_page=3`);
    const { data } = response.data;
    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }
    return {
      requests: data.data.map((request) => ({
        id: request.id,
        name: request.user?.name || "Unknown",
        requestDateTime: request.created_at ? new Date(request.created_at).toLocaleString() : "Unknown",
        original: {
          id: request.id,
          userId: request.user_id || "Unknown",
          name: request.user?.name || "Unknown",
          email: request.user?.email || "No email",
          phone: request.user?.phone || "No phone",
          createdAt: request.created_at ? new Date(request.created_at).toISOString() : "Unknown",
          location: request.user?.provider?.location || "Unknown",
          description: request.user?.provider?.description || "No description",
          bankId: request.user?.provider?.bank_id || "Unknown",
          categoryId: request.user?.provider?.category_id || "Unknown",
          secretKey: request.user?.provider?.secret_key || "Unknown",
        },
      })),
      count: data.total || data.data.length,
    };
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return { requests: [], count: 0 };
  }
};

export const fetchRequests = async (page = 1, perPage = 10, search = '') => {
  try {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    if (search) params.append('search', search);

    const response = await axios.get(`${API_BASE_URL}/registration-requests/pending?${params.toString()}`);
    const { data } = response.data;

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is not an array");
    }

    return {
      requests: data.data.map((request) => ({
        id: request.id,
        userId: request.user_id || "Unknown",
        name: request.user?.name || "Unknown",
        email: request.user?.email || "No email",
        phone: request.user?.phone || "No phone",
        createdAt: request.created_at ? new Date(request.created_at).toISOString() : "Unknown",
        location: request.user?.provider?.location || "Unknown",
        description: request.user?.provider?.description || "No description",
        bankId: request.user?.provider?.bank_id || "Unknown",
        categoryId: request.user?.provider?.category_id || "Unknown",
        secretKey: request.user?.provider?.secret_key || "Unknown",
      })),
      totalPages: data.total ? Math.ceil(data.total / perPage) : Math.ceil(data.data.length / perPage),
      currentPage: data.current_page || page,
    };
  } catch (error) {
    console.error("Error fetching requests:", error);
    return { requests: [], totalPages: 1, currentPage: 1 };
  }
};

export const approveRequest = async (requestId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/registration-requests/${requestId}/approve`);
    console.log(`Approve response for request ${requestId}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error approving request ${requestId}:`, error);
    return { success: false, error };
  }
};

export const rejectRequest = async (requestId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/registration-requests/${requestId}/reject`);
    console.log(`Reject response for request ${requestId}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error rejecting request ${requestId}:`, error);
    return { success: false, error };
  }
};