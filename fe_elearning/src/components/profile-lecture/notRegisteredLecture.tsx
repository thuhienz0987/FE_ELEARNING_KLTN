"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import BenefitsBar from "./benefitsBar";
import RegisterLecture from "./registerLecture";

const dataBenefit = [
  {
    description:
      "Kiếm thu nhập thụ động bằng cách chia sẻ kiến thức với hàng ngàn học viên trên toàn thế giới.",
  },
  {
    description:
      "Xây dựng thương hiệu cá nhân và khẳng định mình là chuyên gia trong lĩnh vực của bạn.",
  },
  {
    description:
      "Truy cập vào các công cụ trực quan để tạo và quản lý khóa học một cách dễ dàng.",
  },
  {
    description:
      "Tiếp cận học viên toàn cầu và tạo ra tác động ý nghĩa cho cộng đồng học tập.",
  },
  {
    description:
      "Nhận hỗ trợ toàn diện từ đội ngũ hỗ trợ giảng viên tận tâm của chúng tôi.",
  },
  {
    description:
      "Theo dõi hiệu quả khóa học và nhận được những gợi ý cải thiện tương tác.",
  },
  {
    description:
      "Tự do giảng dạy với thời gian linh hoạt—tạo nội dung theo tốc độ của riêng bạn.",
  },
];

const NotRegisteredLecture = () => {
  const [register, setRegister] = useState(false);
  return (
    <div>
      {!register && (
        <div>
          <div className="w-full flex flex-col items-center justify-center gap-7">
            <text className="font-sans font-bold text-[24px] text-majorelleBlue flex-wrap text-center">
              Đăng ký ngay để trở thành giảng viên tại E-Learning!
            </text>
            <Button
              className="w-32 hover:bg-majorelleBlue70 p-3 font-sans font-medium text-[16px] hover:shadow-md text-white bg-majorelleBlue"
              onClick={() => setRegister(true)}
            >
              Đăng ký
            </Button>
          </div>

          <div className="w-full  flex flex-col gap-3 items-center justify-center p-4">
            {dataBenefit &&
              dataBenefit.map((item, index) => (
                <BenefitsBar key={index} description={item.description} />
              ))}
          </div>
        </div>
      )}

      {register && (
        <div className="w-full  shadow-md h-full rounded-lg bg-white p-2 dark:bg-eerieBlack">
          <div className="w-full flex flex-col items-center justify-center ">
            <text className="font-sans font-bold text-[24px] text-black dark:text-AntiFlashWhite flex-wrap text-center">
              Hồ sơ
            </text>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <RegisterLecture />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotRegisteredLecture;
