export interface OfferType {
  title: string;
  description: string;
  category: string;
  shipping: boolean;
  zipCode: string;
  price: number;
  status: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  id: string;
  cityInfo?: {
    x: number;
    y: number;
    city: string;
    zipCode: string;
  };
}
