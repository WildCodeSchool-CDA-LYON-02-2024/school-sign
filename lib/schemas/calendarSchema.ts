import { z } from "zod";

export const calendarSchema = z.object({
  title: z.string().max(100, {
    message: "The title should not exceed 100 characters.",
  }),
  // date: z
  //   .string()
  //   .datetime()
  //   .refine((val) => !isNaN(Date.parse(val)), {
  //     message: "Invalid date",
  //   }),
  // subjectId: z.number().min(1, {
  //   message: "Subject is mandatory",
  // }),
  // schoolId: z.number().optional(),
});
