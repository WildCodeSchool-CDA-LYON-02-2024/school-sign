import { z } from "zod";

export const DocumentSchema = z.object({
  name: z.string(),
  url: z.string(),
});
