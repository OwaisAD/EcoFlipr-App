import { create } from "zustand";

export interface AddressFromEndpoint {
  tekst: string;
  adresse: {
    vejnavn: string;
    husnr: string;
    postnr: string;
    postnrnavn: string;
    x: string;
    y: string;
  };
}

export interface Address {
  tekst: string;
  vejnavn: string;
  husnr: string;
  postnr: string;
  postnrnavn: string;
  x: string;
  y: string;
}

interface addressStore {
  address: Address | null;
  setAddress: (address: Address | null) => void;
}

export const useAddressStore = create<addressStore>((set) => ({
  address: null,
  setAddress: (address: Address | null) => set({ address }),
}));
