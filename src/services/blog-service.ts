import client from './api-clients';

export interface BlogDetail {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  authorId: {
    _id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: [];
  seo: {};
  viewCount: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
export interface GetBlogsParams {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  categoryId?: string;
  authorId?: string;
  search?: string;
  sortBy?: string;
  order?: string;
}

export interface GetBlogsResponse {
  status: number;
  data: {
    blogs: BlogDetail[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface DeleteBlogRequest {
  id: string;
}

export interface DeleteBlogResponse {
  status: number;
  data: {
    message: string;
  };
}

export const getListBlogs = async (params: GetBlogsParams = {}): Promise<GetBlogsResponse> => {
  const response = await client.get('/api/v1/admin/blogs', { params });
  return response.data;
};

export const deleteBLog = async (data: DeleteBlogRequest): Promise<DeleteBlogResponse> => {
  const response = await client.delete(`/api/v1/admin/blogs/${data.id}`);
  return response.data;
};
