import axiosInstance from "./axios";
const APIInitCourse = async (data: any) => {
  try {
    const response = await axiosInstance.post("/courses", data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during init course:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIGetCourseById = async (course_id: string) => {
  try {
    const response = await axiosInstance.get(`/courses/${course_id}`);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during get course by id:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIUpdateCourse = async (course_id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/courses/${course_id}`, data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during update course:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIInitSection = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/sections`, data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during init section:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIGetFullCourse = async (course_id: string) => {
  try {
    const response = await axiosInstance.get(
      `/courses/${course_id}/curriculums`
    );
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during get full course:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIUpdateSection = async (section_id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/sections/${section_id}`, data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during update section:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIInitCourseItem = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/lectures`, data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error("Error during init course item:", err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};
export {
  APIInitCourse,
  APIGetCourseById,
  APIUpdateCourse,
  APIInitSection,
  APIGetFullCourse,
  APIUpdateSection,
  APIInitCourseItem,
};
