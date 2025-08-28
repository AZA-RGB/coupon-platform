import api from "@/lib/api";
import axios from "axios";

interface MiniAction {
  id: number;
  provider_id: number;
  type: number;
  description: string;
  points: number;
  is_manual: boolean;
  expiryDate: string;
  expected_time: number;
  content: string;
  action_rules: string;
  usage_number: number;
}

interface Customer {
  id: number;
  user_id: number;
  bank_id: string;
  birth_date: string;
  location: string;
  purchases_count: number;
}

interface File {
  id: number;
  path: string;
  file_type: number;
  name: string;
  title: string | null;
}

interface MiniActionProof {
  id: number;
  mini_action_id: number;
  customer_id: number;
  status: "pending" | "success" | "rejected";
  gained_points: number;
  time: number;
  files: File[];
  mini_action: MiniAction;
  customer: Customer | null; // Allow customer to be null
}

export const fetchMiniActionProofs = async (
  page: number,
  search: string,
  filter: string,
) => {
  try {
    const response = await api.get("/mini-action-proofs/all", {
      params: { page, search, filter },
    });
    const miniActionProofs = response.data.data;

    // Validate that miniActionProofs is an array and filter out invalid entries
    if (!Array.isArray(miniActionProofs)) {
      throw new Error("API response data is not an array");
    }

    // Filter out proofs with missing or null customer
    const validMiniActionProofs = miniActionProofs.filter(
      (proof: MiniActionProof) => proof.customer && proof.customer.bank_id,
    );

    if (validMiniActionProofs.length < miniActionProofs.length) {
      console.warn(
        `Filtered out ${
          miniActionProofs.length - validMiniActionProofs.length
        } invalid MiniActionProofs with missing customer or bank_id`,
      );
    }

    return {
      miniActionProofs: validMiniActionProofs,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || page,
    };
  } catch (error) {
    console.error("Error fetching mini action proofs:", error);
    throw error;
  }
};

export const fetchMiniActionProofDetails = async (id: number) => {
  try {
    const response = await api.get(`/mini-action-proofs/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const approveMiniActionProof = async (id: number) => {
  try {
    await api.post(`/mini-action-proofs/${id}/approve`);
    return { success: true, id };
  } catch (error) {
    return { success: false, id, error };
  }
};

export const rejectMiniActionProof = async (id: number) => {
  try {
    await api.post(`/mini-action-proofs/${id}/reject`);
    return { success: true, id };
  } catch (error) {
    return { success: false, id, error };
  }
};
