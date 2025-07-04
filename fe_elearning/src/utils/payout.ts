import axiosInstance from './axios';

const APIGetPayout = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    );
    const response = await axiosInstance.get(`/payout/me`, {
      params: filteredParams,
    });
    if (response.status === 200) {
      return { status: response.status, data: response.data };
    }
    return { data: null, status: response.status };
  } catch (error) {
    console.error(error);
  }
};

export { APIGetPayout };
