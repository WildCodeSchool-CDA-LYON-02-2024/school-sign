import { z } from "zod";

export const registerSchema = z
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
<<<<<<< HEAD
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas.",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "L'email doit être valide." }).max(255, {
    message: "L'email doit comporter au maximum 255 caractères.",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit comporter au moins 8 caractères.",
  }),
});
=======
  // .refine((data) => data.password === data.confirmPassword, {
  //   path: ["confirmPassword"],
  //   message: "Les mots de passe ne correspondent pas.",
  // });
>>>>>>> d0b66f192f25ae89b46c8f6d74330ab5f3806167
