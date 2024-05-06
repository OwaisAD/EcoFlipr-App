import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SaleOfferType {
  title: string;
  description: string;
  category: string;
  shipping: boolean;
  cityInfo?: {
    zipCode: number | undefined;
    city: string;
    x: number | undefined;
    y: number | undefined;
  };
  price: number;
  images: string[];
}

interface SaleOfferStore {
  saleOfferInCreation: SaleOfferType | null;
  setSaleOfferInCreation: (newAdjustments: SaleOfferType) => void;
  getSaleOfferInCreation: () => Promise<void>;
}

export const useSaleOfferInCreationStore = create<SaleOfferStore>((set) => ({
  saleOfferInCreation: {
    title: "",
    description: "",
    category: "Select a category",
    shipping: false,
    cityInfo: {
      zipCode: undefined,
      city: "",
      x: undefined,
      y: undefined,
    },
    price: 0,
    images: [],
  },
  setSaleOfferInCreation: async (newSaleOffer: SaleOfferType) => {
    set({ saleOfferInCreation: newSaleOffer });
    try {
      await AsyncStorage.setItem("saleOfferInCreation", JSON.stringify(newSaleOffer));
    } catch (error) {
      console.error("Error saving sale offer in creation to AsyncStorage", error);
    }
  },
  getSaleOfferInCreation: async () => {
    try {
      const storedSaleOfferInCreation = await AsyncStorage.getItem("saleOfferInCreation");
      if (storedSaleOfferInCreation !== null) {
        set({ saleOfferInCreation: JSON.parse(storedSaleOfferInCreation) });
      }
    } catch (error) {
      console.error("Error getting sale offer in creation from AsyncStorage", error);
    }
  },
}));
