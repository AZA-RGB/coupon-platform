import axios from 'axios';

const DEFAULT_IMAGE =     "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";

export const fetchCoupons = async (page = 1) => {
  try {
    const response = await axios.get(`http://164.92.67.78:3002/api/coupons/index?page=${page}`);
    const { data } = response.data;

    return {
      coupons: data.data.map((coupon) => ({
        id: coupon.id,
        code: coupon.coupon_code,
        name: coupon.name,
        type: coupon.couponType?.name || 'Unknown',
        discount: coupon.price ? `${parseFloat(coupon.price).toFixed(2)}` : '0.00',
        uses: Math.floor(Math.random() * 1000), // API doesn't provide uses, so keeping random for now
        status: coupon.coupon_status === 0 ? 'active' : 'expired', // Map 0 to active, others to expired
        image: coupon.files.length > 0 ? coupon.files[0] : DEFAULT_IMAGE,
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