import { format } from "date-fns";
import Moment from "react-moment";

export const formattedDate = (date: string) => {
  // Check if date exists
  if (!date) return null;

  // Format the date using Moment
  const formattedDate = <Moment fromNow>{date}</Moment>;

  // Render the formatted date
  return <>{formattedDate}</>;
};

export const formatFirebaseDate = ({ nanoseconds, seconds }: { nanoseconds: number; seconds: number }) => {
  // Converting Firestore timestamp to milliseconds
  const milliseconds = seconds * 1000 + Math.round(nanoseconds / 1e6);

  // Creating a Date object from milliseconds
  const date = new Date(milliseconds);

  // Formatting the date using date-fns-tz
  const formattedDate = format(date, "yyyy-MM-dd'T'HH:mmXXX");

  return formattedDate;
};
