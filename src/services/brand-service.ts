import client from './api-clients';

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface GetBrandsResponse {
  status: number;
  data: {
    brands: Brand[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const getBrands = async (params: GetBrandsParams = {}): Promise<GetBrandsResponse> => {
  const response = await client.get('/api/v1/brands', { params });
  return response.data;
};

export interface CreateBrandRequest {
  name: string;
  slug: string;
  description?: string;
  logo?: File;
  isActive: boolean;
}

export interface CreateBrandResponse {
  status: number;
  data: {
    message: string;
    brand: Brand;
  };
}

export const createBrand = async (data: CreateBrandRequest): Promise<CreateBrandResponse> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('slug', data.slug);
  if (data.description) formData.append('description', data.description);
  if (data.logo) formData.append('logo', data.logo);
  formData.append('isActive', String(data.isActive));

  const response = await client.post('/api/v1/admin/brands', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export interface AntdUploadFileObject {
  uid: string;
  name: string;
  lastModified: number;
  size: number;
  type: string;
  originFileObj?: File;
}

export interface UpdateBrandRequest {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: AntdUploadFileObject;
  isActive: boolean;
}

export interface UpdateBrandResponse {
  status: number;
  data: {
    message: string;
    brand: Brand;
  };
}

export const updateBrand = async (data: UpdateBrandRequest): Promise<UpdateBrandResponse> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('slug', data.slug);
  if (data.description) formData.append('description', data.description);
  formData.append('isActive', String(data.isActive));
  if (data.logo && data.logo.originFileObj) {
    const file = data.logo.originFileObj;
    if (file) {
      formData.append('logo', file as File);
    }
  }

  try {
    const response = await client.put(`/api/v1/admin/brands/${data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface UpdateBrandLogoRequest {
  id: string;
  logo: File;
}

export interface UpdateBrandLogoResponse {
  status: number;
  data: {
    message: string;
    brand: Brand;
  };
}

export const updateBrandLogo = async (
  data: UpdateBrandLogoRequest
): Promise<UpdateBrandLogoResponse> => {
  const formData = new FormData();
  formData.append('logo', data.logo);

  const response = await client.put(`/api/v1/admin/brands/${data.id}/logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export interface ToggleBrandStatusRequest {
  id: string;
  isActive: boolean;
}

export interface ToggleBrandStatusResponse {
  status: number;
  data: {
    message: string;
    brand: Brand;
  };
}

export const toggleBrandStatus = async (
  data: ToggleBrandStatusRequest
): Promise<ToggleBrandStatusResponse> => {
  const requestBody = {
    isActive: data.isActive,
  };
  const response = await client.put(`/api/v1/admin/brands/${data.id}/status`, requestBody);
  return response.data;
};

export interface DeleteBrandRequest {
  id: string;
}

export interface DeleteBrandResponse {
  status: number;
  data: {
    message: string;
  };
}

export const deleteBrand = async (data: DeleteBrandRequest): Promise<DeleteBrandResponse> => {
  const response = await client.delete(`/api/v1/admin/brands/${data.id}`);
  return response.data;
};
