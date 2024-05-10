import { DocumentData, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { StatusTypes } from "../constants/StatusTypes";
import { db, saleOfferRef } from "../firebaseConfig";
import { OfferType } from "../types/offerType";

export const getUserSaleOffersByUserId = async (userId: string, status: StatusTypes) => {
  try {
    const userOffersQuery = query(saleOfferRef, where("userId", "==", userId), where("status", "==", status));
    const offersSnapshot = await getDocs(userOffersQuery);
    const offersData: OfferType[] = offersSnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
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
        images: data.images,
        cityInfo: {
          x: data.cityInfo.x,
          y: data.cityInfo.y,
          city: data.cityInfo.city,
          zipCode: data.cityInfo.zipCode,
        },
      };
    });
    return offersData;
  } catch (error: any) {
    throw new Error("Something went wrong", error);
  }
};

export const getSaleOfferById = async (saleOfferId: string) => {
  try {
    const saleOfferQuery = query(saleOfferRef, where("saleOfferId", "==", saleOfferId));
    const saleOfferSnapshot = await getDocs(saleOfferQuery);
    const saleOfferData = saleOfferSnapshot.docs.map((doc) => {
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
        cityInfo: {
          x: data.cityInfo.x,
          y: data.cityInfo.y,
          city: data.cityInfo.city,
          zipCode: data.cityInfo.zipCode,
        },
      };
    });
    return saleOfferData;
  } catch (error: any) {
    throw new Error("Something went wrong", error);
  }
};

interface Pagination {
  startAfter: any;
  limit: number;
}

export const searchForSaleOffers = async (searchText: string, pagination: Pagination) => {
  try {
    const searchTextLowerCase = searchText.toLowerCase();

    const saleOffersQuery = query(
      saleOfferRef,
      // where("title_lowercase", ">=", searchText.toLowerCase()),
      // where("title_lowercase", "<=", searchText.toLowerCase() + "~"),
      orderBy("title"),
      startAfter(pagination.startAfter),
      limit(pagination.limit)
    );

    const saleOffersSnapshot = await getDocs(saleOffersQuery);
    const saleOffersData = saleOffersSnapshot.docs
      .filter((doc) => {
        const data = doc.data() as DocumentData;
        const titleLowerCase = data.title.toLowerCase();
        const descriptionLowerCase = data.description.toLowerCase();
        return titleLowerCase.includes(searchTextLowerCase) || descriptionLowerCase.includes(searchTextLowerCase);
      })
      .map((doc) => {
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
          cityInfo: {
            x: data.cityInfo.x,
            y: data.cityInfo.y,
            city: data.cityInfo.city,
            zipCode: data.cityInfo.zipCode,
          },
        };
      });
    return saleOffersData;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Something went wrong", error);
  }
};

export const deleteSaleOffer = async (saleOfferId: string, sellerUserId: string, userId: string) => {
  try {
    console.log("saleOfferId", saleOfferId);
    console.log("sellerUserId", sellerUserId);
    console.log("userId", userId);
    if (sellerUserId !== userId) {
      throw new Error("You do not have permission to delete this offer");
    }
    const offerRef = doc(db, "saleoffers", saleOfferId);
    await deleteDoc(offerRef)
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    return { success: true };
  } catch (error: any) {
    console.log(error.message);
    return { success: false, msg: error.message };
  }
};
