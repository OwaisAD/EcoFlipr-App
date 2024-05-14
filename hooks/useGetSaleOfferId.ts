import { useEffect, useState } from "react";
import { getSaleOfferById } from "../helperMethods/saleoffer.methods";
import { OfferType } from "../types/offerType";

export default function useGetSaleOfferById(saleOfferId: string) {
  const [saleOffer, setSaleOffer] = useState<OfferType | null>(null);

  useEffect(() => {
    const fetchSaleOffer = async () => {
      try {
        const saleOffer = await getSaleOfferById(saleOfferId);
        setSaleOffer(saleOffer[0]);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchSaleOffer();
  }, [saleOfferId]);

  return saleOffer;
}
