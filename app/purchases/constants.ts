import axios from "axios";

const API_BASE_URL = "http://164.92.67.78:3002/api";

export const fetchPurchases = async (page = 1, perPage = 10, search = '', purchaseType = '') => {
  try {
    const params = new URLSearchParams({ page: page.toString(), per_page: perPage.toString() });
    if (search) params.append('search', search);
    if (purchaseType) params.append('purchase_type', purchaseType);

    const response = await axios.get(`${API_BASE_URL}/purchases/all?${params.toString()}`);
    const { data } = response.data;

    if (!data || !Array.isArray(data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      purchases: data.map((purchase) => ({
        id: purchase.id,
        customerId: purchase.customer_id || "Unknown",
        providerId: purchase.provider_id || "Unknown",
        purchaseType: purchase.purchaseType?.name || "Unknown",
        date: purchase.date ? new Date(purchase.date).toISOString() : "Unknown",
        paidAmount: purchase.paid_amount || "0.00",
        hashKey: purchase.hash_key || "Unknown",
        customer: purchase.customer ? {
          id: purchase.customer.id,
          name: purchase.customer.user?.name || "Unknown",
          email: purchase.customer.user?.email || "No email",
          phone: purchase.customer.user?.phone_number || "No phone",
          location: purchase.customer.location || "Unknown",
          birthDate: purchase.customer.birth_date ? new Date(purchase.customer.birth_date).toISOString() : "Unknown",
          purchasesCount: purchase.customer.purchases_count || 0,
        } : null,
        provider: purchase.provider ? {
          id: purchase.provider.id,
          name: purchase.provider.name || purchase.provider.user?.name || "Unknown",
          email: purchase.provider.user?.email || "No email",
          phone: purchase.provider.user?.phone_number || "No phone",
          location: purchase.provider.location || "Unknown",
          description: purchase.provider.description || null,
          status: purchase.provider.status || "Unknown",
        } : null,
        purchaseCoupons: purchase.purchaseCoupons ? purchase.purchaseCoupons.map((coupon) => ({
          id: coupon.id,
          couponId: coupon.coupon_id,
          purchaseKey: coupon.purchase_key,
        })) : [],
      })),
      totalPages: response.data.total ? Math.ceil(response.data.total / perPage) : Math.ceil(data.length / perPage),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return { purchases: [], totalPages: 1, currentPage: 1 };
  }
};

export const deletePurchase = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/purchases/${id}`);
    console.log(`Delete response for purchase ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting purchase ${id}:`, error);
    return { success: false, error };
  }
};