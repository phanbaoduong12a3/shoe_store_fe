import client from './api-clients';

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string | null;
    image?: string | null;
    isActive: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetCategoriesParams {
    isActive?: boolean;
    parentId?: string;
}

export interface GetCategoriesResponse {
    status: number;
    data: {
        categories: Category[];
        total: number;
    };
}

export const getCategories = async (params: GetCategoriesParams): Promise<GetCategoriesResponse> => {
    const response = await client.get('/api/v1/categories', { params });
    return response.data;
};

export interface CreateCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    image?: File;
    parentId?: string;
    isActive: boolean;
    displayOrder?: number;
}

export interface CreateCategoryResponse {
    status: number;
    data: {
        message: string;
        category: Category;
    };
}

export const createCategory = async (data: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    if (data.description) formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    if (data.parentId) formData.append('parentId', data.parentId);
    formData.append('isActive', String(data.isActive));
    if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

    const response = await client.post('/api/v1/admin/categories', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export interface UpdateCategoryRequest {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: File;
    parentId?: string;
    isActive: boolean;
    displayOrder?: number;
}

export interface UpdateCategoryResponse {
    status: number;
    data: {
        message: string;
        category: Category;
    };
}

export const updateCategory = async (data: UpdateCategoryRequest): Promise<UpdateCategoryResponse> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    if (data.description) formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    if (data.parentId) formData.append('parentId', data.parentId);
    formData.append('isActive', String(data.isActive));
    if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

    const response = await client.put(`/api/v1/admin/categories/${data.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
