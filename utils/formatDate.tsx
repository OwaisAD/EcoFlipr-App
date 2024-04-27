import Moment from "react-moment";

export const formattedDate = ( date: string) => {
  // Check if date exists
  if (!date) return null;

  // Format the date using Moment
  const formattedDate = <Moment fromNow>{date}</Moment>;

  // Render the formatted date
  return <>{formattedDate}</>;
};
