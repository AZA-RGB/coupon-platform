export const allCouponsData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  code: `DISCOUNT${i + 1}`,
  name: `Coupon ${i + 1}`,
  type: ["Seasonal", "Flash", "Loyalty", "Welcome"][
    Math.floor(Math.random() * 4)
  ],
  discount: `${Math.floor(Math.random() * 50) + 5}%`,
  uses: Math.floor(Math.random() * 1000),
  status: ["active", "expired", "pending"][Math.floor(Math.random() * 3)],
  image:
    "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
  addDate: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
}));
