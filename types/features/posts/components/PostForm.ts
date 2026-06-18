import type { Post } from "@/types/post";

export type PostFormProps =
  | { mode: "create"; post?: undefined }
  | { mode: "edit"; post: Post };
