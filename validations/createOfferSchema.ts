import { z } from "zod";

export const createOfferSchema = z.object({
  title: z.string().min(2, "Please enter a title"),
  description: z.string().min(2, "Please enter a description"),
  category: z.string().refine((value) => {
    return value !== "Select a category";
  }, "Please select a category"),
  shipping: z.boolean(),
  zipCode: z.number().refine((value) => {
    return /^\d{4}$/.test(value.toString());
  }, "Please enter a valid zip code"),
  price: z.number().min(1, "Please enter a price").max(1000000, "Please enter a price less than 1,000,000"),
});
