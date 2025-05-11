import { Card } from "@/components/ui/card";

const ExclusiveOffers = () => {
  return (
    <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-white mb-6">
        Copouns Platform
      </h2>

      <div className="space-y-6 relative">
        {/* 10% Off Card */}
        <Card className="relative bg-red-600 rounded-lg p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300 z-30">
          <span className="absolute -top-3 -left-3 bg-white text-red-600 font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-md">
            10%
          </span>
          <h3 className="text-white font-bold text-xl ml-8">Join us today!</h3>
          <p className="text-white/90 mt-2">
          Boost your sales and reach new customers by offering exclusive discounts
          </p>
        </Card>

        {/* 30% Off Card */}
        <Card className="relative bg-gray-800 rounded-lg p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-20 ml-8">
          <span className="absolute -top-3 -left-3 bg-white text-gray-800 font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-md">
            30%
          </span>
          <h3 className="text-white font-bold text-xl ml-8">Start growing your business now!</h3>
          <p className="text-white/90 mt-2">
          Stand out in the market with personalized coupons and offers
          </p>
        </Card>

        {/* 50% Off Card */}
        <Card className="relative bg-red-700 rounded-lg p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300 z-10 ml-4">
          <span className="absolute -top-3 -left-3 bg-white text-red-700 font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-md">
            50%
          </span>
          <h3 className="text-white font-bold text-xl ml-8">Sign up and get started!</h3>
          <p className="text-white/90 mt-2">
          Attract more shoppers and increase your profits with easy-to-manage discounts
          </p>
        </Card>
      </div>    </div>
  );
};

export default ExclusiveOffers;
