import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SaleOfferType {
  title: string;
  description: string;
  title_lowercase?: string;
  description_lowercase?: string;
  category: string;
  shipping: boolean;
  cityInfo: {
    zipCode: string;
    city: string;
    x: number;
    y: number;
  };
  price: number;
  images: string[];
}

interface SaleOfferStore {
  saleOfferInCreation: SaleOfferType | null;
  setSaleOfferInCreation: (newAdjustments: SaleOfferType) => void;
  getSaleOfferInCreation: () => Promise<void>;
  resetSaleOfferInCreation: () => void;
}

export const useSaleOfferInCreationStore = create<SaleOfferStore>((set) => ({
  saleOfferInCreation: null,
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
  resetSaleOfferInCreation: async () => {
    set({
      saleOfferInCreation: {
        title: "",
        description: "",
        category: "Select a category",
        shipping: false,
        cityInfo: {
          zipCode: "",
          city: "",
          x: 0,
          y: 0,
        },
        price: 0,
        images: [],
      },
    });
    try {
      await AsyncStorage.setItem(
        "saleOfferInCreation",
        JSON.stringify({
          title: "",
          description: "",
          category: "Select a category",
          shipping: false,
          cityInfo: {
            zipCode: "",
            city: "",
            x: 0,
            y: 0,
          },
          price: 0,
          images: [],
        })
      );
    } catch (error) {
      console.error("Error removing sale offer in creation from AsyncStorage", error);
    }
  },
}));
