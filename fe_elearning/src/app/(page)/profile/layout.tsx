"use client";

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  // Xác định nút nào đang active dựa trên đường dẫn
  const isStudentActive = pathname.includes("/profile/student");
  const isLectureActive = pathname.includes("/profile/lecture");

  const handleButtonClick = (type: string) => {
    router.push(`/profile/${type === "Học viên" ? "student" : "lecture"}`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 bg-AntiFlashWhite dark:bg-eerieBlack font-sans font-medium text-majorelleBlue overflow-auto">
      <div className="flex justify-center gap-2 bg-majorelleBlue50 rounded-full w-fit p-2">
        <Button
          onClick={() => handleButtonClick("Học viên")}
          className={`lg:w-32 md:w-24 sm:w-24 w-24 rounded-full ${
            isStudentActive
              ? "bg-majorelleBlue text-white hover:bg-majorelleBlue"
              : "bg-trnsp text-black hover:bg-majorelleBlue70 hover:text-white shadow-none"
          } hover:shadow-lg`}
        >
          Học viên
        </Button>

        <Button
          onClick={() => handleButtonClick("Giảng viên")}
          className={`lg:w-32 md:w-24 sm:w-24 w-24 rounded-full ${
            isLectureActive
              ? "bg-majorelleBlue text-white hover:bg-majorelleBlue"
              : "bg-trnsp text-black hover:bg-majorelleBlue70 hover:text-white shadow-none"
          } hover:shadow-lg`}
        >
          Giảng viên
        </Button>
      </div>
      {children}
    </div>
  );
}
