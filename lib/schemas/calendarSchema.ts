import { z } from "zod";

export const calendarSchema = z.object({
  name: z.string().max(100, {
    message: "The name should not exceed 100 characters.",
  }),
  date: z
    .string()
    .datetime()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date",
    }),
  categoryId: z.number().min(1, {
    message: "Category is mandatory",
  }),
  schoolId: z.number().optional(),
});
