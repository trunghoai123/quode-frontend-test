export type CommentType = {
  id: string | number;
  post_id?: number;
  content: string;
  created_at: string;
};

export type PostType = {
  id: number;
  image_urls: string[];
  created_at: string;
  comments?: CommentType[];
};
