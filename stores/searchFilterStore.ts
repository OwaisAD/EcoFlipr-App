import { create } from "zustand";

interface FilterStore {
  lowPriceRange: number;
  highPriceRange: number;
  zipcode: number;
  distanceFromZipcode: number;
  selectedCategories: string[];
  shippable: boolean;
  setLowPriceRange: (lowPriceRange: number) => void;
  setHighPriceRange: (highPriceRange: number) => void;
  setZipcode: (zipcode: number) => void;
  setDistanceFromZipcode: (distanceFromZipcode: number) => void;
  setSelectedCategories: (selectedCategories: string[]) => void;
  setShippable: (shippable: boolean) => void;
  resetFilters: () => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  lowPriceRange: 0,
  highPriceRange: 100000,
  zipcode: 0,
  distanceFromZipcode: 5,
  selectedCategories: [],
  shippable: true,
  setLowPriceRange: (lowPriceRange: number) => set({ lowPriceRange }),
  setHighPriceRange: (highPriceRange: number) => set({ highPriceRange }),
  setZipcode: (zipcode: number) => set({ zipcode }),
  setDistanceFromZipcode: (distanceFromZipcode: number) => set({ distanceFromZipcode }),
  setSelectedCategories: (selectedCategories: string[]) => set({ selectedCategories }),
  setShippable: (shippable: boolean) => set({ shippable }),
  resetFilters: () =>
    set({
      lowPriceRange: 0,
      highPriceRange: 100000,
      zipcode: 0,
      distanceFromZipcode: 5,
      selectedCategories: [],
      shippable: true,
    }),
}));

export default useFilterStore;
