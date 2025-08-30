import axios from "axios";
import Cookies from "js-cookie";

const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";

export const fetchMiniActionProofs = async (page = 1, perPage = 10, searchQuery = "", filterType = "") => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    // if (searchQuery) {
    //   params.append("search", searchQuery);
    // }
    // if (filterType) {
    //   params.append("filter", filterType);
    // }

    const response = await axios.get(
      `http://164.92.67.78:3002/api/mini-action-proofs/all?${params.toString()}&needToken=true`,
      {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Access the top-level data array directly
    const data = response.data.data;

    if (!Array.isArray(data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is not an array");
    }

    // Return all proofs with proper handling for incomplete customer data
    return {
      miniActionProofs: data.map((proof) => ({
        ...proof,
        // Handle cases where customer might be null or incomplete
        customer: proof.customer || { 
          id: null, 
          user_id: null, 
          bank_id: 'Unknown Customer', 
          birth_date: null, 
          location: null, 
          purchases_count: null 
        },
        files: proof.files.map((file) => ({
          ...file,
          path: file.path ? `${CDN_BASE_URL}/${file.path}` : file.path,
        })),
      })),
      totalPages: response.data.last_page || Math.ceil(data.length / perPage) || 1,
      currentPage: response.data.current_page || page,
    };
  } catch (error) {
    console.error("Error fetching mini action proofs:", error);
    return { miniActionProofs: [], totalPages: 1, currentPage: page };
  }
};

export const fetchMiniActionProofDetails = async (id) => {
  try {
    const response = await axios.get(
      `http://164.92.67.78:3002/api/mini-action-proofs/${id}`,
      {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = response.data;

    if (!data) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing");
    }

    return {
      ...data,
      // Handle cases where customer might be null or incomplete
      customer: data.customer || { 
        id: null, 
        user_id: null, 
        bank_id: 'Unknown Customer', 
        birth_date: null, 
        location: null, 
        purchases_count: null 
      },
      files: data.files.map((file) => ({
        ...file,
        path: file.path ? `${CDN_BASE_URL}/${file.path}` : file.path,
      })),
    };
  } catch (error) {
    console.error(`Error fetching mini action proof ${id}:`, error);
    return { miniActionProofs: [], totalPages: 1, currentPage: 1 };
  }
};

export const approveMiniActionProof = async (id) => {
  try {
    const response = await axios.post(
      `http://164.92.67.78:3002/api/mini-action-proofs/${id}/approve`,
      {},
      {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Approve mini action proof response:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error approving mini action proof ${id}:`, error);
    return { success: false, error };
  }
};

export const rejectMiniActionProof = async (id) => {
  try {
    const response = await axios.post(
      `http://164.92.67.78:3002/api/mini-action-proofs/${id}/reject`,
      {},
      {
        headers: {
          authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Reject mini action proof response:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error rejecting mini action proof ${id}:`, error);
    return { success: false, error };
  }
};