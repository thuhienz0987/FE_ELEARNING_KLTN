import { CircleCheck } from "lucide-react";
import React from "react";

type benefitBar = {
  description: string;
};
const BenefitsBar: React.FC<benefitBar> = ({ description }) => {
  return (
    <div className=" flex flex-row gap-3 items-center px-4 py-2 bg-white lg:w-4/5 md:w-4/5  w-full">
      <CircleCheck color="white" fill="green" />
      <text className="font-sans font-medium text-[16px] text-black70">
        {description}
      </text>
    </div>
  );
};

export default BenefitsBar;