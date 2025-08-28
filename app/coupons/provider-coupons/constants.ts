import axios from 'axios';

const DEFAULT_IMAGE = "https://cdn.pixabay.com/photo/2022/04/22/01/04/ticket-7148607_1280.png";
const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";

export const fetchCoupons = async (page = 1, search = '', status = '') => {
  try {
        //     let url = `http://164.92.67.78:3002/api/providers/my-coupons?current_page=${page}&per_page=12`;

    let url = `http://164.92.67.78:3002/api/coupons/index?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status !== '') url += `&coupon_status=${status}`;
    
    const response = await axios.get(url);
    const { data } = response.data;

    return {
      coupons: data.data.map((coupon) => ({
        id: coupon.id,
        code: coupon.coupon_code,
        name: coupon.name,
        type: coupon.couponType?.name || 'Unknown',
        discount: coupon.price ? `${parseFloat(coupon.price).toFixed(2)}` : '0.00',
        uses: Math.floor(Math.random() * 1000), // API doesn't provide uses, so keeping random
        status: coupon.coupon_status === 0 ? 'active' : coupon.coupon_status === 1 ? 'expired' : 'pending',
        image: coupon.files.length > 0 ? CDN_BASE_URL + "/" + coupon.files[0].path : DEFAULT_IMAGE,
        addDate: coupon.date ? new Date(coupon.date).toISOString() : new Date().toISOString(),
      })),
      totalPages: data.last_page,
      currentPage: data.current_page,
    };
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return { coupons: [], totalPages: 1, currentPage: 1 };
  }
};

export const fetchCouponStats = async () => {
  try {
    const response = await axios.get('http://164.92.67.78:3002/api/coupons/coupons-general-statistics');
    const { data } = response.data;
    return {
      activeCoupons: data.active_coupons,
      monthlyReturn: data.monthly_return,
      totalCoupons: data.total_coupons,
    };
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
    return { activeCoupons: 0, monthlyReturn: '0.00', totalCoupons: 0 };
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await axios.delete(`http://164.92.67.78:3002/api/coupons/${id}`);
    console.log(`Delete response for coupon ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting coupon ${id}:`, error);
    return { success: false, error };
  }
};

export const fetchCouponDetails = async (id: number) => {
  try {
    const response = await axios.get(`http://164.92.67.78:3002/api/coupons/${id}`);
    const { data } = response.data;
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price ? `${parseFloat(data.price).toFixed(2)}` : '0.00',
      coupon_type: data.couponType?.name || 'Unknown',
      category: data.category?.name || 'Unknown',
      provider: data.provider?.name || 'Unknown',
      provider_location: data.provider?.location || 'Unknown',
      provider_email: data.provider?.user?.email || 'Unknown',
      provider_phone: data.provider?.user?.phone_number || 'Unknown',
      coupon_status: data.coupon_status === 0 ? 'active' : data.coupon_status === 1 ? 'expired' : 'pending',
      coupon_code: data.coupon_code,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      average_rating: data.average_rating,
      files: data.files.map((file) => ({
        id: file.id,
        path: CDN_BASE_URL + "/" + file.path,
        file_type: file.file_type,
        name: file.name,
        title: file.title || null,
      })),
      couponCriteria: data.couponCriteria.map((criteria) => ({
        id: criteria.id,
        criteria_id: criteria.criteria_id,
        coupon_id: criteria.coupon_id,
        value: criteria.value,
        criteria_name: criteria.criteria?.name || 'Unknown',
        criteria_type: criteria.criteria?.type || 'Unknown',
      })),
      giftPrograms: data.giftPrograms.map((gift) => ({
        id: gift.id,
        giftable_type: gift.giftable_type,
        giftable_id: gift.giftable_id,
        program_type: gift.program_type,
        points_value: gift.points_value,
        provider_id: gift.provider_id,
        gift_coupon_id: gift.gift_coupon_id,
        is_active: gift.is_active,
        created_at: gift.created_at,
        updated_at: gift.updated_at,
      })),
    };
  } catch (error) {
    console.error(`Error fetching coupon details for ID ${id}:`, error);
    throw error;
  }
};

export const createGiftProgram = async (giftData: { type: string; giftable_id: number; coupon_id?: number; points?: number }) => {
  try {
    const response = await axios.post('http://164.92.67.78:3002/api/gift-programs/create', giftData);
    return { success: true, response };
  } catch (error) {
    console.error('Error creating gift program:', error);
    return { success: false, error };
  }
};

export const deleteGiftProgram = async (id: number) => {
  try {
    const response = await axios.delete(`http://164.92.67.78:3002/api/gift-programs/${id}`);
    console.log(`Delete response for gift program ${id}:`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`Error deleting gift program ${id}:`, error);
    return { success: false, error };
  }
};