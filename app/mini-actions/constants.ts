import api from "@/lib/api";
import axios from "axios";
import Cookies from "js-cookie";

const DEFAULT_IMAGE =
  "https://cdn.pixabay.com/photo/2018/04/29/19/12/money-icon-3360867_1280.png";
const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";

export const fetchMiniActions = async (
  page = 1,
  search = "",
  typeFilter = ""
) => {
  try {
    let url = `http://164.92.67.78:3002/api/mini-actions/all?page=${page}&per_page=10&needToken=true`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (typeFilter !== "") url += `&type=${typeFilter}`;

    const response = await axios.get(url, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });
    const { data } = response.data;

    if (!data || !Array.isArray(data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      miniActions: data.map((action) => ({
        id: action.id,
        type: action.type === 1 ? "video" : "action",
        description: action.description || "No description",
        points: action.points || 0,
        isManual: action.is_manual || false,
        expiryDate: action.expiryDate
          ? new Date(action.expiryDate).toISOString()
          : new Date().toISOString(),
        expectedTime: action.expected_time || 0,
        content: action.content || "No content",
        actionRules: action.action_rules || "No rules",
        usageNumber: action.usage_number || 0,
        provider: action.provider?.name || "Unknown",
        providerStatus: action.provider?.status || "unknown",
        image:
          action.files && action.files.length > 0
            ? `${CDN_BASE_URL}/${action.files[0].path}`
            : DEFAULT_IMAGE,
      })),
      totalPages: Math.ceil(data.length / 10), // Assuming 10 items per page
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching mini-actions:", error);
    return { miniActions: [], totalPages: 1, currentPage: 1 };
  }
};

export const deleteMiniAction = async (id) => {
  try {
    const response = await axios.delete(`http://164.92.67.78:3002/api/mini-actions/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });
    console.log(`Delete response for mini-action ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting mini-action ${id}:`, error);
    return { success: false, error };
  }
};

export const fetchMiniActionDetails = async (id) => {
  try {
    const response = await axios.get(`http://164.92.67.78:3002/api/mini-actions/${id}`, {
      headers: {
        authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });
    const { data } = response.data;

    if (!data) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing");
    }

    return {
      id: data.id,
      type: data.type === 1 ? "video" : "action",
      description: data.description || "No description",
      points: data.points || 0,
      isManual: data.is_manual || false,
      expiryDate: data.expiryDate
        ? new Date(data.expiryDate).toISOString()
        : new Date().toISOString(),
      expectedTime: data.expected_time || 0,
      content: data.content || "No content",
      actionRules: data.action_rules || "No rules",
      usageNumber: data.usage_number || 0,
      provider: data.provider?.name || "Unknown",
      providerStatus: data.provider?.status || "unknown",
      image:
        data.files && data.files.length > 0
          ? `${CDN_BASE_URL}/${data.files[0].path}`
          : DEFAULT_IMAGE,
    };
  } catch (error) {
    console.error(`Error fetching mini-action ${id}:`, error);
    throw error;
  }
};
