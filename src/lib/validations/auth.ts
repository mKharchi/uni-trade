import { z } from "zod";

export const registerSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  university: z.string().min(1, "University is required"),
  year: z.number().int().min(1).max(10, "Year must be between 1 and 10"),
  specialty: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
