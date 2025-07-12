import Image from "next/image";
import { Card } from "../ui/card";

export function ProfileHeader() {
  return (
    <Card className=" relative mb-4 rounded-2xl sm:h-35 lg:h-50 rtl:bg-gradient-to-r bg-gradient-to-l from-primary to-background    ">
      {/* Background Image */}
      {/* <Image
        src="/whiteWavyNet.svg"
        alt="Decorative background pattern"
        className="object-cover dark:invert-0 dark:saturate-70 rotate-y-180 rtl:rotate-y-90"
        fill
      /> */}

      {/* Content Container */}
      <div className="relative h-full flex items-center  ">
        {/* Profile Image */}
        <div className="absolute rtl:right-3 left-3 h-24 w-24 md:size-60   lg:size-45  rounded-lg overflow-hidden">
          <img
            src="/profilePlaceholder.png"
            alt="Profile picture"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Profile Name */}
        <h1 className="font-extrabold bottom-0 absolute rtl:right-50 left-50 text-2xl ml-4 md:text-3xl mr-3 lg:text-4xl lg:ml-6 text-primary">
          الاسم
        </h1>
      </div>
    </Card>
  );
}
