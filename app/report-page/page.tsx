import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import Image from "next/image";

const ReportPage = () => {
  return (
    <main className="overflow-auto  h-screen p-6">
      <div className="min-h-[60vh] grid grid-cols-1 md:grid-rows-2 gap-4">
        <div className="bg-primary relative rounded-2xl ">
          <Image
            src="/whiteWavyNet.svg"
            alt=""
            className=" h-full object-cover "
            fill
          />
          <div className="relative h-full w-1/2 top-1/12 left-7 right-8 flex flex-row">
            <div className="bg-amber-100 rounded-2xl h-5/6 w-60 "></div>
            <h1 className="font-extrabold text-4xl ml-6 relative pr-5 top-2/3">
              Name
            </h1>
          </div>
        </div>
        <Card className=" p-6 dark:border-1 border-0 dark:shadow-none shadow-emerald-100 shadow-md">
          <div className="min-h-full  grid grid-rows-4 ">
            <div className=" row-span-1 flex flex-row place-content-between">
                <div>sales Report</div>
                <Button variant='outline' className=" border-primary dark:border-primary">Export</Button>
            </div>
            <div className="  row-span-3  ">
              <div className="h-full w-full grid grid-cols-5 gap-10 ">
              <div className="bg-[#FFE2E5] text-amber-950 rounded-2xl flex flex-col place-content-between p-4 pl-6">
                <span className="" > <ChartNoAxesColumnIncreasing size={40}  /></span>
                <div className="font-extrabold text-3xl"> $1K</div>
                <div> Total sales</div>



              </div>
              <div className="bg-[#FFF4DE] rounded-2xl"></div>
              <div className="bg-[#DCFCE7] rounded-2xl"></div>
              <div className="bg-[#F3E8FF] rounded-2xl"></div>
              <div className="bg-[#F3E8FF] rounded-2xl"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
       <Card className="h-[60vh] mt-4 dark:border-1 border-0 dark:shadow-none shadow-emerald-100 shadow-2xl"> </Card>
      
    </main>
  );
};

export default ReportPage;
