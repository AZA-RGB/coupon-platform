import axios from "axios";

const API_BASE_URL = "http://164.92.67.78:3002/api";
import Cookies from "js-cookie";

export const fetchCategories = async (page = 1, perPage = 10, search = "", filter = "") => {
  try {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    if (search) params.append("search", search);
    if (filter === "newest") {
      params.append("sort", "id_desc");
    } else if (filter === "oldest") {
      params.append("sort", "id_asc");
    }

    const response = await axios.get(`${API_BASE_URL}/categories/index?${params.toString()}`);
    const { data } = response.data;

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      categories: data.data.map((cat) => ({
        id: cat.id,
        name: cat.name || "Unnamed",
        providers: cat.providers || [],
      })),
      totalPages: data.last_page,
      currentPage: data.current_page,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [], totalPages: 1, currentPage: 1 };
  }
};

export const createCategory = async (name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/categories/create`, { name },{
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      });
    console.log("Create category response:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id, name) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/categories/${id}`, { name },{
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      });
    console.log(`Update category response for ID ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/categories/${id}`,{
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      });
    console.log(`Delete category response for ID ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    return { success: false, error };
  }
};