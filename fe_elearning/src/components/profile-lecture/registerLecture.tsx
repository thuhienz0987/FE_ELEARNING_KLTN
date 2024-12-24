"use client";
import React from "react";
import {
  useForm,
  Controller,
  FieldValues,
  ControllerRenderProps,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "../inputComponent/inputRegisterLecture";
import TextAreaRegisterLecture from "../inputComponent/textAreaRegisterLecture";
import { Button } from "../ui/button";
import { RegisterLectureForm } from "@/types/registerLectureFormType";

// Schema validation với Yup
const schema = yup.object().shape({
  fullName: yup.string().required("Họ và tên không được để trống"),
  dob: yup.string().required("Ngày sinh không được để trống"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải gồm 10 chữ số")
    .required("Số điện thoại không được để trống"),
  address: yup.string().required("Địa chỉ không được để trống"),
  expertise: yup.string().required("Lĩnh vực chuyên môn không được để trống"),
  experience: yup.string().required("Mô tả kinh nghiệm không được để trống"),
  certificate: yup
    .mixed<File[]>()
    .test(
      "fileRequired",
      "Vui lòng tải lên chứng chỉ/bằng cấp",
      (value) => Array.isArray(value) && value.length > 0
    ),
  bankAccount: yup.string().required("Số tài khoản không được để trống"),
  bankName: yup.string().required("Ngân hàng không được để trống"),
  accountHolder: yup.string().required("Tên chủ tài khoản không được để trống"),
});

const RegisterLecture = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterLectureForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      dob: "",
      email: "",
      phone: "",
      address: "",
      expertise: "",
      experience: "",
      certificate: undefined,
      bankAccount: "",
      bankName: "",
      accountHolder: "",
    },
  });

  const onSubmit = (data: FieldValues) => {
    console.log("Form data:", data);
    alert("Đăng ký thành công!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full gap-2 flex flex-col"
    >
      <div className="bg-white w-full h-full shadow-md rounded-lg p-3 border">
        <p className="text-[16px] font-sans font-medium text-black">
          Thông tin cá nhân
        </p>
        <div className="grid lg:grid-cols-2 grid-cols-1 md:grid-cols-2 w-full h-full p-3 gap-3">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Họ và tên"
                error={errors.fullName?.message} // Hiển thị lỗi nếu có
              />
            )}
          />

          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Ngày sinh"
                type="date"
                className="w-fit"
                error={errors.dob?.message} // Hiển thị lỗi nếu có
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Email"
                error={errors.email?.message} // Hiển thị lỗi nếu có
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Số điện thoại"
                error={errors.phone?.message} // Hiển thị lỗi nếu có
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Địa chỉ"
                error={errors.address?.message} // Hiển thị lỗi nếu có
              />
            )}
          />

          {/* Các trường khác tương tự */}
        </div>
      </div>

      <div className="bg-white w-full h-full  shadow-md rounded-lg  p-3 border">
        <text className="text-[16px] font-sans font-medium text-black">
          Thông tin chuyên môn
        </text>
        <div className=" grid  w-full h-full p-3 gap-3">
          <Controller
            name="expertise"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Lĩnh vực chuyên môn"
                error={errors.expertise?.message} // Hiển thị lỗi nếu có
              />
            )}
          />
          <Controller
            name="experience"
            control={control}
            render={({ field }) => (
              <TextAreaRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Mô tả kinh nghiệm"
                error={errors.experience?.message} // Hiển thị lỗi nếu có
              />
            )}
          />
          <Controller
            name="certificate"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Chứng chỉ/bằng cấp"
                type="file"
                error={errors.certificate?.message} // Hiển thị lỗi nếu có
              />
            )}
          />
        </div>
      </div>

      <div className="bg-white w-full h-full  shadow-md rounded-lg  p-3 border">
        <text className="text-[16px] font-sans font-medium text-black">
          Thông tin tài khoản
        </text>
        <div className=" grid lg:grid-cols-2 grid-cols-1 md:grid-cols-2 w-full h-full p-3 gap-3">
          <Controller
            name="bankAccount"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Số tài khoản"
                error={errors.bankAccount?.message} // Hiển thị lỗi nếu có
              />
            )}
          />
          <Controller
            name="bankName"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Ngân hàng"
                error={errors.bankName?.message} // Hiển thị lỗi nếu có
              />
            )}
          />
          <Controller
            name="accountHolder"
            control={control}
            render={({ field }) => (
              <InputRegisterLecture
                {...field} // Truyền các props từ field vào component
                labelText="Tên chủ tài khoản"
                error={errors.accountHolder?.message} // Hiển thị lỗi nếu có
              />
            )}
          />
        </div>
      </div>

      <div className="w-full h-full items-center justify-center flex p-4">
        <Button
          type="submit"
          className="w-32 bg-majorelleBlue text-white hover:bg-majorelleBlue70 rounded-md font-sans font-medium text-[16px] p-2"
        >
          Gửi xét duyệt
        </Button>
      </div>
    </form>
  );
};

export default RegisterLecture;
