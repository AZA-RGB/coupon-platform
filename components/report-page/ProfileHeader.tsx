import Image from "next/image";

export function ProfileHeader() {
  return (
    <div className="bg-primary relative mb-4 rounded-2xl sm:h-35 lg:h-50    ">
      {/* Background Image */}
      <Image
        src="/whiteWavyNet.svg"
        alt="Decorative background pattern"
        className="object-cover"
        fill
        priority
      />

      {/* Content Container */}
      <div className="relative h-full flex items-center p-4 md:p-6 lg:p-8">
        {/* Profile Image */}
        <div className="relative h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 bg-amber-100 rounded-2xl overflow-hidden">
          <img
            src="/profilePlaceholder.png"
            alt="Profile picture"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Profile Name */}
        <h1 className="font-extrabold text-2xl ml-4 md:text-3xl lg:text-4xl lg:ml-6 text-white">
          Name
        </h1>
      </div>
    </div>
  );
}