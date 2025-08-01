import axios from "axios";

const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";
const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";

export const fetchPackages = async (page = 1, search = '', status = '') => {
  try {
    let url = `http://164.92.67.78:3002/api/packages/index?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status !== '') url += `&package_status=${status}`;

    const response = await axios.get(url);
    const { data } = response.data;

    if (!data || !Array.isArray(data.data)) {
      console.error("Invalid API response structure:", response.data);
      throw new Error("Invalid API response: data is missing or not an array");
    }

    return {
      packages: data.data.map((pkg) => ({
        id: pkg.id,
        title: pkg.title || "Untitled",
        provider: pkg.provider?.name || "Unknown",
        description: pkg.description || "No description",
        status: pkg.package_status === 0 ? "active" : pkg.package_status === 1 ? "expired" : "pending",
        image: pkg.files && pkg.files.length > 0 ? `${CDN_BASE_URL}/${pkg.files[0].path}` : DEFAULT_IMAGE,
        fromDate: pkg.from_date ? new Date(pkg.from_date).toISOString() : new Date().toISOString(),
        toDate: pkg.to_date ? new Date(pkg.to_date).toISOString() : new Date().toISOString(),
        couponsCount: pkg.coupons ? pkg.coupons.length : 0,
      })),
      totalPages: data.last_page,
      currentPage: data.current_page,
    };
  } catch (error) {
    console.error("Error fetching packages:", error);
    return { packages: [], totalPages: 1, currentPage: 1 };
  }
};

export const deletePackage = async (id) => {
  try {
    const response = await axios.delete(`http://164.92.67.78:3002/api/packages/${id}`);
    console.log(`Delete response for package ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting package ${id}:`, error);
    return { success: false, error };
  }
};