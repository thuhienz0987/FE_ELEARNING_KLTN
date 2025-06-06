import axiosInstance from './axios';
const APIGetCurrentUser = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    const response = await axiosInstance.get('/users/me');
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return {
      data: response,
      status: response.status,
    }; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err: any) {
    console.error('Error during get current user:', err.message);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIUpdateCurrentUser = async (data: any) => {
  try {
    const response = await axiosInstance.put(`/users/me`, data);
    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }
    return null; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  } catch (err) {
    console.error('Error during update current user:', err);
    throw err; // Ném lỗi ra để xử lý ở chỗ gọi hàm
  }
};

const APIChangePassword = async (data: any) => {
  try {
    const response = await axiosInstance.post('/users/me/change-password', data);
    if (response.status === 201) {
      return { data: response.data, status: response.status };
    }
    return null;
  } catch (err) {
    console.error('Error during change password:', err);
  }
};

export { APIGetCurrentUser, APIUpdateCurrentUser, APIChangePassword };
