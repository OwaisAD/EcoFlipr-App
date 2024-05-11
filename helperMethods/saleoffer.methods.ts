import {
  DocumentData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { StatusTypes } from "../constants/StatusTypes";
import { db, saleOfferRef, storage } from "../firebaseConfig";
import { OfferType } from "../types/offerType";
import { deleteObject, ref } from "firebase/storage";

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
    return saleOfferData;
  } catch (error: any) {
    console.log(error.message);
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
      where("status", "==", StatusTypes.ACTIVE),
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
      })
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });
    return saleOffersData;
  } catch (error: any) {
    console.log(error);
    throw new Error("Something went wrong", error);
  }
};

export const deleteSaleOffer = async (saleOfferId: string, sellerUserId: string, userId: string) => {
  try {
    if (sellerUserId !== userId) {
      throw new Error("You do not have permission to delete this offer");
    }
    const offerRef = doc(db, "saleoffers", saleOfferId);
    const offerSnap = await getDoc(offerRef);
    if (!offerSnap.exists()) {
      throw new Error("Offer does not exist");
    }
    const offerData = offerSnap.data() as DocumentData;
    //  get the offer, delete the images from storage, then delete the offer
    const images = offerData.images;
    for (let i = 0; i < images.length; i++) {
      // delete image from storage
      deleteObject(ref(storage, images[i]))
        .then(() => {
          console.log("Image removed successfully");
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
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

export const updateSaleOfferStatus = async (saleOfferId: string, status: StatusTypes) => {
  try {
    const offerRef = doc(db, "saleoffers", saleOfferId);
    await updateDoc(offerRef, {
      status: status,
    });
    return { success: true };
  } catch (error: any) {
    console.log(error.message);
    return { success: false, msg: error.message };
  }
};

export const saveOffer = async (saleOfferId: string, savedOffers: string[], userId: string) => {
  try {
    if (savedOffers.includes(saleOfferId)) {
      const index = savedOffers.indexOf(saleOfferId);
      savedOffers.splice(index, 1);
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        savedOffers: savedOffers,
      });
      return { msg: "Offer removed", success: true };
    }
    savedOffers.push(saleOfferId);
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      savedOffers: savedOffers,
    });
    return { msg: "Offer saved", success: true };
  } catch (error: any) {
    console.log(error.message);
    return { success: false, msg: error.message };
  }
};

export const getSavedOffers = async (savedOffers: string[]) => {
  try {
    const savedOffersData: OfferType[] = [];
    for (const offerId of savedOffers) {
      const offer = await getSaleOfferById(offerId);
      savedOffersData.push(offer[0]);
    }
    return savedOffersData;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Something went wrong", error);
  }
};
