import axios from 'axios';

const DEFAULT_IMAGE = "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";



export const fetchTopCoupons = async (page = 1, search = '', status = '') => {
  try {
    let url = `http://164.92.67.78:3002/api/coupons/top-sells-coupon?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status !== '') url += `&coupon_status=${status}`;
    
    const response = await axios.get(url);
    const { data } = response.data;

    return {
      coupons: data.map((coupon) => ({
        id: coupon.id,
        code: coupon.coupon_code,
        name: coupon.name,
        type: coupon.couponType?.name || 'Unknown',
        discount: coupon.price ? `${parseFloat(coupon.price).toFixed(2)}` : '0.00',
        uses: Math.floor(Math.random() * 1000), // API doesn't provide uses, so keeping random for now
        status: coupon.coupon_status === 0 ? 'active' : coupon.coupon_status === 1 ? 'expired' : 'pending', // Map 0 to active, 1 to expired, 2 to pending
        image: coupon.files.length > 0 ? coupon.files[0] : DEFAULT_IMAGE,
        addDate: coupon.date ? new Date(coupon.date).toISOString() : new Date().toISOString(),
      })),
      totalPages: data.last_page,
      currentPage: data.current_page,
    };
  } catch (error) {
    console.error('Error fetching top coupons:', error);
    return { coupons: [], totalPages: 1, currentPage: 1 };
  }
};

