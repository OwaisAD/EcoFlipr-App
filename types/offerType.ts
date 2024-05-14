export interface OfferType {
  id?: string;
  saleOfferId?: string;
  title: string;
  description: string;
  category: string;
  shipping: boolean;
  zipCode?: string;
  price: number;
  status?: string;
  createdAt?: {
    nanoseconds: number;
    seconds: number;
  };
  updatedAt?: {
    nanoseconds: number;
    seconds: number;
  };
  userId?: string;
  cityInfo?: {
    x: number;
    y: number;
    city: string;
    zipCode: string;
  };
  images: string[];
}
