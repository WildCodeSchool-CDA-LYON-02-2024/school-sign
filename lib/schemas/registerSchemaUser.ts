import { z } from "zod";

export const registerSchemaUser = z
  .object({
    firstname: z.string().max(100, {
      message: "Le prénom doit comporter au maximum 100 caractères.",
    }),
    lastname: z.string().max(100, {
      message: "Le nom doit comporter au maximum 100 caractères.",
    }),
    email: z.string().email({ message: "L'email doit être valide." }).max(255, {
      message: "L'email doit comporter au maximum 255 caractères.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit comporter au moins 8 caractères.",
      })
      .max(255, {
        message: "Le mot de passe doit comporter au maximum 255 caractères.",
      }),
    // confirmPassword: z
    //   .string()
    //   .min(8, {
    //     message:
    //       "La confirmation du mot de passe doit comporter au moins 8 caractères.",
    //   })
    //   .max(255, {
    //     message:
    //       "La confirmation du mot de passe doit comporter au maximum 255 caractères.",
    //   }),
  })
  // .refine((data) => data.password === data.confirmPassword, {
  //   path: ["confirmPassword"],
  //   message: "Les mots de passe ne correspondent pas.",
  // });