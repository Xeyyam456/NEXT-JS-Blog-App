export const successHandler = (response) => ({
  data: response.data,
  status: response.status,
  result: true,
});

export const errorHandler = (error) => ({
  data: error.response?.data ?? null,
  status: error.response?.status ?? 500,
  result: false,
});
