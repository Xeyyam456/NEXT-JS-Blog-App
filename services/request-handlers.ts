import axios, { type AxiosResponse } from "axios";
import type { ApiFailure, ApiSuccess } from "@/types/api";

export const successHandler = <T>(response: AxiosResponse<T>): ApiSuccess<T> => ({
  data: response.data,
  status: response.status,
  result: true,
});

export const errorHandler = (error: unknown): ApiFailure => {
  if (axios.isAxiosError(error)) {
    return {
      data: error.response?.data ?? null,
      status: error.response?.status ?? 500,
      result: false,
    };
  }

  return {
    data: null,
    status: 500,
    result: false,
  };
};
