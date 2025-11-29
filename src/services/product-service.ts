import client from './api-clients';

export interface ProductImage {
    url: string;
    isPrimary: boolean;
    alt?: string;
}

export interface ProductVariant {
    _id: string;
    color: string;
    colorCode?: string;
    size: number;
    stock: number;
    sku: string;
}

export interface ProductSpecification {
    material?: string;
    sole?: string;
    weight?: string;
    origin?: string;
    gender?: 'male' | 'female' | 'unisex' | 'kids';
}

export interface ProductSeo {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
}

export interface ProductRating {
    average: number;
    count: number;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    logo: string;
    description?: string;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    sku: string;
    description?: string;
    shortDescription?: string;
    categoryId: string | Category;
    brandId: string | Brand;
    price: number;
    salePrice?: number | null;
    costPrice?: number;
    images: ProductImage[];
    variants: ProductVariant[];
    specifications?: ProductSpecification;
    seo?: ProductSeo;
    totalSold: number;
    viewCount: number;
    rating?: ProductRating;
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetProductsParams {
    page?: number;
    limit?: number;
    categoryId?: string;
    brandId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    gender?: 'male' | 'female' | 'unisex' | 'kids';
    sortBy?: string;
    order?: 'asc' | 'desc';
    isFeatured?: boolean;
    isNew?: boolean;
}

export interface GetProductsResponse {
    status: number;
    data: {
        products: Product[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export const getProducts = async (params: GetProductsParams = {}): Promise<GetProductsResponse> => {
    const response = await client.get('/api/v1/products', { params });
    return response.data;
};

export interface GetProductDetailResponse {
    status: number;
    data: {
        product: Product;
    };
}

export const getProductDetail = async (id: string): Promise<GetProductDetailResponse> => {
    const response = await client.get(`/api/v1/products/${id}`);
    return response.data;
};


export interface ToggleProductStatusRequest {
    id: string;
    field: 'isActive' | 'isFeatured' | 'isNew';
}

export interface ToggleProductStatusResponse {
    status: number;
    data: {
        message: string;
        product: Product;
    };
}

export const toggleProductStatus = async (data: ToggleProductStatusRequest): Promise<ToggleProductStatusResponse> => {
    const response = await client.patch(`/api/v1/admin/products/${data.id}/toggle/${data.field}`);
    return response.data;
};

export interface DeleteProductRequest {
    id: string;
}

export interface DeleteProductResponse {
    status: number;
    data: {
        message: string;
    };
}

export const deleteProduct = async (data: DeleteProductRequest): Promise<DeleteProductResponse> => {
    const response = await client.delete(`/api/v1/admin/products/${data.id}`);
    return response.data;
};

export interface CreateProductRequest {
    name: string;
    slug: string;
    sku: string;
    description?: string;
    shortDescription?: string;
    categoryId: string;
    brandId: string;
    price: number;
    salePrice?: number;
    costPrice?: number;
    images?: File[];
    variants: Array<{
        color: string;
        colorCode?: string;
        size: number;
        stock: number;
        sku: string;
    }>;
    specifications?: {
        material?: string;
        sole?: string;
        weight?: string;
        origin?: string;
        gender?: 'male' | 'female' | 'unisex' | 'kids';
    };
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string[];
    };
    isFeatured?: boolean;
    isNew?: boolean;
}

export interface CreateProductResponse {
    status: number;
    data: {
        message: string;
        product: Product;
    };
}

export const createProduct = async (data: CreateProductRequest): Promise<CreateProductResponse> => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('sku', data.sku);
    if (data.description) formData.append('description', data.description);
    if (data.shortDescription) formData.append('shortDescription', data.shortDescription);
    formData.append('categoryId', data.categoryId);
    formData.append('brandId', data.brandId);
    formData.append('price', String(data.price));
    if (data.salePrice) formData.append('salePrice', String(data.salePrice));
    if (data.costPrice) formData.append('costPrice', String(data.costPrice));

    // Images
    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append('images', image);
        });
    }

    // Variants
    formData.append('variants', JSON.stringify(data.variants));

    // Specifications
    if (data.specifications) {
        formData.append('specifications', JSON.stringify(data.specifications));
    }

    // SEO
    if (data.seo) {
        formData.append('seo', JSON.stringify(data.seo));
    }

    formData.append('isFeatured', String(data.isFeatured || false));
    formData.append('isNew', String(data.isNew || false));

    const response = await client.post('/api/v1/admin/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
