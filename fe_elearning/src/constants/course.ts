// 'use client'
import { Section } from "@/types/courseType";
import { Lecture } from "@/types/registerLectureFormType";
import { FileData, Roles } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseInfo: {
    course_id: "",
    title: "",
    subtitle: "",
    description: "",
    level: "",
    price: 0,
    thumbnail: {
      key: "",
      id: "",
    },

    category: {
      slug: "",
      name: "",
      children: [],
    },
    createdAt: "",
    instructor_profile: <Lecture | null>null,
    sections: <Section[]>[],
  },
};

const createCourseSlice = createSlice({
  name: "courseSlice",
  initialState,
  reducers: {
    setCourse: (state, action) => {
      state.courseInfo = action.payload ?? state.courseInfo;
    },
    clearCourse: (state, action) => {
      state.courseInfo = initialState.courseInfo;
    },
    clearSection: (state, action) => {
      state.courseInfo.sections = [];
    },
  },
});

export const { setCourse, clearCourse, clearSection } =
  createCourseSlice.actions;
export default createCourseSlice.reducer;
