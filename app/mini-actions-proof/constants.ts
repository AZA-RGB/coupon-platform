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
  customer: Customer;
}

export const fetchMiniActionProofs = async (page: number, search: string, filter: string) => {
  try {
    const response = await axios.get("http://164.92.67.78:3002/api/mini-action-proofs/all", {
      params: { page, search, filter },
    });
    return {
      miniActionProofs: response.data.data,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || page,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchMiniActionProofDetails = async (id: number) => {
  try {
    const response = await axios.get(`http://164.92.67.78:3002/api/mini-action-proofs/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const approveMiniActionProof = async (id: number) => {
  try {
    await axios.post(`http://164.92.67.78:3002/api/mini-action-proofs/${id}/approve`);
    return { success: true, id };
  } catch (error) {
    return { success: false, id, error };
  }
};

export const rejectMiniActionProof = async (id: number) => {
  try {
    await axios.post(`http://164.92.67.78:3002/api/mini-action-proofs/${id}/reject`);
    return { success: true, id };
  } catch (error) {
    return { success: false, id, error };
  }
};