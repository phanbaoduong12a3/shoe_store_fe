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

export interface ToggleBlogStatusRequest {
  id: string;
  isPublished: boolean;
}

export interface ToggleBlogStatusResponse {
  status: number;
  data: {
    message: string;
    blog: BlogDetail;
  };
}

export interface CreateBlogRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId: string;
  tags?: string[];
  thumbnail?: File;
  isPublished: boolean;
}

export interface CreateBlogResponse {
  status: number;
  data: {
    message: string;
    blog: BlogDetail;
  };
}

export const createBlog = async (data: CreateBlogRequest): Promise<CreateBlogResponse> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('slug', data.slug);
  formData.append('content', data.content);
  if (data.excerpt) formData.append('excerpt', data.excerpt);
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
  formData.append('isPublished', String(data.isPublished));
  formData.append('categoryId', data.categoryId);
  if (data.tags && data.tags.length > 0) {
    formData.append('tags', JSON.stringify(data.tags));
  }

  const response = await client.post('/api/v1/admin/blogs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getListBlogs = async (params: GetBlogsParams = {}): Promise<GetBlogsResponse> => {
  const response = await client.get('/api/v1/admin/blogs', { params });
  return response.data;
};

export const deleteBLog = async (data: DeleteBlogRequest): Promise<DeleteBlogResponse> => {
  const response = await client.delete(`/api/v1/admin/blogs/${data.id}`);
  return response.data;
};

export const toggleBlogStatus = async (
  data: ToggleBlogStatusRequest
): Promise<ToggleBlogStatusResponse> => {
  const requestBody = {
    isPublished: data.isPublished,
  };
  const response = await client.put(`/api/v1/admin/blogs/${data.id}/publish`, requestBody);
  return response.data;
};
