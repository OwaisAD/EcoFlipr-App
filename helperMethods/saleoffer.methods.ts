import { DocumentData, getDocs, query, where } from "firebase/firestore";
import { StatusTypes } from "../constants/StatusTypes";
import { saleOfferRef } from "../firebaseConfig";
import { OfferType } from "../types/offerType";

export const getUserSaleOffersByUserId = async (userId: string, status: StatusTypes) => {
  try {
    const userOffersQuery = query(saleOfferRef, where("userId", "==", userId), where("status", "==", status));
    const offersSnapshot = await getDocs(userOffersQuery);
    const offersData: OfferType[] = offersSnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        saleOfferId: data.saleOfferId,
        title: data.title,
        description: data.description,
        category: data.category,
        shipping: data.shipping,
        zipCode: data.zipCode,
        price: data.price,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        userId: data.userId,
        id: data.id,
        images: data.images,
        cityInfo: data.cityInfo
          ? {
              x: data.cityInfo.x,
              y: data.cityInfo.y,
              city: data.cityInfo.city,
              zipCode: data.cityInfo.zipCode,
            }
          : undefined,
      };
    });
    return offersData;
  } catch (error: any) {
    throw new Error("Something went wrong", error);
  }
};
