import axios from "axios";
import Cookies from "js-cookie";

const DEFAULT_IMAGE = "https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png";
const API_BASE_URL = "http://164.92.67.78:3002/api";

export const fetchProviderCustomers = async (page = 1, search = '', status = '') => {
  try {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    if (status) params.append('customer_status', status);

    const response = await axios.get(`${API_BASE_URL}/providers/my-customers?${params.toString()}`, {
      headers: {
        "authorization": `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });

    const { data: { data: customers, last_page, current_page } } = response.data;

    if (!Array.isArray(customers)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: customers is not an array");
    }

    return {
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.user?.name || "Unknown",
        email: customer.user?.email || "No email",
        phone: customer.user?.phone_number || "No phone",
        subscribeDate: customer.birth_date ? new Date(customer.birth_date).toISOString() : new Date().toISOString(),
        status: customer.user?.status || "active",
        totalCoupons: customer.purchases_count || 0,
        // image: customer.files?.[0]?.path ? `${API_BASE_URL}/${customer.files[0].path}` : DEFAULT_IMAGE,
        image: DEFAULT_IMAGE,
        location: customer.location || "Unknown",
      })),
      totalPages: last_page || 1,
      currentPage: current_page || 1,
    };
  } catch (error) {
    console.error("Error fetching provider customers:", error);
    return { customers: [], totalPages: 1, currentPage: 1 };
  }
};

export const fetchProviderCustomerDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}customers/${id}`, {
      headers: {
        "authorization": `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });

    const { data } = response.data;

    return {
      id: data.id,
      name: data.user?.name || "Unknown",
      email: data.user?.email || "No email",
      phone: data.user?.phone_number || "No phone",
      location: data.location || "Unknown",
      birthDate: data.birth_date ? new Date(data.birth_date).toISOString() : "Unknown",
      purchasesCount: data.purchases_count || 0,
      image: data.files?.[0]?.path ? `${API_BASE_URL}/${data.files[0].path}` : DEFAULT_IMAGE,
    };
  } catch (error) {
    console.error(`Error fetching provider customer details ${id}:`, error);
    throw error;
  }
};