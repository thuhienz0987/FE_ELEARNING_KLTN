"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "@/constants/course";
import { RootState } from "@/constants/store";
import { APIGetFullCourse } from "@/utils/course";
import BasicInfoForm from "@/components/uploadCourse/BasicInfoForm";
import SectionList from "@/components/uploadCourse/SectionList";
import AlertSuccess from "@/components/alert/AlertSuccess";
import AlertError from "@/components/alert/AlertError";
import { Section } from "@/types/courseType";

const CourseDetails: React.FC = () => {
  const courseInfo = useSelector((state: RootState) => state.course.courseInfo);
  const dispatch = useDispatch();
  const params = useParams();
  const courseId = params.id as string;
  const [sections, setSections] = useState<Section[]>([]);
  const [description, setDescription] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const handleGetCourseInfo = async (targetSection?: string) => {
    try {
      const response = await APIGetFullCourse(courseId);
      if (response?.status === 200) {
        const sortedSections = response.data.sections.sort(
          (a: Section, b: Section) => a.position.localeCompare(b.position)
        );
        setSections(sortedSections);
        dispatch(setCourse(response.data));
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      setShowAlertError(true);
      setDescription("Không thể tải thông tin khóa học");
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  useEffect(() => {
    handleGetCourseInfo();
  }, [courseId, dispatch]);

  return (
    <div className="w-full h-full gap-4 flex flex-col p-4">
      <BasicInfoForm
        courseInfo={courseInfo}
        courseId={courseId}
        setShowAlertSuccess={setShowAlertSuccess}
        setShowAlertError={setShowAlertError}
        setDescription={setDescription}
      />
      <SectionList
        sections={sections}
        setSections={setSections}
        courseId={courseId}
        handleGetCourseInfo={handleGetCourseInfo}
        setShowAlertSuccess={setShowAlertSuccess}
        setShowAlertError={setShowAlertError}
        setDescription={setDescription}
      />
      {showAlertSuccess && <AlertSuccess description={description} />}
      {showAlertError && <AlertError description={description} />}
    </div>
  );
};

export default CourseDetails;
