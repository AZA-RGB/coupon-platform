import axios from "axios";

const DEFAULT_IMAGE = "https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png";
const API_BASE_URL = "http://164.92.67.78:3002/api";

export const fetchCustomers = async (page = 1, search = '', status = '') => {
  try {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    if (status) params.append('status', status);

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
        status: customer.status || "active",
        totalCoupons: customer.purchases_count || 0,
        image: DEFAULT_IMAGE,
        location: customer.location || "Unknown",
      })),
      totalPages: Math.ceil(data.length / 10) || 1,
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
      image: DEFAULT_IMAGE,
    };
  } catch (error) {
    console.error(`Error fetching customer details ${id}:`, error);
    throw error;
  }
};

export const fetchCouponStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/customer-general-statistics`);
    const { data } = response.data;
    return [
      {
        title: "totalCustomers",
        value: data.total_customers.toString(),
        change: "+0% from last month",
      },
      {
        title: "newCustomers",
        value: data.new_customers.toString(),
        change: "+0% from last month",
      },
      {
        title: "activeCustomers",
        value: data.active_customers.toString(),
        change: "+0% from last month",
      },
    ];
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
    return [
      {
        title: "totalCustomers",
        value: "0",
        change: "+0% from last month",
      },
      {
        title: "newCustomers",
        value: "0",
        change: "+0% from last month",
      },
      {
        title: "activeCustomers",
        value: "0",
        change: "+0% from last month",
      },
    ];
  }
};

export const blockCustomer = async (id, block) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customers/${id}/block-customer`, { block });
    console.log(`Block response for customer ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error blocking customer ${id}:`, error);
    return { success: false, error };
  }
};