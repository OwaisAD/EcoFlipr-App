import { create } from "zustand";

export interface Address {
  addresse: {
    id?: string | null;
    kommunekode?: string | null;
    postnr?: string | null;
    postnrnavn?: string | null;
    vejnavn?: string | null;
    husnr?: string | null;
    etage?: string | null;
    dør?: string | null;
    x?: number | null;
    y?: number | null;
  };
  tekst?: string | null;
}

interface addressStore {
  address: Address | null;
  setAddress: (address: Address | null) => void;
}

export const useAddressStore = create<addressStore>((set) => ({
  address: null,
  setAddress: (address: Address | null) => set({ address }),
}));
