import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "L'email doit être valide." }).max(255),
  password: z
    .string()
    .min(8, {
      message: "Le mot de passe doit comporter au moins 8 caractères.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.",
      },
    ),
});
