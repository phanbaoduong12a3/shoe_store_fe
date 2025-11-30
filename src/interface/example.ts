// Type definition for Example response

export type TRating = {
  count: number;
  rate: number;
};

export type TExampleRes = {
  id: number;
  category: string;
  title: string;
  image: string;
  description: string;
  price: number;
  rating: TRating;
};
