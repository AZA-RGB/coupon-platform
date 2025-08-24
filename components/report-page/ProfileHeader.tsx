import Image from "next/image";
import { Card } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";

export function ProfileHeader({ name }) {
  return (
    <Card className=" relative mb-4 rounded-2xl h-30 sm:h-40 lg:h-50 rtl:bg-gradient-to-r bg-gradient-to-l from-primary to-background    ">
      {/* Content Container */}
      <div className="relative h-full flex items-center  ">
        {/* Profile Image */}
        <div className="absolute rtl:right-3  left-3 size-25 sm:size-35 md:size-35   lg:size-45  rounded-lg overflow-hidden">
          <Avatar className="size-full">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Profile picture"
              className="h-full w-full object-cover"
            />
          </Avatar>
        </div>

        {/* Profile Name */}
        <h1
          className="font-extrabold bottom-0 absolute  lg:rtl:right-50 rtl:right-30 sm:rtl:right-40   left-50
          text-2xl ml-4 md:text-3xl mr-3 lg:text-4xl lg:ml-6 text-primary"
        >
          {name}
        </h1>
      </div>
    </Card>
  );
}
