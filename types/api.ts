export type PostId = number | string;

export type ApiErrorPayload = {
  message?: string;
  [key: string]: unknown;
};

export type ApiSuccess<T> = {
  data: T;
  status: number;
  result: true;
};

export type ApiFailure = {
  data: ApiErrorPayload | null;
  status: number;
  result: false;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
