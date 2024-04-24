import { z } from "zod";

const danishPhoneNumberRegex = new RegExp(/^(?:(?:00|\+)?45)?(?=2|3[01]|4[012]|4911|5[0-3]|6[01]|[78]1|9[123])\d{8}$/);

export const signUpSchema = z.object({
  firstName: z.string().min(1).max(18),
  lastName: z.string().min(1).max(18),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Please enter a valid password with at least 8 characters."),
  phoneNumber: z
    .string()
    .regex(danishPhoneNumberRegex, "Invalid phone number. Please enter a valid danish phone number."),
});
