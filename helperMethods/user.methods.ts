import { DocumentData, getDocs, query, where } from "firebase/firestore";
import { userRef } from "../firebaseConfig";

export const getUserById = async (userId: string) => {
  try {
    const userQuery = query(userRef, where("userId", "==", userId));
    const userSnapshot = await getDocs(userQuery);
    const userData = userSnapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;

      return {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profileUrl: data.profileUrl,
        address: data.address,
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
