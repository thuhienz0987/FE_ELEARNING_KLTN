import { Star, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import CourseMain from "./courseMain";
import { CourseForm } from "@/types/courseType";

type infoCourse = {
  lecture: string;
  course: CourseForm;
};
const InfoCourse: React.FC<infoCourse> = ({ lecture, course }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalLessons = course.sections?.reduce(
    (total, section) => total + section.items.length,
    0
  );
  const totalDuration = course.sections?.reduce(
    (total, section) =>
      total +
      section.items.reduce((sum, item) => sum + (item.video_duration || 0), 0),
    0
  );

  const [levelShow, setLevelShow] = useState<string | null>(null);
  useEffect(() => {
    if (course?.level === "BEGINNER") {
      setLevelShow("Cơ bản");
    } else if (course?.level === "INTERMEDIATE") {
      setLevelShow("Trung bình");
    } else if (course?.level === "ADVANCED") {
      setLevelShow("Nâng cao");
    }
  }, [course?.level]);
  return (
    <div className="flex flex-col w-full md:gap-8 gap-4">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Hình ảnh khóa học */}
        <div className="relative w-full md:w-1/3">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE || ""}${
              course?.thumbnail?.key || ""
            }`}
            alt="Khóa học"
            className="w-full h-auto rounded-lg object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 rounded-lg" />
        </div>

        {/* Nội dung khóa học */}
        <div className="flex flex-col justify-start gap-2 md:gap-4 font-sans w-full">
          <h2 className="font-bold text-xl md:text-2xl text-eerieBlack dark:text-AntiFlashWhite">
            {course?.title}
          </h2>

          {/* Các tag: rating, level, số học viên */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
            {/* Rating */}
            <div className="flex items-center gap-1 px-2 py-1 bg-champagne dark:bg-black50 rounded-full border border-white min-w-[64px] justify-center">
              <Star size={12} color="#FFCD29" fill="#FFCD29" />
              <span className="text-[10px] text-Sunglow font-medium">
                {course?.rating ? course?.rating : "N/A"}
              </span>
            </div>

            {/* Trình độ */}
            <div className="flex items-center gap-1 px-2 py-1 bg-teaGreen dark:bg-black50 rounded-full border border-white min-w-[80px] justify-center">
              <span className="text-[10px] text-goGreen font-medium">
                {levelShow}
              </span>
            </div>

            {/* Học viên */}
            <div className="flex items-center gap-1 px-2 py-1 bg-majorelleBlue20 dark:bg-black50 rounded-full border border-white min-w-[64px] justify-center">
              <Users size={16} color="#545ae8" />
              <span className="text-[10px] text-majorelleBlue font-medium">
                {course?.number_student
                  ? course?.number_student > 1000
                    ? `${(course?.number_student / 1000).toFixed(1)}k+`
                    : `${course?.number_student}+`
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Giảng viên và giá */}
          <p className="text-sm md:text-base text-black70 dark:text-AntiFlashWhite">
            <strong>Giảng viên:</strong> {lecture}
          </p>
          <p className="text-sm md:text-base text-black70 dark:text-AntiFlashWhite">
            <strong>Giá:</strong> {formatPrice(Number(course?.price))}
          </p>
        </div>
      </div>
      <div className="flex flex-col font-sans">
        <text className="font-medium text-darkSilver md:text-[16px] text-[14px]">
          {course?.subtitle}
        </text>
      </div>

      <div className="flex flex-col font-sans gap-2">
        <text className="font-bold text-[16px] dark:text-AntiFlashWhite text-black md:text-[20px] lg:text-[20px] text-left ">
          Mô tả khóa học
        </text>
        <text
          className="font-normal text-black ql-content  italic dark:text-AntiFlashWhite md:text-[16px] text-[14px]"
          dangerouslySetInnerHTML={{ __html: course?.description || "" }}
        ></text>
      </div>

      <div className="flex flex-col font-sans gap-2">
        <text className="font-bold text-[16px] dark:text-AntiFlashWhite text-black md:text-[20px] lg:text-[20px] text-left ">
          Nội dung khóa học
        </text>

        <text className="font-normal text-black  italic dark:text-AntiFlashWhite md:text-[16px] text-[14px]">
          {`${course.sections?.length} chương - ${totalLessons} bài học - thời lượng ${totalDuration}`}
        </text>

        <div className=" flex flex-col">
          <CourseMain course={course} />
        </div>
      </div>
    </div>
  );
};

export default InfoCourse;
