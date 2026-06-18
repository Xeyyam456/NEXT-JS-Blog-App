import type { ApiResult } from "@/types/api";

export type UseDeletePostReturn = {
  error: string;
  isDeleting: boolean;
  handleDelete: () => Promise<ApiResult<null> | null>;
};
