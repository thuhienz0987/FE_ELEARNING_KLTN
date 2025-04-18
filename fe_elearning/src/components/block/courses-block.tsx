"use client";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Users, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
type coursesBlock = {
  id?: string;
  coverPhoto?: string;
  avatar?: string;
  title?: string;
  rating?: number;
  level?: string;
  numberStudent?: number;
  description?: string;
  name?: string;
  status?: string;
  progress?: number;
  price?: number;
  priceFinal?: number;
};
const CoursesBlock: React.FC<coursesBlock> = ({
  id,
  coverPhoto,
  rating,
  level,
  numberStudent,
  name,
  status,
  progress,
  title,
  avatar,
  description,
  price,
  priceFinal,
}) => {
  const router = useRouter();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const [levelShow, setLevelShow] = useState<string>("");
  useEffect(() => {
    level === "BEGINNER"
      ? setLevelShow("Cơ bản")
      : level === "INTERMEDIATE"
      ? setLevelShow("Trung bình")
      : setLevelShow("Nâng cao");
  }, [level]);
  return (
    <Card
      className="w-full h-full hover:cursor-pointer max-w-sm flex flex-col justify-between hover:shadow-md hover:shadow-cosmicCobalt transition-shadow"
      onClick={() => router.push(`/course/${id}`)}
    >
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <img
            src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (coverPhoto || "")}
            alt={title}
            className="w-full h-full object-contain rounded-t-lg"
          />
          {status && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              {status}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Nội dung chính, set grow để phần dưới đẩy xuống */}
      <CardContent className="pt-4 space-y-3 flex-grow">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              alt={name}
              src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + (avatar || "")}
              className="object-cover"
            />
            <AvatarFallback>{name?.[0]}</AvatarFallback>

            {/* <AvatarFallback>{name?.[0]}</AvatarFallback> */}
          </Avatar>
          <span className="text-sm text-muted-foreground">{name}</span>
        </div>

        <h3 className="font-semibold line-clamp-2">{title}</h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-Sunglow" />
            <span>{rating ? rating.toFixed(1) : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{numberStudent || 0}</span>
          </div>
          {level && (
            <Badge variant="outline" className="bg-teaGreen dark:text-black">
              {levelShow}
            </Badge>
          )}
        </div>

        {progress !== undefined && (
          <div className="space-y-1">
            <div className="w-full bg-darkSilver rounded-full h-2">
              <div
                className="bg-vividMalachite h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {progress}% hoàn thành
            </span>
          </div>
        )}
      </CardContent>

      {/* Phần giá & button luôn ở dưới cùng */}
      <CardFooter className="flex justify-between items-end mt-auto pt-2">
        <div className="space-x-2">
          {/* {price && (
            <span className="text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
          )} */}
          {price && (
            <span className="font-semibold text-primary">
              {formatPrice(price)}
            </span>
          )}
        </div>
        <Badge variant="outline" className="text-[10px]">
          Xem chi tiết
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default CoursesBlock;
