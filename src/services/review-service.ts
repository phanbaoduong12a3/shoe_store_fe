import client from './api-clients';

export interface ReviewDetail {
  _id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
  images: string[];
  reviewer: {
    name: string;
    avatar: string;
  };
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  reply: {
    content: string;
    repliedBy: string;
    repliedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  images?: File[];
}

export interface CreateReviewResponse {
  status: number;
  data: {
    message: string;
    review: ReviewDetail;
  };
}

export const createReview = async (data: CreateReviewRequest): Promise<CreateReviewResponse> => {
  const formData = new FormData();
  formData.append('productId', data.productId);
  formData.append('orderId', data.orderId);
  formData.append('comment', data.comment);
  formData.append('rating', data.rating.toString());
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await client.post('/api/v1/reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
