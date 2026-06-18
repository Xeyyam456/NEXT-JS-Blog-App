export type Post = {
  id: number;
  displayId?: number;
  title: string;
  body: string;
  imageUrl?: string;
};

export type PostFormData = {
  title: string;
  body: string;
  imageUrl: string;
};

export type PostFormMode = "create" | "edit";
