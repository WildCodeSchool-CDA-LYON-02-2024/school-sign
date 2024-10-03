import { z } from "zod";

export const lessonSchema = z.object({
  name: z
    .string()
    .max(100, {
      message: "The lesson name must be at most 100 characters long.",
    })
    .min(3, {
      message: "The lesson name must be at least 3 characters long.",
    }),
  dateStart: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message:
      "The start date must be a valid date. Please ensure it follows the correct format (e.g., YYYY-MM-DD) and contains no invalid characters.",
  }), // TODO: Check if the format is correct: is it YYYY-MM-DD?
  dateEnd: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message:
      "The end date must be a valid date. Please ensure it follows the correct format (e.g., YYYY-MM-DD) and contains no invalid characters.",
  }), // TODO: Check if the format is correct: is it YYYY-MM-DD?
  classId: z.number().optional(),
});
