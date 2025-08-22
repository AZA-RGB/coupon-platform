import axios from 'axios';

const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";
const CDN_BASE_URL = "https://ecoupon-files.sfo3.cdn.digitaloceanspaces.com";

export const fetchCoupons = async (page = 1, search = '', status = '') => {
  try {
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
        uses: Math.floor(Math.random() * 1000), // API doesn't provide uses, so keeping random for now
        status: coupon.coupon_status === 0 ? 'active' : coupon.coupon_status === 1 ? 'expired' : 'pending', // Map 0 to active, 1 to expired, 2 to pending
        image: coupon.files.length > 0 ?CDN_BASE_URL+"/"+ coupon.files[0].path : DEFAULT_IMAGE,
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