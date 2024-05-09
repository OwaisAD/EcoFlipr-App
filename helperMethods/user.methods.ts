import { DocumentData, getDocs, query, where } from "firebase/firestore";
import { userRef } from "../firebaseConfig";

export const getUserById = async (userId: string) => {
  try {
    const userQuery = query(userRef, where("userId", "==", userId));
    const userSnapshot = await getDocs(userQuery);
    const userData = userSnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      console.log(data);
      return {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profileUrl: data.profileUrl,
        address: {
          tekst: data.address?.tekst || "",
          addresse: {
            postnr: data.address?.addresse?.postnr || "",
            postnrnavn: data.address?.addresse?.postnrnavn || "",
            x: data.address?.addresse?.x || "",
            y: data.address?.addresse?.y || "",
          },
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    return userData;
  } catch (error: any) {
    console.log(error);
    throw new Error("Something went wrong", error);
  }
};
