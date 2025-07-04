import axios from "axios";

const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";
const API_BASE_URL = "http://164.92.67.78:3002/api";

export const fetchCustomers = async (page = 1, perPage = 10) => {
  try {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    const response = await axios.get(`${API_BASE_URL}/customers/all?${params.toString()}`);
    const { data } = response.data;

    if (!Array.isArray(data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is not an array");
    }

    return {
      customers: data.map((customer) => ({
        id: customer.id,
        name: customer.user?.name || "Unknown",
        email: customer.user?.email || "No email",
        phone: customer.user?.phone_number || "No phone",
        subscribeDate: customer.birth_date ? new Date(customer.birth_date).toISOString() : new Date().toISOString(),
        status: customer.status || "active", // Assuming status might be added later
        totalCoupons: customer.purchases_count || 0,
        image: DEFAULT_IMAGE, // No profile_image in API response
        location: customer.location || "Unknown",
      })),
      totalPages: Math.ceil(data.length / perPage) || 1, // No pagination info in provided API response
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { customers: [], totalPages: 1, currentPage: 1 };
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/customers/${id}`);
    console.log(`Delete response for customer ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    return { success: false, error };
  }
};

export const fetchCustomerDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    const { data } = response.data;
    return {
      id: data.id,
      name: data.user?.name || "Unknown",
      email: data.user?.email || "No email",
      phone: data.user?.phone_number || "No phone",
      location: data.location || "Unknown",
      birthDate: data.birth_date ? new Date(data.birth_date).toISOString() : "Unknown",
      purchasesCount: data.purchases_count || 0,
      image: DEFAULT_IMAGE, // No profile_image in API response
    };
  } catch (error) {
    console.error(`Error fetching customer details ${id}:`, error);
    throw error;
  }
};

export const summaryData = [
  {
    title: "totalCustomers",
    value: "0", // Placeholder, update with API if available
    change: "+0% from last month", // Placeholder
  },
  {
    title: "newCustomers",
    value: "0", // Placeholder
    change: "+0% from last month", // Placeholder
  },
  {
    title: "activeCustomers",
    value: "0", // Placeholder
    change: "+0% from last month", // Placeholder
  },
];